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
  // No bloqueamos el scroll del body para mantener visible el contenido de fondo

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - no bloquea clicks para mantener la vista */}
      <div
        className="fixed inset-0 z-40 bg-black/80 transition-opacity duration-300 pointer-events-none"
      />
  
      {/* Slide Over Panel */}
      <div className="fixed top-0 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/4 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out pointer-events-auto h-[700px] flex justify-center items-center rounded-lg">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};