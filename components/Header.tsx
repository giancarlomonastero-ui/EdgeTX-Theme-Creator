
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  lang: 'it' | 'en';
  setLang: (lang: 'it' | 'en') => void;
  currentPage: 'designer' | 'gallery' | 'splash';
  setCurrentPage: (page: 'designer' | 'gallery' | 'splash') => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = {
    it: {
      subtitle: "Crea temi personalizzati per la tua radio con schermo a colori EdgeTX",
      siteBtn: "Sito Ufficiale EdgeTX",
      galleryBtn: "Gallery",
      designerBtn: "Editor",
      splashBtn: "Splash Screen"
    },
    en: {
      subtitle: "Create custom themes for your EdgeTX color screen radio",
      siteBtn: "Official EdgeTX Site",
      galleryBtn: "Gallery",
      designerBtn: "Designer",
      splashBtn: "Splash Screen"
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
    <header className="relative bg-slate-900 border-b border-slate-800 py-4 md:py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Logo and Subtitle Section */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              EdgeTX <span className="text-blue-500">Theme Designer</span> <span className="text-slate-500 text-xs md:text-sm font-medium">v.1.8</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">{t[lang].subtitle}</p>
          </div>

          {/* Mobile elements aligned to the far right: Language Switcher + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Language Switcher for Mobile */}
            <div className="flex items-center gap-1.5 bg-slate-950/50 p-1 rounded-full border border-slate-800">
              <button 
                onClick={() => setLang('it')}
                className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all border-2 ${
                  lang === 'it' 
                    ? 'border-blue-500 scale-105 shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
                    : 'border-transparent opacity-40 hover:opacity-100'
                }`}
                title="Italiano"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <FlagIT />
                </div>
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all border-2 ${
                  lang === 'en' 
                    ? 'border-blue-500 scale-105 shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
                    : 'border-transparent opacity-40 hover:opacity-100'
                }`}
                title="English"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <FlagGB />
                </div>
              </button>
            </div>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Right side for desktop screens */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switcher for Desktop */}
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

          <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
            <button
              onClick={() => setCurrentPage('designer')}
              className={`text-xs py-2 px-4 rounded-full border transition-all ${
                currentPage === 'designer'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {t[lang].designerBtn}
            </button>
            <button
              onClick={() => setCurrentPage('gallery')}
              className={`text-xs py-2 px-4 rounded-full border transition-all ${
                currentPage === 'gallery'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {t[lang].galleryBtn}
            </button>
            <button
              onClick={() => setCurrentPage('splash')}
              className={`text-xs py-2 px-4 rounded-full border transition-all ${
                currentPage === 'splash'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {t[lang].splashBtn}
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

      {/* Mobile Dropdown Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 border-t border-slate-800 pt-4 flex flex-col gap-2">
          <button
            onClick={() => {
              setCurrentPage('designer');
              setIsMenuOpen(false);
            }}
            className={`text-left text-sm py-2 px-4 rounded-lg border transition-all ${
              currentPage === 'designer'
                ? 'bg-blue-600 border-blue-500 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'bg-slate-950/40 hover:bg-slate-800 text-slate-300 border-slate-850'
            }`}
          >
            {t[lang].designerBtn}
          </button>
          <button
            onClick={() => {
              setCurrentPage('gallery');
              setIsMenuOpen(false);
            }}
            className={`text-left text-sm py-2 px-4 rounded-lg border transition-all ${
              currentPage === 'gallery'
                ? 'bg-blue-600 border-blue-500 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'bg-slate-950/40 hover:bg-slate-800 text-slate-300 border-slate-850'
            }`}
          >
            {t[lang].galleryBtn}
          </button>
          <button
            onClick={() => {
              setCurrentPage('splash');
              setIsMenuOpen(false);
            }}
            className={`text-left text-sm py-2 px-4 rounded-lg border transition-all ${
              currentPage === 'splash'
                ? 'bg-blue-600 border-blue-500 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'bg-slate-950/40 hover:bg-slate-800 text-slate-300 border-slate-850'
            }`}
          >
            {t[lang].splashBtn}
          </button>
          <a 
            href="https://edgetx.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="text-left text-sm bg-slate-950/40 hover:bg-slate-800 text-slate-300 py-2 px-4 rounded-lg border border-slate-850 transition-colors"
          >
            {t[lang].siteBtn}
          </a>
          <a 
            href="https://www.skyraccoon.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="text-left text-sm bg-slate-950/40 hover:bg-slate-800 text-slate-300 py-2 px-4 rounded-lg border border-slate-850 transition-colors"
          >
            SkyRaccoon
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
