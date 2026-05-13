
import React from 'react';

interface HeaderProps {
  lang: 'it' | 'en';
  setLang: (lang: 'it' | 'en') => void;
  currentPage: 'designer' | 'gallery';
  setCurrentPage: (page: 'designer' | 'gallery') => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, currentPage, setCurrentPage }) => {
  const t = {
    it: {
      subtitle: "Crea temi personalizzati per la tua radio con schermo a colori EdgeTX",
      siteBtn: "Sito Ufficiale EdgeTX",
      galleryBtn: "Gallery",
      designerBtn: "Editor"
    },
    en: {
      subtitle: "Create custom themes for your EdgeTX color screen radio",
      siteBtn: "Official EdgeTX Site",
      galleryBtn: "Gallery",
      designerBtn: "Designer"
    }
  };

  const FlagIT = () => (
    <svg viewBox="0 0 3 2" className="w-full h-full object-cover rounded-full">
      <rect width="1" height="2" fill="#009246"/>
      <rect width="1" height="2" x="1" fill="#fff"/>
      <rect width="1" height="2" x="2" fill="#ce2b37"/>
    </svg>
  );

  const FlagGB = () => (
    <svg viewBox="0 0 60 30" className="w-full h-full object-cover rounded-full">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">EdgeTX <span className="text-blue-500">Theme Designer</span> <span className="text-slate-500 text-sm font-medium">v.1.5</span></h1>
            <p className="text-slate-400 text-sm">{t[lang].subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-full border border-slate-800">
            <button 
              onClick={() => setLang('it')}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all border-2 ${
                lang === 'it' 
                  ? 'border-blue-500 scale-110 shadow-[0_0_12px_rgba(59,130,246,0.6)]' 
                  : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
              }`}
              title="Italiano"
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <FlagIT />
              </div>
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all border-2 ${
                lang === 'en' 
                  ? 'border-blue-500 scale-110 shadow-[0_0_12px_rgba(59,130,246,0.6)]' 
                  : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
              }`}
              title="English"
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <FlagGB />
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage(currentPage === 'gallery' ? 'designer' : 'gallery')}
              className={`text-xs py-2 px-4 rounded-full border transition-colors ${
                currentPage === 'gallery'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {currentPage === 'gallery' ? t[lang].designerBtn : t[lang].galleryBtn}
            </button>
            <a 
              href="https://edgetx.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-full border border-slate-700 transition-colors"
            >
              {t[lang].siteBtn}
            </a>
            <a 
              href="https://www.skyraccoon.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-full border border-slate-700 transition-colors"
            >
              SkyRaccoon
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
