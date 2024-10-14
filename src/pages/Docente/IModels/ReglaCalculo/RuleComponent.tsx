import React, { useEffect } from 'react';
import ConditionComponent from './ConditionComponent';

interface Column {
  value: string[];
  operacion: string;
}

interface Condition {
  parametros: Column[];
  condicion: string;
  valor: number;
  comparacion: string; // Nueva propiedad para la comparación
}

interface Rule {
  estilo: string;
  condiciones: Condition[];
}

type Opcion = {
  tipo: string;
  valor: string;
};

interface RuleComponentProps {
  rule: Rule;
  onChange: (updatedRule: Rule) => void;
  onDelete: () => void;
  estilosAprendizaje: Opcion[];
  parametrosAprendizaje: Opcion[];
}

const RuleComponent: React.FC<RuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
  estilosAprendizaje,
  parametrosAprendizaje,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name)
    console.log(value)
    onChange({ ...rule, [name]: value });
  };

  const handleConditionChange = (
    index: number,
    updatedCondition: Condition,
  ) => {
    const updatedConditions = rule.condiciones.map((cond, i) =>
      i === index ? updatedCondition : cond,
    );
    onChange({ ...rule, condiciones: updatedConditions });
  };

  const addCondition = () => {
    const newCondition: Condition = {
      parametros: [
        { value: [parametrosAprendizaje[0].tipo], operacion: 'suma' },
      ],
      condicion: 'ninguna',
      valor: 0,
      comparacion: 'and',
    }; // Valor predeterminado para comparacion
    onChange({ ...rule, condiciones: [...rule.condiciones, newCondition] });
  };

  const deleteCondition = (index: number) => {
    if (rule.condiciones.length == 1) return;
    const updatedConditions = rule.condiciones.filter((_, i) => i !== index);
    onChange({ ...rule, condiciones: updatedConditions });
  };

  useEffect(() => {

  }, [parametrosAprendizaje]);

  useEffect(() => {
    if (estilosAprendizaje.length > 0) {
      rule.estilo = estilosAprendizaje[0].tipo;
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 border rounded-lg p-5">
      {/* <div>Estilo o dimensión</div> */}
      <div className="flex justify-between">
        <select
          title="fila"
          multiple={false}
          className={`relative p-2 z-20 w-[90%] lg:w-[85%] bg-whiten appearance-none rounded border border-strokedark bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          name="estilo"
          value={rule.estilo}
          onChange={handleChange}
        >
          {estilosAprendizaje.map((estilo, index) => (
            <option key={estilo + '-' + index} value={estilo.tipo}>
             {index+1}{'. '}{estilo.tipo}
            </option>
          ))}
        </select>
        <button
          title="Borrar regla"
          onClick={onDelete}
          className={`flex justify-center lg:justify-between items-center w-[5%] lg:w-[14%] ${`rounded-lg`} bg-primary p-5 lg:p-2 font-medium text-gray hover:bg-opacity-90`}
        >
          <div className="hidden lg:flex ml-5">Borrar regla</div>
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
      {rule.condiciones && rule.condiciones.map((condicion, index) => (
        <ConditionComponent
          key={index}
          condicion={condicion}
          onChange={(updatedCondition) =>
            handleConditionChange(index, updatedCondition)
          }
          onDelete={() => deleteCondition(index)}
          estilosAprendizaje={parametrosAprendizaje}
          hasManyCondiciones={`${rule.condiciones.length > 1 ? true : false}`}
        />
      ))}
      <div className="w-full flex flex-col items-center">
        {/* <button
          onClick={() => deleteCondition(index)}
          className={`flex justify-center lg:justify-between items-center w-[5%] lg:w-[20%] ${`rounded-lg`} bg-primary p-5 lg:p-2 font-medium text-gray hover:bg-opacity-90`}
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
          <div className="hidden lg:flex w-[90%]">Borrar Condición</div>
        </button> */}
        <button
          onClick={addCondition}
          className={`flex justify-center lg:justify-between items-center w-[35%] lg:w-[22%] gap-3 ${`rounded-lg`} bg-primary p-2 font-medium text-gray hover:bg-opacity-90`}
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
          <div className="flex w-[100%]">Agregar Condición</div>
        </button>
      </div>
    </div>
  );
};

export default RuleComponent;
