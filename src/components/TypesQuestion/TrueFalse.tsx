import React from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';

interface tiposEstilosAprendizaje {
  mensaje: string;
  tipos: string[];
}

interface Props {
  estilosAprendizaje: tiposEstilosAprendizaje;
  cambiarTipoEstiloPregunta: (valor: string) => void;
  actualizandoOpcion:boolean;
}

const TrueFalse: React.FC<Props> = ({
  estilosAprendizaje,
  cambiarTipoEstiloPregunta,
  actualizandoOpcion
}) => {
  const opciones = ['Verdadero', 'Falso'];
  return (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Creación de opciones:
        </h3>
        <div className="grid grid-rows-2 gap-3 w-[100%] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
          {opciones &&
            opciones.map((opc) => (
              <div className="flex gap-3">
                <div className="w-[50%]">
                  <input
                    type="text"
                    value={opc}
                    title={opc}
                    disabled={true}
                    maxLength={300}
                    className="w-[100%] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-[50%]">
                  <SelectGroupOne
                    onChange={cambiarTipoEstiloPregunta}
                    opciones={estilosAprendizaje}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      {actualizandoOpcion ? (
        <button
          className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        //   onClick={() => onActualizarOpcion()}
        >
          Actualizar opcion
        </button>
      ) : (
        <button
          className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        //   onClick={() => agregarOpcion()}
        >
          Agregar Opción
        </button>
      )}
    </>
  );
};

export default TrueFalse;
