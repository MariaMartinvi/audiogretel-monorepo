/**
 * Generates blogPosts.generated.js from Markdown files in content/blog/es and content/blog/en.
 * Run: npm run blog:generate
 * Uses gray-matter for frontmatter parsing.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const CONTENT_ES = path.join(FRONTEND_ROOT, 'content', 'blog', 'es');
const CONTENT_EN = path.join(FRONTEND_ROOT, 'content', 'blog', 'en');
const OUT_FILE = path.join(FRONTEND_ROOT, 'src', 'data', 'blogPosts.generated.js');

function readPostsFromDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const contentTrimmed = content.trim();
    posts.push({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      featuredImage: data.featuredImage || '/images/blog/placeholder.svg',
      content: contentTrimmed,
    });
  }
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function escapeForJs(str) {
  if (str == null) return '""';
  return JSON.stringify(String(str));
}

function serializePost(p) {
  const contentEscaped = escapeForJs(p.content);
  return `  {
    slug: ${escapeForJs(p.slug)},
    title: ${escapeForJs(p.title)},
    excerpt: ${escapeForJs(p.excerpt)},
    date: ${escapeForJs(p.date)},
    author: ${escapeForJs(p.author)},
    category: ${escapeForJs(p.category)},
    tags: ${JSON.stringify(p.tags)},
    featuredImage: ${escapeForJs(p.featuredImage)},
    content: ${contentEscaped}
  }`;
}

function run() {
  const postsEs = readPostsFromDir(CONTENT_ES);
  const postsEn = readPostsFromDir(CONTENT_EN);

  const out = `/**
 * AUTO-GENERATED - Do not edit. Run \`npm run blog:generate\` to regenerate from content/blog/es and content/blog/en.
 */
export const postsEs = [
${postsEs.map(serializePost).join(',\n')}
];

export const postsEn = [
${postsEn.map(serializePost).join(',\n')}
];
`;

  fs.writeFileSync(OUT_FILE, out, 'utf8');
  console.log(`✅ blogPosts.generated.js written (${postsEs.length} ES, ${postsEn.length} EN posts).`);
}

run();
