import React, { useState } from 'react';

interface Opcion {
  id: number;
  opcion: string;
  estilo: string;
}

interface Pregunta {
  id: number;
  orden: number;
  pregunta: string;
  opciones: Opcion[];
  min?: number;
  max?: number;
}

interface MultiChoiceCuantitativaResponseProps {
  pregunta: Pregunta;
  valor: number;
  onAddResponse: (
    preguntaId: number,
    opcionId: number,
    valorOpc: number,
    estilo: string,
  ) => void;
}

const MultiChoiceCuantitativaResponse: React.FC<
  MultiChoiceCuantitativaResponseProps
> = ({ pregunta, valor, onAddResponse }) => {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    opcionId: number,
    estilo: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseInt(event.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      const nuevasRespuestas = {
        ...respuestas,
        [opcionId]: newValue,
      };
      const cantidadRespuestas = Object.values(nuevasRespuestas).filter(
        (value) => value > 0,
      ).length;
      const sumaRespuestas = Object.values(nuevasRespuestas).reduce(
        (total, value) => total + value,
        0,
      );

      if (sumaRespuestas > valor) {
        setError(`La suma de los valores no puede exceder ${valor}`);
        return;
      }

      if (sumaRespuestas < valor) {
        setError(`La suma de los valores debe ser igual a ${valor}`);
      }

      if (pregunta.min && cantidadRespuestas > pregunta.min) {
        setError(`Debe seleccionar mínimo ${pregunta.min} respuestas`);
        return;
      }

      if (pregunta.max && cantidadRespuestas > pregunta.max) {
        setError(`Puede seleccionar maximo ${pregunta.max} respuestas`);
        return;
      }

      const valorRespuesta = respuestas[opcionId] || 0;
      setRespuestas(nuevasRespuestas);
      onAddResponse(pregunta.id, opcionId, newValue, estilo);
      setError(null);
    }
  };

  const handleBlur = (opcionId: number) => {
    const valorRespuesta = respuestas[opcionId] || 0;
  };

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
        <div>{`Valor máximo total: ${valor}`}</div>
        <div>
          {pregunta.max
            ? `*Selecciona maximo ${pregunta.max} respuesta(s)`
            : pregunta.min
            ? `*Selecciona minimo ${pregunta.min} respuesta(s)`
            : '*Selecciona una respuesta'}
        </div>
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-2 w-full`}>
        {pregunta.opciones?.map((opc) => (
          <div
            key={opc.id}
            className={`rounded-l-lg w-fit py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          >
            <label className="flex justify-center items-center gap-5">
              <input
                type="number"
                value={respuestas[opc.id] || ''}
                onChange={(e) => handleChange(opc.id, opc.estilo, e)}
                // onBlur={() => handleBlur(opc.id)}
                className="border-strokedark w-20 border rounded-lg bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {opc.opcion}
            </label>
          </div>
        ))}
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default MultiChoiceCuantitativaResponse;
