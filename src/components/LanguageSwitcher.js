'use client';
import { useEffect, useState } from 'react';
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
  const [currentLang, setCurrentLang] = useState('tr');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Do not render anything or run logic if we are in admin
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    // Check if user has already set a preference
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    };

    const savedLang = getCookie('googtrans');
    if (savedLang) {
      const langCode = savedLang.split('/')[2];
      if (langCode) {
        setCurrentLang(langCode);
      }
    } else {
      // Auto-detect via IP if no cookie is found
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
            // Latin isn't a native country language but added per request
            
            if (autoLang !== 'tr') {
              changeLanguage(autoLang, true); // initial auto-set
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

  const changeLanguage = (langCode, isInitial = false) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Set Google Translate cookie (sets both domain and path correctly)
    const domain = window.location.hostname;
    document.cookie = `googtrans=/tr/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/tr/${langCode}; path=/; domain=.${domain}`;
    
    if (!isInitial) {
      window.location.reload(); // Reload to apply changes immediately
    }
  };

  return (
    <div className="language-switcher-container" style={{ position: 'relative', display: 'inline-block', marginLeft: '1rem', zIndex: 9999 }}>
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
