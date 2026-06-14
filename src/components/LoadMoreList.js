'use client';
import { useState } from 'react';
import Link from 'next/link';

const getExcerpt = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
};

export default function LoadMoreList({ items, type }) {
  const [visibleCount, setVisibleCount] = useState(9);

  if (items.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>Henüz kayıt eklenmemiş.</p>;
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {visibleItems.map(item => (
          <article key={item.id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-alt)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(220, 167, 91, 0.2)', transition: 'transform 0.3s ease' }}>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-secondary)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              <span>{item.date}</span>
              {(item.source || item.location) && <span style={{ color: 'var(--color-text-muted)' }}>• {item.source || item.location}</span>}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)', lineHeight: 1.3 }}>{item.title}</h2>
            <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
              {getExcerpt(item.content)}
            </p>
            <Link href={`/${type === 'makale' ? 'makaleler' : 'anilar'}/${item.id}`} className="read-more-link" style={{ display: 'inline-block', alignSelf: 'flex-start', color: 'var(--color-secondary)', fontWeight: 'bold', borderBottom: '1px solid transparent', paddingBottom: '2px', transition: 'border-color 0.3s ease' }}>
              Devamını Oku →
            </Link>
          </article>
        ))}
      </div>
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button 
            onClick={handleLoadMore}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem', backgroundColor: 'var(--color-secondary)', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s ease', boxShadow: '0 4px 15px rgba(220, 167, 91, 0.3)' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Daha Fazla Göster
          </button>
        </div>
      )}
      
      <style>{`
        .read-more-link:hover {
          border-bottom-color: var(--color-secondary) !important;
        }
      `}</style>
    </>
  );
}
