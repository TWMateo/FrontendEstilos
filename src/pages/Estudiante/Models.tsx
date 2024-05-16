import React, { ChangeEvent, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import CardList from '../../components/CardList';
import MultiChoiceQuestion from '../../components/TypesQuestion/MultiChoiceQuestion';
import Likert from '../../components/TypesQuestion/Likert';
import { AlertError } from '../../components/Alerts/AlertError';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
import Modal from '../../components/Modal';

interface Opcion {
  id: number;
  opcion: string;
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
  id: number;
  orden: number;
  pregunta: string;
  tipoPregunta: string;
  opciones: Opcion[];
  escalas: string[];
  min: number;
  max: number;
}

interface ReglaDeCalculo {
  fila: string;
  columnas: string[];
}

interface Props {
  onGuardarTest: (test: Pregunta[]) => void;
}

const Models = () => {
  const [nombreTest, setNombreTest] = useState('');
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState('');
  const [opcionesPregunta, setOpcionesPregunta] = useState<Opcion[]>([]);
  const [estilosAprendizaje, setEstilosAprendizaje] = useState(['']);
  const [nuevoEstiloAprendizaje, setNuevoEstiloAprendizaje] = useState('');
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [estiloNuevaOpcion, setEstiloNuevaOpcion] = useState('');
  const [actualizandoEstilo, setActualizandoEstilo] = useState(false);
  const [estiloBuscado, setEstiloBuscado] = useState('');
  const [listaPreguntas, setListaPreguntas] = useState<Pregunta[]>([]);
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encuestaCuantitativa, setEncuestaCuantitativa] = useState(false);
  const [valorPregunta, setValorPregunta] = useState(1);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [reglaCalculo, setReglaCalculo] = useState<ReglaDeCalculo[]>([
    {
      fila: '',
      columnas: [''],
    },
  ]);

  const [tiposPreguntas, setTiposPreguntas] = useState({
    mensaje: 'Selecciona el tipo de pregunta',
    tipos: ['Selección múltiple', 'Likert'],
  });

  const tiposEstilosAprendizaje = {
    mensaje: 'Estilo de aprendizaje',
    tipos: estilosAprendizaje,
  };

  /* {Código relacionado al funcionamiento de las preguntas
   de opción multiple} */
  const handleClickAddOpcion = (idPregunta: number) => {
    let nuevoIdOpcion;
    if (idPregunta === undefined) return;
    let opciones = listaPreguntas.find((pre) => pre.id === idPregunta)
      ?.opciones;
    if (opciones === undefined) return;
    if (opciones.length == 0) {
      nuevoIdOpcion = 1;
    } else {
      nuevoIdOpcion = opciones[opciones?.length - 1].id + 1;
    }
    const opcion: Opcion = {
      id: nuevoIdOpcion,
      opcion: 'Opción ' + nuevoIdOpcion,
      estilo: '',
    };
    let copiaPreguntas = [...listaPreguntas];
    let pregunta = copiaPreguntas.find((pre) => pre.id === idPregunta);
    if (pregunta === undefined) return;
    pregunta.opciones = pregunta?.opciones.concat(opcion);
    setListaPreguntas(copiaPreguntas);
  };

  const handleChangePregunta = (idPregunta: number, pregunta: string) => {
    if (idPregunta === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    const index = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (index === -1) return;
    currentListaPregunta[index].pregunta = pregunta;
    setListaPreguntas(currentListaPregunta);
  };

  const handleChangeOpcion = (
    idPregunta: number,
    idOpcion: number,
    opcion: string = '',
    estilo: string = '',
  ) => {
    if (idPregunta === undefined || idOpcion === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    const indexPregunta = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    let currentOpciones = currentListaPregunta[indexPregunta].opciones;
    const indexOpciones = currentOpciones.findIndex(
      (opc) => opc.id === idOpcion,
    );
    if (estilo == '')
      currentListaPregunta[indexPregunta].opciones[indexOpciones].opcion =
        opcion;
    if (estilo != '')
      currentListaPregunta[indexPregunta].opciones[indexOpciones].estilo =
        estilo;
    setListaPreguntas(currentListaPregunta);
  };

  const handleClickDeleteOpcion = (idPregunta: number, idOpcion: number) => {
    if (idPregunta == undefined && idOpcion == undefined) return;
    let currentListaPreguntas = [...listaPreguntas];
    const indexPregunta = currentListaPreguntas.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta == -1) return;
    const currentListaOpciones = currentListaPreguntas[indexPregunta].opciones;
    if (currentListaOpciones.length == 1) return;
    const indexOpcion = currentListaOpciones.findIndex(
      (opc) => opc.id === idOpcion,
    );
    currentListaPreguntas[indexPregunta].opciones.splice(indexOpcion, 1);
    setListaPreguntas(currentListaPreguntas);
  };

  const handleClickDeletePregunta = (idPregunta: number) => {
    if (idPregunta === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    let indexPregunta = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta === -1) return;
    currentListaPregunta.splice(indexPregunta, 1);
    setListaPreguntas(currentListaPregunta);
  };

  const handleChangeLimiteRespuesta = (
    idPregunta: number,
    indicador: string,
    valor: number,
  ) => {
    if (idPregunta === undefined) return;
    let currentListaPreguntas = [...listaPreguntas];
    let index = currentListaPreguntas.findIndex((pre) => pre.id === idPregunta);
    if (index === -1) return;
    currentListaPreguntas[index].min = 0;
    currentListaPreguntas[index].max = 0;
    if (indicador === 'min') {
      currentListaPreguntas[index].min = valor;
    }
    if (indicador === 'max') {
      currentListaPreguntas[index].max = valor;
    }
    setListaPreguntas(currentListaPreguntas);
  };

  const handleChangeValorRespuesta = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let valor = parseInt(e.target.value);
    if (isNaN(valor)) {
      setValorPregunta(1);
      return;
    }
    if (valor <= 0) return;
    setValorPregunta(valor);
  };

  /*{Código relacionado al funcionamiento del registro de las reglas 
    de cálculo
  }*/

  const handleClickAddFilaReglaCalculo = () => {
    if (reglaCalculo.length >= tiposEstilosAprendizaje.tipos.length) return;
    let currentReglaCalculo = reglaCalculo;
    let nuevaReglaCalculo = currentReglaCalculo.concat({
      fila: '',
      columnas: [''],
    });
    setReglaCalculo(nuevaReglaCalculo);
  };

  const handleClickAddColumnaReglaCalculo = (indexFila: number) => {
    let currentFila = reglaCalculo[indexFila];
    if (currentFila.columnas.length >= tiposEstilosAprendizaje.tipos.length)
      return;
    let nuevasColumnas = currentFila.columnas.concat('');
    currentFila.columnas = nuevasColumnas;
    let currentReglaCalculo = [...reglaCalculo];
    currentReglaCalculo[indexFila] = currentFila;
    setReglaCalculo(currentReglaCalculo);
  };

  const handleClickDeleteReglaCalculo = (
    indexFila: number,
    indexColumna?: number,
  ) => {
    if (indexFila == undefined) return;
    let currentFila = reglaCalculo[indexFila];
    let currentReglaCalculo = [...reglaCalculo];
    if (indexFila != undefined && indexColumna != undefined) {
      if (currentFila.columnas.length == 1) return;
      currentFila.columnas.splice(indexColumna, 1);
      currentReglaCalculo[indexFila] = currentFila;
      setReglaCalculo(currentReglaCalculo);
    }
    if (indexFila != undefined && indexColumna == undefined) {
      if (currentReglaCalculo.length == 1) return;
      currentReglaCalculo.splice(indexFila, 1);
      setReglaCalculo(currentReglaCalculo);
    }
  };

  const handleChangeReglaCalculo = (
    indexFila: number,
    indexColumna: number,
    opcion: string = '',
    estilo: string = '',
  ) => {
    let currentReglaCalculo = [...reglaCalculo];
    if (estilosAprendizaje.findIndex((est) => est == estilo) == -1) return;
    if (indexColumna != undefined && indexColumna >= 0) {
      currentReglaCalculo[indexFila].columnas[indexColumna] = estilo;
    }
    if (indexColumna < 0) {
      currentReglaCalculo[indexFila].fila = estilo;
    }
    setReglaCalculo(currentReglaCalculo);
  };

  /*{Código relacionado al funcionamiento del ingreso de los datos
     del test}*/
  const onGuardarTest = () => {
    if (
      nombreTest.length == 0 ||
      autor.length == 0 ||
      descripcion.length == 0 ||
      nombreTest.length == 0 ||
      estilosAprendizaje.length == 0 ||
      listaPreguntas.length == 0 ||
      reglaCalculo.length == 0 ||
      reglaCalculo[0].fila == '' ||
      reglaCalculo[0].columnas[0] === ''
    ) {
      cambiarEstadoErrorGuardadoTemporalmente();
      return;
    }
    for (const pregunta of listaPreguntas) {
      if (pregunta.pregunta.length === 0) {
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }
      for (const opcion of pregunta.opciones) {
        if (opcion.estilo.length == 0) {
          cambiarEstadoErrorGuardadoTemporalmente();
          return;
        }
        if (opcion.opcion.length == 0) {
          cambiarEstadoErrorGuardadoTemporalmente();
          return;
        }
      }
    }
    const fecha = new Date();
    const test: Test = {
      titulo: nombreTest,
      autor: autor,
      descripcion: descripcion,
      cuantitativa: encuestaCuantitativa,
      fechaCreacion: fecha.toLocaleDateString(),
      estilosAprendizaje: estilosAprendizaje,
      preguntas: listaPreguntas,
    };
    cambiarEstadoGuardadoTemporalmente()
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

  const handleClickDeleteEstiloAprendizaje = (estilo: string) => {
    const index = estilosAprendizaje.indexOf(estilo);
    let currentEstilosAprendizaje = [...estilosAprendizaje];
    let nuevasReglas;
    let nuevasPreguntas: Pregunta[] = [];
    if (index != -1) {
      if (currentEstilosAprendizaje.length == 1) {
        currentEstilosAprendizaje[0] = '';
        setListaPreguntas(nuevasPreguntas);
      } else {
        const preguntasActualizadas = listaPreguntas.map((pregunta) => ({
          ...pregunta,
          opciones: pregunta.opciones.filter((opc) => opc.estilo !== estilo),
        }));
        setListaPreguntas(preguntasActualizadas);
        currentEstilosAprendizaje.splice(index, 1);
      }
      nuevasReglas = reglaCalculo.filter((regla) => {
        const valorCoincide =
          regla.fila === estilo || regla.columnas.includes(estilo);
        return !valorCoincide;
      });
      setEstilosAprendizaje(currentEstilosAprendizaje);
      setReglaCalculo(nuevasReglas);
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

  const cambiarTipoPregunta = (valor: string) => {
    setTipoPregunta(valor);
    setOpcionesPregunta([]);
    setNuevaOpcion('');
    setEstiloNuevaOpcion('');
  };

  const handleClickAddPregunta = () => {
    // Añadir mas campos para evitar la adición de preguntas si
    // no se llenan
    // if (nombreTest.length == 0) return;
    if (estilosAprendizaje[0] == '') return;
    let IdUltimaPregunta;
    if (listaPreguntas.length == 0) {
      IdUltimaPregunta = 1;
    } else {
      IdUltimaPregunta = listaPreguntas[listaPreguntas.length - 1].id + 1;
    }
    let escalas: string[] = [];
    if (tipoPregunta == 'Likert')
      escalas = [
        'Muy insatisfecho',
        'Insatisfecho',
        'Neutral',
        'Satisfecho',
        'Muy satisfecho',
      ];
    const pregunta: Pregunta = {
      id: IdUltimaPregunta,
      orden: listaPreguntas.length + 1,
      pregunta: 'Nueva pregunta',
      tipoPregunta: tipoPregunta,
      opciones: [
        { id: 1, opcion: 'Opción 1', estilo: '' },
        { id: 2, opcion: 'Opción 2', estilo: '' },
      ],
      escalas: escalas,
      min: 0,
      max: 0,
    };
    const nuevaLista = listaPreguntas
      .concat(pregunta)
      .sort((a, b) => a.orden - b.orden);
    setListaPreguntas(nuevaLista);
    ResetCamposPregunta();
  };

  const ResetCamposPregunta = () => {
    setNuevaPregunta('');
    setOpcionesPregunta([]);
    setNuevaOpcion('');
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
    if (!encuestaCuantitativa) setValorPregunta(1);
    if (encuestaCuantitativa) {
      setTiposPreguntas({
        mensaje: 'Selecciona el tipo de pregunta',
        tipos: ['Selección múltiple'],
      });
      setListaPreguntas([]);
      setTipoPregunta('Selección múltiple');
    } else {
      setTiposPreguntas({
        mensaje: 'Selecciona el tipo de pregunta',
        tipos: ['Selección múltiple', 'Likert'],
      });
      setListaPreguntas([]);
    }
  }, [encuestaCuantitativa]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    onGuardarTest();
    handleCloseModal();
  };

  const cambiarEstadoGuardadoTemporalmente = () => {
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
    }, 4000); 
  };

  const cambiarEstadoErrorGuardadoTemporalmente = () => {
    setErrorGuardado(true);
    setTimeout(() => {
      setErrorGuardado(false);
    }, 4000);
  };

  // Pruebas de estados
  useEffect(() => {
    console.log('Listado pregunta');
    console.log(listaPreguntas);
  }, [listaPreguntas]);

  useEffect(() => {
    console.log('Estilos aprendizaje');
    console.log(estilosAprendizaje);
  }, [estilosAprendizaje]);

  useEffect(() => {
    console.log(valorPregunta);
    console.log('');
  }, [valorPregunta]);

  useEffect(() => {
    console.log(reglaCalculo);
    console.log('tamaño regla');
    console.log(reglaCalculo.length);
  }, [reglaCalculo]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Modelos" />
      {guardado && (
        <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
          <AlertSucessfull titulo="Test Guardado" mensaje="" />
        </div>
      )}
      {errorGuardado && (
        <div className="sticky mb-4 top-20 bg-[#e4bfbf] dark:bg-[#1B1B24] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[4000ms] animate-ease-in-out animate-reverse animate-fill-both">
          <AlertError
            titulo="Test no guardado"
            mensaje="Todos los campos deben estar llenos"
          />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
              Título:
            </h3>
            <input
              type="text"
              placeholder="Nombre del modelo"
              maxLength={75}
              value={nombreTest.length > 0 ? nombreTest : ''}
              onChange={(e) => setNombreTest(e.target.value)}
              className={`w-full ${
                nombreTest.length == 0 ? 'rounded-t-lg' : 'rounded-lg'
              } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {nombreTest.length == 0 && (
              <AlertError mensaje="El campo no debe estar vacío" />
            )}
          </div>
          <div className="">
            <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
              Autor:
            </h3>
            <input
              type="text"
              placeholder="Nombre del autor"
              value={autor}
              maxLength={100}
              onChange={(e) => setAutor(e.target.value)}
              className={`w-full ${
                autor.length == 0 ? 'rounded-t-lg' : 'rounded-lg'
              } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {autor.length == 0 && (
              <AlertError mensaje="El campo no debe estar vacío" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-title-xsm font-semibold text-black dark:text-white">
              Tipo de test:
            </h3>
            <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
              <label className="flex items-center gap-3 pt-2 pb-2">
                <div className="w-full pl-4 font-semibold">Cualitativo</div>
                <div>
                  <input
                    title="Cualitativo"
                    type="radio"
                    name="tipoTest"
                    onClick={() => setEncuestaCuantitativa(false)}
                    className="sr-only"
                  />
                  <div
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                      !encuestaCuantitativa && 'border-primary'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                        !encuestaCuantitativa && '!bg-primary'
                      }`}
                    >
                      {' '}
                    </span>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 pt-2 pb-2">
                <div className="w-full pl-4 font-semibold">Cuantitativo</div>
                <div className="relative">
                  <input
                    title="Cuantitativo"
                    type="radio"
                    name="tipoTest"
                    onClick={() => setEncuestaCuantitativa(true)}
                    className="sr-only"
                  />
                  <div
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                      encuestaCuantitativa && 'border-primary'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                        encuestaCuantitativa && '!bg-primary'
                      }`}
                    >
                      {' '}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
              Descripción:
            </h3>
            <textarea
              placeholder="Descripción del test"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={100}
              className={`w-full h-[83%] ${
                descripcion.length == 0 ? 'rounded-t-lg' : 'rounded-lg'
              } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {descripcion.length == 0 && (
              <AlertError mensaje="El campo no debe estar vacío" />
            )}
          </div>
        </div>
        <div className="gap-4">
          <h3 className="text-title-xsm pt-2 pb-4 font-semibold text-black dark:text-white">
            Valor de preguntas:
          </h3>
          <input
            type="number"
            placeholder="Valor cuantitativo"
            value={valorPregunta}
            onChange={handleChangeValorRespuesta}
            className="rounded-lg w-full h-13 border-[1.5px] border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
              Estilos de aprendizaje:
            </h3>
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Agregar nuevo estilo"
                value={nuevoEstiloAprendizaje}
                onChange={(e) => setNuevoEstiloAprendizaje(e.target.value)}
                className={`w-[50%] ${
                  estilosAprendizaje[0] == '' ? 'rounded-tl-lg' : 'rounded-l-lg'
                } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {actualizandoEstilo === true ? (
                <button
                  className={`flex w-[50%] justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
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
            {estilosAprendizaje[0] == '' && (
              <AlertError mensaje="La lista no debe estar vacío" />
            )}
            <ul className="grid grid-cols-3 gap-4 pt-3">
              {estilosAprendizaje[0].length > 0 &&
                estilosAprendizaje.map((estilo) => (
                  <CardList
                    actualizar={prepararActualizacionEstilo}
                    eliminar={handleClickDeleteEstiloAprendizaje}
                    valor={estilo}
                    limite={11}
                  />
                ))}
            </ul>
          </div>
          {/* Sección de reglas de cálculo */}
          <div>
            <h3 className="text-title-xsm pt-3 pb-3 font-semibold text-black dark:text-white">
              Regla de cálculo:
            </h3>
            <div className="flex flex-col bg-whiten dark:bg-form-input gap-5 rounded-lg border-[1.5px] border-black py-8 px-5 dark:text-white outline-none transition dark:border-form-strokedark">
              <div className="flex flex-col overflow-auto">
                <table>
                  <tbody>
                    {reglaCalculo.map((estilo, index) => (
                      <tr className="flex">
                        <td className="flex w-65 flex-row content-center">
                          <SelectGroupOne
                            onChangeTwo={handleChangeReglaCalculo}
                            opciones={tiposEstilosAprendizaje}
                            idPregunta={index}
                            idOpcion={-1}
                          />
                          <button
                            title="Añadir"
                            className="rounded-md hover:bg-opacity-90"
                            onClick={() =>
                              handleClickAddColumnaReglaCalculo(index)
                            }
                          >
                            {' '}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={18}
                              height={18}
                              className="fill-black ml-3 mb-5 dark:fill-bodydark1"
                              viewBox="0 0 448 512"
                            >
                              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                            </svg>
                          </button>
                          <button
                            title="Borrar"
                            className={`w-[5%] pt-1 ml-3 mb-5`}
                            onClick={() => handleClickDeleteReglaCalculo(index)}
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
                        </td>
                        {estilo.columnas.map((columna, indexColumna) => (
                          <td className="w-54 flex">
                            <SelectGroupOne
                              onChangeTwo={handleChangeReglaCalculo}
                              opciones={tiposEstilosAprendizaje}
                              idPregunta={index}
                              idOpcion={indexColumna}
                            />
                            <button
                              title="Borrar"
                              className={`w-[5%] pt-1 ml-3 mb-5`}
                              onClick={() =>
                                handleClickDeleteReglaCalculo(
                                  index,
                                  indexColumna,
                                )
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
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                title="Añadir"
                className="flex rigth items-center pt-1 pb-1 w-[25%] lg:p-2 lg:pt-2 lg:pb-2 bg-primary rounded-lg hover:bg-opacity-90 dark:text-bodydark1"
                onClick={() => handleClickAddFilaReglaCalculo()}
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
                <div className="text-sm w-[60%] text-gray">Añadir una fila</div>
              </button>
            </div>
            {reglaCalculo.length == 0 && (
              <AlertError mensaje="La regla de calculo debe definirse" />
            )}
          </div>
        </div>
        {/* Sección de previsualizacion del test */}
        <div className="flex flex-col gap-6">
          <h3 className="text-title-xsm pt-4 placeholder:b-4 font-semibold text-black dark:text-white">
            Test:
          </h3>
          {listaPreguntas &&
            listaPreguntas.map((pre) => (
              <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
                {pre.tipoPregunta === 'Selección múltiple' && (
                  <MultiChoiceQuestion
                    pregunta={pre}
                    tiposEstilosAprendizaje={tiposEstilosAprendizaje}
                    onUpdatePregunta={handleChangePregunta}
                    onUpdateOpcion={handleChangeOpcion}
                    onDeleteOpcion={handleClickDeleteOpcion}
                    onDeletePregunta={handleClickDeletePregunta}
                    onAddOpcion={handleClickAddOpcion}
                    onUpdateLimiteRespuesta={handleChangeLimiteRespuesta}
                  />
                )}
                {pre.tipoPregunta === 'Likert' && (
                  <Likert
                    pregunta={pre}
                    tiposEstilosAprendizaje={tiposEstilosAprendizaje}
                    onUpdatePregunta={handleChangePregunta}
                    onAddOpcion={handleClickAddOpcion}
                    onDeleteOpcion={handleClickDeleteOpcion}
                    onDeletePregunta={handleClickDeletePregunta}
                    onUpdateOpcion={handleChangeOpcion}
                  />
                )}
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Tipo de pregunta:
          </h3>
          <SelectGroupOne
            onChange={cambiarTipoPregunta}
            opciones={tiposPreguntas}
            opcionPorDefecto={tipoPregunta}
          />
        </div>
        <div className="flex gap-4">
          <button
            className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            onClick={handleClickAddPregunta}
          >
            Agregar Pregunta
          </button>
          <button
            className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            onClick={handleOpenModal}
          >
            Guardar Test
          </button>
          <Modal
            isOpen={isModalOpen}
            mensaje="¿Estás seguro de guardar el test?"
            onClose={handleCloseModal}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Models;
