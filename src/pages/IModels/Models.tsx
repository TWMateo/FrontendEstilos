import { ChangeEvent, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import CardList from '../../components/CardList';
import MultiChoiceQuestion from '../../components/TypesQuestion/MultiChoiceQuestion';
import Likert from '../../components/TypesQuestion/Likert';

interface Opcion {
  texto: string;
  estilo: string;
}

interface EstiloAprendizaje {
  id: number;
  nombre: string;
}

interface Test {
  titulo: string;
  autor: string;
  descripcion: string;
  cuantitativa: boolean;
  fechaCreacion: string;
  estilosAprendizaje: string[];
  preguntas: Pregunta[];
}

interface Pregunta {
  orden: number;
  pregunta: string;
  tipoPregunta: string;
  opciones: Opcion[];
}

interface Props {
  onGuardarTest: (test: Pregunta[]) => void;
}

const Models = () => {
  const [nombreTest, setNombreTest] = useState('');
  const [test, setTest] = useState<Pregunta[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState('');
  const [opcionesPregunta, setOpcionesPregunta] = useState<Opcion[]>([]);
  const [estilosAprendizaje, setEstilosAprendizaje] = useState(['']);
  const [nuevoEstiloAprendizaje, setNuevoEstiloAprendizaje] = useState('');
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [estiloNuevaOpcion, setEstiloNuevaOpcion] = useState('');
  const [actualizandoEstilo, setActualizandoEstilo] = useState(false);
  const [actualizandoOpcion, setActualizandoOpcion] = useState(false);
  const [estiloBuscado, setEstiloBuscado] = useState('');
  const [listaPreguntas, setListaPreguntas] = useState<Pregunta[]>([]);
  const [actualizandoPregunta, setActualizandoPregunta] = useState(false);
  const [opcionBuscada, setOpcionBuscada] = useState('');
  const [preguntaBuscada, setPreguntaBuscada] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [limiteRespuestas, setLimiteRespuestas] = useState<number>(0);

  const tiposPreguntas = {
    mensaje: 'Selecciona el tipo de pregunta',
    tipos: ['Selección múltiple', 'Likert'],
  };

  const tiposEstilosAprendizaje = {
    mensaje: 'Estilo de aprendizaje',
    tipos: estilosAprendizaje,
  };

  const agregarOpcion = () => {
    if (nuevaOpcion.length == 0) return;
    if (estiloNuevaOpcion.length == 0) return;
    if (opcionesPregunta.findIndex((op) => op.texto === nuevaOpcion) != -1)
      return;
    const opcion: Opcion = {
      texto: nuevaOpcion,
      estilo: estiloNuevaOpcion,
    };
    setOpcionesPregunta([...opcionesPregunta, opcion]);
  };

  //REVISANDO
  const onGuardarTest = () => {
    if (nombreTest.length == 0) return;
    if (autor.length == 0) return;
    if (descripcion.length == 0) return;
    if (nombreTest.length == 0) return;
    if (estilosAprendizaje.length == 0) return;
    if (listaPreguntas.length == 0) return;
    const fecha = new Date();
    const test: Test = {
      titulo: nombreTest,
      autor: autor,
      descripcion: descripcion,
      cuantitativa: false,
      fechaCreacion: fecha.toLocaleDateString(),
      estilosAprendizaje: estilosAprendizaje,
      preguntas: listaPreguntas,
    };
    console.log(test);
  };

  const onGuardarNuevoEstiloAprendizaje = () => {
    if (!nuevoEstiloAprendizaje) return;
    const estilo = nuevoEstiloAprendizaje.toLowerCase();
    if (estilosAprendizaje[0].length == 0) {
      setEstilosAprendizaje([estilo]);
    } else {
      if (!estilosAprendizaje.find((estiloA) => estiloA === estilo)) {
        setEstilosAprendizaje((prevState) => [...prevState, estilo]);
      }
    }
  };

  const onEliminarEstiloAprendizaje = (estilo: string) => {
    const index = estilosAprendizaje.indexOf(estilo);
    if (index != -1) {
      if (estilosAprendizaje.length == 1) {
        estilosAprendizaje[0] = '';
      } else {
        estilosAprendizaje.splice(index, 1);
      }
      setEstilosAprendizaje((prevState) => [...prevState]);
    }
  };

  const onActualizarEstiloAprendizaje = () => {
    const posicion = estilosAprendizaje.indexOf(estiloBuscado);
    estilosAprendizaje[posicion] = nuevoEstiloAprendizaje;
    setEstilosAprendizaje(estilosAprendizaje);
    setActualizandoEstilo(false);
  };

  const prepararActualizacionEstilo = (valor: string) => {
    setActualizandoEstilo(true);
    setNuevoEstiloAprendizaje(valor);
    setEstiloBuscado(valor);
  };

  const eliminarOpcion = (valor: string) => {
    const posicion = opcionesPregunta.findIndex(
      (opcion) => opcion.texto === valor,
    );
    if (posicion != -1) {
      opcionesPregunta.splice(posicion, 1);
      setOpcionesPregunta((prevState) => [...prevState]);
    }
  };

  const prepararActualizacionOpciones = (valor: string) => {
    setActualizandoOpcion(true);
    const estiloNuevaOpcion: Opcion | undefined = opcionesPregunta.find(
      (op) => op.texto == valor,
    );
    if (estiloNuevaOpcion == undefined) return;
    setNuevaOpcion(valor);
    setEstiloNuevaOpcion(estiloNuevaOpcion.estilo);
    setOpcionBuscada(valor);
  };

  const onActualizarOpcion = () => {
    setActualizandoOpcion(false);
    const posicion = opcionesPregunta.findIndex(
      (opcion) => opcion.texto.toLowerCase() === opcionBuscada.toLowerCase(),
    );
    opcionesPregunta[posicion].texto = nuevaOpcion;
    opcionesPregunta[posicion].estilo = estiloNuevaOpcion;
    setOpcionesPregunta(opcionesPregunta);
  };

  const cambiarTipoPregunta = (valor: string) => {
    setTipoPregunta(valor);
    setOpcionesPregunta([]);
    setNuevaOpcion('');
    setEstiloNuevaOpcion('');
  };

  const cambiarTipoEstiloPregunta = (valor: string) => {
    setEstiloNuevaOpcion(valor);
  };

  const onAgregarPregunta = () => {
    if (nombreTest.length == 0) return;
    if (estilosAprendizaje.length == 0) return;
    if (nuevaPregunta.length == 0) return;
    if (opcionesPregunta.length == 0) return;
    if (listaPreguntas.findIndex((pre) => pre.pregunta == nuevaPregunta) != -1)
      return;
    const pregunta: Pregunta = {
      orden: listaPreguntas.length + 1,
      pregunta: nuevaPregunta,
      tipoPregunta: tipoPregunta,
      opciones: opcionesPregunta,
    };
    const nuevaLista = listaPreguntas
      .concat(pregunta)
      .sort((a, b) => a.orden - b.orden);
    setListaPreguntas(nuevaLista);
    ResetCamposPregunta();
  };

  const prepararActualizacionPregunta = (valor: string) => {
    setActualizandoPregunta(true);
    const pregunta: Pregunta | undefined = listaPreguntas.find(
      (pre) => pre.pregunta.toLowerCase() == valor.toLowerCase(),
    );
    if (pregunta == undefined) return;
    setNuevaPregunta(valor);
    setTipoPregunta(pregunta.tipoPregunta);
    setOpcionesPregunta(pregunta.opciones);
    setPreguntaBuscada(valor);
  };

  const onActualizarPregunta = () => {
    setActualizandoPregunta(false);
    const indice = listaPreguntas.findIndex(
      (pre) => pre.pregunta.toLowerCase() === preguntaBuscada.toLowerCase(),
    );
    if (indice == -1) return;
    listaPreguntas[indice].pregunta = nuevaPregunta;
    listaPreguntas[indice].tipoPregunta = tipoPregunta;
    listaPreguntas[indice].opciones = opcionesPregunta;
    setListaPreguntas(listaPreguntas);
    ResetCamposPregunta();
  };

  const ResetCamposPregunta = () => {
    setNuevaPregunta('');
    setOpcionesPregunta([]);
    setNuevaOpcion('');
  };

  const onEliminarPregunta = (valor: string) => {
    const indice = listaPreguntas.findIndex(
      (pre) => pre.pregunta.toLowerCase() === valor.toLowerCase(),
    );
    if (indice == -1) return;
    listaPreguntas.splice(indice, 1);
    setListaPreguntas((prevState) => [...prevState]);
  };

  const cambiarLimiteRespuesta = (valor: string) => {
    let num = parseInt(valor);
    if (num < 0) return;
    setLimiteRespuestas(num);
  };

  const cambiarOrden = (valor: string, direccion: string) => {
    const indice = listaPreguntas.findIndex(
      (pre) => pre.pregunta.toLowerCase() == valor.toLowerCase(),
    );
    if (indice == -1) return;

    const cambio = direccion === 'arriba' ? -1 : 1;
    const nuevoOrden = listaPreguntas[indice].orden + cambio;

    if (nuevoOrden < 1 || nuevoOrden > listaPreguntas.length) return;

    const indiceIntercambio = listaPreguntas.findIndex(
      (pre) => pre.orden === nuevoOrden,
    );

    let nuevaLista = [...listaPreguntas];
    if (indiceIntercambio > -1) {
      nuevaLista[indice].orden = nuevoOrden;
      nuevaLista[indiceIntercambio].orden -= cambio;
    }

    nuevaLista = nuevaLista.sort((a, b) => a.orden - b.orden);
    setListaPreguntas(nuevaLista);
  };

  useEffect(() => {
    console.log(listaPreguntas);
  }, [listaPreguntas]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Modelos" />
      <div className="flex flex-col gap-3">
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Título:
        </h3>
        <input
          type="text"
          placeholder="Nombre del modelo"
          maxLength={75}
          value={nombreTest.length > 0 ? nombreTest : ''}
          onChange={(e) => setNombreTest(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Autor:
        </h3>
        <input
          type="text"
          placeholder="Nombre del Autor"
          value={autor}
          maxLength={100}
          onChange={(e) => setAutor(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Descripción:
        </h3>
        <input
          type="text"
          placeholder="Descripción del test"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={100}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-title-xsm font-semibold text-black dark:text-white">
              Estilos de aprendizaje:
            </h3>
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Agregar nuevo estilo"
                value={nuevoEstiloAprendizaje}
                onChange={(e) => setNuevoEstiloAprendizaje(e.target.value)}
                className="w-[50%] rounded-l-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {actualizandoEstilo === true ? (
                <button
                  className="flex w-[50%] justify-center rounded-r-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  onClick={() => onActualizarEstiloAprendizaje()}
                >
                  Actualizar Estilo de Aprendizaje
                </button>
              ) : (
                <button
                  className="flex w-[50%] justify-center rounded-r-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  onClick={() => onGuardarNuevoEstiloAprendizaje()}
                >
                  Agregar Estilo de Aprendizaje
                </button>
              )}
            </div>
            <ul className="grid grid-cols-3 gap-4">
              {estilosAprendizaje[0].length > 0 &&
                estilosAprendizaje.map((estilo) => (
                  <CardList
                    actualizar={prepararActualizacionEstilo}
                    eliminar={onEliminarEstiloAprendizaje}
                    valor={estilo}
                    limite={11}
                  />
                ))}
            </ul>
          </div>
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Pregunta
          </h3>
          <input
            type="text"
            placeholder="Agregar nueva pregunta"
            value={nuevaPregunta}
            maxLength={300}
            onChange={(e) => setNuevaPregunta(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Tipo de pregunta:
          </h3>
          <SelectGroupOne
            onChange={cambiarTipoPregunta}
            opciones={tiposPreguntas}
            opcionPorDefecto={tipoPregunta}
          />
          {tipoPregunta === 'Selección múltiple' && (
            <MultiChoiceQuestion
              cambiarLimiteRespuesta={cambiarLimiteRespuesta}
              limiteRespuestas={limiteRespuestas}
              nuevaOpcion={nuevaOpcion}
              agregarNuevaOpcion={setNuevaOpcion}
              cambiarTipoEstiloPregunta={cambiarTipoEstiloPregunta}
              tiposEstilosAprendizaje={tiposEstilosAprendizaje}
              estiloNuevaOpcion={estiloNuevaOpcion}
              actualizandoOpcion={actualizandoOpcion}
              onActualizarOpcion={onActualizarOpcion}
              agregarOpcion={agregarOpcion}
              opcionesPregunta={opcionesPregunta}
              prepararActualizacionOpciones={prepararActualizacionOpciones}
              eliminarOpcion={eliminarOpcion}
            />
          )}
          {tipoPregunta === 'Likert' && (
            <Likert
              cambiarTipoEstiloPregunta={cambiarTipoEstiloPregunta}
              estilosAprendizaje={tiposEstilosAprendizaje}
              actualizandoOpcion={actualizandoOpcion}
            />
          )}
          {tipoPregunta === 'Likert'}
          {actualizandoPregunta ? (
            <button
              className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={onActualizarPregunta}
            >
              Actualizar Pregunta
            </button>
          ) : (
            <button
              className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={onAgregarPregunta}
            >
              Agregar Pregunta
            </button>
          )}
          {listaPreguntas.length > 0 && (
            <>
              <h3 className="text-title-xsm font-semibold text-black dark:text-white">
                Lista de Preguntas:
              </h3>
              {listaPreguntas.map((pre) => (
                <CardList
                  actualizar={prepararActualizacionPregunta}
                  eliminar={onEliminarPregunta}
                  valor={pre.pregunta}
                  cambiarOrden={cambiarOrden}
                  mensaje={`PREGUNTA: ${pre.pregunta}\nTIPO DE PREGUNTA: ${pre.tipoPregunta}`}
                  limite={150}
                />
              ))}
            </>
          )}
        </div>
        <button
          className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          onClick={() => onGuardarTest()}
        >
          Guardar Test
        </button>
      </div>
    </DefaultLayout>
  );
};

export default Models;
