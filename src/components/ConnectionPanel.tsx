import React from "react";
import { Button } from "@react-spectrum/s2/Button";
import { PORT_INFO } from "../data/mockData";

export interface ConnectionPanelProps {
  readonly connected: boolean;
  readonly connecting: boolean;
  readonly chip: string | null;
  readonly onConnect: () => Promise<void>;
  readonly onDisconnect: () => Promise<void>;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  connected,
  connecting,
  chip,
  onConnect,
  onDisconnect,
}) => {
  return (
    <section className="bg-surface-white border border-outline-variant p-md flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-surface-container pb-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Connection</h2>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-surface-container-low rounded-full">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              connected ? "bg-status-success" : "bg-status-error"
            }`}
          />
          <span className="font-label-bold text-label-bold text-secondary">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {connected ? (
          <Button
            variant="negative"
            size="XL"
            fillStyle="fill"
            onPress={onDisconnect}
            UNSAFE_className="w-full"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined" data-icon="link_off">
                link_off
              </span>
              DISCONNECT
            </span>
          </Button>
        ) : (
          <Button
            variant="accent"
            size="XL"
            fillStyle="fill"
            isPending={connecting}
            onPress={onConnect}
            UNSAFE_className="w-full"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined" data-icon="cable">
                cable
              </span>
              CONNECT DEVICE
            </span>
          </Button>
        )}
      </div>

      <div className="bg-surface-container-low p-sm border border-outline-variant rounded-sm group relative">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]" data-icon="info">
            info
          </span>
          <span className="font-label-bold text-label-bold">Port Diagnostics</span>
        </div>
        <div className="mt-2 font-code-sm text-code-sm text-secondary flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Vendor ID:</span>{" "}
            <span className="text-on-surface font-semibold">{PORT_INFO.vendorId}</span>
          </div>
          <div className="flex justify-between">
            <span>Product ID:</span>{" "}
            <span className="text-on-surface font-semibold">{PORT_INFO.productId}</span>
          </div>
          {chip && (
            <div className="flex justify-between">
              <span>Detected Chip:</span>{" "}
              <span className="text-primary font-bold">{chip}</span>
            </div>
          )}
        </div>
        {/* Tooltip Style Hint */}
        <div className="absolute -top-10 left-0 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {PORT_INFO.driverName}
        </div>
      </div>
    </section>
  );
};

export default ConnectionPanel;
