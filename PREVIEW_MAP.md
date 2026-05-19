# PREVIEW MAP — EdgeTX Theme Designer

## STRUTTURA GENERALE
La Preview è composta da 3 schermate logiche:
- screenshot1 = HOME / TOP BAR VIEW
- screenshot2 = MIXER / CHANNEL VIEW
- screenshot3 = SETUP / SYSTEM VIEW

Ogni schermata condivide lo stesso sistema di tema (CSS variables) ma ha contenuti UI differenti.

---

## SCREENSHOT1 — HOME (TOP BAR)

### COMPONENTI PRINCIPALI:
- Top Bar Container (fixed layout)
- Time / Date area
- Volume Icon
- Battery Icon
- Status Indicators

### ICONE TOP BAR:
- Volume Icon:
  - file: /images/mask_widget_volume4.svg
  - rendering: MaskIcon system
  - color system: text-white / currentColor (OBBLIGATORIO)

- Battery Icon:
  - file: /images/mask_widget_txbat_full.svg
  - rendering: RAW IMAGE (<img>)
  - color system: NONE (NO mask, NO currentColor, NO text-white)

### REGOLE LAYOUT:
- Volume e Battery sulla stessa riga
- Allineamento verticale identico
- Spacing fisso e non modificabile
- Nessun refactor consentito della top bar

---

## SCREENSHOT2 — MIXER VIEW

### COMPONENTI:
- Lista canali
- Sliders
- Valori telemetria

### ICONE:
- tutte le icone usano MaskIcon system
- obbligatorio text-white / currentColor
- nessuna eccezione consentita

---

## SCREENSHOT3 — SYSTEM / SETUP VIEW

### COMPONENTI:
- Menu sistema
- Lista impostazioni
- Navigazione rotella

### ICONE:
- tutte le icone usano MaskIcon system
- obbligatorio text-white / currentColor
- nessuna eccezione consentita

---

## REGOLE GLOBALI IMPORTANTI

- MaskIcon = sistema standard per icone tematiche
- IMG raw = SOLO eccezioni esplicite (es. batteria screenshot1)
- NON introdurre nuovi sistemi di rendering senza richiesta esplicita
- NON modificare layout tra screenshot
- NON modificare spacing o alignment tra icone
- Ogni modifica deve rispettare questa mappa come fonte di verità
