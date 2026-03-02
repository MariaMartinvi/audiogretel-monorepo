# Desplegar el monorepo en Render (nuevo blog incluido)

Repo: **MariaMartinvi/audiogretel-monorepo** (rama `main`)

Crea **dos servicios** en Render: backend (Web Service) y frontend (Static Site). Así tendrás el **nuevo blog** integrado en el front.

---

## 1. Backend (Web Service)

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**.
2. Conecta el repo **audiogretel-monorepo** (rama `main`).
3. Configuración:
   - **Name**: p. ej. `audiogretel-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Añade las variables de entorno que ya usas (MongoDB, JWT, Firebase, FRONTEND_URL, etc.).  
   Referencia: `backend/config.env.example`.
5. **Create Web Service**.  
   Cuando termine, copia la URL del backend (ej. `https://audiogretel-backend.onrender.com`).

---

## 2. Frontend (Static Site) – con el nuevo blog

1. **New** → **Static Site**.
2. Mismo repo **audiogretel-monorepo**, rama `main`.
3. Configuración:
   - **Name**: p. ej. `audiogretel-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Variable de entorno:
   - **`REACT_APP_API_URL`** = URL de tu backend en Render (ej. `https://audiogretel-backend.onrender.com`, sin barra final).
5. En el **backend**, en variables de entorno, pon **`FRONTEND_URL`** = URL de este Static Site (ej. `https://audiogretel-frontend.onrender.com`).
6. **Create Static Site**.

---

## Resumen

| Servicio | Root Directory | Build | Start / Publish |
|----------|----------------|--------|------------------|
| Backend  | `backend`      | `npm run build` | `npm start` |
| Frontend | `frontend`     | `npm install && npm run build` | `build` |

El frontend desplegado desde este monorepo incluye el **nuevo blog** en `/blog` y `/blog/post/:slug`.
