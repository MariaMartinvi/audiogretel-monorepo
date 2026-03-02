# Plan: Blog estático (SSG) multiidioma ES/EN en Render Static Site

## Objetivo

- Reemplazar el blog SPA (CRA + i18n JSON) por un blog **estático (SSG)**.
- Mantener **Render como Static Site** (0 € extra).
- URLs: `/blog` (ES), `/en/blog` (EN), posts `/blog/<slug>/` y `/en/blog/<slug>/`.
- Contenido en **Markdown/MDX** por idioma; sin backend ni servicios nuevos.

---

## Elección de framework: **Astro** (recomendado) vs Next.js

### Por qué Astro

| Criterio | Astro | Next.js (static export) |
|----------|--------|--------------------------|
| **SSG** | Nativo, 100% estático por defecto | `output: 'export'` → estático |
| **Contenido** | **Content Collections** (Markdown/MDX tipado, por carpeta `content/blog/es`, `content/blog/en`) | MDX con `next-mdx-remote` o lectura manual de archivos en build |
| **Multiidioma** | Routing por prefijo `/en/`, `/es/` sencillo; hreflang y sitemap con utilidades claras | next-intl o similar; más configuración |
| **Bundle** | Zero JS por defecto; React solo donde haga falta (islands) → blog muy ligero | Todo React; páginas blog también |
| **Render Static Site** | Build = carpeta `dist/` estática; sin Node en producción | Igual con `next export` |
| **RSS / sitemap** | Integraciones oficiales o scripts simples en build | Hay que montarlo a mano o con paquetes |

**Conclusión:** Astro está pensado para sitios con mucho contenido estático y multiidioma; el blog con Content Collections encaja muy bien. Next.js es viable pero más orientado a apps dinámicas; para “solo blog estático + mismo sitio” Astro simplifica más y mantiene el coste cero en Render.

### Por qué no quedarnos con Next.js

- Next con `output: 'export'` **sí** sirve para Static Site en Render.
- Para un blog solo estático, Astro suele dar menos fricción (content collections, i18n, menos JS). Si el equipo ya usa Next en otros proyectos, se puede elegir Next y asumir un poco más de configuración (MDX, i18n, sitemap/RSS).

**Recomendación final:** **Astro**. Si prefieres Next por consistencia con otros proyectos, se puede hacer el mismo diseño con Next + static export y documentarlo igual.

---

## Plan mínimo de migración (Astro)

### Fase 1 — Nuevo frontend en Astro (mismo repo)

1. **Estructura**
   - Crear proyecto Astro en la raíz del repo (o en `frontend-astro/`) con:
     - `src/pages/` para rutas.
     - `src/content/blog/es/` y `src/content/blog/en/` para posts (MDX).
     - `src/components/` reutilizando React donde haga falta (navbar, footer, CTA).
   - Definir **content collection** `blog` con schema de frontmatter (title, slug, excerpt, date, author, category, tags, featuredImage, metaTitle, metaDescription, faq opcional).

2. **Rutas estáticas**
   - **ES:** `src/pages/blog/index.astro` → `/blog` (listado).
   - **ES:** `src/pages/blog/[...slug].astro` o `[slug].astro` → `/blog/<slug>/`.
   - **EN:** `src/pages/en/blog/index.astro` → `/en/blog`; `src/pages/en/blog/[...slug].astro` → `/en/blog/<slug>/`.
   - Resto del sitio (home, about, contact, etc.): recrear en Astro como páginas estáticas que repliquen la apariencia actual (o incluir el build de CRA en un iframe/redirect solo para no-blog — no recomendado; lo limpio es migrar todo el “sitio público” a Astro y dejar CRA solo si hay una app privada separada).  
   - **Importante:** el brief pide “rehacer SOLO el blog” pero “migra SOLO el frontend a un framework SSG”. Interpretación: el **frontend completo** pasa a Astro (incluidas home, about, etc.) para que todo sea estático y el blog sea una parte más. Así no hay dos frameworks en producción.

3. **Redirecciones 301 (estáticas)**
   - En Render (o en `_redirects` / `public/_redirects` que Astro copie a `dist/`):
     - `/blog/post/1` → `/blog/<slug-1>/`
     - `/blog/post/2` → `/blog/<slug-2>/`
     - `/blog/post/3` → `/blog/<slug-3>/`
     - `/blog/post/4` → `/blog/<slug-4>/`
     - Y equivalentes EN: `/en/blog/post/1` → `/en/blog/<slug-1>/`, etc.
   - Si se elige soportar categorías por path: `/blog?category=benefits` → 301 a `/blog/category/benefits` (y documentar). Si no, el listado acepta `?category=...` sin redirección.

4. **Política de idioma**
   - Cada post existe como par: `content/blog/es/<slug>.mdx` y `content/blog/en/<slug>.mdx`.
   - **Si falta traducción:** no listar el post en ese idioma (oculto). Documentar en README.

