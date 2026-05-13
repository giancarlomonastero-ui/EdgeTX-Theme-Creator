# EdgeTX Theme Designer

![EdgeTX Theme Designer Banner](https://drive.google.com/uc?export=view&id=1S7DAgGINi2fd-OpbgGNIbnFCCsQUIEtq)

A professional and intuitive web application designed to simplify the creation of color themes for **EdgeTX** compatible radios (optimized for 800x480 screens like the TX16S MK3).

🌐 **Live App:** [edge-tx-theme-creator.vercel.app](https://edge-tx-theme-creator.vercel.app/)

## 🚀 Key Features

- **Live Inspection**: Click directly on the preview elements to identify and modify the corresponding color variable.
- **Real Preview**: Accurate simulator of the EdgeTX interface with support for multiple screens (Home, Channels, Keyboard).
- **Asset Management**: Upload custom background images and model logos to see the final effect in real-time.
- **Full Export**: Generates ready-to-use ZIP packages for the radio's MicroSD, including `.yml` files, background images, and preview screenshots.
- **Multi-language**: Full support for English and Italian.
- **Persistent Session**: Your project is automatically saved in the browser so you never lose your progress.

## 🛠️ How to Use

1. **Define Colors**: Use the "COLOR INSPECTION AND EDIT" panel or click directly on the simulator elements.
2. **Customize**: Upload your background (800x480 recommended) and set your model label.
3. **Export**:
   - Click **"Export Template"** for a standard package.
   - Click **"Export TX16S MK3"** for a version optimized for the latest RadioMaster hardware.
4. **Install on Radio**:
   - Connect your radio to the PC in "USB Storage" mode.
   - Create a folder with your theme name inside `/THEMES/`.
   - Extract the downloaded ZIP content into that folder.
   - On the radio, go to `SYS` -> `Themes` and select your new theme.

## 💻 Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for responsive design
- **JSZip** for package generation
- **html2canvas** for capturing preview screenshots

## 📧 Feedback

If you have any suggestions, bug reports, or feedback, please feel free to reach out via email: [giancarlomonastero@gmail.com](mailto:giancarlomonastero@gmail.com)

## 📄 License

This project is free to use. Donations are optional and solely used to support ongoing development.

---
*Developed with passion by Giancarlo Monastero.*
