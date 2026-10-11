import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { SERVICES, serviceUrl } from '@/data/services';

/* Sitemap gerado no build (o site passou de 5 rotas; ver CLAUDE.md → Sitemap).
   Ao criar uma página, acrescentá-la aqui. A 404 fica de fora (noindex). */
const ROUTES = ['/', ...SERVICES.map((s) => serviceUrl(s.slug))];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map(
    (path) =>
      `  <url>\n    <loc>${new URL(path, SITE.url).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  ).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
