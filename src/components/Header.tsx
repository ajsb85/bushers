import React from "react";
import { ActionButton } from "@react-spectrum/s2/ActionButton";

export interface HeaderProps {
  readonly onClearLogs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearLogs }) => {
  const baseUrl = import.meta.env.BASE_URL || "/";

  return (
    <header className="bg-surface-bright dark:bg-surface-dim border-b border-outline-variant fixed top-0 w-full h-[56px] z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-max-width mx-auto h-full">
        {/* Lado Izquierdo: Logo Corporativo Bushers + Nombre */}
        <div className="flex items-center gap-3">
          <img 
            src={`${baseUrl}bushers 1.svg`} 
            alt="Logo Corporativo Bushers" 
            className="h-9 object-contain rounded-sm"
          />
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight uppercase hidden sm:inline">
            Flasheador
          </span>
        </div>

        {/* Lado Derecho: Acciones rápidas + Icono de la Aplicación */}
        <div className="flex items-center gap-2">
          <ActionButton 
            onPress={onClearLogs}
            aria-label="Limpiar registros de la consola de estado"
            isQuiet
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="delete_sweep">
              delete_sweep
            </span>
          </ActionButton>
          <ActionButton aria-label="Dispositivos USB" isQuiet>
            <span className="material-symbols-outlined" data-icon="usb">
              usb
            </span>
          </ActionButton>
          <ActionButton aria-label="Configuración" isQuiet>
            <span className="material-symbols-outlined" data-icon="settings">
              settings
            </span>
          </ActionButton>
          <ActionButton aria-label="Ayuda y documentación" isQuiet>
            <span className="material-symbols-outlined" data-icon="help">
              help
            </span>
          </ActionButton>
          
          {/* Reemplazo del Avatar por el Icono de la Aplicación en formato Cuadrado */}
          <div className="ml-2 w-8 h-8 rounded-sm bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
            <img 
              alt="Icono de la Aplicación" 
              className="w-full h-full object-cover" 
              src={`${baseUrl}Bushers Adaptive logo 1.svg`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
