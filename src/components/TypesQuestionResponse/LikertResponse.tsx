import React, { useState } from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';

interface tiposEstilosAprendizaje {
  mensaje: string;
  tipos: string[];
}

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
  escalas: string[];
  min: number;
  max: number;
}

interface Props {
  pregunta: Pregunta;
  //   tiposEstilosAprendizaje: tiposEstilosAprendizaje;
  //   onUpdatePregunta: (idPregunta: number, pregunta: string) => void;
  //   onAddOpcion: (idPregunta: number) => void;
  //   onDeleteOpcion: (idPregunta: number, idOpcion: number) => void;
  //   onDeletePregunta: (idPregunta: number) => void;
  //   onUpdateOpcion: (
  //     idPregunta: number,
  //     idOpcion: number,
  //     opcion: string,
  //     estilo?: string,
  //   ) => void;
}

const LikertResponse: React.FC<Props> = ({
  pregunta,
  //   tiposEstilosAprendizaje,
  //   onUpdatePregunta,
  //   onAddOpcion,
  //   onDeleteOpcion,
  //   onDeletePregunta,
  //   onUpdateOpcion
}) => {
  const [escalas, setEscalas] = useState([
    'Muy insatisfecho',
    'Insatisfecho',
    'Neutral',
    'Satisfecho',
    'Muy satisfecho',
  ]);
  const [afirmaciones, setAfirmaciones] = useState([
    'Afirmación',
    'Afirmación',
  ]);

  return (
    <>
      <div className="flex flex-col gap-3 p-3">
        {/* Componente responsable de las afirmaciones */}
        <h3 className="flex justify-between text-title-xsm font-semibold text-black dark:text-white">
          <h3 className="w-[95%] text-base text-black dark:text-white">
            {pregunta.orden}
            {'.-'}
            {pregunta.pregunta}
          </h3>
        </h3>
          <div>
            {pregunta.max
              ? `Selecciona maximo ${pregunta.max}`
              : pregunta.min
              ? `Selecciona minimo ${pregunta.min}`
              : 'Selecciona 1 respuesta por cada opción.'}
          </div>
        <div className="flex flex-col gap-5 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark">
          <div className="flex flex-col overflow-auto">
            {/* Tabla completa */}
            <table>
              {/* Header */}
              <thead className="flex">
                <tr
                  className={`flex gap-8 p-1 ${
                    escalas.length <= 3 && 'w-full'
                  } border-t border-l border-r rounded-lg border-stroke dark:border-none bg-primary`}
                >
                  <th className="w-50 p-2 text-bodydark1">Instrucción</th>
                  {pregunta.escalas.map((opc, index) => (
                    <th className="w-30 lg:w-50 p-1 text-bodydark1">
                      <div className="flex gap-2">
                        <input
                          className="rounded-md w-30 lg:w-50 text-black text-center border-strokedark bg-slate-100 py-1 px-1 outline-none transition focus:border-primary focus:border-[1px] active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={opc}
                          title={opc}
                          disabled={true}
                          placeholder={opc}
                          type="text"
                        />
                      </div>
                    </th>
                  ))}
                  <th className="w-10 p-2 top-0 start-0"></th>
                </tr>
              </thead>
              <tbody>
                {pregunta.opciones.map((opc) => (
                  <tr className="flex gap-8 p-1 w-50 border border-none border-stroke">
                    <td className="flex flex-col gap-2">
                      <div className="flex flex-row w-50">
                        <h3
                          title="Opción"
                          className="rounded-lg w-50 text-center  bg-transparent py-2 px-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          {opc.opcion}
                        </h3>
                      </div>
                      <div className="text-black dark:text-white"></div>
                    </td>
                    {escalas.map((opc) => (
                      <td className="w-30 pl-14 pr-14 lg:pl-25 lg:pr-25 content-center">
                        <input
                          title="Opción"
                          type="radio"
                          disabled={true}
                        ></input>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LikertResponse;
