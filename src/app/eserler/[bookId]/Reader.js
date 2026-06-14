"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function Reader({ initialBook, bookId }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeChapter = initialBook.chapters[activeChapterIndex];

  return (
    <div className={styles.readerLayout}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h3>İçindekiler</h3>
          <button className={styles.toggleBtn} onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <ul className={styles.tocList}>
          {initialBook.chapters.map((chapter, index) => (
            <li key={chapter.id} className={styles.tocItem}>
              <button 
                className={`${styles.tocBtn} ${index === activeChapterIndex ? styles.active : ''}`}
                onClick={() => setActiveChapterIndex(index)}
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
                <p key={i} className={styles.paragraph}>{p.text}</p>
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
    </div>
  );
}
