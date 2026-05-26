import React from "react";
import { Provider } from "@react-spectrum/s2/Provider";
import { Button } from "@react-spectrum/s2/Button";
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
    beforeReset,
    afterReset,
    flashMode,
    flashFreq,
    flashSize,
    customResetSequence,
    setBaudRate,
    setEraseBeforeInstall,
    setSingleBinaryMode,
    setBeforeReset,
    setAfterReset,
    setFlashMode,
    setFlashFreq,
    setFlashSize,
    setCustomResetSequence,
    toggleFileSelection,
    updateFileOffset,
    connectDevice,
    disconnectDevice,
    flashFirmware,
    eraseFlash,
    resetDevice,
    enterBootloaderDevice,
    addCustomFile,
    removeCustomFile,
    clearLogs,
  } = useESPFlash();

  return (
    <Provider>
      <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden antialiased">
        {/* Barra superior de navegación */}
        <Header onClearLogs={clearLogs} />

        {/* Layout responsivo de 12 columnas */}
        <main className="mt-[56px] mb-[32px] flex-grow w-full max-w-max-width mx-auto px-margin-desktop py-lg grid grid-cols-12 gap-gutter">
          {/* Columna Izquierda: Conexión y Ajustes de Hardware (Sidebar) */}
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
              beforeReset={beforeReset}
              afterReset={afterReset}
              flashMode={flashMode}
              flashFreq={flashFreq}
              flashSize={flashSize}
              customResetSequence={customResetSequence}
              onBaudRateChange={setBaudRate}
              onEraseBeforeInstallChange={setEraseBeforeInstall}
              onBeforeResetChange={setBeforeReset}
              onAfterResetChange={setAfterReset}
              onFlashModeChange={setFlashMode}
              onFlashFreqChange={setFlashFreq}
              onFlashSizeChange={setFlashSize}
              onCustomResetSequenceChange={setCustomResetSequence}
            />

            {/* Acciones de Hardware */}
            {connected && (
              <section className="bg-surface-white border border-outline-variant p-md flex flex-col gap-3 rounded-sm">
                <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Acciones de Hardware
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    fillStyle="outline"
                    size="S"
                    isDisabled={isFlashing}
                    onPress={resetDevice}
                    UNSAFE_className="w-full col-span-1"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]" data-icon="restart_alt">
                        restart_alt
                      </span>
                      REINICIAR CHIP
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    fillStyle="outline"
                    size="S"
                    isDisabled={isFlashing}
                    onPress={enterBootloaderDevice}
                    UNSAFE_className="w-full col-span-1"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]" data-icon="bolt">
                        bolt
                      </span>
                      ENTRAR EN BOOT
                    </span>
                  </Button>
                  <Button
                    variant="negative"
                    fillStyle="outline"
                    size="S"
                    isDisabled={isFlashing}
                    onPress={eraseFlash}
                    UNSAFE_className="w-full col-span-2"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]" data-icon="delete_forever">
                        delete_forever
                      </span>
                      BORRAR FLASH
                    </span>
                  </Button>
                </div>
                <div className="mt-2 text-[11px] text-secondary leading-relaxed border-t border-outline-variant/30 pt-2">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[14px]" data-icon="settings_input_composite">
                      settings_input_composite
                    </span>
                    Acoplamiento de Auto-Reinicio por Transistor
                  </span>
                  Use estos botones para controlar manualmente las líneas DTR/RTS para reiniciar el chip o forzar el ingreso al Bootloader de la ROM. Útil si el auto-reinicio automático falla.
                </div>
              </section>
            )}
          </aside>

          {/* Columna Derecha: Selección de Firmware, Progreso y Consola */}
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

        {/* Pie de página con estado de compilación */}
        <footer className="bg-surface-container-low dark:bg-terminal-bg border-t border-outline-variant fixed bottom-0 w-full h-[32px] z-50 flex items-center">
          <div className="flex justify-between items-center w-full px-margin-desktop max-w-max-width mx-auto h-full">
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              v2.4.0-estable | Ingeniería Bushers
            </span>
            <div className="flex gap-4">
              <a
                className="font-label-bold text-label-bold text-secondary hover:text-primary transition-colors text-xs"
                href="https://github.com/espressif/esptool-js"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentación
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

        {/* Marca de agua decorativa industrial */}
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
