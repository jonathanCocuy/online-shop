import React from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop con efecto Blur (Desenfoque) */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
  
      {/* Slide Over Panel Centralizado */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl bg-black shadow-2xl z-50 transform transition-all duration-300 ease-in-out flex flex-col rounded-2xl border border-gray-800 overflow-hidden max-h-[90vh]">
        
        {/* Header con estilo Minimalista */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-900 rounded-full transition-all"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Area de Contenido con Scroll Personalizado */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </div>

      {/* Estilos para el scrollbar (opcional, añadir en tu globals.css) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </>
  );
};