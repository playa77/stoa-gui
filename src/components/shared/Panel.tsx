import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  position: "right" | "bottom";
  open: boolean;
  onClose: () => void;
  title?: string;
}

const Panel = ({ position, open, onClose, title, children, className, ...props }: PanelProps) => {
  const panelClasses = {
    right: "inset-y-0 right-0 h-full w-[400px] border-l",
    bottom: "inset-x-0 bottom-0 w-full h-[240px] border-t",
  };

  const transitionClasses = {
    right: open ? "translate-x-0" : "translate-x-full",
    bottom: open ? "translate-y-0" : "translate-y-full",
  };

  return (
    <>
      {/* Backdrop */}
      {open && position === "right" && (
        <div 
          className="fixed inset-0 z-40 bg-black/20" 
          onClick={onClose} 
        />
      )}

      <div
        className={cn(
          "fixed z-50 bg-bg-elevated border-border transition-transform duration-150 ease-in-out shadow-2xl overflow-hidden flex flex-col",
          panelClasses[position],
          transitionClasses[position],
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border p-4 h-[48px]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-border text-text-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
};

export { Panel };
