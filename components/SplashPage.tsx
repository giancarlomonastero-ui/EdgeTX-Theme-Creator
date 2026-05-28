import React, { useEffect, useState } from 'react';
import { GALLERY_CONFIG } from '../gallery.config.ts';
import { SplashEditor } from './SplashEditor.tsx';

type Lang = 'it' | 'en';

interface GalleryItem {
  id: string;
  name: string;
  previewUrl: string;
  imageUrl: string;
  fallbackImageUrl: string;
  downloadUrl: string;
}

interface SplashPageProps {
  lang: Lang;
}

const SPLASH_TRANSLATIONS = {
  it: {
    failedLoad: 'Impossibile caricare la galleria da Google Drive.',
    splashTitle: 'Splash Screen',
    splashSubtitle: 'Zona dedicata alle immagini di avvio (boot) della vostra radio. Scegli l\'immagine più adatta al tuo dispositivo e scarica la versione corretta in base alla risoluzione. Copia il file nella memoria della radio all\'interno della cartella IMAGES e assicurati che il nome del file sia splash.png',
    splashConfigureHint: 'Configura apiKey e splash_screen in gallery.config.ts per caricare lo splash screen.',
    splashLoading: 'Caricamento immagini di avvio...',
    splashEmpty: 'Nessuna immagine trovata nella cartella Splash Screen.',
    splashResOriginal: '800x480 (Orig.)',
    splashResResized: '480x272 (Resize)'
  },
  en: {
    failedLoad: 'Could not load gallery from Google Drive.',
    splashTitle: 'Splash Screen',
    splashSubtitle: 'Dedicated area for boot (startup) images for your radio. Select the image that fits your device and download the correct resolution version. Copy the file into your radio memory inside the IMAGES folder and make sure the filename is splash.png',
    splashConfigureHint: 'Set apiKey and splash_screen in gallery.config.ts to load splash screen.',
    splashLoading: 'Loading boot images...',
    splashEmpty: 'No images found in the Splash Screen folder.',
    splashResOriginal: '800x480 (Original)',
    splashResResized: '480x272 (Resize)'
  }
};

