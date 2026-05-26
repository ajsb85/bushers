import React, { useRef } from "react";
import { Checkbox } from "@react-spectrum/s2/Checkbox";
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
      // Clear input so same file can be uploaded again
      e.target.value = "";
    }
  };

  return (
    <section className="bg-surface-white border border-outline-variant overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Firmware Selection
        </h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".bin"
            className="hidden"
            disabled={isFlashing}
          />
          <button
            onClick={handleAddFilesClick}
            disabled={isFlashing || singleBinaryMode}
            className={`font-label-bold text-label-bold flex items-center gap-1 px-3 py-1.5 transition-colors rounded ${
              singleBinaryMode
                ? "text-secondary opacity-50 cursor-not-allowed"
                : "text-primary hover:bg-primary-container/20 active:scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="upload_file">
              upload_file
            </span>
            ADD FILES
          </button>
        </div>
      </div>

      {/* Firmware Files Table */}
      <div className={`overflow-x-auto transition-opacity duration-200 ${singleBinaryMode ? "opacity-40" : "opacity-100"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-12 text-center">
                #
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary">
                FILE NAME
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-32">
                OFFSET
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary text-right w-24">
                SIZE
              </th>
              <th className="px-md py-2.5 font-label-bold text-label-bold text-tertiary w-16 text-center">
                REMOVE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {/* Built-in Files */}
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
                  <input
                    type="text"
                    value={fileOffsets[file.id] || file.offset}
                    onChange={(e) => onUpdateOffset(file.id, e.target.value)}
                    disabled={isFlashing || singleBinaryMode}
                    className="font-code-sm text-code-sm border border-outline-variant rounded-sm h-8 px-2 focus:border-primary outline-none text-center w-24 bg-surface-white disabled:bg-surface-container disabled:text-secondary"
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

            {/* Custom Uploaded Files */}
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
                  <input
                    type="text"
                    value={file.offset}
                    onChange={(e) => onUpdateOffset(file.id, e.target.value)}
                    disabled={isFlashing || singleBinaryMode}
                    className="font-code-sm text-code-sm border border-primary/50 rounded-sm h-8 px-2 focus:border-primary outline-none text-center w-24 bg-surface-white disabled:bg-surface-container"
                  />
                </td>
                <td className="px-md py-3 font-code-sm text-code-sm text-right text-primary">
                  {file.sizeText}
                </td>
                <td className="px-md py-3 text-center">
                  <button
                    onClick={() => onRemoveCustomFile(file.id)}
                    disabled={isFlashing || singleBinaryMode}
                    className="text-status-error hover:text-status-error-dark p-1 rounded hover:bg-red-50 disabled:opacity-35 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="delete">
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}

            {customFiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-md py-3 text-center text-secondary text-xs italic">
                  No custom binaries added. Click "ADD FILES" to flash custom ESP32 binaries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Merged Single Binary Toggle Area */}
      <div className="m-md p-md bg-surface-container-highest border border-outline border-dashed rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-container p-2 rounded shrink-0">
            <span className="material-symbols-outlined text-on-primary-container" data-icon="merge">
              merge
            </span>
          </div>
          <div>
            <p className="font-label-bold text-label-bold text-on-surface">Single Binary Mode</p>
            <p className="text-[11px] text-on-surface-variant font-code-sm break-all">
              {MERGED_FIRMWARE_FILE.name}
            </p>
          </div>
        </div>

        {singleBinaryMode ? (
          <button
            onClick={() => onToggleSingleBinaryMode(false)}
            disabled={isFlashing}
            className="w-full sm:w-auto bg-primary text-on-primary px-4 py-1.5 font-label-bold text-label-bold rounded shadow-sm hover:bg-primary/90 transition-all"
          >
            USE MULTI-FILE
          </button>
        ) : (
          <button
            onClick={() => onToggleSingleBinaryMode(true)}
            disabled={isFlashing}
            className="w-full sm:w-auto bg-surface-white border border-outline-variant px-4 py-1.5 font-label-bold text-label-bold text-secondary hover:text-primary hover:border-primary transition-all rounded"
          >
            USE MERGED
          </button>
        )}
      </div>
    </section>
  );
};

export default FirmwareSelectionPanel;
