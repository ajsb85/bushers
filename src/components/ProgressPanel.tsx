import React from "react";
import { Button } from "@react-spectrum/s2/Button";
import { ProgressBar } from "@react-spectrum/s2/ProgressBar";

export interface ProgressPanelProps {
  readonly progress: number;
  readonly isFlashing: boolean;
  readonly connected: boolean;
  readonly onFlash: () => Promise<void>;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  progress,
  isFlashing,
  connected,
  onFlash,
}) => {
  return (
    <section className="bg-surface-white border border-outline-variant p-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Botón de flasheo usando Spectrum S2 Button */}
        <div className="w-full md:w-auto flex-shrink-0">
          <Button
            variant="accent"
            size="XL"
            fillStyle="fill"
            isPending={isFlashing}
            isDisabled={!connected || isFlashing}
            onPress={onFlash}
            UNSAFE_className="w-full h-14"
          >
            <span className="flex items-center justify-center gap-3 font-bold text-headline-sm uppercase select-none">
              <span className="material-symbols-outlined text-[24px]" data-icon="bolt">
                bolt
              </span>
              FLASHEAR FIRMWARE
            </span>
          </Button>
        </div>

        {/* Progreso de la Operación usando Spectrum S2 ProgressBar */}
        <div className="flex-grow w-full space-y-2">
          <ProgressBar
            label="Progreso de la Operación"
            value={progress}
            size="M"
          />
        </div>
      </div>
    </section>
  );
};

export default ProgressPanel;
