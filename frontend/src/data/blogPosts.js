/**
 * Datos del blog: re-exporta posts generados desde Markdown y mantiene API pública.
 * Cómo añadir artículos: ver docs/BLOG-COMO-ANADIR-ARTICULOS.md
 * Los arrays postsEs/postsEn se generan con: npm run blog:generate
 */
import { postsEs, postsEn } from './blogPosts.generated.js';

export const LEGACY_ID_TO_SLUG = {
  1: 'aprendizaje-temprano-idiomas',
  2: 'rutina-cuentos-dormir',
  3: 'cuentos-transformaron-familia',
  4: 'cuentos-mindfulness-andalucia',
};

export { postsEs, postsEn };

export function getPosts(lang) {
  return lang === 'en' ? [...postsEn].sort((a, b) => new Date(b.date) - new Date(a.date)) : [...postsEs].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(lang, slug) {
  const posts = lang === 'en' ? postsEn : postsEs;
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostByLegacyId(lang, id) {
  const slug = LEGACY_ID_TO_SLUG[Number(id)];
  return slug ? getPostBySlug(lang, slug) : null;
}
