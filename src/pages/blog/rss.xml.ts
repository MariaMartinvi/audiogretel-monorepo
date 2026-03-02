import { getCollection } from 'astro:content';

const site = 'https://audiogretel.com';

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getCollection('blogEs');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog - AudioGretel</title>
    <link>${site}/blog/</link>
    <description>Artículos sobre audiocuentos, inglés y familias.</description>
    <language>es</language>
    <atom:link href="${site}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${sorted.map((p) => `    <item>
      <title>${escapeXml(p.data.title)}</title>
      <link>${site}/blog/${p.slug}/</link>
      <description>${escapeXml(p.data.excerpt)}</description>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <guid isPermaLink="true">${site}/blog/${p.slug}/</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
