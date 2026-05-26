import React from "react";

export interface HeaderProps {
  readonly onClearLogs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearLogs }) => {
  return (
    <header className="bg-surface-bright dark:bg-surface-dim border-b border-outline-variant fixed top-0 w-full h-[56px] z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-max-width mx-auto h-full">
        <div className="flex items-center gap-4">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight uppercase">
            Bushers Flasher
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClearLogs}
            title="Clear Status Console Logs"
            className="p-2 hover:bg-surface-container-highest text-primary transition-colors rounded active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="delete_sweep">
              delete_sweep
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container-highest text-primary transition-colors rounded active:scale-95 duration-100">
            <span className="material-symbols-outlined" data-icon="usb">
              usb
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container-highest text-primary transition-colors rounded active:scale-95 duration-100">
            <span className="material-symbols-outlined" data-icon="settings">
              settings
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container-highest text-primary transition-colors rounded active:scale-95 duration-100">
            <span className="material-symbols-outlined" data-icon="help">
              help
            </span>
          </button>
          
          <div className="ml-2 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhOR4ZfKq2xduZONoJBERMwhXKpOO1yWKAp9bBu3N_bna1UA1higTz2ipTsu4ADlwdc18iXBSOO9XbIvCn8W3cHdoPpPd2LoMY2nrTsGo06ZdqpXkjp8ukTARniT0YJx1HHsXqtUrPuYJ7cvbCyfH_qezbezmV0DzXfft2kNwSKTjROJktR5Y45wFoXg_Uz2kJhUarGyt2Cq-4o_qMUR4F1rccZDLi8nYMvDUTjvBtDJn3X5BnbnljAT8D5U2rpHyTbekif3ZiFAE"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
