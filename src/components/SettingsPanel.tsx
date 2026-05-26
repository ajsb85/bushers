import React from "react";
import { Picker, PickerItem } from "@react-spectrum/s2/Picker";
import { Checkbox } from "@react-spectrum/s2/Checkbox";
import { TextField } from "@react-spectrum/s2/TextField";
import { validateCustomResetStringSequence } from "esptool-js";
import { BAUD_RATES } from "../data/mockData";

export interface SettingsPanelProps {
  readonly baudRate: string;
  readonly eraseBeforeInstall: boolean;
  readonly isFlashing: boolean;
  readonly beforeReset: "default_reset" | "usb_reset" | "no_reset";
  readonly afterReset: "hard_reset" | "soft_reset" | "no_reset_stub" | "custom_reset" | "no_reset";
  readonly flashMode: "keep" | "dio" | "qio" | "dout" | "qout";
  readonly flashFreq: "keep" | "80m" | "60m" | "48m" | "40m" | "30m" | "26m" | "24m" | "20m" | "16m" | "15m" | "12m";
  readonly flashSize: "keep" | "detect" | "256KB" | "512KB" | "1MB" | "2MB" | "2MB-c1" | "4MB" | "4MB-c1" | "8MB" | "16MB" | "32MB" | "64MB" | "128MB";
  readonly customResetSequence: string;
  readonly onBaudRateChange: (baud: string) => void;
  readonly onEraseBeforeInstallChange: (erase: boolean) => void;
  readonly onBeforeResetChange: (mode: "default_reset" | "usb_reset" | "no_reset") => void;
  readonly onAfterResetChange: (mode: "hard_reset" | "soft_reset" | "no_reset_stub" | "custom_reset" | "no_reset") => void;
  readonly onFlashModeChange: (mode: "keep" | "dio" | "qio" | "dout" | "qout") => void;
  readonly onFlashFreqChange: (freq: "keep" | "80m" | "60m" | "48m" | "40m" | "30m" | "26m" | "24m" | "20m" | "16m" | "15m" | "12m") => void;
  readonly onFlashSizeChange: (size: "keep" | "detect" | "256KB" | "512KB" | "1MB" | "2MB" | "2MB-c1" | "4MB" | "4MB-c1" | "8MB" | "16MB" | "32MB" | "64MB" | "128MB") => void;
  readonly onCustomResetSequenceChange: (seq: string) => void;
}

const BEFORE_RESET_MODES = [
  { id: "default_reset", label: "Reinicio Clásico por Defecto" },
  { id: "usb_reset", label: "Reinicio Serie por USB JTAG" },
  { id: "no_reset", label: "Sin Reinicio (Manual)" },
] as const;

const AFTER_RESET_MODES = [
  { id: "hard_reset", label: "Reinicio Físico (Ejecutar)" },
  { id: "soft_reset", label: "Reinicio Lógico (Tibio)" },
  { id: "no_reset_stub", label: "Permanecer en el Stub de Flasheo" },
  { id: "custom_reset", label: "Secuencia Personalizada" },
  { id: "no_reset", label: "Sin Reinicio" },
] as const;

const FLASH_MODES = [
  { id: "keep", label: "Mantener (Recomendado)" },
  { id: "dio", label: "Entrada/Salida Dual (DIO)" },
  { id: "qio", label: "Entrada/Salida Cuádruple (QIO)" },
  { id: "dout", label: "Salida Dual (DOUT)" },
  { id: "qout", label: "Salida Cuádruple (QOUT)" },
] as const;

const FLASH_FREQS = [
  { id: "keep", label: "Mantener (Recomendado)" },
  { id: "80m", label: "80 MHz" },
  { id: "60m", label: "60 MHz" },
  { id: "48m", label: "48 MHz" },
  { id: "40m", label: "40 MHz" },
  { id: "30m", label: "30 MHz" },
  { id: "26m", label: "26 MHz" },
  { id: "24m", label: "24 MHz" },
  { id: "20m", label: "20 MHz" },
  { id: "16m", label: "16 MHz" },
  { id: "15m", label: "15 MHz" },
  { id: "12m", label: "12 MHz" },
] as const;

