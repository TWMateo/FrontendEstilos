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

const Test = () => {
  const { id } = useParams<{ id: string }>();
  const [loadingTest, setLoadingTest] = useState(true);
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
        max: 2,
      },
      // {
      //   id: 3,
      //   orden: 3,
      //   pregunta: 'Como considera que aprende mejor?',
      //   tipoPregunta: 'Likert',
      //   opciones: [
      //     {
      //       id: 1,
      //       opcion: 'Dibijando',
      //       estilo: 'kinestesico',
      //     },
      //     {
      //       id: 2,
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
      //   min: 0,
      //   max: 0,
      // },
    ],
    reglaCalculo: [
      {
        fila: 'kinestesico',
        columnas: ['kinestesico'],
      },
      {
        fila: 'visual',
        columnas: ['visual'],
      },
    ],
  };

  // Controlar el loading para que aparezca hasta que se consulte el test de la db
  useEffect(() => {
    console.log('ID TEST: ' + id);
    setTimeout(() => {
      setLoadingTest(false);
    }, 1000);
  }, [id]);

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
  // const {login,logout,isLoggedIn} = useContext(SessionContext)

  return loadingTest ? (
    <Loader />
  ) : (
    <DefaultLayout>
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
              <MultiChoiceResponse pregunta={preg} indice={index} />
            ) : (
              preg.tipoPregunta == 'Likert' && (
                <LikertResponse pregunta={preg} />
              )
            ),
          )}
          <div className='flex justify-between cursor-auto'>
            <div className='cursor-none'></div>
          <button
            className="flex w-[40%] justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            // onClick={() => onGuardarNuevoEstiloAprendizaje()}
          >
            Enviar
          </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Test;
