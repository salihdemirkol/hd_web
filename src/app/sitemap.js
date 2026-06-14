import { getDb } from '@/lib/db';

export default async function sitemap() {
  // Domain adresinizi buraya yazabilirsiniz veya .env dosyasına NEXT_PUBLIC_SITE_URL olarak ekleyebilirsiniz.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hasandamar.com';

  // Core static routes
  const routes = [
    '',
    '/videolar',
    '/galeri',
    '/makaleler',
    '/kronoloji',
    '/anilar',
    '/ses-kayitlari',
    '/kulliyat'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  let articles = [];
  let memories = [];
  
  try {
    const db = await getDb();
    
    // Articles
    articles = (db.articles || []).filter(a => !a.hidden).map((article) => ({
      url: `${baseUrl}/makaleler/${article.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Memories
    memories = (db.memories || []).filter(m => !m.hidden).map((memory) => ({
      url: `${baseUrl}/anilar/${memory.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch(e) {
    console.error("Sitemap oluşturulurken db okuma hatası:", e);
  }

  // Books
  const books = [
    { slug: 'efendilikten-kolelige-1' },
    { slug: 'efendilikten-kolelige-2' },
    { slug: 'dgm-163' }
  ].map(book => ({
    url: `${baseUrl}/eserler/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...routes, ...articles, ...memories, ...books];
}
