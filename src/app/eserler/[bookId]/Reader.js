"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function Reader({ initialBook, bookId }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeChapter = initialBook.chapters[activeChapterIndex];

  const handleChapterClick = (index) => {
    setActiveChapterIndex(index);
    setIsMobileMenuOpen(false); // Close mobile menu when clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.readerLayout}>
      <div 
        className={`${styles.backdrop} ${isMobileMenuOpen ? styles.mobileOpen : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>İçindekiler</h3>
          <button className={styles.toggleBtn} onClick={() => {
            setIsSidebarOpen(false);
            setIsMobileMenuOpen(false);
          }}>✕</button>
        </div>
        <ul className={styles.tocList}>
          {initialBook.chapters.map((chapter, index) => (
            <li key={chapter.id} className={styles.tocItem}>
              <button 
                className={`${styles.tocBtn} ${index === activeChapterIndex ? styles.active : ''}`}
                onClick={() => handleChapterClick(index)}
              >
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.mainContent}>
        {!isSidebarOpen && (
          <button className={styles.openSidebarBtn} onClick={() => setIsSidebarOpen(true)}>
            ☰ İçindekiler
          </button>
        )}
        
        <div className={styles.contentInner}>
          <div className={styles.bookHeader}>
            <h1>{initialBook.title}</h1>
            <p className={styles.subtitle}>{initialBook.subtitle}</p>
          </div>

          <article className={styles.chapter}>
            <h2 className={styles.chapterTitle}>{activeChapter.title}</h2>
            <div className={styles.divider}></div>
            
            <div className={styles.paragraphs}>
              {activeChapter.paragraphs.map((p, i) => (
                <p key={i} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: p.text }}></p>
              ))}
            </div>
          </article>

          <div className={styles.navigation}>
            <button 
              className="btn btn-secondary"
              disabled={activeChapterIndex === 0}
              onClick={() => {
                setActiveChapterIndex(prev => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ← Önceki Bölüm
            </button>
            <span className={styles.pageInfo}>{activeChapterIndex + 1} / {initialBook.chapters.length}</span>
            <button 
              className="btn btn-secondary"
              disabled={activeChapterIndex === initialBook.chapters.length - 1}
              onClick={() => {
                setActiveChapterIndex(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Sonraki Bölüm →
            </button>
          </div>
        </div>
      </main>

      <div className={styles.fabContainer}>
        <button className={`${styles.fabBtn} ${styles.fabMenu}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="İçindekiler">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <button className={`${styles.fabBtn} ${styles.fabUp}`} onClick={handleScrollTop} aria-label="Yukarı Çık">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
