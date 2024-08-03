import DefaultLayout from '../../../layout/DefaultLayout';
import { SessionContext } from '../../../Context/SessionContext';
import { useContext, useEffect, useState } from 'react';
import Loader from '../../../common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import MultiChoiceResponse from '../../../components/TypesQuestionResponse/MultiChoiceResponse';
import LikertResponse from '../../../components/TypesQuestionResponse/LikertResponse';
import MultiChoiceCuantitativaResponse from '../../../components/TypesQuestionResponse/MultiChoiceCuantitativaResponse';
import { AlertSucessfull } from '../../../components/Alerts/AlertSuccesfull';
import { AlertError } from '../../../components/Alerts/AlertError';
import Modal from '../../../components/Modal';

interface Respuesta {
  usuarioId: number;
  encuestaId: number;
  preguntaId: number;
  opcionId: number;
  valorOpc?: number;
  estilo?: string;
}

interface Asignacion {
  asi_id: number;
  enc_id: number;
  cur_id: number;
  usu_id: number;
  mat_id: number;
  asi_descripcion: string;
  asi_fecha_completado: string;
  asi_realizado: boolean;
}

interface Historial {
  asi_id: number;
  cur_id: number;
  est_cedula: string;
  his_fecha_encuesta: string;
  his_nota_estudiante: string;
  his_resultado_encuesta: string;
}

interface RespuestaEnvio {
  asi_id: number;
  opc_id: number;
  pre_id: number;
  usu_id: number;
  res_valor_cuantitativo:number;
}

interface TestEstructurado {
  titulo: string;
  autor: string;
  descripcion: string;
  cuantitativa: boolean;
  fechaCreacion: string;
  estilosAprendizaje: string[];
  valorPregunta: number;
  preguntas: {
    id: number;
    orden: number;
    pregunta: string;
    tipoPregunta: string;
    opciones: {
      id: number;
      opcion: string;
      estilo: string;
    }[];
    escalas: string[];
    min: number;
    max: number;
  }[];
  reglaCalculo: {
    estilo: string;
    condiciones: {
      parametros: {
        value: string[];
        operacion: string;
      }[];
      condicion: string;
      valor: number;
      comparacion: string;
    }[];
  }[];
}

interface ConteoEstilos {
  [key: string]: number;
}

interface ResultadosTest {
  [key: string]: boolean;
}

