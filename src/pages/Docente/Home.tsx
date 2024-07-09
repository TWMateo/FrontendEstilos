import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../Context/SessionContext';

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

const Home = () => {
  const [encuestas, setEncuestas] = useState<Test[]>([]);
  const [asignaciones, setAsignaciones] = useState<
    {
      titulo: string;
      descripcion: string;
    }[]
  >([]);
  const [error, setError] = useState(null);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  const listadoCursos = [
    { titulo: 'Software-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Telecomunicaciones-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Software-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Electricidad-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Automotriz-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Textil-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mecatrónica-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Industrial-P1', descripcion: 'Jan 9, 2014' },
  ];

  const fetchEncuestas = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/encuesta',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (response.status != 200) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const result = await response.json();
      const transformedEncuestas = result.data.map((encuesta: Encuesta) => {
        const fecha = new Date(encuesta.enc_fecha_creacion);
        const opcionesFecha: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        };
        return {
          titulo: encuesta.enc_id + '.' + encuesta.enc_titulo,
          descripcion: fecha.toLocaleDateString('es-ES', opcionesFecha),
        };
      });
      setEncuestas(transformedEncuestas);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAsignaciones = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/asignacion/usuario/${usuId}`,
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

      for (const asignacion of data.data) {
        const cursoResponse = await fetch(
          `http://127.0.0.1:5000/estilos/api/v1/curso/${asignacion.cur_id}`,
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

        // Obtener datos de la encuesta usando enc_id
        const encuestaResponse = await fetch(
          `http://127.0.0.1:5000/estilos/api/v1/encuesta/${asignacion.enc_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
          },
        );
        if (encuestaResponse.status!=200) {
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
        asignacionesData.push({ titulo, descripcion });
      }

      // Actualizar el estado con las asignaciones formateadas
      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error:', error);
      // Manejar errores aquí según sea necesario
    }
  };

  useEffect(() => {
    fetchEncuestas();
    fetchAsignaciones();
  }, []);

  useEffect(() => {
    console.log(encuestas);
  }, [encuestas]);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Inicio" />

      <div className="flex flex-col gap-8">
        <TableGeneral
          listado={encuestas}
          titulo="Tests Creados"
          icono="test"
          path="/modelos/nuevo/test"
        />
        <TableGeneral
          listado={asignaciones}
          titulo="Asignaciones"
          icono="curso"
          path="/perfil"
        />
      </div>
    </DefaultLayout>
  );
};

export default Home;
