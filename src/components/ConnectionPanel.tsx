import React from "react";
import { Button } from "@react-spectrum/s2/Button";
import { StatusLight } from "@react-spectrum/s2/StatusLight";
import { Heading } from "@react-spectrum/s2/Heading";
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
        <Heading level={2} UNSAFE_className="m-0 font-headline-sm text-headline-sm text-on-surface">Conectividad</Heading>
        <StatusLight variant={connected ? "positive" : "negative"} size="M">
          {connected ? "Conectado" : "Desconectado"}
        </StatusLight>
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
              DESCONECTAR
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
              CONECTAR DISPOSITIVO
            </span>
          </Button>
        )}
      </div>

      {/* Diagnóstico del Puerto */}
      <div className="bg-surface-container-low p-sm border border-outline-variant rounded-sm group relative">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]" data-icon="info">
            info
          </span>
          <span className="font-label-bold text-label-bold">Diagnóstico del Puerto</span>
        </div>
        <div className="mt-2 font-code-sm text-code-sm text-secondary flex flex-col gap-1">
          <div className="flex justify-between">
            <span>ID de Fabricante:</span>{" "}
            <span className="text-on-surface font-semibold">{PORT_INFO.vendorId}</span>
          </div>
          <div className="flex justify-between">
            <span>ID de Producto:</span>{" "}
            <span className="text-on-surface font-semibold">{PORT_INFO.productId}</span>
          </div>
          {chip && (
            <div className="flex justify-between">
              <span>Chip Detectado:</span>{" "}
              <span className="text-primary font-bold">{chip}</span>
            </div>
          )}
        </div>
        {/* Tooltip de Driver */}
        <div className="absolute -top-10 left-0 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {PORT_INFO.driverName}
        </div>
      </div>

      {/* Acordeón de Guía de Bootloader Manual */}
      <div className="bg-surface-container-low p-sm border border-outline-variant rounded-sm">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none text-on-surface-variant hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" data-icon="help_center">
                help_center
              </span>
              <span className="font-label-bold text-label-bold">Guía de Bootloader Manual</span>
            </div>
            <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-open:rotate-180" data-icon="expand_more">
              expand_more
            </span>
          </summary>
          <div className="mt-2 text-xs text-secondary leading-relaxed space-y-1.5 pt-2 border-t border-outline-variant/50">
            <p>Si el acoplamiento automático (auto-reset) falla, fuerce el chip al modo bootloader de la ROM manualmente:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Mantenga presionado el botón <strong>BOOT (GPIO0)</strong> en su placa.</li>
              <li>Presione y suelte el botón <strong>EN / RST (Reinicio)</strong>.</li>
              <li>Suelte el botón <strong>BOOT</strong>.</li>
              <li>Haga clic en <strong>CONECTAR DISPOSITIVO</strong> nuevamente.</li>
            </ol>
            <p className="text-[10px] text-primary font-semibold pt-1">Útil para placas que carecen o tienen circuitos de auto-reinicio DTR/RTS deficientes.</p>
          </div>
        </details>
      </div>
    </section>
  );
};

export default ConnectionPanel;
