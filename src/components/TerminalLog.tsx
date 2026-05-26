import React, { useRef, useEffect } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export interface TerminalLogProps {
  readonly terminalRef: React.MutableRefObject<Terminal | null>;
  readonly onClearLogs: () => void;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ terminalRef, onClearLogs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear la instancia de la terminal xterm
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 12,
      fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, 'Courier New', monospace",
      theme: {
        background: "#1A1B1E", // Dark slate background matching design token
        foreground: "#E3E2E6", // Light neutral gray
        cursor: "#E3E2E6",
        selectionBackground: "rgba(255, 255, 255, 0.15)",
        black: "#1A1B1E",
        red: "#FFB4AB",       // Pastel red
        green: "#B2D195",     // Pastel green
        yellow: "#E2C46F",    // Pastel yellow
        blue: "#ADC6FF",      // Pastel blue
        magenta: "#E8B9D4",   // Pastel magenta
        cyan: "#A0D0E8",      // Pastel cyan
        white: "#E3E2E6",
      },
      convertEol: true, // Convertir \n a \r\n de forma automática
      rows: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Abrir terminal en el contenedor DOM
    term.open(containerRef.current);
    fitAddon.fit();

    terminalInstanceRef.current = term;
    terminalRef.current = term;

    // Mensaje de inicialización de la terminal
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    term.write(`[${time}] \x1b[36m[SISTEMA] Motor de Flasheo Bushers inicializado. Listo para conexión WebSerial.\x1b[0m\r\n`);

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn("Error en el ajuste de redimensionado de terminal:", e);
      }
    };
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn("Error diferido en el ajuste de terminal:", e);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      term.dispose();
      terminalInstanceRef.current = null;
      terminalRef.current = null;
    };
  }, [terminalRef]);

  return (
    <section className="bg-terminal-bg border border-outline-variant rounded-sm overflow-hidden flex flex-col h-[300px] shadow-inner">
      {/* Barra de Título de la Terminal */}
      <div className="bg-surface-dim px-md py-2 border-b border-terminal-bg flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-tertiary" data-icon="terminal">
            terminal
          </span>
          <span className="font-code-sm text-code-sm text-on-surface-variant font-bold tracking-wider">
            REGISTRO_DE_ESTADO_REVISION_B (XTERM)
          </span>
        </div>
        <button
          onClick={onClearLogs}
          title="Limpiar registros de la consola"
          className="text-tertiary hover:text-status-error hover:bg-surface-container-highest p-1 rounded transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="delete">
            delete
          </span>
        </button>
      </div>

      {/* Flujo de consola de la terminal */}
      <div 
        ref={containerRef} 
        className="p-sm flex-grow bg-terminal-bg font-code-sm text-code-sm overflow-hidden"
        style={{ height: "calc(100% - 37px)" }}
      />
    </section>
  );
};

export default TerminalLog;
