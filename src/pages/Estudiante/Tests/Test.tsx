import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { TableGeneral } from '../../../components/Tables/TableGeneral';
import { SessionContext } from '../../../Context/SessionContext';
import { FC, useContext, useEffect, useState } from 'react';
import Loader from '../../../common/Loader';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import { Props } from 'react-apexcharts';
import { useParams } from 'react-router-dom';
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

type Operacion = 'suma' | 'resta' | 'multiplicacion' | 'division';

interface Parametro {
  value: string[];
  operacion: Operacion;
}

interface Condicion {
  parametros: Parametro[];
  condicion:
    | 'mayor'
    | 'menor'
    | 'mayor o igual'
    | 'menor o igual'
    | 'igual'
    | 'ninguna';
  valor: number;
  comparacion: 'and' | 'or';
}

const Test = () => {
  const { id, idAsignacion } = useParams<{
    id: string;
    idAsignacion: string;
  }>();
  const [asignacion, setAsignacion] = useState<Asignacion>();
  const [loadingTest, setLoadingTest] = useState(true);
  const { login, logout, isLoggedIn, userContext } = useContext(SessionContext);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [idTest, setIdTest] = useState<number>();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorSave, setErrorSave] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [errorGuardadoCuantitativa, setErrorGuardadoCuantitativa] =
    useState(false);
  const [testAsignado, setTestAsignado] = useState<TestEstructurado | null>(
    null,
  );
  const listadoTests = [
    { titulo: 'Kolb', descripcion: 'Jan 9, 2014' },
    { titulo: 'Honney y Alonso', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
  ];
  interface Pregunta {
    id: number;
    orden: number;
    pregunta: string;
    tipoPregunta: string;
    opciones: Opcion[];
    min: number;
    max: number;
  }

  interface Opcion {
    id: number;
    opcion: string;
    estilo: string;
    valorNumerico?: number; // Nuevo campo para el valor numérico
  }

  let testAsignadoS = {
    titulo: 'Kolb',
    autor: 'Kolb',
    descripcion: 'Kolb',
    cuantitativa: true,
    fechaCreacion: '20/5/2024',
    estilosAprendizaje: ['visual', 'kinestesico'],
    valorPregunta: 2,
    preguntas: [
      {
        id: 1,
        orden: 1,
        pregunta: 'Nueva pregunta',
        tipoPregunta: 'Seleccion multiple',
        opciones: [
          {
            id: 1,
            opcion: 'Opción 11',
            estilo: 'visual',
          },
          {
            id: 2,
            opcion: 'Opción 21',
            estilo: 'kinestesico',
          },
        ],
        escalas: [],
        min: 1,
        max: 0,
      },
      {
        id: 2,
        orden: 2,
        pregunta: 'Nueva pregunta',
        tipoPregunta: 'Seleccion multiple',
        opciones: [
          {
            id: 3,
            opcion: 'Opción 1',
            estilo: 'visual',
          },
          {
            id: 4,
            opcion: 'Opción 2',
            estilo: 'kinestesico',
          },
        ],
        escalas: [],
        min: 0,
        max: 2,
      },
      // {
      //   id: 3,
      //   orden: 3,
      //   pregunta: 'Como considera que aprende mejor?',
      //   tipoPregunta: 'Likert',
      //   opciones: [
      //     {
      //       id: 5,
      //       opcion: 'Dibujando',
      //       estilo: 'kinestesico',
      //     },
      //     {
      //       id: 6,
      //       opcion: 'Con gráficos',
      //       estilo: 'visual',
      //     },
      //   ],
      //   escalas: [
      //     'Totalmente en desacuerdo',
      //     'En desacuerdo',
      //     'Neutral',
      //     'De acuerdo',
      //     'Totalmente de acuerdo',
      //   ],
      //   // Todas las preguntas de likert deben tener el valor de min igual a la cantidad de opciones
      //   min: 2,
      //   max: 0,
      // },
    ],
    reglaCalculo: [
      {
        fila: 'kinestesico',
        columnas: ['kinestesico'],
        // operacion: ['suma']
      },
      {
        fila: 'visual',
        columnas: ['visual'],
        // operacion:['suma']
      },
    ],
  };

  let testAsignadoZ = {
    titulo: 'Kolb 2',
    autor: 'Kolb 2',
    descripcion: 'Vamos a testear el producto',
    cuantitativa: false,
    fechaCreacion: '23/6/2024',
    estilosAprendizaje: ['visual', 'kinestesico'],
    valorPregunta: 1,
    preguntas: [
      {
        id: 1,
        orden: 1,
        pregunta: 'Pregunta 1',
        tipoPregunta: 'Seleccion multiple',
        opciones: [
          {
            id: 1,
            opcion: 'Opción 1',
            estilo: 'visual',
          },
          {
            id: 2,
            opcion: 'Opción 2',
            estilo: 'kinestesico',
          },
        ],
        escalas: [],
        min: 0,
        max: 0,
      },
      {
        id: 2,
        orden: 2,
        pregunta: 'Pregunta 2',
        tipoPregunta: 'Likert',
        opciones: [
          {
            id: 1,
            opcion: 'Opción 1',
            estilo: 'visual',
          },
          {
            id: 2,
            opcion: 'Opción 2',
            estilo: 'kinestesico',
          },
        ],
        escalas: [
          'Muy insatisfecho',
          'Insatisfecho',
          'Neutral',
          'Satisfecho',
          'Muy satisfecho',
        ],
        min: 0,
        max: 0,
      },
    ],
    reglaCalculo: [
      {
        estilo: 'visual',
        condiciones: [
          {
            parametros: [
              {
                value: ['visual'],
                operacion: 'suma',
              },
            ],
            condicion: 'ninguna',
            valor: 0,
            comparacion: 'and',
          },
        ],
      },
      {
        estilo: 'kinestesico',
        condiciones: [
          {
            parametros: [
              {
                value: ['visual'],
                operacion: 'suma',
              },
            ],
            condicion: 'ninguna',
            valor: 0,
            comparacion: 'and',
          },
        ],
      },
    ],
  };

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

  //IMPORTANTE - Controlar el loading para que aparezca hasta que se consulte el test de la db
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
            Authorization: `Bearer ${sessionToken}`, // Asegúrate de que sessionToken esté definido
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
    let cantidadRespuestas;
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

    if (!testAsignado?.cuantitativa) {
      const conteoEstiloS: ResultadosTest = {};
      const conteoParametros: ConteoEstilos = {};
      reglaCalculo?.forEach((regla) => {
        conteoEstiloS[regla.estilo] = false;
      });

      res.forEach((respuesta) => {
        let resp: RespuestaEnvio = {
          asi_id: 0,
          opc_id: 0,
          pre_id: 0,
          usu_id: 0,
        };
        const { estilo, valorOpc } = respuesta;
        if (!estilo) return;
        if (!valorOpc) return;
        if (!idAsignacion) return;
        console.log(respuesta);
        resp.asi_id = parseInt(idAsignacion);
        resp.opc_id = respuesta.opcionId;
        resp.pre_id = respuesta.preguntaId;
        resp.usu_id = respuesta.usuarioId;
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

        regla.condiciones.forEach((condicion) => {
          let primerParametro = true;
          let sumaParametros = 0;
          let operadoresParciales = '';
          let contadorParam = 0;
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
          if (
            !evaluarCondicion(
              sumaParametros,
              condicion.condicion,
              condicion.valor,
            )
          ) {
            operadores.push(false);
          } else {
            operadores.push(true);
            sumaCondiciones += sumaParametros;
          }
          condiciones.push(condicion.comparacion);
        });
        let resultado = evaluateConditions(operadores, condiciones);
        operadores = [];
        conteoEstiloS[regla.estilo] = resultado;
      });

      let estiloPredominante: string = '';
      Object.keys(conteoEstiloS).forEach((key) => {
        const value = conteoEstiloS[key];
        if (value) {
          estiloPredominante = key;
        }
      });
      if (!asignacion) {
        console.log(asignacion);
        return;
      }

      if (!estiloPredominante) {
        estiloPredominante = getRandomKey(conteoEstiloS);
      }
      //CALCULOS
      let fechaTerminado: Date = new Date();
      let fechaFormateada = formatDate(fechaTerminado);
      let historialRespuesta: Historial = {
        asi_id: asignacion?.asi_id,
        cur_id: asignacion?.cur_id,
        his_fecha_encuesta: fechaFormateada,
        est_cedula: usuCedula,
        his_nota_estudiante: estiloPredominante.substring(0, 5),
        his_resultado_encuesta: estiloPredominante,
      };
      historialRespuesta.est_cedula = usuCedula;
      historialRespuesta;
      postHistorial(historialRespuesta);
      let asignacionActualizar = {
        enc_id: asignacion.enc_id,
        usu_id: asignacion.usu_id,
        cur_id: asignacion.cur_id,
        asi_descripcion: asignacion.asi_descripcion,
        asi_fecha_completado: fechaTerminado.toISOString(),
        asi_realizado: true,
      };
      actualizarAsignacion(asignacion?.asi_id, asignacionActualizar);
    } else {
      if (testAsignado?.cuantitativa) {
        for (const pregunta of preguntas) {
          if (pregunta.min !== undefined || pregunta.max !== undefined) {
            const respuestasPregunta = res.filter(
              (resp) => resp.preguntaId === pregunta.id,
            );
            const sumaRespuestasPregunta = respuestasPregunta.reduce(
              (total, resp) => total + (resp.valorOpc || 0),
              0,
            );

            if (sumaRespuestasPregunta !== testAsignado.valorPregunta) {
              cambiarEstadoErrorGuardadoCuantitativa();
              return;
            }
          }
        }
      }
      const conteoEstilos: ConteoEstilos = {};
      testAsignado?.estilosAprendizaje.forEach((regla) => {
        conteoEstilos[regla] = 0;
      });

      res.forEach((respuesta) => {
        const { estilo, valorOpc } = respuesta;

        if (!estilo) return;
        if (!valorOpc) return;

        testAsignado?.estilosAprendizaje.forEach((est) => {
          if (est.includes(estilo)) {
            conteoEstilos[est] += valorOpc;
          }
        });
      });

      let estiloPredominante = null;
      let maxValor = 0;

      for (const estilo in conteoEstilos) {
        if (conteoEstilos[estilo] > maxValor) {
          maxValor = conteoEstilos[estilo];
          estiloPredominante = estilo;
        }
      }

      res.forEach((respuesta) => {
        let resp: RespuestaEnvio = {
          asi_id: 0,
          opc_id: 0,
          pre_id: 0,
          usu_id: 0,
        };
        const { estilo, valorOpc } = respuesta;
        if (!estilo) return;
        if (!valorOpc) return;
        if (!idAsignacion) return;
        resp.asi_id = parseInt(idAsignacion);
        resp.opc_id = respuesta.opcionId;
        resp.pre_id = respuesta.preguntaId;
        resp.usu_id = respuesta.usuarioId;
        postRespuesta(resp);
      });

      if (!asignacion) {
        console.log(asignacion);
        return;
      }

      if (!estiloPredominante) {
        estiloPredominante = getRandomKey(conteoEstilos);
      }
      let fechaTerminado: Date = new Date();
      let fechaFormateada = formatDate(fechaTerminado);
      let historialRespuesta: Historial = {
        asi_id: asignacion?.asi_id,
        cur_id: asignacion?.cur_id,
        his_fecha_encuesta: fechaFormateada,
        est_cedula: usuCedula,
        his_nota_estudiante: estiloPredominante.substring(0, 5),
        his_resultado_encuesta: estiloPredominante,
      };
      historialRespuesta.est_cedula = usuCedula;
      historialRespuesta;
      postHistorial(historialRespuesta);
      let asignacionActualizar = {
        enc_id: asignacion.enc_id,
        usu_id: asignacion.usu_id,
        cur_id: asignacion.cur_id,
        asi_descripcion: asignacion.asi_descripcion,
        asi_fecha_completado: fechaTerminado.toISOString(),
        asi_realizado: true,
      };
      actualizarAsignacion(asignacion?.asi_id, asignacionActualizar);
    }
  };

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

  const theme = createTheme({
    components: {
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: '',
            fontWeight: 'bold',
          },
          secondary: {
            color: 'gray',
          },
        },
      },
    },
  });

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
