import React from 'react';

interface Props {
  titulo?: string;
  mensaje: string;
}

export const AlertLoading: React.FC<Props> = ({ titulo = null, mensaje }) => {
  return (
    <div className="flex w-full border-l-6 gap-5 border-b-[1.5px] border-[#dcddd4] px-3 py-4 mb-3 rounded-b-lg shadow-md bg-primary dark:bg-black md:p-4">
      <div className="w-full flex items-center">
        <h5 className="mb-3 text-lg font-semibold text-white dark:text-[#c3c4c0] ">
          {titulo}
        </h5>
        <p className="text-base leading-relaxed text-body">{mensaje}</p>
      </div>
      <div className="flex items-center justify-center rounded-md">
        <div className="h-13 w-13 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
      </div>
    </div>
  );
};
