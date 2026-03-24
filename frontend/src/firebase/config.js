// Vamos a actualizar la configuración con opciones explícitas para CORS
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, collection, getDocs, limit, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Configuración de Firebase desde variables de entorno (nunca hardcodear claves)
const trim = (v) => (typeof v === "string" ? v.trim() : v);
const firebaseConfig = {
  apiKey: trim(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: trim(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: trim(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: trim(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trim(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: trim(process.env.REACT_APP_FIREBASE_APP_ID)
};

// Debug: Log configuration to check if variables are loaded
console.log('🔥 Firebase Config Debug:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'
});

const checkEnvVariables = () => {
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`Firebase disabled: Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  return true;
};

const envVarsPresent = checkEnvVariables();

/** Si init falla (p. ej. auth/invalid-api-key), aquí está el error; la app puede seguir cargando. */
export let firebaseInitError = null;

let app = null;
let db = null;
let auth = null;
let storage = null;

if (envVarsPresent) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("✅ Firebase initialized successfully");

    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    });

    auth.useDeviceLanguage();
    auth.settings.appVerificationDisabledForTesting = false;
  } catch (error) {
    firebaseInitError = error;
    console.error("❌ Error initializing Firebase:", error);
    app = null;
    db = null;
    auth = null;
    storage = null;
    if (error?.code === 'auth/invalid-api-key' || String(error?.message || '').includes('invalid-api-key')) {
      console.error(
        '💡 Solución habitual: Google Cloud Console → Credenciales → tu API key → Restricciones → ' +
        'añade referentes HTTP: http://localhost:3000/* y http://127.0.0.1:3000/*'
      );
    }
  }
}

export const isFirebaseConfigured = Boolean(envVarsPresent && auth && db && storage);

// Configuración específica para producción en Render
if (process.env.NODE_ENV === 'production') {
  console.log('🌐 Production mode detected, configuring for Render deployment');

  const currentDomain = window.location.hostname;
  console.log('🌐 Current domain:', currentDomain);

  const authorizedDomains = [
    'localhost',
    'audiogretel.com',
    'www.audiogretel.com',
    'cuentacuentos-b2e64.firebaseapp.com',
  ];

  if (!authorizedDomains.some(domain => currentDomain.includes(domain))) {
    console.warn('⚠️ Current domain not in authorized list. Add to Firebase Console:', currentDomain);
  }

  try {
    console.log('🔧 Configuring Firebase for production environment');

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message &&
          (event.reason.message.includes('Cross-Origin-Opener-Policy') ||
           event.reason.message.includes('postMessage'))) {
        console.debug('🔇 COOP/postMessage error suppressed:', event.reason.message);
        event.preventDefault();
      }
    });

    window.addEventListener('error', (event) => {
      if (event.message &&
          (event.message.includes('Cross-Origin-Opener-Policy') ||
           event.message.includes('postMessage'))) {
        console.debug('🔇 COOP/postMessage console error suppressed:', event.message);
        event.preventDefault();
      }
    });

  } catch (error) {
    console.warn('⚠️ Error in production Firebase config:', error);
  }
}

// Configurar timeouts y reintentos
const MAX_RETRIES = 2;
const TIMEOUT_DURATION = 480000; // 8 minutos para uploads grandes (publicación)

const withRetry = async (operation, retries = MAX_RETRIES) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase not configured');
  }

  try {
    return await operation();
  } catch (error) {
    console.error("Operation failed:", error);

    if (retries > 0) {
      console.log(`Reintentando operación. Intentos restantes: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
};

const withTimeout = (promise, duration = TIMEOUT_DURATION) => {
  if (!isFirebaseConfigured) {
    return Promise.reject(new Error('Firebase not configured'));
  }

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${duration}ms`));
    }, duration);
  });

  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
};

const getPublicUrl = async (path) => {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage not configured');
  }

  try {
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(path);
    } catch (e) {
      console.warn('Error decoding path, using original:', e);
      decodedPath = path;
    }

    console.log('Getting public URL for path:', decodedPath);

    const storageRef = ref(storage, decodedPath);

    console.log('Attempting to get download URL for:', decodedPath);
    const url = await getDownloadURL(storageRef);
    console.log('Successfully got URL:', url);
    return url;
  } catch (error) {
    console.error('Error in getPublicUrl:', error);
    throw error;
  }
};

const checkFirebaseConnection = async () => {
  if (!isFirebaseConfigured || !db) {
    console.log('Firebase not configured, skipping connection check');
    return false;
  }

  try {
    const storyExamplesRef = collection(db, 'storyExamples');
    const q = query(storyExamplesRef, limit(1));
    await getDocs(q);
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

if (isFirebaseConfigured) {
  checkFirebaseConnection();
}

export {
  db,
  auth,
  storage,
  withRetry,
  withTimeout,
  getPublicUrl,
  checkFirebaseConnection
};
