export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hasandamar.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Admin panelini ve API yollarını arama motorlarına kapatıyoruz.
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
