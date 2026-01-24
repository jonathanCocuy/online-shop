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

  // Función para manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Solo cierra si el click es directamente en el backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop - ahora captura clicks y previene interacción con elementos debajo */}
      <div
        className="fixed inset-0 z-40 bg-black/80 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
  
      {/* Slide Over Panel */}
      <div className="fixed top-25 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out h-auto flex justify-center items-center rounded-lg">
        <div className="flex flex-col w-full h-full">
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