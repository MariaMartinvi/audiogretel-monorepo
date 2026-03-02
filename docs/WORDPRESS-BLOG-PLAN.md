# Plan: Reemplazo del blog actual por WordPress (Gutenberg)

## PARTE 1 — Inspección del repo

### 1.1 Framework actual

| Aspecto | Valor |
|--------|--------|
| **Stack** | React (Create React App) |
| **Build** | `react-scripts` (Webpack bajo CRA 5) |
| **No es** | Next.js, Nuxt, Vite ni otro meta-framework |

- **Frontend**: `frontend/` — CRA, `react-router-dom` v6, i18next, Firebase.
- **Backend**: `backend/` — Node/Express (auth, Stripe, etc.), desplegado aparte.
- **Deploy actual**: El front se sirve como SPA estática (build → archivos estáticos). Hay `_redirects` (estilo Netlify) y `netlify.toml`; si el hosting es Render, el equivalente es servir el build con un static site o un Web Service que sirva `index.html` para todas las rutas.

### 1.2 Cómo está implementado hoy `/blog`

| Aspecto | Detalle |
|--------|--------|
| **Tipo** | **SPA (client-side)** |
| **Rutas** | Definidas en `frontend/src/routes.js` con React Router. |
| **Contenido** | Listado y posts vienen de **i18n** (`blog.posts.1`, `blog.posts.2`, …) en `frontend/src/i18n/locales/es.json` (y otros idiomas). No hay SSR ni rutas estáticas por post. |
| **URLs** | El servidor devuelve siempre el mismo `index.html`; el router resuelve `/blog` y `/blog/post/:id` en el cliente. |

### 1.3 Rutas exactas bajo `/blog` (ejemplos)

- **Listado**
  - `https://MI_DOMINIO.com/blog`
  - `https://MI_DOMINIO.com/blog?category=benefits|tips|examples|testimonials`
- **Post (por id numérico)**
  - `https://MI_DOMINIO.com/blog/post/1`
  - `https://MI_DOMINIO.com/blog/post/2`
  - `https://MI_DOMINIO.com/blog/post/3`
  - `https://MI_DOMINIO.com/blog/post/4`

**Referencias en el repo**

- `frontend/src/routes.js`: `<Route path="/blog" element={<Blog />} />`, `<Route path="/blog/post/:id" element={<BlogPost />} />`
- `frontend/src/components/Footer.js`: enlace a `/blog`
- `frontend/public/sitemap.xml`: solo incluye `https://audiogretel.com/blog` (no URLs de posts individuales)

---

## PARTE 2 — Arquitectura en Render (routing por path)

### Opción A — Gateway público (Nginx/Traefik) por path (PREFERIDA)

- **Un solo dominio**: `https://MI_DOMINIO.com`.
- **Servicio público**: un **Web Service** que ejecuta Nginx (o Traefik) como reverse proxy:
  - `Location /blog` y `Location /blog/` → proxy a **WordPress** (servicio interno o interno en red de Render).
  - Cualquier otra ruta `/*` → proxy a la **app actual** (SPA).
- **WordPress** y **App** pueden ser:
  - **Web Services internos** (sin dominio público propio), o
  - Servicios con red privada y solo el gateway expuesto al puerto 443/80.

**Ventajas**

