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

interface ConteoEstilos {
  [key: string]: number;
}

const Test = () => {
  const { id } = useParams<{ id: string }>();
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
  }

  let testAsignado = {
    titulo: 'Kolb',
    autor: 'Kolb',
    descripcion: 'Kolb',
    cuantitativa: false,
    fechaCreacion: '20/5/2024',
    estilosAprendizaje: ['visual', 'kinestesico'],
    valorPregunta: 1,
    preguntas: [
      {
        id: 1,
        orden: 1,
        pregunta: 'Nueva pregunta',
        tipoPregunta: 'Selección múltiple',
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
        tipoPregunta: 'Selección múltiple',
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
      {
        id: 3,
        orden: 3,
        pregunta: 'Como considera que aprende mejor?',
        tipoPregunta: 'Likert',
        opciones: [
          {
            id: 5,
            opcion: 'Dibujando',
            estilo: 'kinestesico',
          },
          {
            id: 6,
            opcion: 'Con gráficos',
            estilo: 'visual',
          },
        ],
        escalas: [
          'Totalmente en desacuerdo',
          'En desacuerdo',
          'Neutral',
          'De acuerdo',
          'Totalmente de acuerdo',
        ],
        // Todas las preguntas de likert deben tener el valor de min igual a la cantidad de opciones
        min: 2,
        max: 0,
      },
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

  const handleAddRespuesta = (
    preguntaId: number,
    opcionId: number,
    valorOpc?: number,
    estiloI?: string,
  ) => {
    //Dato quemados
    let usuarioId = 1;
    //-----------------
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
    let exists = currentResponses.some(
      (respuesta) =>
        respuesta.encuestaId === nuevaRespuesta.encuestaId &&
        respuesta.usuarioId === nuevaRespuesta.usuarioId &&
        respuesta.preguntaId === nuevaRespuesta.preguntaId &&
        respuesta.opcionId === nuevaRespuesta.opcionId,
    );
    if (exists) {
      currentResponses = currentResponses.filter(
        (respuesta) =>
          !(
            respuesta.encuestaId === nuevaRespuesta.encuestaId &&
            respuesta.usuarioId === nuevaRespuesta.usuarioId &&
            respuesta.preguntaId === nuevaRespuesta.preguntaId &&
            respuesta.opcionId === nuevaRespuesta.opcionId
          ),
      );
    } else {
      currentResponses.push(nuevaRespuesta);
    }
    setRespuestas(currentResponses);
  };

  const handleAddRespuestaLikert = (
    preguntaId: number,
    opcionId: number,
    valorOpc?: number,
    estiloI?: string,
  ) => {
    //Dato quemados
    let usuarioId = 1;
    //-----------------
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

  // Controlar el loading para que aparezca hasta que se consulte el test de la db
  useEffect(() => {
    console.log('ID TEST: ' + id);
    console.log(userContext);
    if (!id) return;
    let idNewTest = parseInt(id);
    setIdTest(idNewTest);
    setTimeout(() => {
      setLoadingTest(false);
    }, 1000);
  }, [id]);

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
    }, 4000);
  };

  const cambiarEstadoGuardadoTemporalmente = () => {
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
    }, 4000);
  };

  const handleSendTest = () => {
    const res = respuestas;
    const reglaCalculo = testAsignado.reglaCalculo;
    // Controlar que todas las preguntas tengan las respuestas especificadas
    let preguntas = testAsignado.preguntas;
    let preguntaId;
    let cantidadRespuestas;
    preguntas.forEach((element) => {
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
    });
    //
    const conteoEstilos: ConteoEstilos = {};

    reglaCalculo.forEach((regla) => {
      conteoEstilos[regla.fila] = 0;
    });

    res.forEach((respuesta) => {
      const { estilo, valorOpc } = respuesta;

      if (!estilo) return;
      if (!valorOpc) return;

      reglaCalculo.forEach((regla) => {
        if (regla.columnas.includes(estilo)) {
          conteoEstilos[regla.fila] += valorOpc;
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

    console.log(
      'El estilo de aprendizaje predominante es:',
      estiloPredominante,
    );
    console.log(conteoEstilos);
    console.log(respuestas);
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

  return loadingTest ? (
    <Loader />
  ) : (
    <DefaultLayout>
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
      <div className="flex flex-col justify-center items-center w-[100%] gap-8 bg-stroke dark:bg-transparent">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Test de {testAsignado.titulo}
        </h3>
        <div>{testAsignado.autor}</div>
        <div className="p-5 w-[80%] cursor-pointer rounded-lg bg-white dark:bg-boxdark">
          <h4 className="text-base font-semibold p-3 text-black dark:text-white">
            Descripción:
          </h4>
          <div className="pl-3 pb-3">{testAsignado.descripcion}</div>
        </div>
        <h3 className="text-lg w-[80%] font-semibold text-black dark:text-white">
          Preguntas:
        </h3>
        <div className="flex flex-col p-5 gap-5 w-[80%] cursor-pointer rounded-lg bg-white dark:bg-boxdark">
          {testAsignado.preguntas.map((preg, index) =>
            preg.tipoPregunta == 'Selección múltiple' ? (
              testAsignado.cuantitativa ? (
                <MultiChoiceCuantitativaResponse
                  pregunta={preg}
                  indice={index}
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
    </DefaultLayout>
  );
};

export default Test;
