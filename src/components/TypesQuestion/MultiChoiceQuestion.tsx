import React from 'react';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';
import CardList from '../CardList';

interface Opcion {
  texto: string;
  estilo: string;
}

interface Props {
  cambiarLimiteRespuesta: (valor: string) => void;
  limiteRespuestas: number;
  nuevaOpcion: string;
  agregarNuevaOpcion: (valor: string) => void;
  cambiarTipoEstiloPregunta: (valor: string) => void;
  tiposEstilosAprendizaje: { mensaje: string; tipos: string[] };
  estiloNuevaOpcion: string;
  actualizandoOpcion: boolean;
  onActualizarOpcion: () => void;
  agregarOpcion: () => void;
  opcionesPregunta: Opcion[];
  prepararActualizacionOpciones: (valor: string) => void;
  eliminarOpcion: (valor: string) => void;
}

const MultiChoiceQuestion: React.FC<Props> = ({
  limiteRespuestas,
  cambiarLimiteRespuesta,
  nuevaOpcion,
  agregarNuevaOpcion,
  cambiarTipoEstiloPregunta,
  tiposEstilosAprendizaje,
  estiloNuevaOpcion,
  actualizandoOpcion,
  onActualizarOpcion,
  agregarOpcion,
  opcionesPregunta,
  prepararActualizacionOpciones,
  eliminarOpcion,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-title-xsm font-semibold text-black dark:text-white">
        Límite de respuestas:
      </h3>
      <input
        type="number"
        placeholder="Limite"
        value={limiteRespuestas}
        onChange={(e) => cambiarLimiteRespuesta(e.target.value)}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      <div className="flex flex-row">
        <div className="w-[50%] rounded-l-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
          <h3 className="font-semibold text-black dark:text-white">Opción:</h3>
          <input
            type="text"
            value={nuevaOpcion}
            title={nuevaOpcion}
            maxLength={300}
            onChange={(e) => agregarNuevaOpcion(e.target.value)}
            className="w-[100%] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="w-[50%] rounded-r-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
          <h3 className="font-semibold text-black dark:text-white">
            Estilo de aprendizaje:
          </h3>
          <SelectGroupOne
            onChange={cambiarTipoEstiloPregunta}
            opciones={tiposEstilosAprendizaje}
            opcionPorDefecto={estiloNuevaOpcion}
          />
        </div>
      </div>
      {opcionesPregunta.length > 0 && (
        <>
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Lista de opciones:
          </h3>
          <ul>
            {opcionesPregunta.map((item) => (
              <li>
                <CardList
                  actualizar={prepararActualizacionOpciones}
                  eliminar={eliminarOpcion}
                  valor={item.texto}
                  mensaje={
                    'PREGUNTA: ' +
                    item.texto +
                    '\nESTILO DE APRENDIZAJE: ' +
                    item.estilo
                  }
                  limite={150}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      {actualizandoOpcion ? (
        <button
          className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          onClick={() => onActualizarOpcion()}
        >
          Actualizar opcion
        </button>
      ) : (
        <button
          className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          onClick={() => agregarOpcion()}
        >
          Agregar Opción
        </button>
      )}
    </div>
  );
};

export default MultiChoiceQuestion;
