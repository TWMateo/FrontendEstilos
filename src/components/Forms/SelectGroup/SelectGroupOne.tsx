import React, { useEffect, useState } from 'react';
import { AlertError } from '../../Alerts/AlertError';

interface Props {
  onChange?: (valor: string) => void;
  onChangeTwo?: (
    idPregunta: number,
    idOpcion: number,
    opcion: string,
    estilo: string,
  ) => void;
  opciones: {
    mensaje: string;
    tipos: Opcion[];
  };
  opcionPorDefecto?: string;
  idPregunta?: number;
  idOpcion?: number;
  advertencia?: string;
}

type Opcion = {
  tipo: string;
  valor: string;
};

const SelectGroupOne: React.FC<Props> = ({
  onChange,
  onChangeTwo,
  opciones,
  opcionPorDefecto = '',
  idPregunta = null,
  idOpcion = null,
  advertencia
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setSelectedOption(valor);
    if (onChangeTwo && idPregunta != null && idOpcion != null) {
      onChangeTwo(idPregunta, idOpcion, '', valor);
    } else if (onChange) {
      onChange(valor);
    }
    changeTextColor();
  };
  useEffect(() => {
    // console.log(opciones)
    if (opcionPorDefecto != '') setSelectedOption(opcionPorDefecto);
  }, []);

  return (
    <div className="mb-4.5">
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <div className="flex flex-row">
          <select
            title={opcionPorDefecto == '' ? selectedOption : opcionPorDefecto}
            value={opcionPorDefecto == '' ? selectedOption : opcionPorDefecto}
            onChange={handleChange}
            className={`relative z-20 w-full bg-whiten dark:bg-black appearance-none rounded ${
              (selectedOption == ''&& advertencia=='') && 'rounded-t rounded-b-none'
            } border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
              isOptionSelected ? 'text-black dark:text-white' : ''
            }`}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              {opciones.mensaje}
            </option>
            {opciones.tipos &&
              opciones.tipos.map((item, index) => (
                <option
                  value={item.valor}
                  className="text-body dark:text-bodydark"
                  key={index}
                >
                  {item.tipo}
                </option>
              ))}
          </select>
          <span className="absolute top-6.5 right-4 z-30 -translate-y-1/2">
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill=""
                ></path>
              </g>
            </svg>
          </span>
        </div>
        {(selectedOption == '' && advertencia!='n') && (
          <AlertError mensaje="Selecciona" />
        )}
      </div>
    </div>
  );
};

export default SelectGroupOne;
