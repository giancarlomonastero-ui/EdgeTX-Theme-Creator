import React, { useEffect, useRef, useState } from 'react';

interface GalleryItem {
  id: string;
  name: string;
  previewUrl: string;
  imageUrl: string;
  fallbackImageUrl: string;
  downloadUrl: string;
}

interface SplashEditorProps {
  isOpen: boolean;
  item: GalleryItem | null;
  lang: 'it' | 'en';
  onClose: () => void;
  onExport: (item: GalleryItem, resolution: '800x480' | '480x272' | '480x320') => void;
}

const FONTS_LIST = [
  'Arial',
  'Times New Roman',
  'Anton'
];

export const SplashEditor: React.FC<SplashEditorProps> = ({ isOpen, item, lang, onClose, onExport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalOverlayRef = useRef<HTMLDivElement | null>(null);

  // Force scroll top when opening the editor
  useEffect(() => {
    if (isOpen) {
      if (modalOverlayRef.current) {
        modalOverlayRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }
  }, [isOpen]);
  
  // Editor States
  const [overlayText, setOverlayText] = useState('Booting EdgeTX...');
  const [textFont, setTextFont] = useState('Arial');
  const [textSize, setTextSize] = useState(48);
  const [textX, setTextX] = useState(400); // Decentered or centered horizontal
  const [textY, setTextY] = useState(240); // Vertical center (480 / 2)
  const [isItalic, setIsItalic] = useState(false);
  
  // Independent Color System
  const [textColor, setTextColor] = useState('#ffffff');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [outlineColor, setOutlineColor] = useState('#0e0f11');
  
  // Effects Toggles
  const [enableShadow, setEnableShadow] = useState(true);
  const [shadowBlur, setShadowBlur] = useState(8);
  const [enableOutline, setEnableOutline] = useState(true);
  const [outlineWidth, setOutlineWidth] = useState(6);

  // Loading States
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const t = {
    it: {
      editTitle: 'Editor Splash Screen',
      instructions: 'Questo editor ti permette di personalizzare la schermata di avvio della tua radio (Splash Screen). Puoi aggiungere solo un testo personalizzato, come il tuo nome o un identificativo, per rendere la tua radio facilmente riconoscibile. Non è possibile inserire loghi o firme grafiche: è consentito esclusivamente testo. Questo può essere utile in caso di smarrimento della radio o per identificarne rapidamente il proprietario. Lo scopo è aggiungere un elemento semplice di identificazione personale al tuo dispositivo.',
      textSettings: 'Impostazioni Testo',
      textPlaceholder: 'Inserisci il testo...',
      fontSize: 'Dimensione Testo',
      fontFamily: 'Tipo di Font',
      positionX: 'Posizione Orizzontale (X)',
      positionY: 'Posizione Verticale (Y)',
      colorsSection: 'Sistema Colori',
      textColorLabel: 'Colore Testo (Fill)',
      shadowColorLabel: 'Colore Ombra (Shadow)',
      outlineColorLabel: 'Colore Contorno (Outline)',
      effectsSection: 'Effetti Specifica',
      shadowToggle: 'Abilita Ombra',
      shadowBlurLabel: 'Sfocatura Ombra',
      outlineToggle: 'Abilita Contorno',
      outlineWidthLabel: 'Spessore Contorno',
      cancelBtn: 'CANCEL',
      loadingImg: 'Caricamento dell\'immagine...',
      errorImg: 'Impossibile caricare l\'immagine di origine.',
      export800: 'Export 800x480',
      export272: 'Export 480x272',
      italicLabel: 'Corsivo (Italic)'
    },
    en: {
      editTitle: 'Splash Screen Editor',
      instructions: 'This editor allows you to customize the startup screen of your radio (Splash Screen). You can only add custom text, such as your name or an identifier, to make your radio easily recognizable. Logos or graphic signatures are not supported: only text input is allowed. This can be useful in case the radio is lost or to quickly identify its owner. The goal is to add a simple personal identification element to your device.',
      textSettings: 'Text Settings',
      textPlaceholder: 'Enter text here...',
      fontSize: 'Text Size',
      fontFamily: 'Font Family',
      positionX: 'Horizontal Position (X)',
      positionY: 'Vertical Position (Y)',
      colorsSection: 'Color System',
      textColorLabel: 'Text Color (Fill)',
      shadowColorLabel: 'Shadow Color',
      outlineColorLabel: 'Outline Color',
      effectsSection: 'Specific Effects',
      shadowToggle: 'Enable Shadow',
      shadowBlurLabel: 'Shadow Blur Size',
      outlineToggle: 'Enable Outline',
      outlineWidthLabel: 'Outline Thickness',
      cancelBtn: 'CANCEL',
      loadingImg: 'Loading source image...',
      errorImg: 'Could not load background image.',
      export800: 'Export 800x480',
      export272: 'Export 480x272',
      italicLabel: 'Italic'
    }
  };

  const localized = t[lang];

  // Load Image when item is set
  useEffect(() => {
    if (!isOpen || !item) {
      setImageLoaded(false);
      setLoadingError(null);
      return;
    }

    let isAborted = false;
    const loadImg = async () => {
      try {
        setLoadingError(null);
        setImageLoaded(false);

        const res = await fetch(item.downloadUrl, {
          mode: 'cors',
          referrerPolicy: 'no-referrer',
          credentials: 'omit'
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        if (isAborted) return;

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (isAborted) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => {
          if (isAborted) return;
          imgRef.current = img;
          setImageLoaded(true);
          setLoadingError(null);
        };
        img.onerror = () => {
          if (isAborted) return;
          setImageLoaded(false);
          setLoadingError(localized.errorImg);
        };
        img.src = dataUrl;
      } catch (err) {
        console.error("Error loading image in SplashEditor:", err);
        if (isAborted) return;
        
        // Fallback to direct load with img.crossOrigin
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => {
          if (isAborted) return;
          imgRef.current = img;
          setImageLoaded(true);
          setLoadingError(null);
        };
        img.onerror = () => {
          if (isAborted) return;
          setImageLoaded(false);
          setLoadingError(localized.errorImg);
        };
        img.src = item.downloadUrl;
      }
    };

    loadImg();

    return () => {
      isAborted = true;
    };
  }, [item, isOpen, localized.errorImg]);

  // Redraw Canvas on change of state
  useEffect(() => {
    if (!isOpen || !imageLoaded) return;
    
    const redraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Clear previous drawings
      ctx.clearRect(0, 0, 800, 480);

      // 2. Draw Background image (designed exactly as 800x480)
      if (imgRef.current) {
        ctx.drawImage(imgRef.current, 0, 0, 800, 480);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 800, 480);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 3. Draw Overlay Text
      if (overlayText.trim()) {
        ctx.save();
        
        ctx.font = `${isItalic ? 'italic ' : ''}bold ${textSize}px "${textFont}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Apply custom letter spacing for Anton font to improve readability
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = textFont === 'Anton' ? '0.03em' : '0px';
        }

        // Apply Shadow to text safely
        if (enableShadow) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Apply Outline (stroke)
        if (enableOutline) {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = outlineWidth;
          ctx.lineJoin = 'round';
          ctx.strokeText(overlayText, textX, textY);
        }

        // Apply Fill text
        ctx.fillStyle = textColor;
        ctx.fillText(overlayText, textX, textY);

        ctx.restore();
      }
    };

    redraw();
  }, [
    isOpen,
    imageLoaded,
    overlayText,
    textFont,
    textSize,
    textX,
    textY,
    textColor,
    shadowColor,
    outlineColor,
    enableShadow,
    shadowBlur,
    enableOutline,
    outlineWidth,
    isItalic
  ]);

  const handleExport = (resolution: '800x480' | '480x272' | '480x320') => {
    const canvas = canvasRef.current;
    if (item && onExport && canvas) {
      try {
        const canvasDataUrl = canvas.toDataURL('image/png');
        const customItem: GalleryItem = {
          ...item,
          downloadUrl: canvasDataUrl,
          imageUrl: canvasDataUrl
        };
        onExport(customItem, resolution);
      } catch (err) {
        console.error("Failed to generate data URL from canvas:", err);
        onExport(item, resolution);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalOverlayRef}
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-7xl w-full flex flex-col md:flex-row overflow-hidden md:h-[85vh] md:max-h-[700px]"
        style={{ minHeight: '520px' }}
      >
        {/* AREA PREVIEW (SINISTRA) */}
        <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 md:h-full md:overflow-hidden">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-amber-500 mb-2 block">{localized.editTitle}</span>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="inline-block w-2.5 h-4 bg-amber-500 rounded-sm"></span>
              PREVIEW (800x480)
            </h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed font-normal whitespace-pre-line">
              {localized.instructions}
            </p>
          </div>

          <div className="my-4 relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 aspect-[5/3] w-full max-w-[800px] max-h-[340px] lg:max-h-[420px] mx-auto shadow-inner flex items-center justify-center shrink-0">
            {!imageLoaded && !loadingError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-slate-400 text-sm">
                <span className="animate-spin mr-2 border-2 border-amber-500 border-t-transparent rounded-full w-4 h-4"></span>
                {localized.loadingImg}
              </div>
            )}
            {loadingError && (
              <div className="absolute inset-0 p-4 flex items-center justify-center text-center text-sm text-red-400">
                {loadingError}
              </div>
            )}
            
            <canvas
              ref={canvasRef}
              width={800}
              height={480}
              className="max-w-full max-h-full object-contain"
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          </div>

          <p className="text-slate-500 font-mono text-[10px] text-center uppercase tracking-wide">
            {lang === 'it' 
              ? 'L\'immagine finale verrà esportata e scaricata come splash.png nella risoluzione scelta.' 
              : 'The final image will be exported and downloaded as splash.png in the chosen resolution.'}
          </p>
        </div>

        {/* AREA EDITOR (DESTRA) */}
        <div className="w-full md:w-[380px] bg-slate-900 flex flex-col justify-between md:h-full shrink-0 overflow-hidden">
          {/* SEZIONE INPUTS SCROLLABILE */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 custom-scrollbar">
            {/* Input Testo */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {localized.textSettings}
              </label>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder={localized.textPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Font Selection & Size */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {localized.fontFamily}
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {FONTS_LIST.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {localized.fontSize} ({textSize}px)
                </label>
                <input
                  type="range"
                  min="16"
                  max="100"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-950 rounded-lg cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Toggles Row (Italic, Shadow, Outline in a single compact 3-column row) */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <label className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 rounded-lg p-1.5 cursor-pointer justify-center select-none">
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={(e) => setIsItalic(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer shrink-0"
                />
                <span className="text-[10px] font-black text-slate-200 truncate">{localized.italicLabel}</span>
              </label>

              <label className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 rounded-lg p-1.5 cursor-pointer justify-center select-none">
                <input
                  type="checkbox"
                  checked={enableShadow}
                  onChange={(e) => setEnableShadow(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer shrink-0"
                />
                <span className="text-[10px] font-black text-slate-200 truncate">Shadow</span>
              </label>

              <label className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 rounded-lg p-1.5 cursor-pointer justify-center select-none">
                <input
                  type="checkbox"
                  checked={enableOutline}
                  onChange={(e) => setEnableOutline(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer shrink-0"
                />
                <span className="text-[10px] font-black text-slate-200 truncate">Outline</span>
              </label>
            </div>

            {/* Conditional Blur & Width Control Row */}
            {(enableShadow || enableOutline) && (
              <div className="grid grid-cols-2 gap-2 bg-slate-950/40 border border-slate-800/60 rounded-lg p-2">
                {enableShadow ? (
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">
                      Blur ({shadowBlur}px)
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={shadowBlur}
                      onChange={(e) => setShadowBlur(Number(e.target.value))}
                      className="w-full h-1 accent-amber-500 bg-slate-900 rounded cursor-pointer"
                    />
                  </div>
                ) : <div />}
                {enableOutline ? (
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">
                      Width ({outlineWidth}px)
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={outlineWidth}
                      onChange={(e) => setOutlineWidth(Number(e.target.value))}
                      className="w-full h-1 accent-amber-500 bg-slate-900 rounded cursor-pointer"
                    />
                  </div>
                ) : <div />}
              </div>
            )}

            {/* Posizionamento Testo X e Y Slider */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  X ({textX}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  value={textX}
                  onChange={(e) => setTextX(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-950 rounded-lg cursor-pointer mt-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Y ({textY}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="480"
                  value={textY}
                  onChange={(e) => setTextY(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-950 rounded-lg cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Sistema Colori (3 color pickers indipendenti) */}
            <div className="border-t border-slate-800 pt-3">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                {localized.colorsSection}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center bg-slate-950 border border-slate-800/60 rounded-lg p-1">
                  <span className="text-[9px] text-slate-400 text-center uppercase font-bold truncate w-full mb-0.5">
                    Fill
                  </span>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
                <div className="flex flex-col items-center bg-slate-950 border border-slate-800/60 rounded-lg p-1">
                  <span className="text-[9px] text-slate-400 text-center uppercase font-bold truncate w-full mb-0.5">
                    Shadow
                  </span>
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
                <div className="flex flex-col items-center bg-slate-950 border border-slate-800/60 rounded-lg p-1">
                  <span className="text-[9px] text-slate-400 text-center uppercase font-bold truncate w-full mb-0.5">
                    Outline
                  </span>
                  <input
                    type="color"
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FIANCO FISSO BOTTOM CON AZIONI DI ESPORTAZIONE */}
          <div className="border-t border-slate-800 p-4 bg-slate-950/80 flex flex-col gap-2.5 shrink-0">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleExport('480x272')}
                disabled={!imageLoaded}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md cursor-pointer text-center"
              >
                480x272
              </button>
              <button
                type="button"
                onClick={() => handleExport('480x320')}
                disabled={!imageLoaded}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md cursor-pointer text-center"
              >
                480x320
              </button>
              <button
                type="button"
                onClick={() => handleExport('800x480')}
                disabled={!imageLoaded}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md hover:shadow-amber-500/10 cursor-pointer text-center"
              >
                800x480
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-colors cursor-pointer text-center"
            >
              {localized.cancelBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
