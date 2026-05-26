import React, { useRef } from "react";
import { Checkbox } from "@react-spectrum/s2/Checkbox";
import { TextField } from "@react-spectrum/s2/TextField";
import { Heading } from "@react-spectrum/s2/Heading";
import { Button } from "@react-spectrum/s2/Button";
import { ActionButton } from "@react-spectrum/s2/ActionButton";
import { INITIAL_FIRMWARE_FILES, MERGED_FIRMWARE_FILE } from "../data/mockData";
import type { CustomFile } from "../hooks/useESPFlash";

export interface FirmwareSelectionPanelProps {
  readonly selectedFiles: { readonly [id: string]: boolean };
  readonly fileOffsets: { readonly [id: string]: string };
  readonly customFiles: readonly CustomFile[];
  readonly singleBinaryMode: boolean;
  readonly isFlashing: boolean;
  readonly onToggleSelection: (id: string) => void;
  readonly onUpdateOffset: (id: string, offset: string) => void;
  readonly onAddCustomFile: (file: File) => void;
  readonly onRemoveCustomFile: (id: string) => void;
  readonly onToggleSingleBinaryMode: (mode: boolean) => void;
}

export const FirmwareSelectionPanel: React.FC<FirmwareSelectionPanelProps> = ({
  selectedFiles,
  fileOffsets,
  customFiles,
  singleBinaryMode,
  isFlashing,
  onToggleSelection,
  onUpdateOffset,
  onAddCustomFile,
  onRemoveCustomFile,
  onToggleSingleBinaryMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddCustomFile(file);
      e.target.value = "";
    }
  };

  return (
    <section className="bg-surface-white border border-outline-variant overflow-hidden flex flex-col rounded-sm shadow-xs">
      {/* Encabezado del Panel */}
      <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
        <Heading level={2} UNSAFE_className="m-0 font-headline-sm text-headline-sm text-on-surface">
          Selección de Firmware
        </Heading>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".bin"
            className="hidden"
            disabled={isFlashing}
          />
          <Button
            variant="primary"
            fillStyle="outline"
            size="S"
            isDisabled={isFlashing || singleBinaryMode}
            onPress={handleAddFilesClick}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]" data-icon="upload_file">
                upload_file
              </span>
              AGREGAR ARCHIVOS
            </span>
          </Button>
        </div>
      </div>

      {/* Tabla de Archivos de Firmware */}
      <div className={`overflow-x-auto transition-opacity duration-200 ${singleBinaryMode ? "opacity-40" : "opacity-100"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-12 text-center">
                #
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary">
                NOMBRE DEL ARCHIVO
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-32">
                DIRECCIÓN (OFFSET)
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary text-right w-24">
                TAMAÑO
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-16 text-center">
                ELIMINAR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {/* Archivos Iniciales por Defecto */}
            {INITIAL_FIRMWARE_FILES.map((file) => (
              <tr key={file.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-md py-3 text-center">
                  <Checkbox
                    isSelected={!singleBinaryMode && !!selectedFiles[file.id]}
                    onChange={() => !singleBinaryMode && onToggleSelection(file.id)}
                    isDisabled={isFlashing || singleBinaryMode}
                  />
                </td>
                <td className="px-md py-3 font-code-sm text-code-sm text-on-surface truncate max-w-xs">
                  {file.name}
                </td>
                <td className="px-md py-3">
                  <TextField
                    aria-label="Dirección de Offset"
                    value={fileOffsets[file.id] || file.offset}
                    onChange={(val) => onUpdateOffset(file.id, val)}
                    isDisabled={isFlashing || singleBinaryMode}
                    size="S"
                    UNSAFE_className="w-24 text-center font-code-sm text-code-sm"
                  />
                </td>
                <td className="px-md py-3 font-code-sm text-code-sm text-right text-secondary">
                  {file.sizeText}
                </td>
                <td className="px-md py-3 text-center text-secondary opacity-30">
                  <span className="material-symbols-outlined text-[16px]" data-icon="lock">
                    lock
                  </span>
                </td>
              </tr>
            ))}

            {/* Archivos Cargados Personalizados */}
            {customFiles.map((file) => (
              <tr key={file.id} className="hover:bg-surface-container-low transition-colors group bg-primary/5">
                <td className="px-md py-3 text-center">
                  <Checkbox
                    isSelected={!singleBinaryMode && !!selectedFiles[file.id]}
                    onChange={() => !singleBinaryMode && onToggleSelection(file.id)}
                    isDisabled={isFlashing || singleBinaryMode}
                  />
                </td>
                <td className="px-md py-3 font-code-sm text-code-sm text-primary font-medium truncate max-w-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary" data-icon="file_present">
                    file_present
                  </span>
                  {file.name}
                </td>
                <td className="px-md py-3">
                  <TextField
                    aria-label="Dirección de Offset"
                    value={file.offset}
                    onChange={(val) => onUpdateOffset(file.id, val)}
                    isDisabled={isFlashing || singleBinaryMode}
                    size="S"
                    UNSAFE_className="w-24 text-center font-code-sm text-code-sm"
                  />
                </td>
                <td className="px-md py-3 font-code-sm text-code-sm text-right text-primary">
                  {file.sizeText}
                </td>
                <td className="px-md py-3 text-center">
                  <ActionButton
                    onPress={() => onRemoveCustomFile(file.id)}
                    isDisabled={isFlashing || singleBinaryMode}
                    isQuiet
                    aria-label="Eliminar archivo personalizado"
                  >
                    <span className="material-symbols-outlined text-[18px] text-status-error" data-icon="delete">
                      delete
                    </span>
                  </ActionButton>
                </td>
              </tr>
            ))}

            {customFiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-md py-3 text-center text-secondary text-xs italic">
                  No se han agregado binarios personalizados. Haga clic en "AGREGAR ARCHIVOS" para flashear binarios de ESP32 personalizados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selector de Modo de Binario Único Fusionado */}
      <div className="m-md mt-0 p-md bg-surface-container-highest border border-outline border-dashed rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-container p-2 rounded shrink-0">
            <span className="material-symbols-outlined text-on-primary-container" data-icon="merge">
              merge
            </span>
          </div>
          <div>
            <p className="font-label-bold text-label-bold text-on-surface">Modo de Binario Único</p>
            <p className="text-[11px] text-on-surface-variant font-code-sm break-all">
              {MERGED_FIRMWARE_FILE.name}
            </p>
          </div>
        </div>

        {singleBinaryMode ? (
          <Button
            variant="primary"
            fillStyle="fill"
            size="S"
            isDisabled={isFlashing}
            onPress={() => onToggleSingleBinaryMode(false)}
            UNSAFE_className="w-full sm:w-auto"
          >
            USAR MULTI-ARCHIVO
          </Button>
        ) : (
          <Button
            variant="secondary"
            fillStyle="outline"
            size="S"
            isDisabled={isFlashing}
            onPress={() => onToggleSingleBinaryMode(true)}
            UNSAFE_className="w-full sm:w-auto"
          >
            USAR BINARIO FUSIONADO
          </Button>
        )}
      </div>
    </section>
  );
};

export default FirmwareSelectionPanel;
