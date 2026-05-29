import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { EdgeTXTheme, ThemeVariable, ThemeMetadata } from './types.ts';
import { INITIAL_THEME, VARIABLE_METADATA } from './constants.ts';
import Preview from './components/Preview.tsx';
import Header from './components/Header.tsx';
import GalleryPage from './components/GalleryPage.tsx';
import SplashPage from './components/SplashPage.tsx';

type ScreenID = 'screenshot1' | 'screenshot2' | 'screenshot3';

const STORAGE_KEY = 'edgetx_designer_session';

const TARGET_RESOLUTIONS = [
  {
    id: '480x272' as const,
    label: '480×272',
    radios: 'RadioMaster TX16S MK1/MK2, Eachine TX16S, Jumper T16/T18/T15, FrSky Horus X10/X10S, FlySky NV14/EL18/PL18/PL18EV/PL18U, HelloRadioSky V16, FatFish F16'
  },
  {
    id: '480x320' as const,
    label: '480×320',
    radios: 'Radiomaster TX15, FlySky ST16'
  },
  {
    id: '800x480' as const,
    label: '800×480',
    radios: 'RadioMaster TX16S MK3'
  }
];

const App: React.FC = () => {
  const translations = {
    it: {
      inspection: "ISPEZIONA COLORE E MODIFICA",
      inspectionHelp: "Tocca un elemento nel preview per ispezionare il colore",
      projectSetup: "Setup Progetto",
      themeName: "Nome Tema",
      author: "Autore",
      info: "Info",
      defaultThemeName: "",
      defaultAuthor: "",
      defaultInfo: "",
      import: "Importa .yml",
      export: "Esporta Tema",
      exportTx: "Esporta TX16S MK3",
      exporting: "Esportazione...",
      instructions: "Dopo l’esportazione del template in formato ZIP, crea una cartella con lo stesso nome del template dentro /THEMES della MicroSD della radio (puoi collegare la radio al PC) e inserisci al suo interno tutti i file contenuti nello ZIP. Per impostare il template in EdgeTX vai in SYS/Themes",
      support: "Supporto",
      supportText: "Il progetto è e rimarrà gratuito. Le donazioni sono facoltative e servono solo a supportare lo sviluppo. Progetto sviluppato da Giancarlo Monastero.",
      donationBtn: "Donazione PayPal",
      assetTitle: "Personalizzazione Assets",
      assetWarning: "Attenzione: l’immagine e l’etichetta del modello, nel preview del template, servono esclusivamente per generare i tre screenshot del template finale. Nel template viene esportata solo l’immagine di sfondo. Si consiglia di creare lo sfondo a 800×480 per garantire la compatibilità con TX16S MK3.",
      labelModel: "Etichetta Modello",
      imgModel: "Immagine Modello (PNG)",
      imgBg: "Sfondo Schermo (PNG)",
       upload: "CARICA",
       gallery: "GALLERY",
       remove: "RIMUOVI",
      statusInit: "Inizializzazione...",
      statusBg: "Processamento sfondo...",
      statusDone: "Esportazione Completata!",
      statusZip: "Compressione pacchetto...",
      statusSShot: "Generazione Screenshot",
      alertDone: "Creazione del pacchetto terminata!",
      alertError: "Si è verificato un errore durante la generazione del pacchetto.",
      alertYmlError: "Errore nel caricamento del file .yml.",
      clearCache: "Pulisci Cache Sito",
      clearCacheConfirm: "Sei sicuro di voler resettare il sito? Tutti i dati non salvati andranno persi.",
      footerSpec: "Ottimizzato per EdgeTX v2.8+ | Risoluzione Target: 480x272 & 800x480 | Supporto & Feedback:",
      varDescriptions: {
        primary1: 'Testo statico principale (nomi menu, etichette) e linee di divisione tra le righe.',
        primary2: 'Sfondo delle barre (Top bar con orologio/batteria, Header dei menu) e barre di scorrimento.',
        primary3: 'Sfondo dei tasti standard e icone dei menu (es. le icone nella pagina SYS).',
        secondary1: 'Testo dei valori dinamici (numeri della telemetria, percentuali dei canali, nomi canali).',
        secondary2: 'Etichette secondarie e descrizioni brevi sotto i titoli principali.',
        secondary3: 'Sfondo generale dello schermo (l\'area "vuota" dietro a tutto il resto).',
        focus: 'Cursore di selezione: il colore del rettangolo che indica dove ti trovi.',
        edit: 'Campo in modifica: il colore che appare quando premi la rotella per cambiare un valore.',
        active: 'Stato ON: colore di checkbox attive, switch logici "accesi" e indicatori di stato.',
        warning: 'Allarmi: testo di errore, avvisi di sicurezza (stick non a zero) e icone di pericolo.',
        disabled: 'Funzioni non disponibili: testo o icone di opzioni che non puoi cliccare.',
        qm_bg: 'Sfondo dei widget personalizzati o placeholder (es. tastiera/menu veloci).',
        qm_fg: 'Testo dei widget personalizzati o placeholder (es. tastiera/menu veloci).'
      }
    },
    en: {
      inspection: "COLOR INSPECTION AND EDIT",
      inspectionHelp: "Tap an element in the preview to inspect its color",
      projectSetup: "Project Setup",
      themeName: "Theme Name",
      author: "Author",
      info: "Info",
      defaultThemeName: "",
      defaultAuthor: "",
      defaultInfo: "",
      import: "Import .yml",
      export: "Export Theme",
      exportTx: "Export TX16S MK3",
      exporting: "Exporting...",
      instructions: "After exporting the template in ZIP format, create a folder with the same name as the template inside /THEMES on the radio's MicroSD (you can connect the radio to your PC) and put all the files from the ZIP inside. To set the template in EdgeTX, go to SYS/Themes.",
      support: "Support",
      supportText: "The project is and will remain free. Donations are optional and only serve to support development. Project developed by Giancarlo Monastero.",
      donationBtn: "PayPal Donation",
      assetTitle: "Asset Customization",
      assetWarning: "Warning: The image and model label in the template preview are used exclusively to generate the three final screenshots. Only the background image is exported in the template. We recommend creating the background at 800×480 to ensure compatibility with TX16S MK3.",
      labelModel: "Model Label",
      imgModel: "Model Image (PNG)",
      imgBg: "Screen Background (PNG)",
       upload: "UPLOAD",
       gallery: "GALLERY",
       remove: "REMOVE",
      statusInit: "Initializing...",
      statusBg: "Processing background...",
      statusDone: "Export Completed!",
      statusZip: "Compressing package...",
      statusSShot: "Generating Screenshot",
      alertDone: "Package creation finished!",
      alertError: "An error occurred during package generation.",
      alertYmlError: "Error loading the .yml file.",
      clearCache: "Clear Site Cache",
      clearCacheConfirm: "Are you sure you want to reset the site? All unsaved data will be lost.",
      footerSpec: "Optimized for EdgeTX v2.8+ | Target Resolution: 480x272 & 800x480 | Support & Feedback:",
      varDescriptions: {
        primary1: 'Main static text (main menu names, labels) and divider lines between rows.',
        primary2: 'Bar background (Top bar with clock/battery, Menu headers) and scroll bars.',
        primary3: 'Standard key background and menu icons (e.g. SYS page icons).',
        secondary1: 'Dynamic values text (telemetry numbers, channel percentages, channel names).',
        secondary2: 'Secondary labels and short descriptions under main titles.',
        secondary3: 'General screen background (the "empty" area behind everything else).',
        focus: 'Selection cursor: the color of the rectangle indicating your position.',
        edit: 'Field being edited: the color that appears when you press the scroll wheel to change a value.',
        active: 'ON state: active checkboxes, "on" logic switches and status indicators.',
        warning: 'Alarms: error text, safety warnings (stick not at zero) and danger icons.',
        disabled: 'Functions not available: text or icons of options that you cannot click.',
        qm_bg: 'Color for custom widget background or placeholder (e.g. keyboard/quickmenus).',
        qm_fg: 'Color for custom widget foreground or text (e.g. keyboard/quickmenus).'
      }
    }
  };

  const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          theme: { ...INITIAL_THEME, ...parsed.theme },
          meta: parsed.meta || { name: '', author: '', info: '' },
          droneImg: parsed.droneImg || "/assets/drone.png",
          backgroundImg: parsed.backgroundImg !== undefined ? parsed.backgroundImg : "/background.png",
          modelLabel: parsed.modelLabel || 'MODEL',
          lang: (parsed.lang === 'it' || parsed.lang === 'en' ? parsed.lang : 'en') as 'it' | 'en'
        };
      } catch (e) {
        console.error("Error loading session", e);
      }
    }
    return {
      theme: { ...INITIAL_THEME },
      meta: { name: '', author: '', info: '' },
      droneImg: "/assets/drone.png",
      backgroundImg: "/background.png",
      modelLabel: 'MODEL',
      lang: 'en' as 'it' | 'en'
    };
  };

  const initialState = getInitialState();

  const [lang, setLang] = useState<'it' | 'en'>(initialState.lang);
  const [theme, setTheme] = useState<EdgeTXTheme>(initialState.theme);
  const [activeScreen, setActiveScreen] = useState<ScreenID>('screenshot1');
  const [meta, setMeta] = useState<ThemeMetadata>(initialState.meta);
  const [droneImg, setDroneImg] = useState<string>(initialState.droneImg);
  const [backgroundImg, setBackgroundImg] = useState<string | null>(initialState.backgroundImg);
  const [modelLabel, setModelLabel] = useState<string>(initialState.modelLabel);

  const [highlightedVar, setHighlightedVar] = useState<ThemeVariable | null>(null);
  const [selectedVar, setSelectedVar] = useState<ThemeVariable | null>(null);
  const [hoveredVar, setHoveredVar] = useState<ThemeVariable | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedResolution, setSelectedResolution] = useState<'480x272' | '480x320' | '800x480'>('480x272');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  const [currentPage, setCurrentPage] = useState<'designer' | 'gallery' | 'splash'>('designer');

  const t = (key: Exclude<keyof typeof translations['it'], 'varDescriptions'>): string => translations[lang][key] as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiAssetInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  }, [theme]);

  useEffect(() => {
    const sessionData = { theme, meta, droneImg, backgroundImg, modelLabel, lang };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [theme, meta, droneImg, backgroundImg, modelLabel, lang]);

  useEffect(() => {
    if (meta.name === translations.it.defaultThemeName || meta.name === translations.en.defaultThemeName) {
        setMeta(prev => ({ ...prev, name: translations[lang].defaultThemeName }));
    }
    if (meta.author === translations.it.defaultAuthor || meta.author === translations.en.defaultAuthor) {
        setMeta(prev => ({ ...prev, author: translations[lang].defaultAuthor }));
    }
    if (meta.info === translations.it.defaultInfo || meta.info === translations.en.defaultInfo) {
        setMeta(prev => ({ ...prev, info: translations[lang].defaultInfo }));
    }
  }, [lang]);

  const updateColor = useCallback((variable: ThemeVariable, color: string) => {
    if (theme[variable] === color) return;
    setTheme(prev => ({ ...prev, [variable]: color }));
  }, [theme]);

  const handleMultiAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setDroneImg(result);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBackgroundImg(result);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleVariableClick = (variable: ThemeVariable) => {
    setHighlightedVar(variable);
    setSelectedVar(variable);
    setTimeout(() => setHighlightedVar(null), 2000);
  };

  const handleClearCache = () => {
    if (window.confirm(translations[lang].clearCacheConfirm as string)) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const to0x = (hex: string) => `0x${hex.replace('#', '').toUpperCase()}`;
  const from0x = (ox: string) => {
    let clean = ox.replace(/['"]/g, '').trim();
    if (clean.startsWith('#')) return clean;
    const hex = clean.replace(/^0[xX]/, '');
    return `#${hex.padStart(6, '0')}`;
  };

  const yamlCode = useMemo(() => {
    const whitelistColors: Record<string, string> = {
      PRIMARY1: theme.primary1,
      PRIMARY2: theme.primary2,
      PRIMARY3: theme.primary3,
      SECONDARY1: theme.secondary1,
      SECONDARY2: theme.secondary2,
      SECONDARY3: theme.secondary3,
      FOCUS: theme.focus,
      EDIT: theme.edit,
      ACTIVE: theme.active,
      WARNING: theme.warning,
      DISABLED: theme.disabled,
      QM_BG: theme.qm_bg || theme.primary1,
      QM_FG: theme.qm_fg || theme.primary2,
    };

    const formatColorVal = (hex: string) => to0x(hex);

    const colorsLines = Object.entries(whitelistColors)
      .map(([k, v]) => `  ${k}: ${formatColorVal(v)}`)
      .join('\n');

    return `summary:
  name: "${meta.name}"
  author: "${meta.author}"
  info: "${meta.info}"

colors:
${colorsLines}`;
  }, [theme, meta]);

  const handleExportZip = async () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStatus(translations[lang].statusInit as string);
    window.scrollTo(0, 0);
    
    // Dynamic loading of large libraries to optimize bundle size
    const [JSZipModule, html2canvasModule] = await Promise.all([
      import('jszip'),
      import('html2canvas')
    ]);
    const JSZip = JSZipModule.default;
    const html2canvas = html2canvasModule.default;

    const zip = new JSZip();
    zip.file("theme.yml", yamlCode);

    let targetW = 480;
    let targetH = 272;
    let fileName = 'background_480x272.png';

    if (selectedResolution === '800x480') {
      targetW = 800;
      targetH = 480;
      fileName = 'background.png';
    } else if (selectedResolution === '480x320') {
      targetW = 480;
      targetH = 320;
      fileName = 'background_480x320.png';
    }

    setExportStatus(translations[lang].statusBg as string);
    try {
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = targetW;
      bgCanvas.height = targetH;
      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        if (backgroundImg) {
          try {
            const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              if (!backgroundImg.startsWith('data:')) {
                img.crossOrigin = "anonymous";
              }
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = backgroundImg;
            });
            bgCtx.imageSmoothingEnabled = true;
            bgCtx.imageSmoothingQuality = 'high';
            bgCtx.drawImage(bgImg, 0, 0, targetW, targetH);
          } catch (e) {
            console.error("Error processing background image", e);
            bgCtx.fillStyle = theme.secondary3;
            bgCtx.fillRect(0, 0, targetW, targetH);
          }
        } else {
          // No active background image -> fill with dynamic secondary3 color!
          bgCtx.fillStyle = theme.secondary3;
          bgCtx.fillRect(0, 0, targetW, targetH);
        }
        const bgData = bgCanvas.toDataURL("image/png").split(',')[1];
        zip.file(fileName, bgData, {base64: true});
      }
    } catch (e) {
      console.error("Error processing background", e);
    }

    const originalScreen = activeScreen;
    const screens: ScreenID[] = ['screenshot1', 'screenshot2', 'screenshot3'];
    
    try {
      let progress = 10;
      for (const [index, screenId] of screens.entries()) {
        setActiveScreen(screenId);
        setExportStatus(`${translations[lang].statusSShot as string} ${index + 1}/3...`);
        setExportProgress(progress);
        await new Promise(r => setTimeout(r, 2000)); 
        
        const previewEl = document.querySelector('.preview-screen-capture');
        if (!previewEl) continue;

        const canvas = await html2canvas(previewEl as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          logging: false,
          scrollX: 0,
          scrollY: 0
        });

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 418;
        resizedCanvas.height = 237;
        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 418, 237);
        }
        
        const imgData = resizedCanvas.toDataURL("image/png").split(',')[1];
        zip.file(`${screenId}.png`, imgData, {base64: true});

        if (screenId === 'screenshot1') {
          const logoCanvas = document.createElement('canvas');
          logoCanvas.width = 225;
          logoCanvas.height = 128;
          const logoCtx = logoCanvas.getContext('2d');
          if (logoCtx) {
            logoCtx.imageSmoothingEnabled = true;
            logoCtx.imageSmoothingQuality = 'high';
            logoCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 225, 128);
            const logoData = logoCanvas.toDataURL("image/png").split(',')[1];
            zip.file("logo.png", logoData, {base64: true});
          }
        }
        progress += 25;
      }

      setExportStatus(translations[lang].statusZip as string);
      setExportProgress(90);
      setActiveScreen(originalScreen);

      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      const themeNameSlug = (meta.name || "theme").toLowerCase().replace(/\s+/g, '_');
      a.download = `${themeNameSlug}_${selectedResolution}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportProgress(100);
      setExportStatus(translations[lang].statusDone as string);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 3000);

      alert(translations[lang].alertDone as string);
    } catch (error) {
      console.error("Error during export", error);
      alert(translations[lang].alertError as string);
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const newTheme = { ...theme };
        const newMeta = { ...meta };
        content.split('\n').forEach(line => {
          const parts = line.split(':');
          if (parts.length < 2) return;
          const rawKey = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          
          const rawKeyLower = rawKey.toLowerCase();
          
          if (rawKeyLower === 'name') {
            newMeta.name = val.replace(/['"]/g, '').trim();
            return;
          }
          if (rawKeyLower === 'author') {
            newMeta.author = val.replace(/['"]/g, '').trim();
            return;
          }
          if (rawKeyLower === 'info') {
            newMeta.info = val.replace(/['"]/g, '').trim();
            return;
          }

          // Strip quotes from value
          const cleanVal = val.replace(/['"]/g, '').trim();
          
          // Check if cleanVal is a color (looks like hex color #FFF, #FFFFFF, 0xFFF, 0xFFFFFF or similar)
          const isColor = /^#([0-9a-fA-F]{3,8})$/.test(cleanVal) || 
                          /^0[xX]([0-9a-fA-F]{3,8})$/.test(cleanVal) || 
                          /^([0-9a-fA-F]{6})$/.test(cleanVal);
          
          if (isColor) {
            const normalizedKey = rawKeyLower.replace(/^color_theme_/, '');
            // Check if it's one of core 11 keys
            const match = (Object.keys(newTheme) as ThemeVariable[]).find(k => String(k).toLowerCase() === normalizedKey);
            if (match) {
              newTheme[match] = from0x(cleanVal);
            } else {
              // Store as additional key on theme!
              newTheme[rawKeyLower] = from0x(cleanVal);
            }
          }
        });
        setMeta(newMeta);
        setTheme(newTheme);
        e.target.value = '';
      } catch (err) {
        alert(translations[lang].alertYmlError as string);
      }
    };
    reader.readAsText(file);
  };

  const selectedVarInfo = useMemo(() => {
    if (!selectedVar) return null;
    return VARIABLE_METADATA.find(v => v.key === selectedVar);
  }, [selectedVar]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      <Header
        lang={lang}
        setLang={setLang}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {isExporting && (
        <div className="fixed top-0 left-0 w-full z-[100] animate-in slide-in-from-top duration-300">
           <div className="bg-slate-900 border-b border-blue-500/30 p-4 shadow-2xl backdrop-blur-md">
              <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-400">{exportStatus}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{exportProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${exportProgress}%` }}
                   />
                </div>
              </div>
           </div>
        </div>
      )}

      {currentPage === 'gallery' ? (
        <GalleryPage
          lang={lang}
          onApplyBackground={(dataUrl) => {
            setBackgroundImg(dataUrl);
            setCurrentPage('designer');
          }}
        />
      ) : currentPage === 'splash' ? (
        <SplashPage
          lang={lang}
        />
      ) : (
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col xl:grid xl:grid-cols-12 gap-8 items-start">
        {/* Sidebar Wrapper (Contents on mobile, flex-col sticky on PC) */}
        <div className="contents xl:flex xl:flex-col xl:col-span-4 xl:sticky xl:top-8 xl:gap-6">
          
          {/* 1. ISPEZIONA COLORE E MODIFICA */}
          <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 shrink-0 order-1 w-full">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white">
                  <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">{t('inspection')}</h2>
                </div>
             </div>
             
             {selectedVarInfo ? (
               <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="relative group/inspector shrink-0">
                      <input 
                        type="color" 
                        value={theme[selectedVarInfo.key]} 
                        onChange={(e) => updateColor(selectedVarInfo.key, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="w-16 h-16 rounded-xl border-4 border-slate-800 shadow-xl"
                        style={{ backgroundColor: theme[selectedVarInfo.key] }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1 border-2 border-slate-900 z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1">{selectedVarInfo.key}</div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={theme[selectedVarInfo.key].toUpperCase()} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                               updateColor(selectedVarInfo.key, val);
                            }
                          }}
                          className="bg-slate-950/50 border border-slate-800 rounded px-2 py-0.5 text-2xl font-black text-white font-mono tracking-tighter w-full focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{translations[lang].varDescriptions[selectedVarInfo.key as keyof typeof translations['it']['varDescriptions']]}"
                    </p>
                  </div>
               </div>
             ) : (
               <div className="py-8 flex flex-col items-center justify-center text-center opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest">{t('inspectionHelp')}</p>
               </div>
             )}
          </div>

          {/* 4. Setup Progetto (In coda nel layout mobile) */}
          <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 shrink-0 order-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                {t('projectSetup')}
              </h2>
              <button 
                onClick={handleClearCache}
                className="text-[9px] font-black uppercase tracking-widest text-yellow-500 hover:text-red-400 transition-colors underline underline-offset-4"
              >
                {t('clearCache')}
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('themeName')}</label>
                  <input type="text" value={meta.name} onChange={(e) => setMeta({...meta, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-blue-100 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('author')}</label>
                  <input type="text" value={meta.author} onChange={(e) => setMeta({...meta, author: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-blue-100 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('info')}</label>
                  <input type="text" value={meta.info} onChange={(e) => setMeta({...meta, info: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-blue-100 outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full opacity-50"></div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {lang === 'it' ? 'Risoluzione Target & Radio Compatibili' : 'Target Resolution & Compatible Radios'}
                </label>
                <div className="space-y-2">
                  {TARGET_RESOLUTIONS.map((res) => {
                    const isSelected = selectedResolution === res.id;
                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setSelectedResolution(res.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-900/20 shadow-md ring-1 ring-blue-500/20'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 w-full">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-blue-500 text-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          </span>
                          <span className="text-xs font-bold text-slate-100">
                            {res.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal pl-6 font-medium">
                          {res.radios}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full opacity-50 my-2"></div>

              <div className="flex flex-col gap-3">
                <input type="file" accept=".yml" ref={fileInputRef} onChange={handleImport} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-700">
                  {t('import')}
                </button>
                <button 
                  onClick={() => handleExportZip()} 
                  disabled={isExporting}
                  className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isExporting ? t('exporting') : t('export')}
                </button>
              </div>

              <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-xl">
                 <p className="text-[11px] text-blue-300 leading-relaxed italic">
                   {t('instructions')}
                 </p>
              </div>
            </div>
          </div>

          {/* 5. Supporto */}
          <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 shrink-0 order-5 w-full">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                {t('support')}
              </h2>
              <a href="mailto:giancarlomonastero@gmail.com" className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-mono">
                giancarlomonastero@gmail.com
              </a>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {t('supportText')}
              </p>
              <a 
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=giancarlomonastero@gmail.com&currency_code=EUR&source=url"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.067 8.478c.492.88.556 2.014.307 3.292-.51 2.615-2.28 4.095-4.88 4.095h-1.428l-.517 2.658-.024.126-.516 2.652a.63.63 0 01-.617.51h-2.58a.515.515 0 01-.508-.614l.006-.034.494-2.54.02-.102.006-.034.507-2.607.019-.098.508-2.61a.631.631 0 01.617-.51h1.565c2.454 0 4.14-1.206 4.654-3.84a3.911 3.911 0 00.11-.83c.036-.45.025-.847-.074-1.183l-.001-.004c.002-.007.004-.015.007-.022.007-.024.015-.048.024-.072l.001-.002a3.3 3.3 0 01.183-.393c.063-.12.133-.23.21-.334l.007-.009.006-.007c.101-.133.217-.253.348-.362.106-.088.222-.164.35-.228.148-.073.308-.124.477-.148.114-.016.23-.021.348-.014.12.007.237.026.348.057.108.03.21.072.304.124.1.055.19.122.27.2.083.08.154.17.214.267.062.1.11.208.146.32l.001.004zM6.51 17.53l.944-4.852.02-.102.946-4.86.02-.101.944-4.853a.63.63 0 01.618-.51h5.568c1.383 0 2.5.344 3.336 1.028.835.684 1.253 1.636 1.253 2.857 0 1.24-.26 2.373-.78 3.4-.52 1.026-1.28 1.833-2.28 2.42-.999.587-2.228.88-3.687.88h-1.427l-.518 2.658-.024.126-.516 2.652a.63.63 0 01-.617.51H6.51a.515.515 0 01-.508-.614l.006-.034z"/>
                </svg>
                {t('donationBtn')}
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper (Contents on mobile, flex-col on PC) */}
        <div className="contents xl:flex xl:flex-col xl:col-span-8 xl:gap-8">
          
          {/* 2. Preview */}
          <div className="order-2 w-full">
            <Preview 
              theme={theme} 
              onVariableClick={handleVariableClick} 
              hoveredVar={hoveredVar} 
              droneImage={droneImg} 
              backgroundImage={backgroundImg}
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              modelLabel={modelLabel}
            />
          </div>

          {/* 3. Personalizzazione Assets */}
          <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 order-3 w-full">
             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">{t('assetTitle')}</h2>
                </div>
                <div className="hidden md:block w-[1px] h-6 bg-slate-800"></div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {t('assetWarning')}
                </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('labelModel')}</label>
                  <input type="text" value={modelLabel} onChange={(e) => setModelLabel(e.target.value.toUpperCase())} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-blue-100 font-mono outline-none focus:border-blue-500 transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    {t('imgModel')} <span className="text-[10px] text-slate-500 font-normal normal-case tracking-normal leading-tight ml-1">MAX 300x280px</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="file" accept="image/png" ref={multiAssetInputRef} onChange={handleMultiAssetUpload} className="hidden" />
                    <button onClick={() => multiAssetInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-[9px] font-black border border-slate-700 flex items-center justify-center gap-2 transition-all">{t('upload')}</button>
                    <button onClick={() => setDroneImg("/assets/drone.png")} className="bg-slate-800 hover:bg-red-900/20 text-white py-2 rounded-lg text-[9px] font-black border border-slate-700 flex items-center justify-center gap-2 transition-all">{t('remove')}</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    {t('imgBg')} <span className="text-[10px] text-slate-500 font-normal normal-case tracking-normal leading-tight ml-1">MAX 800x480px</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="file" accept="image/png" ref={backgroundInputRef} onChange={handleBackgroundUpload} className="hidden" />
                    <button onClick={() => backgroundInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-[9px] font-black border border-slate-700 flex items-center justify-center gap-2 transition-all">{t('upload')}</button>
                    <button onClick={() => setCurrentPage('gallery')} className="bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg text-[9px] font-black border border-blue-600 flex items-center justify-center gap-2 transition-all">{t('gallery')}</button>
                    <button onClick={() => setBackgroundImg(null)} className="bg-slate-800 hover:bg-red-900/20 text-white py-2 rounded-lg text-[9px] font-black border border-slate-700 flex items-center justify-center gap-2 transition-all">{t('remove')}</button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
      )}

      <footer className="bg-slate-900 border-t border-slate-800 h-[80px] flex items-center justify-center px-4 text-center shrink-0">
        <div className="container mx-auto">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide leading-none">
            {t('footerSpec')} <a href="mailto:giancarlomonastero@gmail.com" className="text-blue-500 hover:text-blue-400 transition-colors font-mono">giancarlomonastero@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;