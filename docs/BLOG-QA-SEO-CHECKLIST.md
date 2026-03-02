# Checklist QA SEO – Blog AudioGretel

## Indexabilidad

- [ ] No hay `noindex` en listado ni posts (salvo legacy si se desea).
- [ ] Todas las URLs del blog devuelven 200 y HTML completo (no SPA vacío).
- [ ] robots.txt permite `User-agent: *` y `Allow: /` y referencia Sitemap.

## Canonical

- [ ] Cada página tiene `<link rel="canonical" href="https://audiogretel.com/...">` absoluto.
- [ ] Posts: canonical apunta a la URL con slug (con o sin barra final según configuración).
- [ ] Páginas legacy: canonical apunta al post definitivo (slug), no a /blog/post/N.

## Hreflang

- [ ] Listado: `/blog` tiene `hreflang="es"` y `hreflang="en"` (y `x-default` si aplica).
- [ ] Listado EN: `/en/blog` tiene alternates ES y EN.
- [ ] Cada post tiene alternates al otro idioma (mismo slug en /blog/ y /en/blog/).

## Sitemap

- [ ] https://audiogretel.com/sitemap.xml existe y es XML válido.
- [ ] Incluye /blog, /en/blog y todos los posts ES y EN.
- [ ] robots.txt incluye `Sitemap: https://audiogretel.com/sitemap.xml`.

## Legacy y redirecciones

- [ ] /blog/post/1/ … /blog/post/4/ (y EN) redirigen (meta refresh o 301) al slug correcto.
- [ ] Esas páginas tienen canonical al slug definitivo.
- [ ] Si se usa _redirects (Render), reglas probadas.

## RSS

- [ ] /blog/rss.xml (ES) y /en/blog/rss.xml (EN) existen y son RSS válidos.
- [ ] Incluyen los posts del idioma correspondiente con link al post.

## JSON-LD

- [ ] Cada post incluye script `application/ld+json` tipo Article (headline, description, image, datePublished, author).
- [ ] Si hay bloque FAQ en frontmatter, se emite FAQPage (opcional).
