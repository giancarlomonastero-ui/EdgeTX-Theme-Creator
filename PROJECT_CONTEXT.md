# PROJECT CONTEXT

## Nome progetto
EdgeTX Theme Designer (v1.8.0)

---

## Scopo della webapp
EdgeTX Theme Designer è uno strumento professionale per la creazione di temi a colori personalizzati per radio EdgeTX (ottimizzate per schermi 800x480 come RadioMaster TX16S MK3). Permette di ispezionare visivamente le variabili colore, caricare asset personalizzati (sfondi e loghi modelli) ed esportare pacchetti ZIP pronti per l'uso sulla MicroSD della radio.

---

## Stack utilizzato
- **Frontend**: React 19 (Functional Components, Hooks)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4 (con script in-page)
- **Utilities**: 
  - `JSZip`: Per la generazione e compressione dei pacchetti temi.
  - `html2canvas`: Per catturare gli screenshot del simulatore durante l'export.
- **Deploy**: Vercel
- **Version Control**: GitHub

---

## Workflow sviluppo
1. **Modifiche in Google AI Studio**: Sviluppo iterativo della logica e dell'interfaccia.
2. **Export ZIP**: Scaricamento del codice aggiornato.
3. **Sincronizzazione Locale**: Copia dei file nella directory di sviluppo locale.
4. **Deploy Vercel**: Push su GitHub che attiva la build automatica su Vercel.

---

## Architettura cartelle

### / (Root)
- `App.tsx`: Componente principale con stato globale (temi, meta, asset), internazionalizzazione (IT/EN) e logica di export ZIP.
- `index.tsx`: Entry point React che monta l'applicazione.
- `types.ts`: Definizioni delle interfacce per temi, variabili e metadati.
- `constants.ts`: Valori iniziali (INITIAL_THEME) e metadati delle variabili (VARIABLE_METADATA).
- `gallery.config.ts`: Configurazione API (Google Drive) per la galleria sfondi.

### /components
- `Header.tsx`: Gestione navigazione e cambio lingua.
- `Preview.tsx`: Cuore del progetto; simula l'interfaccia EdgeTX con scaling dinamico e aree cliccabili per l'ispezione colore.
- `GalleryPage.tsx`: Integrazione con Google Drive API per caricare sfondi HD.
- `Controls.tsx`: Pannello laterale per la modifica manuale dei colori e visualizzazione output YAML.
- `MappingGuide.tsx`: Guida tecnica per la corrispondenza tra variabili e aree dello schermo.
- `HistoryLog.tsx`: Visualizzazione della cronologia delle modifiche.

### /public/images (Asset originali EdgeTX)
- **Mask Icons**: Icone in formato SVG (`mask_icon_*.svg`) utilizzate con `mask-image` CSS per applicare dinamicamente i colori del tema.
- **UI Elements**: Elementi grafici come widget, pulsanti e sfondi di sistema (`mask_ui_*.svg`, `mask_widget_*.svg`).
- **Bitmaps**: Asset grafici ed icone a colori (`bmp_*.svg`).

---

## Funzioni principali
- **Live Color Inspection**: Cliccando sugli elementi della preview, il designer identifica e seleziona automaticamente la variabile colore corrispondente.
- **Asset Dynamic Rendering**: Gli asset in `public/images` vengono renderizzati dinamicamente utilizzando maschere CSS, permettendo la colorazione in tempo reale basata sulle variabili del tema.
- **Multi-Screen Support**: Anteprima del tema su diverse schermate (Home, Mixer, Tastiera/Mixer Setup).
- **Export Evoluto**: Generazione di un pacchetto ZIP contenente `theme.yml`, sfondi ridimensionati e screenshot di anteprima necessari per EdgeTX.
- **Session Persistence**: Salvataggio automatico dello stato del progetto nel LocalStorage del browser.

---

## API utilizzate
- **Google Drive API (v3)**: Utilizzata in `GalleryPage.tsx` per il recupero di immagini da cartelle pubbliche tramite API Key.

---

## Variabili ambiente
- Non sono presenti variabili `.env` critiche nel repository pubblico; la configurazione API è gestita staticamente in `gallery.config.ts`.

---

## Regole IMPORTANTI
- **Build Vercel**: Assicurarsi che `package.json` punti correttamente all'entry point `index.tsx` (configurato in `index.html`).
- **Compatibilità Mobile**: Il simulatore (Preview) utilizza un sistema di scaling dinamico per adattarsi a container di diverse dimensioni.
- **Export Performance**: L'export ZIP utilizza dynamic imports per ottimizzare il caricamento iniziale.

---

## Problemi già risolti
- **Scaling Preview**: Risolto il problema del ritaglio del simulatore su schermi piccoli tramite trasformazioni CSS dinamiche.
- **CORS Gallery**: Gestione degli accessi alle immagini di Google Drive per il rendering in canvas.

---

## Note tecniche
- Le variabili colore sono proiettate come custom properties CSS (`--primary1`, ecc.) sull'elemento `root`.
- L'export per TX16S MK3 forza una risoluzione di 800x480, mentre lo standard esporta asset a 480x272.
