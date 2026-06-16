'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoadMoreVideos({ videos }) {
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (videos.length === 0) {
    return <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>Henüz video eklenmemiş.</p>;
  }

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 9);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {visibleVideos.map(video => {
          const isYoutube = video.url?.includes('youtube.com') || video.url?.includes('youtu.be');
          let embedUrl = video.url;
          let thumbUrl = '';
          
          if (isYoutube) {
            const videoId = video.url.includes('v=') ? video.url.split('v=')[1].split('&')[0] : video.url.split('/').pop();
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }

          return (
            <div 
              key={video.id} 
              onClick={() => setSelectedVideo({ ...video, embedUrl, isYoutube })}
              className="mock-card" 
              style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(220, 167, 91, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease', cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} 
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000' }}>
                {isYoutube ? (
                  <Image src={thumbUrl} alt={video.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                ) : (
                  <video src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}></video>
                )}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', backgroundColor: 'rgba(220,167,91,0.9)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{video.date}</div>
                <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary)', lineHeight: 1.3 }}>{video.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>{video.desc}</p>
              </div>
            </div>
          );
        })}
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

      {/* Lightbox Modal */}
      {selectedVideo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem'
        }} onClick={() => setSelectedVideo(null)}>
          
          <button onClick={() => setSelectedVideo(null)} style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            ✕
          </button>

          <div onClick={e => e.stopPropagation()} style={{
            display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1000px',
            backgroundColor: 'var(--color-bg-alt)', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(220,167,91,0.3)'
          }}>
            <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%', backgroundColor: '#000' }}>
              {selectedVideo.isYoutube ? (
                <iframe src={selectedVideo.embedUrl} allow="autoplay; fullscreen" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}></iframe>
              ) : (
                <video src={selectedVideo.url} controls autoPlay style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}></video>
              )}
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedVideo.date}</div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
                {selectedVideo.title}
              </h2>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                {selectedVideo.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
