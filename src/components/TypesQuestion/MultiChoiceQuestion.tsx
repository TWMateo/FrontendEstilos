import React, { useState } from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';
import CardList from '../CardList';

interface Opcion {
  opcion: string;
  estilo: string;
}

interface Pregunta {
  id: number;
  orden: number;
  pregunta: string;
  tipoPregunta: string;
  limiteRespuesta: 0;
  opciones: Opcion[];
}

interface Pregunta {}

interface Props {
  cambiarLimiteRespuesta: (valor: string) => void;
  nuevaOpcion: string;
  agregarNuevaOpcion: (valor: string) => void;
  cambiarTipoEstiloPregunta: (valor: string) => void;
  tiposEstilosAprendizaje: { mensaje: string; tipos: string[] };
  estiloNuevaOpcion: string;
  actualizandoOpcion: boolean;
  onActualizarOpcion: () => void;
  agregarOpcion: (idPregunta:number) => void;
  eliminarOpcion: (valor: string) => void;
  pregunta: Pregunta;
}

const MultiChoiceQuestion: React.FC<Props> = ({
  pregunta,
  cambiarLimiteRespuesta,
  nuevaOpcion,
  agregarNuevaOpcion,
  cambiarTipoEstiloPregunta,
  tiposEstilosAprendizaje,
  estiloNuevaOpcion,
  actualizandoOpcion,
  onActualizarOpcion,
  agregarOpcion,
  eliminarOpcion,
}) => {
  return (
    <div>
      <div className="flex flex-col rounded-lg pt-3">
        <div className="flex flex-col gap-3">
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Pregunta:
          </h3>
          <input
            type="text"
            placeholder={pregunta.pregunta}
            value={pregunta.pregunta}
            maxLength={300}
            // onChange={(e) => setNuevaPregunta(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-strokedark bg-whiten py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <h3 className="font-semibold text-black dark:text-white pt-3 pb-2">
          Opciones:
        </h3>
        {pregunta.opciones?.map((pre) => (
          <div className="grid grid-cols-2">
            <div className="rounded-l-lg py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              <input
                type="text"
                value={pre.opcion}
                title={pre.opcion}
                placeholder={pre.opcion}
                maxLength={300}
                onChange={(e) => agregarNuevaOpcion(e.target.value)}
                className="w-[100%] rounded-lg border-[1.5px] border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="flex gap-4 rounded-r-lg bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              <div className="w-[90%]">
                <SelectGroupOne
                  onChange={cambiarTipoEstiloPregunta}
                  opciones={tiposEstilosAprendizaje}
                  opcionPorDefecto={pre.estilo}
                />
              </div>
              <div>
                <button
                  title="Borrar"
                  className={`${
                    pre.opcion.length == 1 && 'hidden'
                  } w-[5%] pt-3`}
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
            </div>
          </div>
        ))}
        <h3 className="text-title-xsm pb-4 font-semibold text-black dark:text-white">
          Límite de respuestas:
        </h3>
        <div className="grid grid-cols-2 gap-10">
          <input
            type="number"
            placeholder="Limite"
            value={pregunta.limiteRespuesta}
            // onChange={(e) => cambiarLimiteRespuesta(e.target.value)}
            className="rounded-lg border-[1.5px] border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            className="flex justify-center items-center rounded-lg bg-primary p-2 font-medium text-gray hover:bg-opacity-90"
            onClick={() => agregarOpcion(pregunta.id)}
          >
            Agregar Opción
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiChoiceQuestion;
