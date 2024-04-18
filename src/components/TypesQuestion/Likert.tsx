import React, { useState } from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';

interface tiposEstilosAprendizaje {
  mensaje: string;
  tipos: string[];
}

interface Props {
  estilosAprendizaje: tiposEstilosAprendizaje;
  cambiarTipoEstiloPregunta: (valor: string) => void;
  actualizandoOpcion: boolean;
}

const Likert: React.FC<Props> = ({
  estilosAprendizaje,
  cambiarTipoEstiloPregunta,
  actualizandoOpcion,
}) => {
  const [opciones, setOpciones] = useState([
    'Opción 1',
    'Opción 2',
  ]);
  const [instrucciones, setInstrucciones] = useState([
    'Instrucción 1',
    'Instrucción 2',
    'Instrucción 3',
  ]);

  const deleteElements = (data: string, listado: string) => {
    let listaAux;
    if (listado === 'instrucciones') listaAux = [...instrucciones];
    else listaAux = [...opciones];
    if (listaAux.length === 1) return;
    let index = listaAux.findIndex((element) => element === data);
    listaAux.splice(index, 1);
    if (listado === 'instrucciones') setInstrucciones(listaAux);
    else setOpciones(listaAux);
  };

  const addElements = (listado: string) => {
    let listaAux;
    let data;
    if (listado === 'instrucciones') {
      listaAux = [...instrucciones];
      data =
        'Instrucción ' + (Number(listaAux[listaAux.length - 1].charAt(12)) + 1);
    } else {
      listaAux = [...opciones];
      data = 'Opcion ' + (Number(listaAux[listaAux.length - 1].charAt(7)) + 1);
    }
    if (listaAux.length >= 7) return;
    let nuevaLista = listaAux.concat(data);
    if (listado === 'instrucciones') setInstrucciones(nuevaLista);
    else setOpciones(nuevaLista);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Conponente responsable de las instrucciones */}
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Creación de opciones:
        </h3>
        <div className="flex flex-col gap-5 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark">
          <div className="flex flex-col overflow-auto">
            {/* Tabla completa */}
            <table>
              {/* Header */}
              <thead className="flex">
                <tr
                  className={`flex gap-8 p-1 ${
                    opciones.length <= 3 && 'w-full'
                  } border-t border-l border-r rounded-lg border-stroke dark:border-none bg-primary`}
                >
                  <th className="w-30 p-2 text-bodydark1">Instrucción</th>
                  {opciones.map((opc) => (
                    <th className="w-30 lg:w-50 p-1 text-bodydark1">
                      <div className="flex gap-2">
                        <input
                          className="rounded-md w-30 lg:w-50 text-black text-center border-strokedark bg-slate-100 py-1 px-1 outline-none transition focus:border-primary focus:border-[1px] active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          title={opc}
                          placeholder={opc}
                          type="text"
                        />
                        <button
                          title="Borrar"
                          className={`${opciones.length == 1 && 'hidden'}`}
                          onClick={() => deleteElements(opc, 'opciones')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={18}
                            height={18}
                            className='dark:fill-bodydark1'
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="w-10 p-2 top-0 start-0">
                    <button
                      title="Añadir"
                      className="p-1 rounded-md hover:bg-opacity-90"
                      onClick={() => addElements('opciones')}
                    >
                      {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        className='fill-black dark:fill-bodydark1'
                        viewBox="0 0 448 512"
                      >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {instrucciones.map((inst) => (
                  <tr className="flex gap-8 p-1 border dark:border-none border-stroke">
                    <td className="flex flex-row w-30 gap-2">
                      <input
                        title="Instrucción"
                        className="rounded-lg w-30 text-center border-[1px] border-black bg-transparent py-2 px-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        placeholder={inst}
                      />
                      <button
                        title="Borrar"
                        className={`${instrucciones.length == 1 && 'hidden'}`}
                        onClick={() => deleteElements(inst, 'instrucciones')}
                      >
                        {' '}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={18}
                          height={18}
                          className='fill-black dark:fill-bodydark2'
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                        </svg>
                      </button>
                    </td>
                    {opciones.map((opc) => (
                      <td className="w-30 pl-14 pr-14 lg:pl-25 lg:pr-25">
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
            onClick={() => addElements('instrucciones')}
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

export default Likert;
