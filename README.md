# EdgeTX Theme Designer

![EdgeTX Theme Designer Banner](https://drive.google.com/uc?export=view&id=1S7DAgGINi2fd-OpbgGNIbnFCCsQUIEtq)

A professional and intuitive web application designed to simplify the creation of custom color themes and visual assets for EdgeTX compatible radios (optimized for 800x480 displays such as the TX16S MK3).

🌐 Live App: https://edge-tx-theme-creator.vercel.app/

---

## 🚀 Key Features

### 🎨 Advanced Theme Editor
- Live Color Inspection: Click directly on UI elements inside the preview to instantly identify and edit the linked theme variable.
- Real-Time Rendering: Accurate EdgeTX simulator with multiple preview environments and responsive rendering.
- Multi-Screen Support:
  - Home Screen
  - Channels / Mixer Screen
  - System / Setup Screen

### 🖼️ Asset & Gallery Management
- Upload and manage:
  - Custom backgrounds
  - Model logos
  - Splash screen boot images
- Integrated online gallery powered by Google Drive synchronization.
- Dedicated Splash Screen Gallery Section with separated visual layout.

### ✨ Splash Screen Editor
Built-in advanced editor for customizing radio boot screens directly inside the web app.

Features include:
- Real-time 800x480 preview editor
- Custom text positioning (X/Y controls)
- Font selection:
  - Arial
  - Times New Roman
  - Impact
- Italic style toggle
- Independent controls for:
  - Text color
  - Outline color
  - Shadow color
- Optional outline and shadow effects
- High-quality export system

### 📥 Smart Splash Export
- Export ready-to-use:
  - 800x480
  - 480x272
- Automatic filename generation:
  - splash.png
- High-quality proportional downscaling for smaller displays.

### 📦 Full Theme Export
Generates complete EdgeTX-ready ZIP packages including:
- .yml theme files
- Background assets
- Preview screenshots
- Theme structure ready for MicroSD deployment

### 🌍 Multi-language Support
Full bilingual support:
- English
- Italian

### 💾 Persistent Sessions
Projects are automatically saved locally in the browser to prevent data loss during editing sessions.

---

## 🛠️ How to Use

### Theme Creation
1. Use the Color Inspection and Edit panel.
2. Click directly on the preview to modify theme variables.
3. Upload custom assets such as wallpapers and logos.
4. Export your completed EdgeTX theme package.

### Splash Screen Creation
1. Open the dedicated Splash Screen Gallery.
2. Select a splash image.
3. Customize the text, font, effects, and positioning.
4. Export your final splash.png file in the desired resolution.

### Installing on the Radio
1. Connect the radio to your computer in USB Storage Mode.
2. Create a folder inside:
   /THEMES/
3. Extract the generated ZIP package into the new folder.
4. For splash screens:
   - Copy splash.png
   - Place it inside:
   /IMAGES/
5. On the radio:
   - Open SYS
   - Navigate to Themes
   - Select your custom theme

---

## 💻 Tech Stack

- React 19 with TypeScript
- Tailwind CSS for responsive UI
- JSZip for package generation
- html2canvas for preview rendering and screenshots
- Google Drive API for online gallery synchronization

---

## 📱 Responsive Design

The application is designed to work on:
- Desktop browsers
- Tablets
- Smartphones

Responsive optimizations ensure usability across different screen sizes while preserving accurate EdgeTX preview proportions.

---

## 📧 Feedback

If you have suggestions, bug reports, or feedback, feel free to contact:

📩 giancarlomonastero@gmail.com

---

## 📄 License

This project is free to use.
Optional donations help support future development and improvements.

---

Developed with passion by Giancarlo Monastero.