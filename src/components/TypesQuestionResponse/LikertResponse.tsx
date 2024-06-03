import React, { useEffect, useState } from 'react';
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
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  onAddResponse: (
    preguntaId: number,
    opcionId: number,
    valorOpc?: number,
    estilo?:string
  ) => void;
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
  selectedOptions,
  setSelectedOptions,
  onAddResponse
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

  const handleOptionChange = (opcionEstilo: string, value: string, opcion:string,opcionId:number) => {
    let valorOpc
    let indexEscala = pregunta.escalas.findIndex((esc)=>esc === value)
    valorOpc=indexEscala+1;
    setSelectedOptions((prev) => ({
      ...prev,
      [opcionEstilo]: value,
    }));
    onAddResponse(pregunta.id,opcionId,valorOpc,opcionEstilo)
  };

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

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
                  className={`flex items-center gap-1 p-1 w-[100%] ${
                    escalas.length <= 3 && 'w-full'
                  } border-t border-l border-r rounded-lg border-stroke dark:border-none bg-primary`}
                >
                  <th className="w-30 p-5 text-bodydark1">Instrucción</th>
                  {pregunta.escalas.map((opc, index) => (
                    <th className="w-25 p-1 text-bodydark1">
                      <div className="flex">
                        <h3
                          className="rounded-md text-xs lg:text-sm w-30 lg:w-25 min-h-17 text-black text-center content-center border-strokedark bg-slate-100 py-1 px-1 outline-none transition focus:border-primary focus:border-[1px] active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          title={opc}
                        >
                          {opc}
                        </h3>
                      </div>
                    </th>
                  ))}
                  <th className="w-10 p-2 top-0 start-0"></th>
                </tr>
              </thead>
              <tbody>
                {pregunta.opciones.map((opcion, indexOpc) => (
                  <tr className="flex gap-2 p-3 border border-none border-stroke w-[96%]">
                    <td className="flex flex-col w-25">
                      <div className="flex flex-row">
                        <h3
                          title="Opción"
                          className="rounded-lg text-xs lg:text-sm w-25 text-center bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          {opcion.opcion}
                        </h3>
                      </div>
                      <div className="text-black dark:text-white"></div>
                    </td>
                    {pregunta.escalas.map((escala, index) => (
                      <td key={index} className="flex justify-center w-25">
                        <input
                          title="Opción"
                          type="radio"
                          name={`escalaOptions-${opcion.id}`}
                          value={escala}
                          checked={selectedOptions[opcion.estilo] === escala}
                          onChange={() =>
                            handleOptionChange(opcion.estilo, escala,opcion.opcion,opcion.id)
                          }
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
