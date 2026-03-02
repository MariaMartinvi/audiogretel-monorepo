# Cómo añadir artículos e imágenes al blog

El blog se genera desde **archivos Markdown** por idioma. No edites `blogPosts.js` ni `blogPosts.generated.js` a mano.

---

## Flujo resumido

1. **Imagen** → en `frontend/public/images/blog/`
2. **Dos archivos .md** → uno en `frontend/content/blog/es/` y otro en `frontend/content/blog/en/` (mismo `slug`)
3. **Regenerar datos** → `npm run blog:generate` (o se ejecuta solo antes de `npm run build`)

---

## 1. Añadir la imagen

1. Guarda la imagen en **`frontend/public/images/blog/`**.
2. Nombre recomendado: minúsculas, sin espacios (ej. `consejos-verano.jpg`).
3. Formatos válidos: JPG, PNG, WebP, SVG.

La URL en el sitio será: **`/images/blog/nombre-del-archivo.jpg`**.

---

## 2. Añadir el artículo (español)

Crea un archivo en **`frontend/content/blog/es/`** con nombre **`<slug>.md`** (ej. `consejos-verano.md`).

Ejemplo:

```md
---
slug: consejos-verano
title: Consejos para el verano con audiocuentos
excerpt: Ideas para seguir aprendiendo inglés en vacaciones con cuentos en audio.
date: '2025-03-15'
author: AudioGretel
category: Familia
tags:
  - verano
  - vacaciones
  - inglés
featuredImage: /images/blog/consejos-verano.jpg
---

Primer párrafo del artículo. Puedes usar **negrita** y [enlaces](https://ejemplo.com).

Segundo párrafo. También listas:

- Punto uno
- Punto dos
```

- **slug**: mismo que el nombre del archivo (sin `.md`). Será la URL: `/blog/post/consejos-verano`.
- El **cuerpo** (debajo del segundo `---`) es Markdown: párrafos, listas, negrita, enlaces, etc.

---

## 3. Añadir el artículo (inglés)

Crea el **mismo artículo en inglés** en **`frontend/content/blog/en/`** con **el mismo nombre de archivo** (`consejos-verano.md`):

```md
---
slug: consejos-verano
title: Summer tips with audio stories
excerpt: Ideas to keep learning English on holiday with audio stories.
date: '2025-03-15'
author: AudioGretel
category: Family
tags:
  - summer
  - holidays
  - English
featuredImage: /images/blog/consejos-verano.jpg
---

First paragraph. You can use **bold** and [links](https://example.com).

Second paragraph.
```

El **slug** y **featuredImage** deben coincidir con el archivo en español.

---

## 4. Regenerar y comprobar

En la raíz del **frontend**:

```bash
npm run blog:generate
```

Eso genera/actualiza `frontend/src/data/blogPosts.generated.js`. Luego:

- **Desarrollo:** `npm start` (el listado y el detalle del blog usarán los nuevos posts).
- **Producción:** `npm run build` ya ejecuta `blog:generate` antes de compilar.

---

## 5. (Opcional) URLs antiguas tipo /blog/post/5

Si quieres que `/blog/post/5` apunte al nuevo artículo, en **`frontend/src/data/blogPosts.js`** añade una entrada en **`LEGACY_ID_TO_SLUG`** (ese archivo sí se edita a mano para esto):

```js
export const LEGACY_ID_TO_SLUG = {
  1: 'aprendizaje-temprano-idiomas',
  2: 'rutina-cuentos-dormir',
  3: 'cuentos-transformaron-familia',
  4: 'cuentos-mindfulness-andalucia',
  5: 'consejos-verano',  // nuevo
};
```

---

## Resumen

| Qué | Dónde |
|-----|--------|
| Imagen del artículo | `frontend/public/images/blog/nombre.jpg` |
| Post en español | `frontend/content/blog/es/<slug>.md` |
| Post en inglés | `frontend/content/blog/en/<slug>.md` (mismo slug) |
| Regenerar datos | `npm run blog:generate` (o al hacer `npm run build`) |
| URL del artículo | `https://tudominio.com/blog/post/<slug>` |

No hace falta tocar rutas ni componentes: solo los dos `.md`, la imagen y, si quieres, `LEGACY_ID_TO_SLUG` en `blogPosts.js`.
