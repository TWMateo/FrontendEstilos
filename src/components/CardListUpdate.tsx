import React from 'react';

interface tipoValor {
  tipo: string;
  valor: string;
  new: boolean;
}

interface Props {
  actualizar: (valor: string) => void;
  eliminar: (valor:tipoValor) => void;
  cambiarOrden?: (valor: string, direccion: string) => void;
  valor: tipoValor;
  limite: number;
  mensaje?: string;
}

const CardListUpdate: React.FC<Props> = ({
  actualizar,
  eliminar,
  valor,
  cambiarOrden,
  mensaje = '',
  limite,
}) => {
  return (
    <li
      title={valor.tipo}
      className="flex flex-row border-[1.5px] bg-bodydark1 border-strokedark rounded-lg w-full bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      key={valor.tipo}
    >
      <div className="py-2 px-3 w-[80%] whitespace-pre-wrap sm:w-[90%]">
        {mensaje != ''
          ? mensaje
          : valor.tipo.length > limite
          ? valor.tipo.substring(0, limite) + '...'
          : valor.tipo}
      </div>
      <button
        onClick={() => {
          actualizar(valor.tipo);
        }}
        aria-label="Editar"
        className={`flex justify-center items-center w-[8%] sm:w-[5%] rounded-l-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
      >
        <svg
          className="fill-white dark:fill-bodydark1 absolute"
          width="18"
          height="18"
          viewBox="0 0 576 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
        </svg>
      </button>
      <button
        onClick={() => eliminar(valor)}
        aria-label="Borrar"
        className={`flex justify-center items-center w-[8%] sm:w-[5%] ${
          !cambiarOrden && `rounded-r-lg`
        } bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="fill-white dark:fill-bodydark1 absolute"
          width="18"
          height="18"
          viewBox="0 0 576 512"
        >
          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
        </svg>
      </button>
      {cambiarOrden && (
        <div className="w-[8%]">
          <div
            className="flex justify-center h-[50%] items-center rounded-tr-lg rounded-b-none bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            onClick={() => cambiarOrden(valor.tipo, 'arriba')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current absolute"
              width="18"
              height="18"
              viewBox="0 0 320 512"
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          </div>
          <div
            className="flex justify-center h-[50%] items-center rounded-r-lg rounded-t-none bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            onClick={() => cambiarOrden(valor.tipo, 'abajo')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current absolute"
              width="18"
              height="18"
              viewBox="0 0 320 512"
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>
        </div>
      )}
    </li>
  );
};

export default CardListUpdate;
