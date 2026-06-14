'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'la', name: 'Latina', flag: '🏛️' }, // Latin doesn't have an official flag, using a temple icon
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentLang, setCurrentLang] = useState('tr');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Do not render anything or run logic if we are in admin
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if user has already set a preference
    const savedLang = localStorage.getItem('hd_lang_pref');
    
    if (savedLang) {
      if (savedLang !== 'tr') {
        setCurrentLang(savedLang);
        // We will apply the change via Google Translate once it's loaded
      }
    } else {
      // Auto-detect via IP if no preference is found
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country_code) {
            let autoLang = 'tr';
            const country = data.country_code;
            
            if (['DE', 'AT', 'CH'].includes(country)) autoLang = 'de';
            else if (['GB', 'US', 'AU', 'CA', 'NZ', 'IE'].includes(country)) autoLang = 'en';
            else if (['FR', 'BE', 'MC'].includes(country)) autoLang = 'fr';
            else if (['SA', 'AE', 'QA', 'BH', 'KW', 'OM', 'EG', 'JO', 'LB', 'SY', 'IQ', 'YE', 'DZ', 'MA', 'TN', 'LY', 'SD'].includes(country)) autoLang = 'ar';
            // Latin isn't a native country language
            
            if (autoLang !== 'tr') {
              setCurrentLang(autoLang);
              localStorage.setItem('hd_lang_pref', autoLang);
              
              // Apply immediately via cookie for Google Translate
              document.cookie = `googtrans=/tr/${autoLang}; path=/;`;
              document.cookie = `googtrans=/tr/${autoLang}; path=/; domain=${window.location.hostname}`;
            }
          }
        })
        .catch(err => console.error("IP lookup failed", err));
    }

    // Define Google Translate Init Function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'tr', 
          includedLanguages: 'tr,de,en,fr,la,ar',
          autoDisplay: false
        },
        'google_translate_element'
      );
      
      // If we have a saved non-TR lang, make sure it's applied when widget loads
      const savedLangPref = localStorage.getItem('hd_lang_pref');
      if (savedLangPref && savedLangPref !== 'tr') {
        setTimeout(() => {
          const selectField = document.querySelector('.goog-te-combo');
          if (selectField) {
            selectField.value = savedLangPref;
            selectField.dispatchEvent(new Event('change'));
          }
        }, 1000);
      }
    };

    // Inject Script if not already there
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      setScriptLoaded(true);
    }

  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Save preference permanently
    localStorage.setItem('hd_lang_pref', langCode);
    
    if (langCode === 'tr') {
       // If switching back to original, clear the translation cookies
       document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
       document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
       document.cookie = `googtrans=/tr/${langCode}; path=/;`;
       document.cookie = `googtrans=/tr/${langCode}; path=/; domain=${window.location.hostname}`;
    }
    
    // Try to use Google's select box for instant translation without reload
    const selectField = document.querySelector('.goog-te-combo');
    if (selectField) {
      if (langCode === 'tr') {
         // Reset to original
         const iframe = document.querySelector('.goog-te-banner-frame');
         if (iframe) {
           const restoreBtn = iframe.contentWindow.document.getElementById(':1.restore');
           if (restoreBtn) restoreBtn.click();
           else window.location.reload();
         } else {
            window.location.reload();
         }
      } else {
         selectField.value = langCode;
         selectField.dispatchEvent(new Event('change'));
      }
    } else {
      // If widget isn't ready but user clicked, reload as fallback
      window.location.reload();
    }
  };

  return (
    <div ref={dropdownRef} className="language-switcher-container notranslate" style={{ position: 'relative', display: 'inline-block', marginLeft: '1rem', zIndex: 9999 }}>
      {/* Hidden Div for Google Translate logic */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="language-btn"
        aria-label="Dil Seçimi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>
          {currentLang}
        </span>
      </button>

      {isOpen && (
        <div className="language-dropdown glass-panel">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={currentLang === lang.code ? 'active' : ''}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
