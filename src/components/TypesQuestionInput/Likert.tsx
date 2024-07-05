import React, { useState } from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';

interface tiposEstilosAprendizaje {
  mensaje: string;
  tipos: tipoValor[];
}

interface tipoValor {
  tipo:string;
  valor:string;
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
  tiposEstilosAprendizaje: tiposEstilosAprendizaje;
  onUpdatePregunta: (idPregunta: number, pregunta: string) => void;
  onAddOpcion: (idPregunta: number) => void;
  onDeleteOpcion: (idPregunta: number, idOpcion: number) => void;
  onDeletePregunta: (idPregunta: number) => void;
  onUpdateOpcion: (
    idPregunta: number,
    idOpcion: number,
    opcion: string,
    estilo?: string,
  ) => void;
}

const Likert: React.FC<Props> = ({
  pregunta,
  tiposEstilosAprendizaje,
  onUpdatePregunta,
  onAddOpcion,
  onDeleteOpcion,
  onDeletePregunta,
  onUpdateOpcion
}) => {
  const [escalas, setEscalas] = useState([
    'Totalmente en desacuerdo',
    'En desacuerdo',
    'Neutral',
    'De acuerdo',
    'Totalmente de acuerdo',
  ]);
  const [afirmaciones, setAfirmaciones] = useState([
    'Afirmación',
    'Afirmación',
  ]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Componente responsable de las afirmaciones */}
        <h3 className="flex justify-between text-title-xsm font-semibold text-black dark:text-white">
          <h3>Pregunta:</h3>
          <div className="">
            <button
              title="Borrar"
              className={`w-[5%] pt-1`}
              onClick={() => onDeletePregunta(pregunta.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                className="dark:fill-bodydark1"
                viewBox="0 0 448 512"
              >
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
              </svg>
            </button>
          </div>
        </h3>
        <input
          type="text"
          placeholder={'Ingrese la nueva pregunta'}
          value={pregunta.pregunta}
          maxLength={300}
          onChange={(e) => onUpdatePregunta(pregunta.id, e.target.value)}
          className={`w-[100%] rounded-lg border-[1.5px] border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
        />

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
                        {/* <button
                          title="Borrar"
                          className={`${escalas.length == 1 && 'hidden'}`}
                          onClick={() =>
                            handleClickDeleteElements(index, 'escalas')
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={18}
                            height={18}
                            className="dark:fill-bodydark1"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                          </svg>
                        </button> */}
                      </div>
                    </th>
                  ))}
                  <th className="w-10 p-2 top-0 start-0">
                    {/* <button
                      title="Añadir"
                      className="p-1 rounded-md hover:bg-opacity-90"
                      // onClick={() => handleClickAddElements('escalas')}
                    >
                      {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        className="fill-black dark:fill-bodydark1"
                        viewBox="0 0 448 512"
                      >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                      </svg>
                    </button> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pregunta.opciones.map((opc) => (
                  <tr className="flex gap-8 p-1 w-50 border dark:border-none border-stroke">
                    <td className="flex flex-col gap-2">
                      <div className="flex flex-row w-50">
                        <input
                          title="Opción"
                          className="rounded-lg w-50 text-center border-[1px] border-black bg-transparent py-2 px-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={opc.opcion}
                          placeholder={opc.opcion}
                          maxLength={300}
                          onChange={(e) =>
                            onUpdateOpcion(pregunta.id, opc.id, e.target.value)
                          }
                        />
                        <button
                          title="Borrar"
                          className={`pl-3 ${afirmaciones.length == 1 && 'hidden'}`}
                          onClick={() => onDeleteOpcion(pregunta.id, opc.id)}
                        >
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={18}
                            height={18}
                            className="fill-black dark:fill-bodydark2"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-black dark:text-white">
                        <SelectGroupOne
                          onChangeTwo={onUpdateOpcion}
                          opciones={tiposEstilosAprendizaje}
                          opcionPorDefecto={opc.estilo}
                          idPregunta={pregunta.id}
                          idOpcion={opc.id}
                        />
                      </div>
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
          {/* Footer table - Añadir una instrucción*/}
          <button
            title="Añadir"
            className="flex rigth items-center pt-1 pb-1 w-[25%] lg:p-2 lg:pt-2 lg:pb-2 bg-primary rounded-lg hover:bg-opacity-90 dark:text-bodydark1"
            onClick={() => onAddOpcion(pregunta.id)}
          >
            {' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 448 512"
              className="w-[25%] fill-white"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
            <div className="text-sm w-[60%] text-gray">
              Añadir una instrucción
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Likert;
