'use client';
import { useState, useEffect } from 'react';

export default function LoadMoreGallery({ photos }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        else setSelectedIndex(null);
      }
      if (e.key === 'ArrowRight' && selectedIndex !== null) handleNext();
      if (e.key === 'ArrowLeft' && selectedIndex !== null) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (photos.length === 0) {
    return <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>Henüz fotoğraf eklenmemiş.</p>;
  }

  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 12);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {visiblePhotos.map((photo, index) => (
          <div key={photo.id} onClick={() => setSelectedIndex(index)} className="mock-card" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#2a2520', aspectRatio: '4/3', cursor: 'pointer', border: '1px solid rgba(220, 167, 91, 0.1)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <p style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>{photo.title}</p>
            </div>
          </div>
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

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: isFullscreen ? '#000' : 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: isFullscreen ? '0' : '2rem'
        }} onClick={() => isFullscreen ? setIsFullscreen(false) : setSelectedIndex(null)}>
          
          {/* Close Button */}
          <button onClick={(e) => { e.stopPropagation(); isFullscreen ? setIsFullscreen(false) : setSelectedIndex(null); }} style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            ✕
          </button>

          {/* Prev Button */}
          <button onClick={handlePrev} style={{
            position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: '50px', height: '50px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            ❮
          </button>

          {/* Next Button */}
          <button onClick={handleNext} style={{
            position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: '50px', height: '50px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            ❯
          </button>

          {/* Modal Content */}
          <div className={isFullscreen ? "modal-fullscreen" : "modal-content-container"} onClick={e => e.stopPropagation()}>
            
            {/* Image Section */}
            <div className="modal-image-section" onClick={() => setIsFullscreen(!isFullscreen)}>
              <img 
                src={photos[selectedIndex].url} 
                alt={photos[selectedIndex].title} 
                style={{
                  maxWidth: '100%', maxHeight: '100%', 
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%'
                }} 
              />
              {!isFullscreen && (
                <div style={{ 
                  position: 'absolute', bottom: '1rem', right: '1rem', 
                  backgroundColor: 'rgba(220,167,91,0.9)', color: '#000', 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)', pointerEvents: 'none'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info Section (Hidden in Fullscreen) */}
            {!isFullscreen && (
              <div className="custom-scrollbar modal-info-section">
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-secondary)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                  {photos[selectedIndex].title}
                </h3>
                {photos[selectedIndex].content ? (
                  <div 
                    style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: photos[selectedIndex].content }}
                  />
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>Bu fotoğraf için detaylı açıklama eklenmemiş.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220,167,91,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220,167,91,0.6); }
        
        .modal-fullscreen {
          width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;
        }
        
        .modal-content-container {
          display: flex;
          width: 90%;
          max-width: 950px;
          height: 70vh;
          background-color: var(--color-bg-alt);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(220,167,91,0.3);
          flex-direction: row;
        }

        .modal-image-section {
          flex: 2;
          background-color: #000;
          cursor: zoom-in;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .modal-fullscreen .modal-image-section {
          flex: none;
          width: 100%;
          height: 100%;
          cursor: zoom-out;
        }

        .modal-info-section {
          flex: 1;
          padding: 3rem 2rem;
          overflow-y: auto;
          border-left: 1px solid rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .modal-content-container {
            flex-direction: column;
            height: 85vh;
          }
          .modal-image-section {
            flex: none;
            height: 50%;
          }
          .modal-info-section {
            flex: 1;
            padding: 1.5rem 1.5rem;
            border-left: none;
            border-top: 1px solid rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </>
  );
}
