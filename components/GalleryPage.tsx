import React, { useEffect, useState } from 'react';
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

const GALLERY_TRANSLATIONS = {
  it: {
    title: 'Gallery Sfondi HD',
    subtitle: 'Archivio sfondi 800x480.',
    ownerHint: 'Clicca sull\'immagine che preferisci per inserirla automaticamente come sfondo del template. (Immagini gratuite per uso personale/non commerciale. Vietata vendita o uso commerciale senza autorizzazione).',
    configureHint: 'Configura apiKey e folderId in gallery.config.ts per caricare le immagini.',
    loading: 'Caricamento galleria...',
    empty: 'Nessuna immagine trovata nella cartella Gallery.',
    apply: 'Usa come sfondo',
    applying: 'Applicazione...',
    download: 'Scarica',
    applied: 'Sfondo applicato al template.',
    failedApply: 'Impossibile applicare lo sfondo selezionato.',
    failedLoad: 'Impossibile caricare la galleria da Google Drive.'
  },
  en: {
    title: 'HD Background Gallery',
    subtitle: '800x480 background archive.',
    ownerHint: 'Click the image you prefer to automatically apply it as your template background. (Free images for personal/non-commercial use. No selling or commercial use without permission).',
    configureHint: 'Set apiKey and folderId in gallery.config.ts to load images.',
    loading: 'Loading gallery...',
    empty: 'No images found in the Gallery folder.',
    apply: 'Use as background',
    applying: 'Applying...',
    download: 'Download',
    applied: 'Background applied to the template.',
    failedApply: 'Could not apply selected background.',
    failedLoad: 'Could not load gallery from Google Drive.'
  }
};

const GalleryPage: React.FC<GalleryPageProps> = ({ lang, onApplyBackground }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const activeLang = lang === 'it' || lang === 'en' ? lang : 'en';
  const t = GALLERY_TRANSLATIONS[activeLang];

  useEffect(() => {
    let active = true;

    // Safety timeout to guarantee loading state is turned off after 5 seconds
    const safetyTimeout = setTimeout(() => {
      if (active) {
        console.warn('[GalleryPage] Safety timeout reached. Forcing loading to false.');
        setLoading(false);
      }
    }, 5000);

    const loadGallery = async () => {
      if (!GALLERY_CONFIG.apiKey || !GALLERY_CONFIG.folderId) {
        if (active) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
        return;
      }

      try {
        if (active) {
          setLoading(true);
          setError(null);
        }

        const fields = encodeURIComponent('files(id,name,mimeType)');
        const fullQuery = encodeURIComponent(`'${GALLERY_CONFIG.folderId}' in parents and trashed=false and mimeType contains 'image/'`);
        const fullUrl = `https://www.googleapis.com/drive/v3/files?q=${fullQuery}&fields=${fields}&orderBy=name&pageSize=200&key=${encodeURIComponent(GALLERY_CONFIG.apiKey)}`;

        console.log('[GalleryPage] Fetching background images from Google Drive API...');
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
          setItems(mapped);
        }
      } catch (e) {
        console.error('[GalleryPage] Error loading gallery images from Google Drive:', e);
        if (active) {
          setError(t.failedLoad);
        }
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    loadGallery();

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
    };
  }, [activeLang]);

  const handleApplyBackground = async (item: GalleryItem) => {
    try {
      setApplyingId(item.id);
      const res = await fetch(item.downloadUrl, { 
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        credentials: 'omit'
      });
      if (!res.ok) {
        throw new Error(`Failed to download background image. Status: ${res.status}`);
      }
      const blob = await res.blob();

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      onApplyBackground(dataUrl);
    } catch (e) {
      console.error('[GalleryPage] Error applying background image:', e);
      setError(t.failedApply);
    } finally {
      setApplyingId(null);
    }
  };

  const isConfigured = Boolean(GALLERY_CONFIG.apiKey && GALLERY_CONFIG.folderId);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col gap-8">
      {/* SEZIONE 1 — BACKGROUND GALLERY */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.subtitle}</p>
          <p className="text-slate-500 text-xs mt-2">{t.ownerHint}</p>
        </div>

        {!isConfigured && (
          <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
            {t.configureHint}
          </div>
        )}

        {loading && (
          <div className="text-slate-400 text-sm animate-pulse">{t.loading}</div>
        )}

        {error && (
          <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        {!loading && !error && isConfigured && items.length === 0 && (
          <div className="text-slate-400 text-sm">{t.empty}</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => handleApplyBackground(item)}
                  disabled={applyingId === item.id}
                  className="aspect-[5/3] bg-slate-900 w-full block disabled:opacity-70 overflow-hidden group cursor-pointer"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
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
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      {applyingId === item.id ? t.applying : t.apply}
                    </button>
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg text-center transition-colors flex items-center justify-center font-bold"
                    >
                      {t.download}
                    </a>
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
