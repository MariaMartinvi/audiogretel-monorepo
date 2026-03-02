# Blog Astro: estructura final y plan por commits

## Arquitectura

- **Frontend:** Render Static Site → sirve `dist/` (salida de `astro build`).
- **Backend:** API aparte; el blog **no** depende del backend.
- **Blog:** 100% estático (Content Collections MDX), rutas reales `/blog`, `/blog/<slug>/`, `/en/blog`, `/en/blog/<slug>/`.

---

## Estructura de carpetas final

```
cuentacuentos-fresh-20260227/
├── frontend/                          # LEGACY: CRA actual (se elimina o se conserva como ref hasta fin migración)
│   └── ...
├── src/                               # Astro (raíz del proyecto Astro)
│   ├── content/
│   │   └── blog/
│   │       ├── es/
│   │       │   ├── aprendizaje-temprano-idiomas.mdx
│   │       │   ├── rutina-cuentos-dormir.mdx
│   │       │   ├── cuentos-transformaron-familia.mdx
│   │       │   ├── cuentos-mindfulness-andalucia.mdx
│   │       │   └── ... (20 posts demo)
│   │       └── en/
│   │           ├── aprendizaje-temprano-idiomas.mdx
│   │           └── ... (20 posts demo)
│   ├── content.config.ts              # Schema frontmatter blog
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── ...
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── blog/
│   │   │   ├── BlogCard.astro
│   │   │   ├── BlogSidebar.astro
│   │   │   ├── PostTOC.astro
│   │   │   ├── Breadcrumbs.astro
│   │   │   ├── RelatedPosts.astro
│   │   │   └── CTA.astro
│   │   └── ...
│   ├── pages/
│   │   ├── index.astro                # / (home ES)
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── blog/
│   │   │   ├── index.astro             # /blog (listado ES)
│   │   │   ├── rss.xml.ts              # /blog/rss.xml
│   │   │   ├── post/
│   │   │   │   ├── 1/
│   │   │   │   │   └── index.astro     # /blog/post/1/ → legacy redirect
│   │   │   │   ├── 2/
│   │   │   │   │   └── index.astro
│   │   │   │   ├── 3/
│   │   │   │   │   └── index.astro
│   │   │   │   └── 4/
│   │   │   │       └── index.astro
│   │   │   └── [slug]/
│   │   │       └── index.astro         # /blog/<slug>/
│   │   ├── en/
│   │   │   ├── index.astro             # /en (home EN)
│   │   │   ├── about.astro
│   │   │   ├── blog/
│   │   │   │   ├── index.astro         # /en/blog
│   │   │   │   ├── rss.xml.ts         # /en/blog/rss.xml
│   │   │   │   ├── post/
│   │   │   │   │   ├── 1/
│   │   │   │   │   │   └── index.astro # legacy redirect
│   │   │   │   │   └── ... 2,3,4
│   │   │   │   └── [slug]/
│   │   │   │       └── index.astro     # /en/blog/<slug>/
│   │   │   └── ...
│   │   ├── sitemap-index.xml.ts       # sitemap index si se usa
│   │   └── robots.txt.ts
│   ├── styles/
│   │   └── global.css
│   ├── i18n/
│   │   └── ...                         # textos UI ES/EN (navbar, footer, CTA, etc.)
│   └── env.d.ts
├── public/
│   ├── _redirects                     # Por si Render usa; 301 opcionales
│   ├── images/
│   │   └── blog/                      # featured images
│   └── ...
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── docs/
│   ├── BLOG-SSG-PLAN.md
│   ├── BLOG-ASTRO-ESTRUCTURA-Y-COMMITS.md  # este doc
│   └── BLOG-QA-SEO-CHECKLIST.md
├── README.md                           # Incluye: añadir post, frontmatter, local, build, deploy Render
└── ...
```

**Notas:**