const FLASH_SIZES = [
  { id: "keep", label: "Mantener (Recomendado)" },
  { id: "detect", label: "Auto Detectar" },
  { id: "256KB", label: "256 KB" },
  { id: "512KB", label: "512 KB" },
  { id: "1MB", label: "1 MB" },
  { id: "2MB", label: "2 MB" },
  { id: "2MB-c1", label: "2 MB (c1)" },
  { id: "4MB", label: "4 MB" },
  { id: "4MB-c1", label: "4 MB (c1)" },
  { id: "8MB", label: "8 MB" },
  { id: "16MB", label: "16 MB" },
  { id: "32MB", label: "32 MB" },
  { id: "64MB", label: "64 MB" },
  { id: "128MB", label: "128 MB" },
] as const;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  baudRate,
  eraseBeforeInstall,
  isFlashing,
  beforeReset,
  afterReset,
  flashMode,
  flashFreq,
  flashSize,
  customResetSequence,
  onBaudRateChange,
  onEraseBeforeInstallChange,
  onBeforeResetChange,
  onAfterResetChange,
  onFlashModeChange,
  onFlashFreqChange,
  onFlashSizeChange,
  onCustomResetSequenceChange,
}) => {
  const isSequenceValid = validateCustomResetStringSequence(customResetSequence);

  return (
    <section className="bg-surface-white border border-outline-variant p-md flex flex-col gap-4">
      <h3 className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
        Ajustes de Flasheo y Conf. de Hardware
      </h3>

      <div className="space-y-4">
        {/* Selector de velocidad usando Spectrum S2 Picker */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="VELOCIDAD DE BAUDIOS (BAUD RATE)"
            selectedKey={baudRate}
            onSelectionChange={(key) => onBaudRateChange(key as string)}
            isDisabled={isFlashing}
            size="M"
          >
            {BAUD_RATES.map((rate) => (
              <PickerItem id={rate.id} key={rate.id}>
                {rate.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Reinicio Antes de Flashear */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="REINICIO ANTES DEL FLASHEO"
            selectedKey={beforeReset}
            onSelectionChange={(key) => onBeforeResetChange(key as SettingsPanelProps["beforeReset"])}
            isDisabled={isFlashing}
            size="M"
          >
            {BEFORE_RESET_MODES.map((mode) => (
              <PickerItem id={mode.id} key={mode.id}>
                {mode.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Reinicio Después de Flashear */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="REINICIO DESPUÉS DEL FLASHEO"
            selectedKey={afterReset}
            onSelectionChange={(key) => onAfterResetChange(key as SettingsPanelProps["afterReset"])}
            isDisabled={isFlashing}
            size="M"
          >
            {AFTER_RESET_MODES.map((mode) => (
              <PickerItem id={mode.id} key={mode.id}>
                {mode.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Secuencia Personalizada */}
        {afterReset === "custom_reset" && (
          <div className="flex flex-col gap-1.5 p-sm bg-surface-container-low border border-outline-variant rounded-sm">
            <TextField
              label="SECUENCIA DE REINICIO PERSONALIZADA"
              value={customResetSequence}
              onChange={onCustomResetSequenceChange}
              isDisabled={isFlashing}
              size="M"
              UNSAFE_className="w-full font-code-sm text-code-sm"
              errorMessage={!isSequenceValid ? "Secuencia de comandos no válida" : undefined}
              isInvalid={!isSequenceValid}
            />
            <div className="text-[10px] text-secondary leading-normal">
              Formato: Comandos separados por |.<br />
              D=activar DTR (1/0), R=activar RTS (1/0), W=Esperar (ms).<br />
              Ej: <code className="font-mono text-primary bg-surface-container px-1 py-0.5">D0|R1|W100|D1|R0|W50|D0</code>
            </div>
          </div>
        )}

        {/* Modo SPI de la Flash */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="MODO SPI DE LA FLASH"
            selectedKey={flashMode}
            onSelectionChange={(key) => onFlashModeChange(key as SettingsPanelProps["flashMode"])}
            isDisabled={isFlashing}
            size="M"
          >
            {FLASH_MODES.map((mode) => (
              <PickerItem id={mode.id} key={mode.id}>
                {mode.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Frecuencia de la Flash */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="FRECUENCIA DE LA FLASH"
            selectedKey={flashFreq}
            onSelectionChange={(key) => onFlashFreqChange(key as SettingsPanelProps["flashFreq"])}
            isDisabled={isFlashing}
            size="M"
          >
            {FLASH_FREQS.map((freq) => (
              <PickerItem id={freq.id} key={freq.id}>
                {freq.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Tamaño de Memoria Flash */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="TAMAÑO DE LA MEMORIA FLASH"
            selectedKey={flashSize}
            onSelectionChange={(key) => onFlashSizeChange(key as SettingsPanelProps["flashSize"])}
            isDisabled={isFlashing}
            size="M"
          >
            {FLASH_SIZES.map((size) => (
              <PickerItem id={size.id} key={size.id}>
                {size.label}
              </PickerItem>
            ))}
          </Picker>
        </div>

        {/* Checkbox de borrado antes de instalar */}
        <div className="pt-2">
          <Checkbox
            isSelected={eraseBeforeInstall}
            onChange={onEraseBeforeInstallChange}
            isDisabled={isFlashing}
          >
            <span className="font-body-md text-body-md text-on-surface select-none hover:text-primary transition-colors cursor-pointer">
              Borrar memoria flash antes de flashear
            </span>
          </Checkbox>
        </div>
      </div>
    </section>
  );
};

export default SettingsPanel;
