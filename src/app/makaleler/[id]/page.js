import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = await getDb();
  const article = (db.articles || []).find(a => a.id === id);
  if (!article) return { title: 'Makale Bulunamadı | Hasan Damar' };
  return { title: `${article.title} | Hasan Damar` };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const db = await getDb();
  
  const articles = (db.articles || []).filter(a => !a.hidden);
  const currentIndex = articles.findIndex(a => a.id === id);
  const article = articles[currentIndex];

  if (!article) {
    notFound();
  }

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/makaleler" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 'bold' }}>
          <span>←</span> Makalelere Dön
        </Link>
        
        <article style={{ backgroundColor: 'var(--color-bg-alt)', padding: '3rem 2rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(220, 167, 91, 0.2)' }}>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            <span>{article.date}</span>
            {article.source && <span style={{ color: 'var(--color-text-muted)' }}>• {article.source}</span>}
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-primary)', lineHeight: 1.2 }}>{article.title}</h1>
          
          <div className="divider" style={{ width: '60px', height: '3px', backgroundColor: 'var(--color-secondary)', marginBottom: '3rem' }}></div>
          
          <div 
            className="article-content" 
            style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1.1rem' }}
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </article>

        {/* Prev/Next Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid rgba(220,167,91,0.2)', paddingTop: '2rem' }}>
          <div style={{ flex: 1, paddingRight: '1rem' }}>
            {prevArticle && (
              <Link href={`/makaleler/${prevArticle.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '0.5rem', opacity: 0.9 }}>← Önceki Makale</span>
                <span style={{ display: 'block', color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{prevArticle.title}</span>
              </Link>
            )}
          </div>
          <div style={{ flex: 1, paddingLeft: '1rem', textAlign: 'right' }}>
            {nextArticle && (
              <Link href={`/makaleler/${nextArticle.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '0.5rem', opacity: 0.9 }}>Sonraki Makale →</span>
                <span style={{ display: 'block', color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{nextArticle.title}</span>
              </Link>
            )}
          </div>
        </div>

      </div>
      <style>{`
        .article-content p { margin-bottom: 1.5rem; }
        .article-content h1, .article-content h2, .article-content h3 { color: var(--color-primary); margin-top: 2rem; margin-bottom: 1rem; }
        .article-content ul, .article-content ol { margin-left: 2rem; margin-bottom: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content a { color: var(--color-secondary); text-decoration: underline; text-underline-offset: 4px; }
        .article-content blockquote { border-left: 4px solid var(--color-secondary); padding-left: 1rem; margin-left: 0; font-style: italic; color: #555; }
        .article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
      `}</style>
    </div>
  );
}
