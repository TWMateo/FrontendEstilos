import { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    mensaje:string;
    onClose: () => void;
    onConfirm: () => void;
  }

const Modal:React.FC<ModalProps> = ({ isOpen, mensaje, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-75"></div>
          <div className="absolute md:ml-52 flex flex-col bg-whiter rounded-lg p-11 max-w-md z-50">
            <h2 className="text-lg font-semibold mb-4 dark:text-black">{mensaje}</h2>
            <div className="flex justify-between mt-5">
              <button
                onClick={onClose}
                className="bg-primary hover:bg-red-500 text-white font-semibold py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className={`bg-primary hover:bg-red-500 text-white font-semibold py-2 px-4 rounded`}
              >
                {'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
