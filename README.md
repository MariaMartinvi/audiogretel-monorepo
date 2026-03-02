# AudioGretel

Sitio estático (Astro) para audiogretel.com. El blog es 100% estático (SSG) para SEO.

## Blog estático

### Estructura

- **Contenido:** `src/content/blogEs/` (español) y `src/content/blogEn/` (inglés). Un archivo `.md` por post.
- **Rutas:** `/blog` (listado ES), `/blog/<slug>/` (post ES), `/en/blog`, `/en/blog/<slug>/`.
- **Legacy:** `/blog/post/1/` … `/blog/post/4/` (y `/en/blog/post/1/` … `4/`) redirigen al slug correspondiente.

### Añadir un post

1. Crea `src/content/blogEs/mi-nuevo-post.md` (y opcionalmente `src/content/blogEn/mi-nuevo-post.md`).
2. Frontmatter mínimo:

```yaml
---
title: "Título del post"
excerpt: "Resumen corto para listados y meta."
date: 2025-03-01
author: "AudioGretel"
category: "Educación"
tags: ["tag1", "tag2"]
featuredImage: "/images/blog/imagen.jpg"
metaTitle: "Título SEO | AudioGretel"
metaDescription: "Descripción para buscadores."
---
```

3. El slug se genera del nombre del archivo (`mi-nuevo-post.md` → `/blog/mi-nuevo-post/`).

### Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:4321 (inicio), http://localhost:4321/blog (blog ES), http://localhost:4321/en/blog (blog EN).

### Build y deploy

```bash
npm run build
```

La carpeta `dist/` es la salida estática. En Render: configurar como **Static Site**, raíz del repo, comando `npm run build`, directorio de publicación `dist`.

### SEO

- Sitemap: https://audiogretel.com/sitemap.xml
- RSS: /blog/rss.xml (ES), /en/blog/rss.xml (EN)
- robots.txt en /robots.txt
- Meta canonical, OG, Twitter y hreflang en listado y posts.