- Las páginas legacy `/blog/post/1/` … `/blog/post/4/` y `/en/blog/post/1/` … son `.astro` que generan HTML con `<meta http-equiv="refresh" content="0;url=/blog/<slug>/">`, `<link rel="canonical" href="...">` y un enlace visible “Ir al artículo” para usuarios y bots.
- Content collection: `src/content/config.ts` (o `content.config.ts`) define el schema del blog (title, slug, excerpt, date, author, category, tags, featuredImage, metaTitle, metaDescription, faq opcional).
- Sitemap: se puede generar con `@astrojs/sitemap` (configurando i18n) para incluir `/blog`, `/en/blog` y todos los posts; alternates hreflang en cada entrada.

---

## Plan por commits (fases)

Cada ítem puede ser 1 commit o 2 si conviene dividir.

---

### Fase 0 — Inicializar Astro

| # | Commit | Descripción |
|---|--------|-------------|
| 0.1 | `chore(astro): init Astro project and config` | Crear proyecto Astro en repo (o subcarpeta `frontend-astro/` que luego sea la raíz del Static Site). `astro.config.mjs` con base, build estático, integración React si hace falta para islas. |
| 0.2 | `chore(astro): add Content Collections and blog schema` | `src/content/config.ts` con colección `blog` y schema de frontmatter (title, slug, excerpt, date, author, category, tags, featuredImage, metaTitle, metaDescription, faq opcional). Carpetas vacías `content/blog/es/` y `content/blog/en/`. |

---

### Fase 1 — Layout base y páginas no-blog

| # | Commit | Descripción |
|---|--------|-------------|
| 1.1 | `feat(astro): BaseLayout + Header + Footer` | Layout común (ES/EN según ruta), Header con nav y selector idioma, Footer. Estilos mínimos para que el sitio se parezca al actual. |
| 1.2 | `feat(astro): home, about, contact (ES)` | Páginas estáticas `/`, `/about`, `/contact` con contenido placeholder o migrado del CRA. |
| 1.3 | `feat(astro): home, about, contact (EN) under /en/` | Rutas `/en`, `/en/about`, `/en/contact`. i18n básico para textos de UI (navbar, footer) según prefijo. |

---

### Fase 2 — Blog: contenido y listado

| # | Commit | Descripción |
|---|--------|-------------|
| 2.1 | `feat(blog): 4 posts ES+EN (slugs legacy 1..4)` | Crear 4 pares de MDX en `content/blog/es/` y `content/blog/en/` con slugs: aprendizaje-temprano-idiomas, rutina-cuentos-dormir, cuentos-transformaron-familia, cuentos-mindfulness-andalucia. Contenido real o placeholder. |
| 2.2 | `feat(blog): listado /blog y /en/blog con paginación` | `src/pages/blog/index.astro` y `src/pages/en/blog/index.astro`. Leer Content Collection, paginación (ej. 10 por página), cards con excerpt, featured image, autor, fecha, reading time. |
| 2.3 | `feat(blog): sidebar categorías, recientes, buscador` | Componente BlogSidebar (categorías, N posts recientes, input búsqueda). Búsqueda: en Static Site puede ser client-side (Alpine/React isla) sobre datos inyectados en la página o JSON estático generado en build. |
| 2.4 | `feat(blog): filtro por categoría/tag` | Listado acepta query `?category=...` o rutas `/blog/category/<cat>` (y EN). Decisión documentada en README. |

---

### Fase 3 — Página de post y legacy

| # | Commit | Descripción |
|---|--------|-------------|
| 3.1 | `feat(blog): página post /blog/[slug] y /en/blog/[slug]` | `src/pages/blog/[slug]/index.astro` y `src/pages/en/blog/[slug]/index.astro`. Contenido MDX, H1 único, H2/H3, imagen destacada, autor, fecha, reading time. |
| 3.2 | `feat(blog): TOC automática, breadcrumbs, related posts, CTA` | Componentes PostTOC (desde headings), Breadcrumbs, RelatedPosts (mismo idioma, por categoría/tag), CTA final. |
| 3.3 | `feat(blog): páginas legacy /blog/post/1..4 y /en/blog/post/1..4` | Páginas estáticas que generan HTML con meta refresh a `/blog/<slug>/` (o `/en/blog/<slug>/`), canonical y enlace manual. Mapeo id→slug en config o constante. |

---

### Fase 4 — SEO

