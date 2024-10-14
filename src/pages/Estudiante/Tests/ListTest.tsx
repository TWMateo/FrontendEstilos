import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
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
import { SessionContext } from '../../../Context/SessionContext';
import { useContext, useEffect, useState } from 'react';
import Loader from '../../../common/Loader';
import EscudoUtn from '../../../images/UTN/escudo-utn.svg';

interface Asignacion {
  id: number;
  idAsignacion: number;
  titulo: string;
  descripcion: string;
}

const ListTest = () => {
  const navigate = useNavigate();
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loadingTest, setLoadingTest] = useState(true);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  // const fetchAsignaciones = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://backendestilos.onrender.com/estilos/api/v1/asignacion/usuario/${usuId}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${sessionToken}`,
  //         },
  //       },
  //     );
  //     if (response.status != 200) {
  //       throw new Error('Error al obtener las asignaciones');
  //     }
  //     const data = await response.json();
  //     let fechaActual = new Date();
  //     const asignacionesData = [];
  //     const titulosData = [];

  //     for (const asignacion of data.data) {
  //       const cursoResponse = await fetch(
  //         `https://backendestilos.onrender.com/estilos/api/v1/curso/${asignacion.cur_id}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${sessionToken}`,
  //           },
  //         },
  //       );
  //       if (!cursoResponse.ok) {
  //         throw new Error('Error al obtener los datos del curso');
  //       }
  //       const cursoData = await cursoResponse.json();

  //       const encuestaResponse = await fetch(
  //         `https://backendestilos.onrender.com/estilos/api/v1/encuesta/${asignacion.enc_id}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${sessionToken}`,
  //           },
  //         },
  //       );
  //       if (encuestaResponse.status != 200) {
  //         throw new Error('Error al obtener los datos de la encuesta');
  //       }
  //       const encuestaData = await encuestaResponse.json();
  //       const fecha = new Date(asignacion.asi_fecha_completado);
  //       const opcionesFecha: Intl.DateTimeFormatOptions = {
  //         month: 'short',
  //         day: 'numeric',
  //         year: 'numeric',
  //       };
  //       const id = asignacion.enc_id;
  //       const idAsignacion = asignacion.asi_id;
  //       const titulo = `${encuestaData.data.enc_id}. ${encuestaData.data.enc_titulo} - ${cursoData.data.cur_carrera} ${cursoData.data.cur_nivel}`;
  //       const descripcion = fecha.toLocaleDateString('es-ES', opcionesFecha);
  //       let date1 = new Date(asignacion.asi_fecha_completado);
  //       let date2 = new Date(fechaActual);
  //       if (date2 <= date1) {
  //         if (!asignacion.asi_realizado) {
  //           console.log(asignacion);
  //           asignacionesData.push({ id, idAsignacion, titulo, descripcion });
  //         }
  //       }
  //     }
  //     setAsignaciones(asignacionesData);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const fetchAsignaciones = async () => {
    const fetchData = async (url:any) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos de ${url}`);
      }
      return response.json();
    };

    try {
      const response = await fetchData(
        `https://backendestilos.onrender.com/estilos/api/v1/asignacion/usuario/${usuId}`,
      );

      const asignaciones = response.data;
      const fechaActual = new Date();
      const asignacionesData:any = [];

      const fetchDetailsPromises = asignaciones.map(async (asignacion:any) => {
        const cursoPromise = fetchData(
          `https://backendestilos.onrender.com/estilos/api/v1/curso/${asignacion.cur_id}`,
        );
        const encuestaPromise = fetchData(
          `https://backendestilos.onrender.com/estilos/api/v1/encuesta/${asignacion.enc_id}`,
        );

        const [cursoData, encuestaData] = await Promise.all([
          cursoPromise,
          encuestaPromise,
        ]);

        const fecha = new Date(asignacion.asi_fecha_completado);
        const opcionesFecha: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        };
        const id = asignacion.enc_id;
        const idAsignacion = asignacion.asi_id;
        const titulo = `${encuestaData.data.enc_id}. ${encuestaData.data.enc_titulo} - ${cursoData.data.cur_carrera} ${cursoData.data.cur_nivel}`;
        const descripcion = fecha.toLocaleDateString('es-ES', opcionesFecha);

        if (fechaActual <= fecha && !asignacion.asi_realizado) {
          asignacionesData.push({ id, idAsignacion, titulo, descripcion });
        }
      });

      await Promise.all(fetchDetailsPromises);
      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log(asignaciones);
  }, [asignaciones]);

  useEffect(() => {
    fetchAsignaciones();
    setTimeout(() => {
      setLoadingTest(false);
    }, 1000);
  }, []);

  const handleSelectTest = (idTest: number, idAsignacion: number) => {
    console.log('ID TEST:' + idTest);
    navigate('/test/' + idTest + '/' + idAsignacion);
    return true;
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
          <Breadcrumb pageName="Tests" />
          <div
            className="flex flex-col gap-8"
            style={{
              backgroundImage: `url(${EscudoUtn})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              width: '100%', // Asegúrate de que el contenedor tenga el ancho adecuado
              height: '70vh',
            }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Tests asignados
            </h3>
            <ThemeProvider theme={theme}>
              <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                className="grid opacity-90 grid-cols-1 lg:grid-cols-2 cursor-pointer rounded-lg bg-stroke dark:bg-boxdark"
              >
                {asignaciones.length > 0 ? (
                  asignaciones.map((test) => (
                    <ListItem
                      className="flex gap-8 hover:bg-black m-5 rounded-lg text-black dark:text-slate-400 hover:text-white dark:hover:text-white"
                      sx={{ width: '93%', minWidth: 280 }}
                      onClick={() =>
                        handleSelectTest(test.id, test.idAsignacion)
                      }
                    >
                      <ListItemAvatar className="">
                        <Avatar style={{ width: '75px', height: '75px' }}>
                          {/* {icono == 'test' && ( */}
                          <PsychologySharpIcon
                            style={{ width: '70px', height: '70px' }}
                            className="text-black"
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        style={{
                          width: '100px',
                          whiteSpace: 'wrap',
                          textAlign: 'center',
                        }}
                        primary={test.titulo}
                        secondary={test.descripcion}
                      />
                    </ListItem>
                  ))
                ) : (
                  <div className="font-bold text-xl p-10">
                    ¡Todos tus tests estan completados🥳!
                  </div>
                )}
              </List>
            </ThemeProvider>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default ListTest;
