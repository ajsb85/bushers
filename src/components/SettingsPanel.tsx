import React from "react";
import { Picker, PickerItem } from "@react-spectrum/s2/Picker";
import { Checkbox } from "@react-spectrum/s2/Checkbox";
import { BAUD_RATES } from "../data/mockData";

export interface SettingsPanelProps {
  readonly baudRate: string;
  readonly eraseBeforeInstall: boolean;
  readonly isFlashing: boolean;
  readonly onBaudRateChange: (baud: string) => void;
  readonly onEraseBeforeInstallChange: (erase: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  baudRate,
  eraseBeforeInstall,
  isFlashing,
  onBaudRateChange,
  onEraseBeforeInstallChange,
}) => {
  return (
    <section className="bg-surface-white border border-outline-variant p-md flex flex-col gap-4">
      <h3 className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
        Flash Settings
      </h3>

      <div className="space-y-4">
        {/* Baudrate Selector using Spectrum S2 Picker */}
        <div className="flex flex-col gap-1.5">
          <Picker
            label="BAUD RATE"
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

        {/* Erase toggle using Spectrum S2 Checkbox */}
        <div className="pt-2">
          <Checkbox
            isSelected={eraseBeforeInstall}
            onChange={onEraseBeforeInstallChange}
            isDisabled={isFlashing}
          >
            <span className="font-body-md text-body-md text-on-surface select-none hover:text-primary transition-colors cursor-pointer">
              Erase flash before install
            </span>
          </Checkbox>
        </div>
      </div>
    </section>
  );
};

export default SettingsPanel;
