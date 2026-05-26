# ⚡ Bushers Adaptive ESP32 WebSerial Firmware Flasher

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-success?style=for-the-badge&logo=github&logoColor=white)](https://ajsb85.github.io/bushers/)
[![React Spectrum S2](https://img.shields.io/badge/React%20Spectrum-S2--Ready-blue?style=for-the-badge&logo=adobe&logoColor=white)](https://react-spectrum.adobe.com/s2/index.html)
[![Vite](https://img.shields.io/badge/Vite-v8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache--2.0-orange?style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

A premium, state-of-the-art WebSerial ESP32 Firmware Flasher web application built with **React**, **TypeScript**, **Vite**, and **Adobe React Spectrum S2**. This dashboard provides a highly refined, corporate-industrial interface to write, erase, and debug firmware streams on Espressif ESP32 microcontrollers directly from your web browser—no local command-line tools or drivers required.

> 🔗 **Live Web Application URL**: [https://ajsb85.github.io/bushers/](https://ajsb85.github.io/bushers/)

---

## 🎨 Design & Visual Aesthetics

The application layout is modeled after the **Stitch Design System** featuring a high-density, hybrid fixed-fluid layout tailored for industrial engineering dashboards:
*   **Aesthetic Harmony**: Features an elegant corporate dark/light palette with polished glassmorphic surfaces, subtle hover micro-animations, and fluid transition systems.
*   **Dual-Theme Dark Mode**: Built with deep, curated HSL color tokens mapped directly from Tailwind CSS (`background: #1A1B1E`, `primary-container`, `status-success`, and outline variants).
*   **Xterm.js Status Monitor**: Integrates a real-time, low-level, high-contrast console stream designed with a retro-industrial look, leveraging full terminal emulators with ANSI color sequences.

---

## 🚀 Key Features

*   **⚡ WebSerial Connection Handshaking**: Robust, sandboxed hardware communication directly from compatible browsers (Chrome, Edge, Opera) with fully adjustable Baudrates (up to 921600).
*   **📺 Xterm.js Terminal Console**: Seamlessly displays real-time execution streams from `esptool-js` with flawless support for ANSI escape color codes, logging streams, and carriage return carriage-overs (`\r` progress indicators).
*   **📦 Atomic/Composite S2 Interface**: Built entirely with `@react-spectrum/s2` components—including premium high-contrast action buttons, dense offset tables, checklist toggles, and reactive progress bars.
*   **💾 Preloaded Firmware selection**: Instantly selects and flashes preloaded official firmware binaries (including partitions, bootloaders, boot app buffers) or allows custom drag-and-drop local uploads.
*   **🛠️ Hardware Controls**: Direct interface to trigger quick actions like chip initialization, hardware resetting (via DTR toggling), and full-chip flash memory erasing.
*   **📱 Responsive 12-Column Grid**: Dynamic fluid sidebar-content layout that formats beautifully across dual-monitor desktop screens and mobile handheld interfaces.

---

## 📖 Step-by-Step Flashing Instructions

To flash your ESP32 device using the online flasher, follow these simple steps:

1.  **Connect your ESP32 Device**: Connect your ESP32 board to your computer's USB port.
2.  **Select Baudrate**: Open the [Live Web Application](https://ajsb85.github.io/bushers/), and select your desired flashing speed (recommended: `460800` or `921600` for high-speed writes).
3.  **Establish Serial Bridge**: Click the **CONNECT** button in the sidebar. A browser prompt will appear. Choose the correct USB-Serial port (e.g. `Silicon Labs CP210x` or `CH340`) and click **Connect**.
4.  **Confirm Binary Files**: Choose either:
    *   *Default Binaries*: Select the desired checkboxes in the Firmware offsets table (bootloader, partitions, app).
    *   *Single Binary Mode*: Toggle the switch to flash a single consolidated `merged.bin` file directly at offset `0x0`.
    *   *Custom Upload*: Drag and drop your own custom compilation binary file and specify its hex address offset.
5.  **Trigger Flash Sequence**: Click the high-contrast **FLASH FIRMWARE** button. The terminal console will display connection logs, erase sectors, write data blocks, and verify MD5 hashes in real-time.
6.  **Verify & Run**: Once progress reaches `100%`, the console will report success and automatically reset your board into user-application mode.

---

## 🛠️ Technical Stack & Dependencies

*   **Core Logic**: [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
*   **Component System**: [@react-spectrum/s2](https://react-spectrum.adobe.com/s2/index.html)
*   **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) & Vanilla CSS
*   **Flasher Bridge**: [esptool-js](https://github.com/espressif/esptool-js)
*   **Terminal Interface**: [@xterm/xterm](https://xtermjs.org/) & [@xterm/addon-fit](https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-fit)
*   **Hashing**: [crypto-js](https://github.com/brix/crypto-js) (MD5 validation)

---

## 📦 Local Installation & Development

To clone, set up, and run the project locally on your machine, perform the following steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/ajsb85/bushers.git
    cd bushers
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to the address displayed in the terminal (usually `http://localhost:5173/`).

4.  **Build Production Bundle**:
    ```bash
    npm run build
    ```
    The static optimized production build is generated inside the `dist/` directory.

---

## 🤝 Contribution Guidelines

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to understand how you can submit bug reports, feature requests, or propose design upgrades to the project.

---

## 📜 License

This project is open-source and licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file or head over to the [Apache Official Site](https://www.apache.org/licenses/LICENSE-2.0) for detailed terms.

Developed with ⚡ by the **Bushers Adaptive Team**.