| # | Commit | Descripción |
|---|--------|-------------|
| 4.1 | `feat(seo): meta title/description, canonical, OG/Twitter por post` | En layout de post y listado: meta por idioma, OG y Twitter cards. Canonical absoluto por página. |
| 4.2 | `feat(seo): hreflang ES<->EN` | En cada página blog (listado y post) añadir `<link rel="alternate" hreflang="x-default" />` y alternates al otro idioma. |
| 4.3 | `feat(seo): JSON-LD Article (y FAQ si hay bloque)` | Script JSON-LD en post; si frontmatter tiene `faq`, añadir schema FAQ. |
| 4.4 | `feat(seo): sitemap con /blog, /en/blog y todos los posts` | Usar `@astrojs/sitemap` o script en build. Incluir alternates hreflang en sitemap si la lib lo permite. |
| 4.5 | `feat(seo): RSS /blog/rss.xml y /en/blog/rss.xml` | Endpoints `rss.xml.ts` que generen RSS con posts del idioma correspondiente. |
| 4.6 | `feat(seo): robots.txt` | `public/robots.txt` o `src/pages/robots.txt.ts` con Sitemap y reglas correctas. |

---

### Fase 5 — Contenido demo y docs

| # | Commit | Descripción |
|---|--------|-------------|
| 5.1 | `content(blog): 20 posts demo ES+EN` | 16 posts nuevos + los 4 ya creados = 20. Pares en `content/blog/es/` y `content/blog/en/`. EN puede ser placeholder con mismo frontmatter. |
| 5.2 | `docs: README blog (añadir post, frontmatter, local, build, deploy)` | README con: estructura de carpetas, cómo añadir un post ES/EN, campos frontmatter, política de traducción, `npm run dev`, `astro build`, deploy a Render Static Site. |
| 5.3 | `docs: checklist QA SEO` | Documento (ej. `docs/BLOG-QA-SEO-CHECKLIST.md`) con: indexabilidad, canonicals, hreflang, sitemap ES+EN, legacy 301/redirect, RSS, robots.txt. |

---

### Fase 6 — Ajustes finales y limpieza

| # | Commit | Descripción |
|---|--------|-------------|
| 6.1 | `chore: _redirects para Render (opcional)` | Si Render usa `_redirects`, añadir reglas para `/blog/post/1` → `/blog/post/1/` (o directo a `/blog/<slug>/`) si se desea doble capa. |
| 6.2 | `chore: eliminar rutas blog del CRA (frontend/)` | Quitar de `frontend/src/routes.js` las rutas `/blog` y `/blog/post/:id`. Si el deploy en Render pasa a ser solo Astro, el build de CRA deja de usarse; si se mantiene CRA para algo, dejar solo las rutas no-blog. |

---

## Orden de ejecución resumido

1. **Fase 0** — Astro + Content Collections + schema.  
2. **Fase 1** — Layout, Header, Footer, home/about/contact ES y EN.  
3. **Fase 2** — 4 posts, listado con paginación, sidebar, filtro categoría.  
4. **Fase 3** — Página post con TOC, breadcrumbs, relacionados, CTA; páginas legacy.  
5. **Fase 4** — Meta, canonical, hreflang, JSON-LD, sitemap, RSS, robots.  
6. **Fase 5** — 20 posts demo, README, checklist QA.  
7. **Fase 6** — _redirects (opcional), eliminar rutas blog del CRA.

---

## Ubicación del proyecto Astro

- **Opción A:** Astro en la **raíz** del repo (`src/`, `public/`, `astro.config.mjs` en raíz). El `frontend/` (CRA) se puede conservar como referencia o borrar cuando el deploy sea solo Astro.
- **Opción B:** Astro en **`frontend-astro/`** (o `web/`). El build de Render apuntaría a `frontend-astro/dist/` y el root del repo quedaría con `frontend/` (CRA) y `frontend-astro/` (Astro).

Recomendación: **Opción A** si el objetivo es un solo frontend estático (Astro); **Opción B** si quieres mantener el CRA en el repo un tiempo y desplegar solo la carpeta Astro.

Cuando confirmes estructura (A o B) y que el plan por commits te encaja, sigo con la implementación fase por fase en commits pequeños.