const Test = () => {
  const navigate = useNavigate();
  const { id, idAsignacion } = useParams<{
    id: string;
    idAsignacion: string;
  }>();
  const [asignacion, setAsignacion] = useState<Asignacion>();
  const [loadingTest, setLoadingTest] = useState(true);
  const [pantallaResultado, setPantallaResultado] = useState(false);
  const [resultadoPantalla, setResultadoPantalla] = useState('');
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [idTest, setIdTest] = useState<number>();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [errorGuardadoCuantitativa, setErrorGuardadoCuantitativa] =
    useState(false);
  const [testAsignado, setTestAsignado] = useState<TestEstructurado | null>(
    null,
  );

  const limpiarRespuestas = (respuestas: Respuesta[]): Respuesta[] => {
    return respuestas.filter((respuesta) => respuesta.valorOpc !== 0);
  };

  const handleAddRespuesta = (
    preguntaId: number,
    opcionId: number,
    valorOpc?: number,
    estiloI?: string,
  ) => {
    if (!usuId) {
      return;
    }
    let usuarioId = usuId;
    if (!idTest) return;
    let currentR = [...respuestas];
    const respuestasLimpias = limpiarRespuestas(currentR);
    let currentResponses = respuestasLimpias;

    let nuevaRespuesta: Respuesta = {
      encuestaId: idTest,
      usuarioId: usuarioId,
      preguntaId: preguntaId,
      opcionId: opcionId,
      valorOpc: valorOpc ? valorOpc : 0,
      estilo: estiloI,
    };

    let exists = currentResponses.some(
      (respuesta) =>
        respuesta.encuestaId === nuevaRespuesta.encuestaId &&
        respuesta.usuarioId === nuevaRespuesta.usuarioId &&
        respuesta.preguntaId === nuevaRespuesta.preguntaId &&
        respuesta.opcionId === nuevaRespuesta.opcionId,
    );
    if (exists) {
      if (testAsignado?.cuantitativa) {
        let index = currentResponses.findIndex(
          (resp) =>
            resp.encuestaId === nuevaRespuesta.encuestaId &&
            resp.usuarioId === nuevaRespuesta.usuarioId &&
            resp.preguntaId === nuevaRespuesta.preguntaId &&
            resp.opcionId === nuevaRespuesta.opcionId,
        );
        currentResponses[index] = nuevaRespuesta;
      } else {
        currentResponses = currentResponses.filter(
          (respuesta) =>
            !(
              respuesta.encuestaId === nuevaRespuesta.encuestaId &&
              respuesta.usuarioId === nuevaRespuesta.usuarioId &&
              respuesta.preguntaId === nuevaRespuesta.preguntaId &&
              respuesta.opcionId === nuevaRespuesta.opcionId
            ),
        );
      }
    } else {
      currentResponses.push(nuevaRespuesta);
    }
    console.log('RESPUESTAS');
    console.log(currentResponses);
    setRespuestas(currentResponses);
  };

  const handleAddRespuestaLikert = (
    preguntaId: number,
    opcionId: number,
    valorOpc?: number,
    estiloI?: string,
  ) => {
    if (!usuId) {
      return;
    }
    let usuarioId = usuId;
    if (!idTest) return;
    let currentResponses = [...respuestas];
    let nuevaRespuesta: Respuesta = {
      encuestaId: idTest,
      usuarioId: usuarioId,
      preguntaId: preguntaId,
      opcionId: opcionId,
      valorOpc: valorOpc ? valorOpc : 1,
      estilo: estiloI,
    };
    currentResponses = currentResponses.filter(
      (respuesta) =>
        !(
          respuesta.encuestaId === nuevaRespuesta.encuestaId &&
          respuesta.usuarioId === nuevaRespuesta.usuarioId &&
          respuesta.preguntaId === nuevaRespuesta.preguntaId &&
          respuesta.opcionId === nuevaRespuesta.opcionId
        ),
    );

    currentResponses.push(nuevaRespuesta);

    setRespuestas(currentResponses);
  };

  const fetchTest = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/encuestaDetalles/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );
      const data = await response.json();
      const dataEstructurada = await transformData(data.data);
      await console.log(dataEstructurada);
      setTestAsignado(dataEstructurada);
    } catch (error) {
      console.error('Error al obtener las asignaciones:', error);
    }
  };

  const transformData = (data: any) => {
    console.log(data.reglas[0].reglas_json);
    data.reglas[0].reglas_json.map((reg: any) => {
      console.log(reg);
    });
    return {
      titulo: data.enc_titulo || '',
      autor: data.enc_autor || '',
      descripcion: data.enc_descripcion || '',
      cuantitativa: data.enc_cuantitativa || false,
      fechaCreacion: data.enc_fecha_creacion
        ? new Date(data.enc_fecha_creacion).toLocaleDateString()
        : '',
      estilosAprendizaje: data.estilos
        ? data.estilos.map((estilo: any) => estilo.est_nombre)
        : [],
      valorPregunta:
        data.preguntas && data.preguntas.length > 0
          ? data.preguntas[0].pre_valor_total
          : 0,
      preguntas: data.preguntas
        ? data.preguntas.map((pregunta: any) => ({
            id: pregunta.pre_id,
            orden: pregunta.pre_orden,
            pregunta: pregunta.pre_enunciado,
            tipoPregunta:
              pregunta.pre_tipo_pregunta === 'seleccion'
                ? 'Seleccion multiple'
                : 'Likert',
            opciones: pregunta.opciones
              ? pregunta.opciones.map((opcion: any) => ({
                  id: opcion.opc_id,
                  opcion: opcion.opc_texto,
                  estilo: opcion.valor_cualitativo,
                }))
              : [],
            escalas:
              pregunta.pre_tipo_pregunta === 'likert'
                ? [
                    'Muy insatisfecho',
                    'Insatisfecho',
                    'Neutral',
                    'Satisfecho',
                    'Muy satisfecho',
                  ]
                : [],
            min: pregunta.pre_num_respuestas_min,
            max: pregunta.pre_num_respuestas_max,
          }))
        : [],
      reglaCalculo: data.reglas
        ? data.reglas[0].reglas_json.map((regla: any) => ({
            estilo: regla.estilo && regla.estilo.length > 0 ? regla.estilo : '',
            condiciones:
              regla.condiciones && regla.condiciones.length > 0
                ? regla.condiciones.map((condicion: any) => ({
                    parametros: condicion.parametros.map((parametro: any) => ({
                      value: parametro.value,
                      operacion: parametro.operacion,
                    })),
                    condicion: condicion.condicion,
                    valor: condicion.valor,
                    comparacion: condicion.comparacion,
                  }))
                : [],
          }))
        : [],
    };
  };

  useEffect(() => {
    if (!id) return;
    let idNewTest = parseInt(id);
    setIdTest(idNewTest);
    fetchTest(parseInt(id));
    fetchAsignacion();
    setTimeout(() => {
      setLoadingTest(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (!idAsignacion) return;
    console.log(idAsignacion);
  }, [idAsignacion]);

  useEffect(() => {
    console.log('Verificando respuestas');
    console.log(respuestas);
  }, [respuestas]);

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    handleSendTest();
    handleCloseModal();
  };

  const cambiarEstadoErrorGuardadoTemporalmente = () => {
    setErrorGuardado(true);
    setTimeout(() => {
      setErrorGuardado(false);
    }, 7000);
  };

  const cambiarEstadoErrorGuardadoCuantitativa = () => {
    setErrorGuardadoCuantitativa(true);
    setTimeout(() => {
      setErrorGuardadoCuantitativa(false);
    }, 7000);
  };

  const cambiarEstadoGuardadoTemporalmente = () => {
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
    }, 4000);
  };

  const fetchAsignacion = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/asignacion/${idAsignacion}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAsignacion(data.data);
    } catch (error) {
      console.error('Error al obtener datos de asignación:', error);
      throw error;
    }
  };

  const postHistorial = async (historialData: Historial) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/historial',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(historialData),
        },
      );

      if (response.status != 201) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar el historial');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al enviar el historial:', error);
      throw error;
    }
  };

  const postRespuesta = async (respuestaData: RespuestaEnvio) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/respuesta',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(respuestaData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar la respuesta');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      throw error;
    }
  };

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function getRandomKey(obj: { [key: string]: boolean | number }): string {
    const keys = Object.keys(obj);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  const handleSendTest = () => {
    const res = respuestas;
    const reglaCalculo = testAsignado?.reglaCalculo;
    let preguntas = testAsignado?.preguntas;
    if (!preguntas) {
      cambiarEstadoErrorGuardadoTemporalmente();
      return;
    }
    for (let i = 0; i < preguntas.length; i++) {
      const element = preguntas[i];
      let cantidadRespuestas;

      if (element.min != 0) {
        cantidadRespuestas = respuestas.filter(
          (resp) => resp.preguntaId === element.id,
        );

        if (cantidadRespuestas.length != element.min) {
          cambiarEstadoErrorGuardadoTemporalmente();
          return;
        }
      } else if (element.max != 0) {
        cantidadRespuestas = respuestas.filter(
          (resp) => resp.preguntaId === element.id,
        );

        if (cantidadRespuestas.length == 0) {
          cambiarEstadoErrorGuardadoTemporalmente();
          return;
        }
      }

      cambiarEstadoGuardadoTemporalmente();
    }

    // if (!testAsignado?.cuantitativa) {
    const conteoEstiloS: ResultadosTest = {};
    const sumatoriaEstilos: any = [];
    const conteoParametros: ConteoEstilos = {};
    //CONTEO DE ESTILOS
    reglaCalculo?.forEach((regla) => {
      conteoEstiloS[regla.estilo] = false;
      // sumatoriaEstilos.push({[regla.estilo]:0});
    });
    //ESTA SECCION SE REPITE
    res.forEach((respuesta) => {
      let resp: RespuestaEnvio = {
        asi_id: 0,
        opc_id: 0,
        pre_id: 0,
        usu_id: 0,
        res_valor_cuantitativo:0
      };
      const { estilo, valorOpc } = respuesta;
      if (!estilo) return;
      if (!valorOpc) return;
      if(!respuesta.valorOpc) return;
      if (!idAsignacion) return;
      // console.log(respuesta);
      resp.asi_id = parseInt(idAsignacion);
      resp.opc_id = respuesta.opcionId;
      resp.pre_id = respuesta.preguntaId;
      resp.usu_id = respuesta.usuarioId;
      resp.res_valor_cuantitativo=respuesta.valorOpc;
      postRespuesta(resp);
      if (!conteoParametros.hasOwnProperty(estilo)) {
        conteoParametros[estilo] = 0;
      }
    });
    reglaCalculo?.forEach((regla) => {
      let sumaCondiciones = 0;
      let operacion: string;
      let operadores: boolean[] = [];
      let condiciones: string[] = [];
      if (regla.condiciones.length > 0) {
        let hayCondicion = false;
        regla.condiciones.forEach((condicion) => {
          let primerParametro = true;
          let sumaParametros = 0;
          let operadoresParciales = '';
          let contadorParam = 0;
          //-------------------

          condicion.parametros.forEach((parametro) => {
            let sumaRespuestas = 0;
            contadorParam++;
            operadoresParciales += parametro.value + ' ' + operacion + ' ';
            res.forEach((respuesta) => {
              const { estilo, valorOpc } = respuesta;
              if (!estilo) return;
              if (!valorOpc) return;
              if (parametro.value.includes(estilo)) {
                sumaRespuestas += valorOpc;
              }
            });
            conteoParametros[parametro.value[0]] = sumaRespuestas;
            if (primerParametro) {
              sumaParametros = sumaRespuestas;
              primerParametro = false;
              operacion = parametro.operacion;
            } else {
              sumaParametros = aplicarOperacion(
                sumaParametros,
                sumaRespuestas,
                operacion,
              );
              operacion = parametro.operacion;
            }
          });
          //SUMAR LAS RESPUESTAS SI NO HA NINGUNA CONDICIÓN
          if (condicion.condicion == 'ninguna') {
            hayCondicion = false;
            sumatoriaEstilos.push({ [regla.estilo]: sumaParametros });
          }
          //EVALUAR LA CONDICIÓN SI EXISTE
          if (
            condicion.condicion != 'ninguna' &&
            !evaluarCondicion(
              sumaParametros,
              condicion.condicion,
              condicion.valor,
            )
          ) {
            hayCondicion = true;
            operadores.push(false);
          } else {
            hayCondicion = true;
            operadores.push(true);
            sumaCondiciones += sumaParametros;
          }
          if (hayCondicion) {
            condiciones.push(condicion.comparacion);
          }
        });
        if (hayCondicion) {
          let resultado = evaluateConditions(operadores, condiciones);
          operadores = [];
          conteoEstiloS[regla.estilo] = resultado;
        }
      } else {
        //EN EL CASO DE QUE NO HAYA CONDICIONES
        let sumaTotal = 0;
        res.forEach((item) => {
          if (item.estilo === regla.estilo) {
            if (!item.valorOpc) return;
            sumaTotal += item.valorOpc;
          }
        });
        sumatoriaEstilos.push({ [regla.estilo]: sumaTotal });
      }
    });

    let maxValor = -Infinity;
    let resultado: { [key: string]: boolean }[] = [];

    sumatoriaEstilos.forEach((obj: any) => {
      let valor: unknown = Object.values(obj)[0];
      if (typeof valor === 'number' && valor > maxValor) {
        maxValor = valor;
      }
    });
    sumatoriaEstilos.forEach((obj: any) => {
      const estilo = Object.keys(obj)[0];
      const valor = Object.values(obj)[0];
      resultado.push({ [estilo]: valor === maxValor });
    });
    resultado.forEach((respuesta: { [key: string]: boolean }) => {
      const [clave, valor] = Object.entries(respuesta)[0];
      if (conteoEstiloS.hasOwnProperty(clave)) {
        conteoEstiloS[clave] = valor;
      }
    });
    console.log('RESULTADO C1: ')
    console.log(sumatoriaEstilos)
    console.log('RESULTADOS C2: ')
    console.log(conteoParametros);
    let jsonRespuesta;
    if(sumatoriaEstilos.length>0){
      let nuevoJson = sumatoriaEstilos.reduce((acc:any, item:any) => {
        const [key, value] = Object.entries(item)[0];
        acc[key] = value;
        return acc;
      }, {});
      jsonRespuesta = JSON.stringify(nuevoJson);
    }else{
      console.log('no')
      jsonRespuesta=JSON.stringify(conteoParametros);
      console.log(jsonRespuesta)
    }

    let arrayConteoEstilos = Object.entries(conteoEstiloS).map(
      ([clave, valor]) => ({ [clave]: valor }),
    );
    let estiloPredominante: string[] = [];
    let mensajeRespuesta;

    arrayConteoEstilos.forEach((objeto) => {
      const [clave, valor] = Object.entries(objeto)[0];
      if (valor) {
        estiloPredominante.push(clave);
      }
    });
    if (estiloPredominante.length === 0) {
      mensajeRespuesta = 'No se ha identificado ningún estilo predominante.';
    } else if (estiloPredominante.length === 1) {
      mensajeRespuesta = `${estiloPredominante[0]}.`;
    } else {
      mensajeRespuesta = `Posees rasgos relacionados a los estilos ${estiloPredominante.join(
        ', ',
      )}.`;
    }
    console.log('MENSAJE RESPUESTA: '+mensajeRespuesta)
    if (!asignacion) {
      console.log(asignacion);
      return;
    }
    let fechaTerminado: Date = new Date();
    let fechaFormateada = formatDate(fechaTerminado);
    let historialRespuesta: Historial = {
      asi_id: asignacion?.asi_id,
      cur_id: asignacion?.cur_id,
      his_fecha_encuesta: fechaFormateada,
      est_cedula: usuCedula,
      his_nota_estudiante: jsonRespuesta,
      his_resultado_encuesta: mensajeRespuesta,
    };
    historialRespuesta.est_cedula = usuCedula;
    historialRespuesta;
    postHistorial(historialRespuesta);
    let asignacionActualizar = {
      enc_id: asignacion.enc_id,
      usu_id: asignacion.usu_id,
      cur_id: asignacion.cur_id,
      mat_id: asignacion.mat_id,
      asi_descripcion: asignacion.asi_descripcion,
      asi_fecha_completado: fechaTerminado.toISOString(),
      asi_realizado: true,
    };
    actualizarAsignacion(asignacion?.asi_id, asignacionActualizar);
    setPantallaResultado(true);
    setResultadoPantalla(mensajeRespuesta);
  };

  useEffect(() => {
    if (pantallaResultado) {
      const timer = setTimeout(() => {
        navigate('/resultado', {
          state: {
            resultado: resultadoPantalla,
            titulo: testAsignado?.titulo,
            autor: testAsignado?.autor,
          },
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pantallaResultado]);

  async function actualizarAsignacion(asi_id: number, asignacionData: any) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/asignacion/${asi_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(asignacionData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la asignación');
      }

      const data = await response.json();
      console.log('Asignación actualizada:', data);
      return data;
    } catch (error: any) {
      console.error('Error al actualizar la asignación:', error.message);
      throw error;
    }
  }

  const evaluateConditions = (conditions: boolean[], operators: string[]) => {
    let result = conditions[0];

    for (let i = 0; i < operators.length - 1; i++) {
      if (operators[i] === 'and') {
        result = result && conditions[i + 1];
      } else if (operators[i] === 'or') {
        result = result || conditions[i + 1];
      } else {
        console.log('error');
        throw new Error(`Operador desconocido: ${operators[i]}`);
      }
    }
    return result;
  };

  const aplicarOperacion = (
    acumulado: number,
    valor: number,
    operacion: string,
  ) => {
    switch (operacion) {
      case 'suma':
        return acumulado + valor;
      case 'resta':
        return acumulado - valor;
      case 'multiplicacion':
        return acumulado * valor;
      case 'division':
        return acumulado / valor;
      default:
        return acumulado;
    }
  };

  const evaluarCondicion = (suma: number, condicion: string, valor: number) => {
    switch (condicion) {
      case 'mayor':
        return suma > valor;
      case 'igual':
        return suma === valor;
      case 'menor':
        return suma < valor;
      case 'mayor o igual que':
        return suma >= valor;
      case 'menor o igual que':
        return suma <= valor;
      case 'ninguna':
        return true; // No se toma en cuenta la condición
      default:
        return false;
    }
  };

  return (
    <DefaultLayout>
      {loadingTest ? (
        <Loader />
      ) : (
        <>
          {guardado && (
            <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertSucessfull titulo="Test Guardado" mensaje="" />
            </div>
          )}
          {errorGuardado && (
            <div className="sticky mb-4 top-20 bg-[#e4bfbf] dark:bg-[#1B1B24] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[4000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertError
                titulo="Test no guardado"
                mensaje="Todos las preguntas deben ser respondidas"
              />
            </div>
          )}
          {errorGuardadoCuantitativa && (
            <div className="sticky mb-4 top-20 bg-[#e4bfbf] dark:bg-[#1B1B24] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[4000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertError
                titulo="Test no guardado"
                mensaje="La sumatoria de las respuestas debe cumplir el valor maximo indicado en las preguntas."
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center w-[100%] gap-8 bg-stroke dark:bg-transparent">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Test de {testAsignado?.titulo}
            </h3>
            <div>{testAsignado?.autor}</div>
            <div className="p-5 w-[80%] cursor-pointer rounded-lg bg-white dark:bg-boxdark">
              <h4 className="text-base font-semibold p-3 text-black dark:text-white">
                Descripción:
              </h4>
              <div className="pl-3 pb-3">{testAsignado?.descripcion}</div>
            </div>
            <h3 className="text-lg w-[80%] font-semibold text-black dark:text-white">
              Preguntas:
            </h3>
            <div className="flex flex-col p-5 gap-5 w-[80%] cursor-pointer rounded-lg bg-white dark:bg-boxdark">
              {testAsignado?.preguntas.map((preg, index) =>
                preg.tipoPregunta == 'Seleccion multiple' ? (
                  testAsignado.cuantitativa ? (
                    <MultiChoiceCuantitativaResponse
                      pregunta={preg}
                      // indice={index}
                      valor={testAsignado.valorPregunta}
                      onAddResponse={handleAddRespuesta}
                      key={index}
                    />
                  ) : (
                    <MultiChoiceResponse
                      pregunta={preg}
                      indice={index}
                      onAddResponse={handleAddRespuesta}
                      key={index}
                    />
                  )
                ) : (
                  preg.tipoPregunta == 'Likert' && (
                    <LikertResponse
                      pregunta={preg}
                      key={index}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
                      onAddResponse={handleAddRespuestaLikert}
                    />
                  )
                ),
              )}
              <div className="flex justify-between cursor-auto">
                <div className="cursor-none"></div>
                <button
                  className="flex w-[40%] justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  onClick={handleOpenModal}
                >
                  Enviar
                </button>
                <Modal
                  isOpen={isModalOpen}
                  mensaje="¿Estás seguro de guardar el test?"
                  onClose={handleCloseModal}
                  onConfirm={handleConfirm}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default Test;
