import React, { useEffect, useMemo, useState } from 'react';
import { GALLERY_CONFIG } from '../gallery.config.ts';

type Lang = 'it' | 'en';

interface GalleryItem {
  id: string;
  name: string;
  previewUrl: string;
  imageUrl: string;
  fallbackImageUrl: string;
  downloadUrl: string;
}

interface GalleryPageProps {
  lang: Lang;
  onApplyBackground: (dataUrl: string) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ lang, onApplyBackground }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const [splashItems, setSplashItems] = useState<GalleryItem[]>([]);
  const [splashLoading, setSplashLoading] = useState(true);
  const [splashError, setSplashError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = useMemo(() => ({
    it: {
      title: 'Gallery Sfondi HD',
      subtitle: 'Archivio sfondi 800x480.',
      ownerHint: 'Clicca sull\'immagine che preferisci per inserirla automaticamente come sfondo del template. (Immagini di mia creazione, gratuite per uso personale/non commerciale. Vietata vendita o uso commerciale senza autorizzazione).',
      configureHint: 'Configura apiKey e folderId in gallery.config.ts per caricare le immagini.',
      loading: 'Caricamento galleria...',
      empty: 'Nessuna immagine trovata nella cartella Gallery.',
      apply: 'Usa come sfondo',
      applying: 'Applicazione...',
      download: 'Scarica',
      applied: 'Sfondo applicato al template.',
      failedApply: 'Impossibile applicare lo sfondo selezionato.',
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
      title: 'HD Background Gallery',
      subtitle: '800x480 background archive.',
      ownerHint: 'Click the image you prefer to automatically apply it as your template background. (My original images, free for personal/non-commercial use. No selling or commercial use without permission).',
      configureHint: 'Set apiKey and folderId in gallery.config.ts to load images.',
      loading: 'Loading gallery...',
      empty: 'No images found in the Gallery folder.',
      apply: 'Use as background',
      applying: 'Applying...',
      download: 'Download',
      applied: 'Background applied to the template.',
      failedApply: 'Could not apply selected background.',
      failedLoad: 'Could not load gallery from Google Drive.',
      splashTitle: 'Splash Screen',
      splashSubtitle: 'Dedicated area for boot (startup) images for your radio. Select the image that fits your device and download the correct resolution version. Copy the file into your radio memory inside the IMAGES folder and make sure the filename is splash.png',
      splashConfigureHint: 'Set apiKey and splash_screen in gallery.config.ts to load splash screen.',
      splashLoading: 'Loading boot images...',
      splashEmpty: 'No images found in the Splash Screen folder.',
      splashResOriginal: '800x480 (Original)',
      splashResResized: '480x272 (Resize)'
    }
  }), []);

  useEffect(() => {
    const loadGallery = async () => {
      if (!GALLERY_CONFIG.apiKey || !GALLERY_CONFIG.folderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fields = encodeURIComponent('files(id,name,mimeType)');

        const fullQuery = encodeURIComponent(`'${GALLERY_CONFIG.folderId}' in parents and trashed=false and mimeType contains 'image/'`);
        const fullUrl = `https://www.googleapis.com/drive/v3/files?q=${fullQuery}&fields=${fields}&orderBy=name&pageSize=200&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;

        const previewFolderQuery = encodeURIComponent(`'${GALLERY_CONFIG.folderId}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder' and name='preview'`);
        const previewFolderUrl = `https://www.googleapis.com/drive/v3/files?q=${previewFolderQuery}&fields=${fields}&pageSize=1&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;

        const [fullRes, previewFolderRes] = await Promise.all([
          fetch(fullUrl),
          fetch(previewFolderUrl)
        ]);
        if (!fullRes.ok || !previewFolderRes.ok) throw new Error('Drive API error');

        const fullData = await fullRes.json();
        const previewFolderData = await previewFolderRes.json();
        const previewFolderId = previewFolderData.files?.[0]?.id as string | undefined;

        let previewByName = new Map<string, string>();
        if (previewFolderId) {
          const previewQuery = encodeURIComponent(`'${previewFolderId}' in parents and trashed=false and mimeType contains 'image/'`);
          const previewUrl = `https://www.googleapis.com/drive/v3/files?q=${previewQuery}&fields=${fields}&orderBy=name&pageSize=200&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;
          const previewRes = await fetch(previewUrl);
          if (previewRes.ok) {
            const previewData = await previewRes.json();
            previewByName = new Map<string, string>(
              (previewData.files || []).map((file: { id: string; name: string }) => [
                file.name,
                `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`
              ])
            );
          }
        }

        const mapped: GalleryItem[] = (fullData.files || []).map((file: { id: string; name: string }) => ({
          id: file.id,
          name: file.name,
          previewUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          imageUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`,
          fallbackImageUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          downloadUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`
        }));
        setItems(mapped);
      } catch (e) {
        setError(t[lang].failedLoad);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [lang, t]);

  useEffect(() => {
    const loadSplashGallery = async () => {
      if (!GALLERY_CONFIG.apiKey || !GALLERY_CONFIG.splash_screen) {
        setSplashLoading(false);
        return;
      }

      try {
        setSplashLoading(true);
        setSplashError(null);
        const fields = encodeURIComponent('files(id,name,mimeType)');
        const fullQuery = encodeURIComponent(`'${GALLERY_CONFIG.splash_screen}' in parents and trashed=false and mimeType contains 'image/'`);
        const fullUrl = `https://www.googleapis.com/drive/v3/files?q=${fullQuery}&fields=${fields}&orderBy=name&pageSize=200&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;

        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error('Drive API error');

        const fullData = await res.json();
        const mapped: GalleryItem[] = (fullData.files || []).map((file: { id: string; name: string }) => ({
          id: file.id,
          name: file.name,
          previewUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          imageUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`,
          fallbackImageUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w320`,
          downloadUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`
        }));
        setSplashItems(mapped);
      } catch (e) {
        setSplashError(t[lang].failedLoad);
      } finally {
        setSplashLoading(false);
      }
    };

    loadSplashGallery();
  }, [lang, t]);

  const handleDownloadSplash = async (item: GalleryItem, resolution: '800x480' | '480x272') => {
    const actionId = `${item.id}-${resolution}`;
    try {
      setDownloadingId(actionId);
      const res = await fetch(item.downloadUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('Image fetch error');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      if (resolution === '480x272') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = objectUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load for resizing'));
        });

        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 272;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.drawImage(img, 0, 0, 480, 272);

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
      setSplashError(lang === 'it' ? 'Impossibile scaricare o ridimensionare lo splash screen.' : 'Could not download or resize the splash screen.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleApplyBackground = async (item: GalleryItem) => {
    try {
      setApplyingId(item.id);
      const res = await fetch(item.downloadUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('Image fetch error');
      const blob = await res.blob();

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      onApplyBackground(dataUrl);
    } catch (e) {
      setError(t[lang].failedApply);
    } finally {
      setApplyingId(null);
    }
  };

  const isConfigured = Boolean(GALLERY_CONFIG.apiKey && GALLERY_CONFIG.folderId);
  const isSplashConfigured = Boolean(GALLERY_CONFIG.apiKey && GALLERY_CONFIG.splash_screen);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col gap-8">
      {/* SEZIONE 1 — BACKGROUND GALLERY (ESISTENTE) */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{t[lang].title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t[lang].subtitle}</p>
          <p className="text-slate-500 text-xs mt-2">{t[lang].ownerHint}</p>
        </div>

        {!isConfigured && (
          <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
            {t[lang].configureHint}
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm">{t[lang].loading}</div>
        )}

        {error && (
          <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && isConfigured && items.length === 0 && (
          <div className="text-slate-400 text-sm">{t[lang].empty}</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleApplyBackground(item)}
                  disabled={applyingId === item.id}
                  className="aspect-[5/3] bg-slate-900 w-full block disabled:opacity-70"
                >
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
                </button>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApplyBackground(item)}
                      disabled={applyingId === item.id}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-colors"
                    >
                      {applyingId === item.id ? t[lang].applying : t[lang].apply}
                    </button>
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg text-center transition-colors"
                    >
                      {t[lang].download}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEZIONE 2 — SPLASH SCREEN (NUOVA) */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-6 bg-amber-500 rounded-full animate-pulse"></span>
            {t[lang].splashTitle}
          </h2>
          <p className="text-white text-xs bg-amber-950/40 border border-amber-800/30 rounded-lg p-4 mt-4 font-normal leading-relaxed">
            {t[lang].splashSubtitle}
          </p>
        </div>

        {!isSplashConfigured && (
          <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
            {t[lang].splashConfigureHint}
          </div>
        )}

        {splashLoading && (
          <div className="text-slate-400 text-sm">{t[lang].splashLoading}</div>
        )}

        {splashError && (
          <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg text-red-300 text-sm mb-4">
            {splashError}
          </div>
        )}

        {!splashLoading && !splashError && isSplashConfigured && splashItems.length === 0 && (
          <div className="text-slate-400 text-sm">{t[lang].splashEmpty}</div>
        )}

        {!splashLoading && !splashError && splashItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {splashItems.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between">
                <div className="aspect-[5/3] bg-slate-950 w-full relative">
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
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadSplash(item, '800x480')}
                      disabled={downloadingId !== null}
                      className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 px-1 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      {downloadingId === `${item.id}-800x480` ? (lang === 'it' ? 'Download...' : 'Downloading...') : t[lang].splashResOriginal}
                    </button>
                    <button
                      onClick={() => handleDownloadSplash(item, '480x272')}
                      disabled={downloadingId !== null}
                      className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 text-[10px] font-black uppercase tracking-widest py-2 px-1 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      {downloadingId === `${item.id}-480x272` ? (lang === 'it' ? 'Resize...' : 'Resizing...') : t[lang].splashResResized}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default GalleryPage;

