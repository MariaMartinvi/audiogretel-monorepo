import { getCollection } from 'astro:content';

const site = 'https://audiogretel.com';

export async function GET() {
  const blogEs = await getCollection('blogEs');
  const blogEn = await getCollection('blogEn');
  const urls: string[] = [
    '/',
    '/about/',
    '/contact/',
    '/blog/',
    '/en/',
    '/en/about/',
    '/en/contact/',
    '/en/blog/',
  ];
  blogEs.forEach((p) => urls.push(`/blog/${p.slug}/`));
  blogEn.forEach((p) => urls.push(`/en/blog/${p.slug}/`));

  const lastmod = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url>
    <loc>${site}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
