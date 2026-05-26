import { useState, useCallback, useRef } from "react";
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
  
  // File selection state
  const [selectedFiles, setSelectedFiles] = useState<{ readonly [id: string]: boolean }>({
    app: true,
    partitions: true,
    bootloader: true,
    boot_app: true,
  });

  // Offsets overrides state
  const [fileOffsets, setFileOffsets] = useState<{ readonly [id: string]: string }>({
    app: "0x10000",
    partitions: "0x8000",
    bootloader: "0x1000",
    boot_app: "0xe000",
  });

  const [customFiles, setCustomFiles] = useState<readonly CustomFile[]>([]);

  // Refs for low-level objects to preserve references across renders
  const transportRef = useRef<Transport | null>(null);
  const esploaderRef = useRef<ESPLoader | null>(null);

  // Helper to append status logs to xterm.js terminal
  const addLog = useCallback((text: string, type: "default" | "info" | "warn" | "success" | "error" = "default") => {
    if (terminalRef.current) {
      let colorPrefix = "";
      const colorSuffix = "\x1b[0m";
      switch (type) {
        case "info":
          colorPrefix = "\x1b[36m"; // Cyan
          break;
        case "warn":
          colorPrefix = "\x1b[33m"; // Yellow
          break;
        case "success":
          colorPrefix = "\x1b[32m"; // Green
          break;
        case "error":
          colorPrefix = "\x1b[31m"; // Red
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

  // WebSerial handshaking
  const connectDevice = useCallback(async () => {
    setConnecting(true);
    addLog("Handshaking with ESP32 device...", "info");
    try {
      if (!navigator.serial) {
        throw new Error("WebSerial API is not supported in this browser. Please use Google Chrome, Edge, or Opera.");
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

      const detectedChip = await loader.main();
      setChip(detectedChip);
      setConnected(true);
      addLog(`Connected to ESP Serial Bridge on device: ${detectedChip}`, "success");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Connection error: ${msg}`, "error");
    } finally {
      setConnecting(false);
    }
  }, [baudRate, addLog]);

  const disconnectDevice = useCallback(async () => {
    if (transportRef.current) {
      try {
        await transportRef.current.disconnect();
      } catch (error) {
        console.error(error);
      }
      transportRef.current = null;
    }
    esploaderRef.current = null;
    setChip(null);
    setConnected(false);
    addLog("Device disconnected", "info");
  }, [addLog]);

  // Utility to fetch binary from server public directory
  const fetchBinary = async (path: string): Promise<Uint8Array> => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load firmware chunk: ${path} (${response.statusText})`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };

  // Erase flash memory
  const eraseFlash = useCallback(async () => {
    if (!esploaderRef.current) {
      addLog("Cannot erase: No connected device found.", "error");
      return;
    }

    addLog("Erasing flash memory...", "warn");
    try {
      await esploaderRef.current.eraseFlash();
      addLog("Flash memory erased successfully!", "success");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Erase failed: ${msg}`, "error");
    }
  }, [addLog]);

  // Reset device
  const resetDevice = useCallback(async () => {
    if (!transportRef.current) {
      addLog("Cannot reset: No connected device found.", "error");
      return;
    }

    addLog("Resetting device...", "info");
    try {
      await transportRef.current.setDTR(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await transportRef.current.setDTR(true);
      addLog("Device reset complete.", "success");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Reset failed: ${msg}`, "error");
    }
  }, [addLog]);

  // Add custom firmware file upload
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
        addLog(`Added custom file: ${file.name} (${sizeText})`, "success");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [addLog]);

  const removeCustomFile = useCallback((id: string) => {
    setCustomFiles((prev) => prev.filter((f) => f.id !== id));
    addLog("Custom file removed.", "info");
  }, [addLog]);

  // Main firmware flasher execution
  const flashFirmware = useCallback(async () => {
    if (!esploaderRef.current) {
      addLog("Cannot flash: No connected device found.", "error");
      return;
    }

    setIsFlashing(true);
    setProgress(0);
    addLog("Starting flash sequence...", "info");

    try {
      const fileArray: { data: Uint8Array; address: number }[] = [];

      if (singleBinaryMode) {
        addLog(`Preloading single merged binary: ${MERGED_FIRMWARE_FILE.name}...`, "info");
        const binData = await fetchBinary(MERGED_FIRMWARE_FILE.path);
        fileArray.push({
          data: binData,
          address: parseInt(MERGED_FIRMWARE_FILE.offset, 16) || 0,
        });
      } else {
        // Built-in files
        for (const file of INITIAL_FIRMWARE_FILES) {
          if (selectedFiles[file.id]) {
            addLog(`Preloading firmware: ${file.name}...`, "info");
            const binData = await fetchBinary(file.path);
            const hexOffset = fileOffsets[file.id] || file.offset;
            fileArray.push({
              data: binData,
              address: parseInt(hexOffset, 16),
            });
          }
        }

        // Custom uploaded files
        for (const custom of customFiles) {
          if (selectedFiles[custom.id]) {
            addLog(`Preloading custom file: ${custom.name}...`, "info");
            fileArray.push({
              data: custom.data,
              address: parseInt(custom.offset, 16),
            });
          }
        }
      }

      if (fileArray.length === 0) {
        throw new Error("No files selected for flashing!");
      }

      // 1. Erase all if selected
      if (eraseBeforeInstall) {
        addLog("Erasing flash sectors before writing...", "warn");
        // Handled internally in esploader via writeFlash eraseAll option
      }

      // 2. Perform write
      const flashOptions: FlashOptions = {
        fileArray,
        eraseAll: eraseBeforeInstall,
        compress: true,
        flashMode: "keep",
        flashFreq: "keep",
        flashSize: "keep",
        reportProgress: (_: number, written: number, total: number) => {
          const percent = Math.round((written / total) * 100);
          setProgress(percent);
        },
        calculateMD5Hash: (image: Uint8Array) => {
          const latin1String = Array.from(image, (byte) => String.fromCharCode(byte)).join("");
          return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(latin1String)).toString();
        },
      };

      addLog("Writing binaries to flash...", "info");
      await esploaderRef.current.writeFlash(flashOptions);
      await esploaderRef.current.after();

      addLog("Verification successful! ESP32 resetting...", "success");
      setProgress(100);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`Flash failed: ${msg}`, "error");
    } finally {
      setIsFlashing(false);
    }
  }, [selectedFiles, fileOffsets, customFiles, eraseBeforeInstall, singleBinaryMode, addLog]);

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
  };
};
export default useESPFlash;