const SplashPage: React.FC<SplashPageProps> = ({ lang }) => {
  const [splashItems, setSplashItems] = useState<GalleryItem[]>([]);
  const [splashLoading, setSplashLoading] = useState(true);
  const [splashError, setSplashError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Splash Screen Editor States
  const [selectedSplashItem, setSelectedSplashItem] = useState<GalleryItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const activeLang = lang === 'it' || lang === 'en' ? lang : 'en';
  const t = SPLASH_TRANSLATIONS[activeLang];

  const handleOpenEditor = (item: GalleryItem) => {
    setSelectedSplashItem(item);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedSplashItem(null);
    setIsEditorOpen(false);
  };

  useEffect(() => {
    let active = true;

    // Safety timeout to guarantee loading state is turned off after 5 seconds
    const safetyTimeout = setTimeout(() => {
      if (active) {
        console.warn('[SplashPage] Safety timeout reached. Forcing splashLoading to false.');
        setSplashLoading(false);
      }
    }, 5000);

    const loadSplashGallery = async () => {
      if (!GALLERY_CONFIG.apiKey || !GALLERY_CONFIG.splash_screen) {
        if (active) {
          setSplashLoading(false);
          clearTimeout(safetyTimeout);
        }
        return;
      }

      try {
        if (active) {
          setSplashLoading(true);
          setSplashError(null);
        }

        const fields = encodeURIComponent('files(id,name,mimeType)');
        const fullQuery = encodeURIComponent(`'${GALLERY_CONFIG.splash_screen}' in parents and trashed=false and mimeType contains 'image/'`);
        const fullUrl = `https://www.googleapis.com/drive/v3/files?q=${fullQuery}&fields=${fields}&orderBy=name&pageSize=200&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;

        console.log('[SplashPage] Fetching splash screen images from Google Drive...');
        const res = await fetch(fullUrl, {
          mode: 'cors',
          referrerPolicy: 'no-referrer',
          credentials: 'omit'
        });
        if (!res.ok) {
          throw new Error(`Drive API returned status ${res.status}`);
        }

        const fullData = await res.json();
        const mapped: GalleryItem[] = (fullData.files || []).map((file: { id: string; name: string }) => ({
          id: file.id,
          name: file.name,
          previewUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          imageUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`,
          fallbackImageUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          downloadUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`
        }));

        if (active) {
          setSplashItems(mapped);
        }
      } catch (e) {
        console.error('[SplashPage] Error loading splash gallery from Google Drive:', e);
        if (active) {
          setSplashError(t.failedLoad);
        }
      } finally {
        if (active) {
          setSplashLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    loadSplashGallery();

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
    };
  }, [activeLang]);

  const handleDownloadSplash = async (item: GalleryItem, resolution: '800x480' | '480x272' | '480x320') => {
    const actionId = `${item.id}-${resolution}`;
    try {
      setDownloadingId(actionId);
      const res = await fetch(item.downloadUrl, { 
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        credentials: 'omit'
      });
      if (!res.ok) {
        throw new Error(`Image fetch error. Status: ${res.status}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      if (resolution === '480x272' || resolution === '480x320') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = objectUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load for resizing'));
        });

        const canvas = document.createElement('canvas');
        const targetW = 480;
        const targetH = resolution === '480x320' ? 320 : 272;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.drawImage(img, 0, 0, targetW, targetH);

        canvas.toBlob((resizedBlob) => {
          if (resizedBlob) {
            const resizedUrl = URL.createObjectURL(resizedBlob);
            const link = document.createElement('a');
            link.href = resizedUrl;
            link.download = 'splash.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(resizedUrl);
          }
          URL.revokeObjectURL(objectUrl);
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'splash.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      console.error('Splash download/resize failed:', err);
      setSplashError(activeLang === 'it' ? 'Impossibile scaricare o ridimensionare lo splash screen.' : 'Could not download or resize the splash screen.');
    } finally {
      setDownloadingId(null);
    }
  };

  const isSplashConfigured = Boolean(GALLERY_CONFIG.apiKey && GALLERY_CONFIG.splash_screen);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col gap-8">
      {/* SEZIONE 2 — SPLASH SCREEN */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-6 bg-amber-500 rounded-full animate-pulse"></span>
            {t.splashTitle}
          </h2>
          <p className="text-white text-xs bg-blue-950/40 border border-blue-800/30 rounded-lg p-4 mt-4 font-normal leading-relaxed">
            {t.splashSubtitle}
          </p>
        </div>

        {!isSplashConfigured && (
          <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
            {t.splashConfigureHint}
          </div>
        )}

        {splashLoading && (
          <div className="text-slate-400 text-sm animate-pulse">{t.splashLoading}</div>
        )}

        {splashError && (
          <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg text-red-300 text-sm mb-4">
            {splashError}
          </div>
        )}

        {!splashLoading && !splashError && isSplashConfigured && splashItems.length === 0 && (
          <div className="text-slate-400 text-sm">{t.splashEmpty}</div>
        )}

        {!splashLoading && !splashError && isSplashConfigured && splashItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {splashItems.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between">
                <div className="aspect-[5/3] bg-slate-950 w-full relative overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== item.fallbackImageUrl) {
                        img.src = item.fallbackImageUrl;
                      }
                    }}
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <button
                    onClick={() => handleOpenEditor(item)}
                    className="w-full bg-slate-800 hover:bg-slate-700 hover:text-amber-500 border border-slate-700/50 text-slate-200 text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg transition-all cursor-pointer text-center mb-3 flex items-center justify-center gap-1"
                  >
                    ✏️ {activeLang === 'it' ? 'PERSONALIZZA / EDITA' : 'CUSTOMIZE / EDIT'}
                  </button>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownloadSplash(item, '480x272')}
                      disabled={downloadingId !== null}
                      className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md cursor-pointer text-center"
                    >
                      {downloadingId === `${item.id}-480x272` ? '...' : '480x272'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSplash(item, '480x320')}
                      disabled={downloadingId !== null}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md cursor-pointer text-center"
                    >
                      {downloadingId === `${item.id}-480x320` ? '...' : '480x320'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSplash(item, '800x480')}
                      disabled={downloadingId !== null}
                      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-md cursor-pointer text-center"
                    >
                      {downloadingId === `${item.id}-800x480` ? '...' : '800x480'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SplashEditor 
        isOpen={isEditorOpen} 
        item={selectedSplashItem} 
        lang={activeLang} 
        onClose={handleCloseEditor} 
        onExport={handleDownloadSplash}
      />
    </main>
  );
};

export default SplashPage;
