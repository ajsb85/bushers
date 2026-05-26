import React from "react";
import { Provider } from "@react-spectrum/s2/Provider";
import Header from "./components/Header";
import ConnectionPanel from "./components/ConnectionPanel";
import SettingsPanel from "./components/SettingsPanel";
import FirmwareSelectionPanel from "./components/FirmwareSelectionPanel";
import ProgressPanel from "./components/ProgressPanel";
import TerminalLog from "./components/TerminalLog";
import useESPFlash from "./hooks/useESPFlash";

export const App: React.FC = () => {
  const {
    connected,
    connecting,
    chip,
    terminalRef,
    progress,
    isFlashing,
    baudRate,
    eraseBeforeInstall,
    selectedFiles,
    fileOffsets,
    customFiles,
    singleBinaryMode,
    setBaudRate,
    setEraseBeforeInstall,
    setSingleBinaryMode,
    toggleFileSelection,
    updateFileOffset,
    connectDevice,
    disconnectDevice,
    flashFirmware,
    eraseFlash,
    resetDevice,
    addCustomFile,
    removeCustomFile,
    clearLogs,
  } = useESPFlash();

  return (
    <Provider>
      <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden antialiased">
        {/* Top Navigation App Bar */}
        <Header onClearLogs={clearLogs} />

        {/* 12-Column Responsive Layout Grid */}
        <main className="mt-[56px] mb-[32px] flex-grow w-full max-w-max-width mx-auto px-margin-desktop py-lg grid grid-cols-12 gap-gutter">
          {/* Left Column: Device Connection & Settings (Sidebar) */}
          <aside className="col-span-12 lg:col-span-4 space-y-gutter flex flex-col justify-start">
            <ConnectionPanel
              connected={connected}
              connecting={connecting}
              chip={chip}
              onConnect={connectDevice}
              onDisconnect={disconnectDevice}
            />

            <SettingsPanel
              baudRate={baudRate}
              eraseBeforeInstall={eraseBeforeInstall}
              isFlashing={isFlashing}
              onBaudRateChange={setBaudRate}
              onEraseBeforeInstallChange={setEraseBeforeInstall}
            />

            {/* Quick Actions Panel */}
            {connected && (
              <section className="bg-surface-white border border-outline-variant p-md flex flex-col gap-3 rounded-sm">
                <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                  Hardware Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={resetDevice}
                    disabled={isFlashing}
                    className="flex items-center justify-center gap-2 border border-secondary text-secondary font-label-bold text-label-bold h-9 px-3 hover:bg-surface-container hover:text-primary transition-all rounded-sm active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="restart_alt">
                      restart_alt
                    </span>
                    RESET
                  </button>
                  <button
                    onClick={eraseFlash}
                    disabled={isFlashing}
                    className="flex items-center justify-center gap-2 border border-status-error text-status-error font-label-bold text-label-bold h-9 px-3 hover:bg-red-50 transition-all rounded-sm active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="delete_forever">
                      delete_forever
                    </span>
                    ERASE
                  </button>
                </div>
              </section>
            )}
          </aside>

          {/* Right Column: Firmware Selection, Actions & Scroll Console Logs */}
          <div className="col-span-12 lg:col-span-8 space-y-gutter flex flex-col">
            <FirmwareSelectionPanel
              selectedFiles={selectedFiles}
              fileOffsets={fileOffsets}
              customFiles={customFiles}
              singleBinaryMode={singleBinaryMode}
              isFlashing={isFlashing}
              onToggleSelection={toggleFileSelection}
              onUpdateOffset={updateFileOffset}
              onAddCustomFile={addCustomFile}
              onRemoveCustomFile={removeCustomFile}
              onToggleSingleBinaryMode={setSingleBinaryMode}
            />

            <ProgressPanel
              progress={progress}
              isFlashing={isFlashing}
              connected={connected}
              onFlash={flashFirmware}
            />

            <TerminalLog terminalRef={terminalRef} onClearLogs={clearLogs} />
          </div>
        </main>

        {/* Status Bar Footer */}
        <footer className="bg-surface-container-low dark:bg-terminal-bg border-t border-outline-variant fixed bottom-0 w-full h-[32px] z-50 flex items-center">
          <div className="flex justify-between items-center w-full px-margin-desktop max-w-max-width mx-auto h-full">
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              v2.4.0-stable | Bushers Engineering
            </span>
            <div className="flex gap-4">
              <a
                className="font-label-bold text-label-bold text-secondary hover:text-primary transition-colors text-xs"
                href="https://github.com/espressif/esptool-js"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
              <a
                className="font-label-bold text-label-bold text-secondary hover:text-primary transition-colors text-xs"
                href="https://github.com/espressif/esptool-js"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>

        {/* Decorative Industrial Watermark */}
        <div className="fixed top-24 right-12 opacity-[0.03] pointer-events-none select-none -z-10 rotate-12 transition-transform duration-1000 hover:rotate-45">
          <span className="material-symbols-outlined text-[320px]" data-icon="memory">
            memory
          </span>
        </div>
      </div>
    </Provider>
  );
};

export default App;
