import React from 'react';

interface Column {
  value: string[];
  operacion: string;
}

interface Condition {
  parametros: Column[];
  condicion: string;
  valor: number;
  comparacion: string; 
}

type Opcion = {
  tipo: string;
  valor: string;
};

interface ConditionProps {
  condicion: Condition;
  onChange: (updatedCondition: Condition) => void;
  onDelete: () => void;
  estilosAprendizaje: Opcion[];
  hasManyCondiciones: string;
}

const ConditionComponent: React.FC<ConditionProps> = ({
  condicion,
  onChange,
  onDelete,
  estilosAprendizaje,
  hasManyCondiciones,
}) => {
  const handleColumnsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    const updatedColumns = condicion.parametros.map((col, i) =>
      i === index ? { ...col, value: selectedOptions } : col,
    );
    onChange({
      ...condicion,
      parametros: updatedColumns,
    });
  };

  const handleOperacionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const updatedColumns = condicion.parametros.map((col, i) =>
      i === index ? { ...col, operacion: e.target.value } : col,
    );
    onChange({
      ...condicion,
      parametros: updatedColumns,
    });
  };

  const handleComparacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...condicion,
      comparacion: e.target.value,
    });
  };

  const addColumnPair = () => {
    onChange({
      ...condicion,
      parametros: [
        ...condicion.parametros,
        { value: [estilosAprendizaje[0].tipo], operacion: 'suma' },
      ],
    });
  };

  const handleConditionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    onChange({
      ...condicion,
      [name]: value,
    });
  };

  const deleteColumnPair = (index: number) => {
    if (condicion.parametros.length == 1) return;
    const updatedColumns = condicion.parametros.filter((_, i) => i !== index);
    onChange({
      ...condicion,
      parametros: updatedColumns,
    });
  };

  return (
    <div className="flex flex-col gap-5 border rounded-lg p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {condicion.parametros.map((col, index) => (
          <div key={index} className="flex gap-3 justify-center">
            <div className="font-bold text-black dark:text-bodydark1">
              Dimensión:
            </div>
            <select
              title="columna"
              name="columnas"
              value={col.value}
              onChange={(e) => handleColumnsChange(e, index)}
              className={`w-full bg-whiten appearance-none rounded border border-strokedark bg-transparent py-3 px-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              {estilosAprendizaje.map((estilo) => (
                <option key={estilo.tipo} value={estilo.tipo}>
                  {estilo.tipo}
                </option>
              ))}
            </select>
            <select
              title="operacion"
              name="operacion"
              value={col.operacion}
              onChange={(e) => handleOperacionChange(e, index)}
              className={`relative pt-2 z-20 bg-whiten appearance-none rounded border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              <option value="resta">-</option>
              <option value="suma">+</option>
              <option value="multiplicacion">*</option>
              <option value="division">/</option>
            </select>
            <button
              title="eliminar operación"
              onClick={() => deleteColumnPair(index)}
              className={`flex justify-center items-center w-[5%] lg:w-[5%] ${`rounded-lg`} bg-primary p-5 font-medium text-gray hover:bg-opacity-90`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white dark:fill-bodydark1 absolute"
                width="18"
                height="18"
                viewBox="0 0 576 512"
              >
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addColumnPair}
        className={`flex justify-center items-center lg:justify-between p-5 gap-2 w-[5%] lg:w-[20%] ${`rounded-lg`} bg-primary p-5 lg:p-2 font-medium text-gray hover:bg-opacity-90`}
      >
        <div className="lg:w-[12%] flex items-center h-1">
          <svg
            className="fill-white dark:fill-bodydark1 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 612"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
          </svg>
        </div>
        <div className="hidden lg:flex w-full">Añadir Campo</div>
      </button>
      <div className="flex gap-5 h-8">
        <div className="font-semibold text-black w-[25%] dark:text-white">
          Resultado debe ser :
        </div>
        <select
          title="condicion"
          name="condicion"
          value={condicion.condicion}
          onChange={handleConditionChange}
          className={`relative pt-0 z-20 w-full bg-whiten appearance-none rounded border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
        >
          <option value="ninguna">{'Ninguna'}</option>
          <option value="mayor">{'>'}</option>
          <option value="menor">{'<'}</option>
          <option value="igual">{'='}</option>
          <option value="mayor-igual">{'>='}</option>
          <option value="menor-igual">{'<='}</option>
        </select>
        <input
          type="number"
          name="valor"
          value={condicion.condicion == 'ninguna' ? 0 : condicion.valor}
          onChange={handleConditionChange}
          placeholder="Valor"
          className={`w-[40%] h-5 rounded-lg p-3 bg-transparent ${
            condicion.condicion == 'ninguna' && 'hidden'
          } pt-3 h-full appearance-none rounded border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary `}
        />
        <div
          className={`flex w-100 gap-5 ${
            hasManyCondiciones == 'false' && 'hidden'
          }`}
        >
          <div className="font-semibold text-black dark:text-bodydark1">
            Operación:
          </div>
          <select
            title="relacion con demas condiciones"
            name="comparacion"
            value={condicion.comparacion}
            onChange={handleComparacionChange}
            className={`relative pt-0 z-20 bg-whiten appearance-none rounded border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={onDelete}
          className={`flex justify-center lg:justify-between items-center w-[40%] lg:w-[22%] gap-3 ${`rounded-lg`} bg-primary p-2 font-medium text-gray hover:bg-opacity-90`}
        >
          <div className="flex justify-center items-center w-[19%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white dark:fill-bodydark1 absolute w-[5%]"
              width="18"
              height="18"
              viewBox="0 0 576 512"
            >
              <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
            </svg>
          </div>
          <div className="flex w-[90%]">Borrar Condición</div>
        </button>
      </div>
    </div>
  );
};

export default ConditionComponent;
