import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import AppRoutes from './routes';
import CookieConsent from './components/CookieConsent';
import { initProxy, cleanupProxy } from './services/proxyService';
import GoogleTagManager from './components/GoogleTagManager';
import config from './config';
import { firebaseInitError } from './firebase/config';

// Usar configuración dinámica en lugar de URL hardcodeada
const API_URL = config.apiUrl;

function App() {
  console.log('🚀🚀🚀 [APP] APLICACIÓN INICIANDO - App.js está funcionando');
  console.log('🚀🚀🚀 [APP] Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: API_URL,
    isProduction: config.isProduction,
    timestamp: new Date().toISOString()
  });
  
  useEffect(() => {
    console.log('🚀🚀🚀 [APP] App useEffect ejecutándose - initProxy');
    initProxy();
    return () => {
      cleanupProxy();
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <AuthProvider>
          <CookieConsentProvider>
            <Router>
              {firebaseInitError && (
                <div
                  role="alert"
                  style={{
                    background: '#3d1313',
                    color: '#ffebee',
                    padding: '12px 16px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    borderBottom: '1px solid #8b0000'
                  }}
                >
                  <strong>Firebase no pudo iniciarse.</strong>{' '}
                  {String(firebaseInitError.message || firebaseInitError)}{' '}
                  Si ves <code>auth/invalid-api-key</code>, en Google Cloud → APIs y servicios → Credenciales → tu clave de API
                  (navegador) añade referentes: <code>http://localhost:3000/*</code> y <code>http://127.0.0.1:3000/*</code>.
                </div>
              )}
              <div id="google-signin-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />
              <GoogleTagManager />
              <AppRoutes />
              <CookieConsent />
            </Router>
          </CookieConsentProvider>
        </AuthProvider>
      </HelmetProvider>
    </I18nextProvider>
  );
}

export default App;