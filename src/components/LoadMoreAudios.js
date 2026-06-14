'use client';
import { useState } from 'react';

export default function LoadMoreAudios({ audios }) {
  const [visibleCount, setVisibleCount] = useState(10);

  if (audios.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>Henüz ses kaydı eklenmemiş.</p>;
  }

  const visibleAudios = audios.slice(0, visibleCount);
  const hasMore = visibleCount < audios.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 10);

  const renderAudioPlayer = (url) => {
    if (!url) return null;
    if (url.includes('spotify.com') || url.includes('soundcloud.com')) {
      return <iframe src={url} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" style={{ borderRadius: '8px' }}></iframe>;
    }
    return <audio controls src={url} style={{ width: '100%', outline: 'none', borderRadius: '50px', height: '40px' }} />;
  };

  return (
    <>
      <style>{`
        .audio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .audio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="audio-grid">
        {visibleAudios.map(audio => (
          <article key={audio.id} style={{ backgroundColor: 'var(--color-bg-alt)', padding: '0.75rem 1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(220, 167, 91, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-primary)', fontWeight: 'bold' }}>{audio.title}</h2>
              <span style={{ color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{audio.date}</span>
            </div>
            {audio.desc && (
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.85rem', lineHeight: '1.3', marginBottom: '0.5rem' }}>
                {audio.desc}
              </p>
            )}
            <div style={{ width: '100%' }}>
              {renderAudioPlayer(audio.url)}
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            onClick={handleLoadMore}
            style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', backgroundColor: 'var(--color-secondary)', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s ease', boxShadow: '0 4px 15px rgba(220, 167, 91, 0.3)' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Daha Fazla Göster
          </button>
        </div>
      )}
    </>
  );
}
