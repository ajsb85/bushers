import { useState, useCallback, useRef, useEffect } from "react";
import CryptoJS from "crypto-js";
import { ESPLoader, Transport } from "esptool-js";
import type { FlashOptions, LoaderOptions } from "esptool-js";
import type { Terminal } from "@xterm/xterm";
import { INITIAL_FIRMWARE_FILES, MERGED_FIRMWARE_FILE } from "../data/mockData";

export interface CustomFile {
  readonly id: string;
  readonly name: string;
  readonly data: Uint8Array;
  readonly offset: string;
  readonly sizeText: string;
}

export const useESPFlash = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [chip, setChip] = useState<string | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [baudRate, setBaudRate] = useState("460800");
  const [eraseBeforeInstall, setEraseBeforeInstall] = useState(true);
  const [singleBinaryMode, setSingleBinaryMode] = useState(false);
  
  // Selección de archivos iniciales
  const [selectedFiles, setSelectedFiles] = useState<{ readonly [id: string]: boolean }>({
    app: true,
    partitions: true,
    bootloader: true,
    boot_app: true,
  });

  // Direcciones de offset iniciales
  const [fileOffsets, setFileOffsets] = useState<{ readonly [id: string]: string }>({
    app: "0x10000",
    partitions: "0x8000",
    bootloader: "0x1000",
    boot_app: "0xe000",
  });

  const [customFiles, setCustomFiles] = useState<readonly CustomFile[]>([]);
  const [beforeReset, setBeforeReset] = useState<"default_reset" | "usb_reset" | "no_reset">("default_reset");
  const [afterReset, setAfterReset] = useState<"hard_reset" | "soft_reset" | "no_reset_stub" | "custom_reset" | "no_reset">("hard_reset");
  const [flashMode, setFlashMode] = useState<"keep" | "dio" | "qio" | "dout" | "qout">("keep");
  const [flashFreq, setFlashFreq] = useState<"keep" | "80m" | "60m" | "48m" | "40m" | "30m" | "26m" | "24m" | "20m" | "16m" | "15m" | "12m">("keep");
  const [flashSize, setFlashSize] = useState<"keep" | "detect" | "256KB" | "512KB" | "1MB" | "2MB" | "2MB-c1" | "4MB" | "4MB-c1" | "8MB" | "16MB" | "32MB" | "64MB" | "128MB">("keep");
  const [customResetSequence, setCustomResetSequence] = useState<string>("D0|R1|W100|D1|R0|W50|D0");

  const transportRef = useRef<Transport | null>(null);
  const esploaderRef = useRef<ESPLoader | null>(null);

  // Helper para escribir registros de estado en xterm.js
  const addLog = useCallback((text: string, type: "default" | "info" | "warn" | "success" | "error" = "default") => {
    if (terminalRef.current) {
      let colorPrefix = "";
      const colorSuffix = "\x1b[0m";
      switch (type) {
        case "info":
          colorPrefix = "\x1b[36m"; // Cian
          break;
        case "warn":
          colorPrefix = "\x1b[33m"; // Amarillo
          break;
        case "success":
          colorPrefix = "\x1b[32m"; // Verde
          break;
        case "error":
          colorPrefix = "\x1b[31m"; // Rojo
          break;
      }
      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const formattedText = colorPrefix ? `${colorPrefix}${text}${colorSuffix}` : text;
      terminalRef.current.write(`[${time}] ${formattedText}\r\n`);
    } else {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  }, []);

  const clearLogs = useCallback(() => {
    terminalRef.current?.clear();
  }, []);

  const toggleFileSelection = useCallback((id: string) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const updateFileOffset = useCallback((id: string, offset: string) => {
    setFileOffsets((prev) => ({ ...prev, [id]: offset }));
  }, []);

  const cleanupTransport = useCallback(async () => {
    if (transportRef.current) {
      const transport = transportRef.current;
      const port = transport.device;
      addLog("Limpiando la conexión del puerto serial...", "info");
      
      const disconnectPromise = transport.disconnect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout de desconexión")), 1000)
      );

      try {
        await Promise.race([disconnectPromise, timeoutPromise]);
        addLog("Transporte desconectado limpiamente.", "success");
      } catch (error: unknown) {
        console.warn("La desconexión falló o expiró, realizando recuperación por cierre forzado:", error);
        addLog("Forzando el cierre de los bloqueos huérfanos del puerto serial...", "warn");
        
        try {
          const transportWithReader = transport as unknown as { reader?: { cancel: () => Promise<void> } };
          if (port.readable?.locked && transportWithReader.reader) {
            addLog("Cancelando el lector de flujo activo...", "info");
            await transportWithReader.reader.cancel();
          }
          
          if (port.readable || port.writable) {
            addLog("Forzando el cierre del puerto serial...", "warn");
            await port.close();
            addLog("Puerto cerrado exitosamente mediante cierre forzado.", "success");
          }
        } catch (forceErr: unknown) {
          const forceErrMsg = forceErr instanceof Error ? forceErr.message : String(forceErr);
          console.error("El cierre forzado falló:", forceErr);
          addLog(`El cierre forzado del puerto falló: ${forceErrMsg}`, "error");
        }
      }
      transportRef.current = null;
    }
    esploaderRef.current = null;
  }, [addLog]);

  const disconnectDevice = useCallback(async () => {
    await cleanupTransport();
    setChip(null);
    setConnected(false);
    addLog("Dispositivo desconectado.", "info");
  }, [cleanupTransport, addLog]);

  // Evento de desconexión física del hardware
  useEffect(() => {
    if (!navigator.serial) return;

    const handleDisconnect = (event: Event) => {
      const port = (event as unknown as { port: SerialPort }).port;
      if (transportRef.current && transportRef.current.device === port) {
        addLog("El dispositivo físico fue desconectado de forma imprevista.", "warn");
        disconnectDevice();
      }
    };

    navigator.serial.addEventListener("disconnect", handleDisconnect);
    return () => {
      navigator.serial.removeEventListener("disconnect", handleDisconnect);
    };
  }, [addLog, disconnectDevice]);

  // Conexión WebSerial
  const connectDevice = useCallback(async () => {
    setConnecting(true);
    addLog("Realizando acoplamiento (handshake) con el dispositivo de la serie ESP...", "info");
    
    await cleanupTransport();

    try {
      if (!navigator.serial) {
        throw new Error("La API WebSerial no está soportada en este navegador. Por favor use Google Chrome, Edge u Opera.");
      }

      const port = await navigator.serial.requestPort({});
      const transport = new Transport(port, true);
      transportRef.current = transport;

      const espLoaderTerminal = {
        clean: () => terminalRef.current?.clear(),
        writeLine: (data: string) => {
          terminalRef.current?.write(data + "\r\n");
        },
        write: (data: string) => {
          terminalRef.current?.write(data);
        },
      };

      const loaderOptions: LoaderOptions = {
        transport,
        baudrate: parseInt(baudRate, 10),
        terminal: espLoaderTerminal,
        debugLogging: false,
      };

      const loader = new ESPLoader(loaderOptions);
      esploaderRef.current = loader;

      const detectedChip = await loader.main(beforeReset);
      setChip(detectedChip);
      setConnected(true);
      addLog(`Conectado exitosamente al puente serie de ESP en el dispositivo: ${detectedChip}`, "success");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Error de conexión: ${msg}`, "error");
      
      await cleanupTransport();
      setChip(null);
      setConnected(false);

      addLog("Asistencia de Entrada a Modo Bootloader / Descarga:", "warn");
      addLog("Si la conexión falla repetidamente, active manualmente el modo bootloader de la ROM:", "warn");
      addLog("1. Mantenga presionado el botón BOOT (GPIO0) en su placa.", "warn");
      addLog("2. Presione y suelte el botón EN / RST (Reinicio).", "warn");
      addLog("3. Suelte el botón BOOT y luego haga clic en CONECTAR DISPOSITIVO de nuevo.", "warn");
    } finally {
      setConnecting(false);
    }
  }, [baudRate, beforeReset, addLog, cleanupTransport]);

  const fetchBinary = async (path: string): Promise<Uint8Array> => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const normalizedPath = path.startsWith("/") ? path.substring(1) : path;
    const fullUrl = `${baseUrl}${normalizedPath}`;

    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar el fragmento de firmware: ${fullUrl} (${response.statusText})`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };

  const eraseFlash = useCallback(async () => {
    if (!esploaderRef.current) {
      addLog("No se puede borrar: No se encontró un dispositivo conectado.", "error");
      return;
    }

    addLog("Borrando memoria flash del dispositivo...", "warn");
    try {
      await esploaderRef.current.eraseFlash();
      addLog("¡Memoria flash borrada exitosamente!", "success");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`El borrado falló: ${msg}`, "error");
    }
  }, [addLog]);

  const resetDevice = useCallback(async () => {
    if (!transportRef.current) {
      addLog("No se puede reiniciar: No se encontró un dispositivo conectado.", "error");
      return;
    }

    addLog("Ejecutando reinicio por hardware (hard reset) mediante la secuencia de pines RTS/DTR...", "info");
    try {
      await transportRef.current.setDTR(false);
      await transportRef.current.setRTS(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await transportRef.current.setRTS(false);
      addLog("Reinicio por hardware completado de forma exitosa.", "success");
      
      // Al reiniciar por hardware, el chip sale del modo de flasheo (stub) y ejecuta su firmware normal.
      // Debemos limpiar el transporte y actualizar el estado a desconectado.
      await cleanupTransport();
      setChip(null);
      setConnected(false);
      addLog("El dispositivo se ha desconectado de la sesión de flasheo para permitir la ejecución de su firmware normal.", "info");
      addLog("Para volver a flashear, haga clic en 'CONECTAR DISPOSITIVO' nuevamente.", "info");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`El reinicio falló: ${msg}`, "error");
    }
  }, [cleanupTransport, addLog]);

  const enterBootloaderDevice = useCallback(async () => {
    if (!transportRef.current) {
      addLog("No se puede entrar al bootloader: No se encontró un dispositivo conectado.", "error");
      return;
    }

    addLog("Ejecutando secuencia programática de entrada al Bootloader (conmutación RTS/DTR por transistor)...", "info");
    try {
      await transportRef.current.setDTR(true);
      await transportRef.current.setRTS(true);
      await new Promise((resolve) => setTimeout(resolve, 150));

      await transportRef.current.setRTS(false);
      await new Promise((resolve) => setTimeout(resolve, 50));

      await transportRef.current.setDTR(false);

      addLog("Se forzó exitosamente el chip al modo de descarga / Bootloader Serial de la ROM.", "success");
      
      // Al forzar el modo bootloader, el chip se reinicia a su velocidad inicial de 115200 baudios.
      // Dado que la sesión de flasheo actual estaba configurada a una velocidad mayor (ej. 460800 baudios)
      // y con el software de stub en memoria, la conexión anterior queda desincronizada.
      // Se debe limpiar el transporte y desconectar la UI para forzar un nuevo handshake de conexión.
      await cleanupTransport();
      setChip(null);
      setConnected(false);
      addLog("Conexión desincronizada intencionalmente para actualizar velocidad. Por favor, haga clic en 'CONECTAR DISPOSITIVO' para iniciar un nuevo proceso de flasheo con el chip ya en modo descarga.", "warn");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Error al entrar programáticamente al modo boot: ${msg}`, "error");
    }
  }, [cleanupTransport, addLog]);

  const addCustomFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        const u8 = new Uint8Array(e.target.result);
        const sizeKB = Math.round(u8.length / 1024);
        const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
        const newFile: CustomFile = {
          id: `custom_${Date.now()}`,
          name: file.name,
          data: u8,
          offset: "0x1000",
          sizeText,
        };
        setCustomFiles((prev) => [...prev, newFile]);
        setSelectedFiles((prev) => ({ ...prev, [newFile.id]: true }));
        addLog(`Archivo personalizado agregado: ${file.name} (${sizeText})`, "success");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [addLog]);

  const removeCustomFile = useCallback((id: string) => {
    setCustomFiles((prev) => prev.filter((f) => f.id !== id));
    addLog("Archivo personalizado eliminado.", "info");
  }, [addLog]);

  const flashFirmware = useCallback(async () => {
    if (!esploaderRef.current) {
      addLog("No se puede flashear: No se encontró un dispositivo conectado.", "error");
      return;
    }

    setIsFlashing(true);
    setProgress(0);
    addLog("Iniciando secuencia de flasheo...", "info");

    try {
      const fileArray: { data: Uint8Array; address: number }[] = [];

      if (singleBinaryMode) {
        addLog(`Pre-cargando binario único fusionado: ${MERGED_FIRMWARE_FILE.name}...`, "info");
        const binData = await fetchBinary(MERGED_FIRMWARE_FILE.path);
        fileArray.push({
          data: binData,
          address: parseInt(MERGED_FIRMWARE_FILE.offset, 16) || 0,
        });
      } else {
        for (const file of INITIAL_FIRMWARE_FILES) {
          if (selectedFiles[file.id]) {
            addLog(`Pre-cargando firmware: ${file.name}...`, "info");
            const binData = await fetchBinary(file.path);
            const hexOffset = fileOffsets[file.id] || file.offset;
            fileArray.push({
              data: binData,
              address: parseInt(hexOffset, 16),
            });
          }
        }

        for (const custom of customFiles) {
          if (selectedFiles[custom.id]) {
            addLog(`Pre-cargando archivo personalizado: ${custom.name}...`, "info");
            fileArray.push({
              data: custom.data,
              address: parseInt(custom.offset, 16),
            });
          }
        }
      }

      if (fileArray.length === 0) {
        throw new Error("¡No hay archivos seleccionados para el flasheo!");
      }

      if (eraseBeforeInstall) {
        addLog("Borrando sectores de la flash antes de escribir...", "warn");
      }

      const flashOptions: FlashOptions = {
        fileArray,
        eraseAll: eraseBeforeInstall,
        compress: true,
        flashMode,
        flashFreq,
        flashSize,
        reportProgress: (_: number, written: number, total: number) => {
          const percent = Math.round((written / total) * 100);
          setProgress(percent);
        },
        calculateMD5Hash: (image: Uint8Array) => {
          const latin1String = Array.from(image, (byte) => String.fromCharCode(byte)).join("");
          return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(latin1String)).toString();
        },
      };

      addLog("Escribiendo binarios en la memoria flash...", "info");
      await esploaderRef.current.writeFlash(flashOptions);
      
      await esploaderRef.current.after(afterReset, false, customResetSequence);

      addLog("¡Verificación exitosa! Secuencia de reinicio / ejecución activada.", "success");
      setProgress(100);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`El flasheo falló: ${msg}`, "error");
    } finally {
      setIsFlashing(false);
    }
  }, [selectedFiles, fileOffsets, customFiles, eraseBeforeInstall, singleBinaryMode, flashMode, flashFreq, flashSize, afterReset, customResetSequence, addLog]);

  return {
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
  };
};
export default useESPFlash;