- Un solo dominio y una sola SSL: mejor para SEO y para el usuario.
- `/blog` y `/blog/*` son WordPress; el resto sigue siendo la SPA sin tocar lógica de auth/pagos.
- Encaja con “solo /blog y /blog/* cambian; el resto igual”.

**Limitaciones en Render**

- Render **no ofrece** un “ingress” o API Gateway gestionado por path. Hay que montar el gateway como un servicio más.
- El gateway debe estar siempre arriba y ser el único que tenga dominio custom; los otros servicios se hablan por nombre de servicio (ej. `wordpress`, `web`) en la red privada de Render.

### Opción B — Subdominio `blog.MI_DOMINIO.com`

- WordPress en un Web Service con dominio `blog.midominio.com`.
- La app sigue en `midominio.com`; en el menú el “Blog” apunta a `https://blog.midominio.com`.

**Ventajas**

- Configuración más simple en Render (dos servicios, dos dominios).
- No hace falta gateway.

**Inconvenientes**

- Cambio de dominio para el blog: hay que 301 de `midominio.com/blog` → `blog.midominio.com` para no perder SEO.
- Menos “un solo sitio” desde el punto de vista del usuario y del cliente.

### Elección y justificación

- **Se elige Opción A** (gateway por path) porque:
  1. El objetivo es que `https://MI_DOMINIO.com/blog` y `https://MI_DOMINIO.com/blog/*` sean WordPress sin cambiar dominio.
  2. Es el patrón habitual para “una web + blog en subpath” y es lo que pide el brief.
  3. La limitación de Render (no tener gateway gestionado) se resuelve con un solo Web Service que corra Nginx (o Traefik) y dos backends; es mantenible y documentable.

---

## PARTE 3 — Estructura de servicios en Render (Opción A)

```
                    Internet (HTTPS)
                           │
                           ▼
              ┌────────────────────────────┐
              │  Web Service (público)     │
              │  "gateway"                 │
              │  - Dominio: MI_DOMINIO.com │
              │  - Nginx reverse proxy     │
              │  - Puerto 443 → 80         │
              └─────────────┬───────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
  /blog, /blog/*       /* (resto)
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Web Service     │  │ Static Site o    │
│ "wordpress"     │  │ Web Service      │
│ (privado*)      │  │ "web" (app CRA)  │
│ - Docker        │  │ - build SPA      │
│ - Puerto 80     │  │ - sirve index.html
└────────┬────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│ PostgreSQL o    │  (*) "Privado" = sin dominio
│ MySQL           │      público; solo accesible
│ (Render DB o    │      desde gateway por nombre
│  servicio)      │      de servicio.
└─────────────────┘
```

- **Gateway**: único servicio con `MI_DOMINIO.com`. Nginx resuelve por `$request_uri`: si empieza por `/blog`, proxy a `wordpress`; si no, proxy a `web`.
- **wordpress**: solo recibe tráfico del gateway en `/blog` y `/blog/`. WP configurado con `WP_HOME`/`WP_SITEURL` = `https://MI_DOMINIO.com/blog`.
- **web**: sirve el build de la SPA; fallback `index.html` para rutas que no sean `/blog*`.

Si Render solo permite “un servicio por dominio” en el plan actual, entonces el “gateway” puede ser el mismo proceso que sirve la SPA pero con Nginx delante: Nginx hace proxy a WordPress para `/blog*` y sirve (o hace proxy a) los estáticos + index.html para el resto. La alternativa es tener el dominio en el gateway y que “web” sea un servicio interno al que Nginx hace proxy.

---

## PARTE 4 — Plan de implementación (resumen)

1. **`/render-gateway`**  
   - Config Nginx (o Traefik) con:
     - `location /blog` y `location /blog/` → proxy a WordPress (headers Host, X-Forwarded-Proto, X-Forwarded-For).
     - `location /` → proxy a app SPA (o servir estáticos).
   - Gzip/Brotli si es sencillo.
   - Dockerfile para el gateway.

2. **`/wordpress`**  
   - `docker-compose.yml` local: WordPress + MySQL (o MariaDB) para desarrollo.
   - Para Render: WordPress como Web Service (Docker), disco persistente en `wp-content`; BD como Render PostgreSQL/MySQL o externa (documentar variables).
   - Env: `DB_*`, `WP_HOME`, `WP_SITEURL` (= `https://MI_DOMINIO.com/blog`), etc.

3. **WordPress bajo `/blog`**  
   - Permalinks: `/blog/%postname%/`.
   - Ajustes para reverse proxy (trust proxy, URLs de assets y admin sin mixed content).

4. **Blog SEO (Gutenberg)**  
   - Rank Math o Yoast (uno), tabla de contenidos, posts relacionados, breadcrumbs.
   - Tema ligero + child/minimal: listado /blog con paginación, categorías/tags, búsqueda, plantilla post (H1, autor, fecha, lectura, imagen, CTA).

5. **SEO técnico**  
   - Sitemap, robots.txt, canonical, OG + Twitter, schema Article (y FAQ si aplica).

6. **Migración y 301**  
   - URLs antiguas: `/blog`, `/blog?category=*`, `/blog/post/1` … `/blog/post/4`.  
   - En WordPress crear posts con slugs equivalentes donde tenga sentido; en gateway (o plugin WP) 301 de `/blog/post/1` → `/blog/slug-equivalente` (y así 2,3,4). Documentar checklist (status codes, canonicals, sitemap).

7. **Contenido demo**  
   - 20 posts de ejemplo con categorías, tags y featured image.

8. **Entregables**  
   - README: local (app + WP + gateway), deploy Render (servicios, env, discos), cómo publicar, redirects.
   - Checklist QA funcional + SEO.

---

## PARTE 5 — URLs antiguas del blog a contemplar (para 301)

| URL actual (ejemplo) | Acción sugerida |
|---------------------|-----------------|
| `https://MI_DOMINIO.com/blog` | Sigue siendo el listado de WordPress en `/blog`. |
| `https://MI_DOMINIO.com/blog?category=*` | WordPress puede usar `?category=*` o taxonomías; redirigir a la estructura que elijas. |
| `https://MI_DOMINIO.com/blog/post/1` | 301 → `https://MI_DOMINIO.com/blog/slug-del-post-1/` (crear post en WP con ese slug). |
| `https://MI_DOMINIO.com/blog/post/2` | Idem. |
| `https://MI_DOMINIO.com/blog/post/3` | Idem. |
| `https://MI_DOMINIO.com/blog/post/4` | Idem (ej. mindfulness-andalucia). |

El sitemap actual solo lista `/blog`; los posts 1–4 no están. Tras la migración, el sitemap de WordPress (o combinado) debe incluir todas las URLs de posts.

---

## Siguiente paso

Cuando apruebes este plan y la estructura de servicios (gateway público → WordPress + app), se implementará en este orden:

1. Crear `render-gateway` (Nginx + Dockerfile).
2. Crear `wordpress` (docker-compose local + documentación Render + WP en /blog).
3. Configurar WordPress (permalinks, proxy, tema, SEO).
4. Redirecciones 301 y checklist.
5. Contenido demo y README + QA.

Si quieres, el siguiente commit puede ser solo la carpeta `render-gateway` con Nginx y un README de cómo probarlo en local junto al front actual.
