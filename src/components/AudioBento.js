"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';
import { AudioIcon } from './Icons';

export default function AudioBento({ pinnedAudio }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className={`${styles.bentoItem} ${styles.bentoSmall} ${styles.bentoHoverable} animate-slide-up delay-700`}
      onClick={() => router.push('/ses-kayitlari')}
      style={{ 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <div className={styles.bentoContent} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AudioIcon className={styles.iconSvg} />
          {pinnedAudio && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0, lineHeight: '1.2' }}>
                  {pinnedAudio.title}
                </p>
                <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.2' }}>
                  Şimdi Dinle
                </p>
              </div>
              <button 
                onClick={togglePlay}
                title={isPlaying ? "Durdur" : "Dinle"}
                style={{
                  background: isPlaying ? 'var(--color-primary)' : 'transparent',
                  border: '1px solid var(--color-primary)',
                  color: isPlaying ? '#fff' : 'var(--color-primary)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  paddingLeft: isPlaying ? '0' : '2px', // icon optical alignment
                  flexShrink: 0
                }}
              >
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <audio ref={audioRef} src={pinnedAudio.url} onEnded={() => setIsPlaying(false)} />
            </div>
          )}
        </div>
        
        <h3 className={styles.bentoTitleSmall} style={{marginTop: '1rem', marginBottom: '0.5rem'}}>Ses Kayıtları</h3>
        
        <p className={styles.bentoDescSmall} style={{ marginTop: 'auto' }}>Eski sohbet ve konferans kasetleri</p>
      </div>

    </div>
  );
}
