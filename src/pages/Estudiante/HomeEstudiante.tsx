import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import { SessionContext } from '../../Context/SessionContext';
import { useContext, useEffect, useState } from 'react';
import Loader from '../../common/Loader';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';

interface Encuesta {
  enc_id: number;
  enc_titulo: string;
  enc_descripcion: string;
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_fecha_creacion: string;
}

interface Test {
  titulo: string;
  descripcion: string;
}

const HomeEstudiante = () => {
  const [asignaciones, setAsignaciones] = useState<
    {
      titulo: string;
      descripcion: string;
    }[]
  >([]);
  const [titulos, setTitulos] = useState<
    {
      titulo: string;
      descripcion: string;
    }[]
  >([]);
  const [loadingTest, setLoadingTest] = useState(true);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  const fetchAsignaciones = async () => {
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/asignacion/usuario/${usuId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Error al obtener las asignaciones');
      }
      const data = await response.json();
      const asignacionesData = [];
      const titulosData = [];
      for (const asignacion of data.data) {
        const cursoResponse = await fetch(
          `https://backendestilos.onrender.com/estilos/api/v1/curso/${asignacion.cur_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
          },
        );
        if (!cursoResponse.ok) {
          throw new Error('Error al obtener los datos del curso');
        }
        const cursoData = await cursoResponse.json();
        let fechaActual = new Date();
        let date1 = new Date(asignacion.asi_fecha_completado);
        let date2 = new Date(fechaActual);

        if (date2 <= date1) {
          const encuestaResponse = await fetch(
            `https://backendestilos.onrender.com/estilos/api/v1/encuesta/${asignacion.enc_id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionToken}`,
              },
            },
          );
          if (encuestaResponse.status != 200) {
            throw new Error('Error al obtener los datos de la encuesta');
          }
          const encuestaData = await encuestaResponse.json();
          const fecha = new Date(asignacion.asi_fecha_completado);
          const opcionesFecha: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          };
          const titulo = `${encuestaData.data.enc_id}. ${encuestaData.data.enc_titulo} - ${cursoData.data.cur_carrera} ${cursoData.data.cur_nivel}`;
          const descripcion = fecha.toLocaleDateString('es-ES', opcionesFecha);
          if (!asignacion.asi_realizado) {
            asignacionesData.push({ titulo, descripcion });
          }
          const tituloCurso = cursoData.data.cur_carrera;
          titulosData.push({ titulo: tituloCurso, descripcion: tituloCurso });
        }
        setTitulos(titulosData);
        console.log(asignacionesData);
        setAsignaciones(asignacionesData);
      }
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

  return (
    <DefaultLayout>
      {loadingTest ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Inicio" />
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
            <TableGeneral
              listado={asignaciones}
              titulo="Tests Asignados"
              icono="test"
              path="/modelos/nuevo/test"
              crear={false}
              mensaje="¡Todos tus tests estan completados🥳!"
            />
            <TableGeneral
              listado={titulos}
              titulo="Cursos Asignados"
              icono="curso"
              path="/perfil"
              crear={false}
            />
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default HomeEstudiante;
