/**
 * Datos del nuevo blog (mismo contenido que Astro blogEs/blogEn).
 * Legacy: id 1→4 mapean a estos slugs.
 */
export const LEGACY_ID_TO_SLUG = {
  1: 'aprendizaje-temprano-idiomas',
  2: 'rutina-cuentos-dormir',
  3: 'cuentos-transformaron-familia',
  4: 'cuentos-mindfulness-andalucia',
};

export const postsEs = [
  {
    slug: 'aprendizaje-temprano-idiomas',
    title: 'Aprendizaje temprano de idiomas con audiocuentos',
    excerpt: 'Cómo los cuentos en audio ayudan a los más pequeños a familiarizarse con el inglés de forma natural y divertida.',
    date: '2025-01-15',
    author: 'AudioGretel',
    category: 'Educación',
    tags: ['idiomas', 'niños', 'inglés', 'audiocuentos'],
    featuredImage: '/images/blog/aprendizaje-temprano-idiomas.svg',
    content: 'Los primeros años de vida son fundamentales para el desarrollo del lenguaje. Los audiocuentos en inglés permiten que los niños se expongan a sonidos, entonaciones y vocabulario de forma amena, sin presión.\n\nEn este artículo exploramos por qué el input auditivo es tan valioso y cómo integrar los cuentos en la rutina familiar.',
  },
  {
    slug: 'rutina-cuentos-dormir',
    title: 'Rutina de cuentos antes de dormir',
    excerpt: 'Crear un momento mágico cada noche con cuentos en inglés ayuda al sueño y al vínculo con tus hijos.',
    date: '2025-01-22',
    author: 'AudioGretel',
    category: 'Familia',
    tags: ['rutinas', 'sueño', 'familia', 'cuentos'],
    featuredImage: '/images/blog/rutina-cuentos-dormir.svg',
    content: 'Una rutina estable a la hora de acostarse reduce la ansiedad y mejora la calidad del sueño. Añadir un cuento en inglés, breve y relajado, convierte ese momento en algo especial.\n\nTe contamos cómo elegir el cuento adecuado y cómo mantener la constancia sin agobios.',
  },
  {
    slug: 'cuentos-transformaron-familia',
    title: 'Cómo los cuentos transformaron nuestra familia',
    excerpt: 'Una familia comparte su experiencia usando audiocuentos personalizados para conectar y aprender inglés juntos.',
    date: '2025-02-01',
    author: 'AudioGretel',
    category: 'Experiencias',
    tags: ['testimonios', 'familia', 'inglés', 'personalización'],
    featuredImage: '/images/blog/cuentos-transformaron-familia.svg',
    content: 'Cada familia tiene su historia. En esta entrevista, unos padres nos cuentan cómo introdujeron los audiocuentos en inglés en casa y qué cambió en la dinámica familiar y en la motivación de sus hijos.',
  },
  {
    slug: 'cuentos-mindfulness-andalucia',
    title: 'Cuentos y mindfulness en Andalucía',
    excerpt: 'Combinar cuentos en inglés con prácticas de atención plena en el aula y en casa.',
    date: '2025-02-10',
    author: 'AudioGretel',
    category: 'Educación',
    tags: ['mindfulness', 'andalucía', 'aula', 'calma'],
    featuredImage: '/images/blog/cuentos-mindfulness-andalucia.svg',
    content: 'En varias escuelas andaluzas se está probando la combinación de sesiones de cuentos en inglés con ejercicios breves de mindfulness. Los resultados apuntan a mayor calma y mejor retención del idioma.\n\nTe resumimos la experiencia y cómo replicarla en casa.',
  },
];

export const postsEn = [
  {
    slug: 'aprendizaje-temprano-idiomas',
    title: 'Early language learning with audio stories',
    excerpt: 'How audio stories help little ones get familiar with English in a natural and fun way.',
    date: '2025-01-15',
    author: 'AudioGretel',
    category: 'Education',
    tags: ['languages', 'children', 'English', 'audio stories'],
    featuredImage: '/images/blog/aprendizaje-temprano-idiomas.svg',
    content: 'The first years of life are key for language development. English audio stories let children be exposed to sounds, intonation and vocabulary in a relaxed, pressure-free way.\n\nIn this article we look at why auditory input is so valuable and how to fit stories into the family routine.',
  },
  {
    slug: 'rutina-cuentos-dormir',
    title: 'Bedtime story routine',
    excerpt: 'Creating a magical moment every night with English stories helps with sleep and bonding with your kids.',
    date: '2025-01-22',
    author: 'AudioGretel',
    category: 'Family',
    tags: ['routines', 'sleep', 'family', 'stories'],
    featuredImage: '/images/blog/rutina-cuentos-dormir.svg',
    content: 'A consistent bedtime routine reduces anxiety and improves sleep quality. Adding a short, calm story in English makes that time special.\n\nWe share how to choose the right story and keep it going without stress.',
  },
  {
    slug: 'cuentos-transformaron-familia',
    title: 'How stories transformed our family',
    excerpt: 'One family shares their experience using personalized audio stories to connect and learn English together.',
    date: '2025-02-01',
    author: 'AudioGretel',
    category: 'Experiences',
    tags: ['testimonials', 'family', 'English', 'personalization'],
    featuredImage: '/images/blog/cuentos-transformaron-familia.svg',
    content: "Every family has its own story. In this interview, parents tell us how they introduced English audio stories at home and what changed in family dynamics and their children's motivation.",
  },
  {
    slug: 'cuentos-mindfulness-andalucia',
    title: 'Stories and mindfulness in Andalusia',
    excerpt: 'Combining English stories with mindfulness practices in the classroom and at home.',
    date: '2025-02-10',
    author: 'AudioGretel',
    category: 'Education',
    tags: ['mindfulness', 'Andalusia', 'classroom', 'calm'],
    featuredImage: '/images/blog/cuentos-mindfulness-andalucia.svg',
    content: 'Several schools in Andalusia are trying the combination of English story sessions with short mindfulness exercises. Results point to greater calm and better language retention.\n\nWe summarise the experience and how to replicate it at home.',
  },
];

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
