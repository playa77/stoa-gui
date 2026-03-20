import React, { useEffect } from "react";
import { X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, title, children, className }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-lg border border-border bg-bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-border text-text-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