### Fase 2 — Contenido y demo

5. **Slugs para posts actuales (1–4)**
   - Definir slugs únicos (ej. `aprendizaje-temprano-idiomas`, `rutina-cuentos-dormir`, `historias-familia-idiomas`, `cuentos-mindfulness-andalucia`) y crear `es/*.mdx` y `en/*.mdx` con el contenido actual (o placeholders EN).

6. **20 posts demo**
   - 20 slugs; 20 archivos en `content/blog/es/` y 20 en `content/blog/en/` (EN puede ser placeholder con mismo frontmatter y texto breve). Categorías/tags variados para probar listado, sidebar y relacionados.

### Fase 3 — SEO y estándares “WordPress-like”

7. **Por página (listado y post)**
   - Meta title + meta description (por idioma).
   - OpenGraph y Twitter cards (por idioma).
   - Canonical (ES o EN según la página).
   - hreflang: en cada URL ES, `alternate` a la URL EN; en cada URL EN, `alternate` a la URL ES.
   - JSON-LD Article (y FAQ si hay bloque FAQ en frontmatter).

8. **Global**
   - `sitemap.xml`: incluir `/blog`, todos los posts ES, `/en/blog`, todos los posts EN; idealmente entradas con `xhtml:link` alternates por idioma.
   - `robots.txt`: permitir todo, apuntar a sitemap.
   - RSS: `/blog/rss.xml` (ES) y `/en/blog/rss.xml` (EN).

### Fase 4 — Build y Render

9. **Build**
   - `astro build` → salida estática en `dist/`.
   - Render: **Static Site** apuntando a ese `dist/` (o a la carpeta que Render use tras el build command de Astro). Sin Web Services ni DB.

10. **README y QA**
    - README: estructura de carpetas, cómo añadir un post (ES/EN), frontmatter obligatorio, cómo correr local, build y deploy a Render Static Site.
    - Checklist QA SEO: indexabilidad, canonicals, hreflang, sitemap (ambos idiomas), 301 legacy.

---

## Estructura de carpetas objetivo (resumen)

```text
/
├── frontend/                    # (legacy CRA; se sustituye por Astro o se elimina tras migrar)
├── src/                         # Astro
│   ├── content/
│   │   └── blog/
│   │       ├── es/
│   │       │   ├── aprendizaje-temprano-idiomas.mdx
│   │       │   ├── rutina-cuentos-dormir.mdx
│   │       │   └── ...
│   │       └── en/
│   │           ├── aprendizaje-temprano-idiomas.mdx
│   │           └── ...
│   ├── pages/
│   │   ├── index.astro           # home ES
│   │   ├── blog/
│   │   │   ├── index.astro       # /blog
│   │   │   └── [...slug].astro   # /blog/<slug>/
│   │   ├── en/
│   │   │   ├── index.astro       # /en (home EN)
│   │   │   └── blog/
│   │   │       ├── index.astro   # /en/blog
│   │   │       └── [...slug].astro # /en/blog/<slug>/
│   │   └── ...
│   ├── components/
│   └── layouts/
├── public/
│   ├── _redirects               # 301 /blog/post/:id y /en/blog/post/:id
│   ├── robots.txt
│   └── ...
├── docs/
│   └── BLOG-SSG-PLAN.md
└── README.md
```

(La ubicación exacta de `src/` depende de si Astro vive en la raíz o en `frontend-astro/`; el contenido blog siempre bajo `content/blog/{es,en}`.)

---

## Frontmatter (obligatorio por post)

```yaml
title: string
slug: string
excerpt: string
date: ISO date
author: string
category: string
tags: string[]
featuredImage: string   # path relativo a public o URL
metaTitle: string
metaDescription: string
# opcional:
faq: { question: string, answer: string }[]
```

---

## Categorías en el listado

- **Opción A:** El listado acepta `?category=...` y filtra en cliente (o en build generando páginas estáticas por categoría). Sin 301.
- **Opción B:** 301 de `/blog?category=benefits` a `/blog/category/benefits` y tener `src/pages/blog/category/[...cat].astro`. Más “WordPress-like” y mejor para SEO (URLs limpias).

**Recomendación:** Opción B (rutas `/blog/category/<cat>` y `/en/blog/category/<cat>`), documentado en README.

---

## Resumen de decisión

- **Framework:** **Astro** (recomendado) para todo el frontend estático; blog como Content Collections en `content/blog/es` y `content/blog/en`.
- **Migración:** (1) Proyecto Astro nuevo, (2) rutas `/blog` y `/en/blog` + posts por slug, (3) 301 de `/blog/post/:id` y `/en/blog/post/:id`, (4) 20 posts demo ES/EN, (5) SEO (meta, hreflang, sitemap, RSS), (6) README y checklist QA.

Cuando confirmes que vas con **Astro** (o si prefieres **Next.js** con static export), el siguiente paso es implementar en commits pequeños siguiendo este plan.
