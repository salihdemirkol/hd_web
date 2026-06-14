'use client';
import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="container header-inner">
        <div className="header-left">
          <Link href="/" className="logo-container notranslate" onClick={() => setIsMenuOpen(false)}>
            <div className="logo-mark">ح</div>
            <div className="logo-text">
              <span className="logo-title">Hasan Damar</span>
            </div>
          </Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menüyü Aç/Kapat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"></path>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            )}
          </svg>
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/videolar" onClick={() => setIsMenuOpen(false)}>Videolar</Link>
          <Link href="/galeri" onClick={() => setIsMenuOpen(false)}>Galeri</Link>
          <Link href="/makaleler" onClick={() => setIsMenuOpen(false)}>Makaleler</Link>
          <Link href="/biyografi" onClick={() => setIsMenuOpen(false)}>Kronoloji</Link>
          <Link href="/anilar" onClick={() => setIsMenuOpen(false)}>Anılar</Link>
          <Link href="/ses-kayitlari" onClick={() => setIsMenuOpen(false)}>Ses Kayıtları</Link>
          
          {/* Mobil görünümde eklentileri göstermek için nav içine klonluyoruz */}
          <div className="mobile-actions">
            <Link href="/kulliyat" className="header-cta" onClick={() => setIsMenuOpen(false)}>KÜLLİYAT</Link>
            <LanguageSwitcher />
          </div>
        </nav>

        <div className="header-actions desktop-actions">
          <Link href="/kulliyat" className="header-cta">KÜLLİYAT</Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
