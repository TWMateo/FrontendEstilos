import React, { HtmlHTMLAttributes, useEffect, useState } from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';
import { AlertError } from '../Alerts/AlertError';
import { parsePath } from 'react-router-dom';

interface Opcion {
  id: number;
  opcion: string;
  estilo: string;
}

interface Pregunta {
  id: number;
  orden: number;
  pregunta: string;
  tipoPregunta: string;
  opciones: Opcion[];
  escalas?: string[];
  min: number;
  max: number;
}

interface Props {
  //   tiposEstilosAprendizaje: { mensaje: string; tipos: string[] };
  pregunta: Pregunta;
  indice:number;
  //   onUpdatePregunta: (idPregunta: number, pregunta: string) => void;
  //   onUpdateOpcion: (
  //     idPregunta: number,
  //     idOpcion: number,
  //     opcion: string,
  //     estilo?: string,
  //   ) => void;
  //   onDeleteOpcion: (idPregunta: number, idOpcion: number) => void;
  //   onDeletePregunta: (idPregunta: number) => void;
  //   onAddOpcion: (idPregunta: number) => void;
  //   onUpdateLimiteRespuesta: (
  //     idPregunta: number,
  //     indicador: string,
  //     valor: number,
  //   ) => void;
}

const MultiChoiceResponse: React.FC<Props> = ({ pregunta, indice }) => {

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (opcion: string) => {
    let updatedOptions;
    
    if (selectedOptions.includes(opcion)) {
      updatedOptions = selectedOptions.filter((item) => item !== opcion);
    } else {
      if (pregunta.max != 0 && selectedOptions.length < pregunta.max) {
        updatedOptions = [...selectedOptions, opcion];
      } else if (pregunta.min != 0 && selectedOptions.length < pregunta.min) {
        updatedOptions = [...selectedOptions, opcion];
      } else {
        updatedOptions = selectedOptions;
        setError(`Solo puedes seleccionar hasta ${pregunta.max} opciones.`);
        return;
      }
    }

    setSelectedOptions(updatedOptions);
    setError(null);
  };

  useEffect(() => {
    console.log(indice)
    console.log(selectedOptions);
  }, [selectedOptions]);

  const handleFormSubmit = () => {
    if (selectedOptions.length < pregunta.min) {
      setError(`Debes seleccionar al menos ${pregunta.min} opciones.`);
      return;
    }
    setError(null);
    // Procesar los datos seleccionados
    console.log('Selected options:', selectedOptions);
  };

  useEffect(() => {
    if (selectedOptions.length > pregunta.max) {
      setSelectedOptions(selectedOptions.slice(0, pregunta.max));
    }
  }, [pregunta.max]);

  useEffect(() => {
    if (pregunta.max) {
    } else if (pregunta.min) {
    }
  }, []);

  return (
    <div className="flex flex-col rounded-lg p-3">
      <div className="flex flex-col">
        <div className="flex w-full items-start pb-3">
          <h3 className="w-[95%] text- font-semibold text-black dark:text-white">
            {pregunta.orden}
            {'.-'}
            {pregunta.pregunta}
          </h3>
        </div>
        <div>
          {pregunta.max
            ? `Selecciona maximo ${pregunta.max} respuesta(s)`
            : pregunta.min
            ? `Selecciona minimo ${pregunta.min} respuesta(s)`
            : 'Selecciona una respuesta'}
        </div>
        {pregunta.pregunta.length == 0 && (
          <AlertError mensaje="El campo no debe estar vacío " />
        )}
      </div>
      <h3 className="font-semibold text-black dark:text-white pt-3 pb-2">
        Opciones:
      </h3>
      <div className="grid grid-cols-2 w-full">
        {pregunta.opciones?.map((opc) => (
          <div className="rounded-l-lg py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
            <label className="flex">
              <input
                type="checkbox"
                checked={selectedOptions.includes(opc.opcion)}
                onChange={() => handleCheckboxChange(opc.opcion)}
                className={`border-strokedark w-20 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {opc.opcion}
            </label>
          </div>
        ))}
      </div>
      {pregunta.max
        ? selectedOptions.length == 0 && <AlertError mensaje="Completa" />
        : pregunta.min
        ? selectedOptions.length != pregunta.min && (
            <AlertError mensaje="Completa" />
          )
        : selectedOptions.length == 0 && <AlertError mensaje="Completa" />}
    </div>
  );
};

export default MultiChoiceResponse;
