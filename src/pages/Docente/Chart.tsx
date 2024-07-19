import React, { useContext, useEffect, useRef, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartThree from '../../components/Charts/ChartThree';
import { SessionContext } from '../../Context/SessionContext';
import { Chart as GoogleChart } from 'react-google-charts';
// import Breadcrumb from '';
// import ChartOne from '../components/Charts/ChartOne';
// import ChartThree from '../components/Charts/ChartThree';
// import ChartTwo from '../components/Charts/ChartTwo';
// import DefaultLayout from '../layout/DefaultLayout';
// import { TableGeneral } from '../components/Tables/TableGeneral';

interface Encuesta {
  enc_id: number;
  enc_titulo: string;
  enc_descripcion: string;
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_fecha_creacion: string;
}

interface Usuario {
  usu_id: number;
  usu_usuario: string;
}

interface Asignacion {
  asi_id: number;
  encuesta: Encuesta;
  curso: Curso;
  usu_id: number;
  usuario: Usuario;
  asi_descripcion: string;
  asi_fecha_completado: string;
  asi_realizado: boolean;
}

interface Curso {
  cur_id: number;
  cur_carrera: string;
  cur_nivel: number;
}

interface Test {
  titulo: string;
  descripcion: string;
}

const Chart: React.FC = () => {
  const [loadingTest, setLoadingTest] = useState(true);
  const [encuestas, setEncuestas] = useState<Test[]>([]);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [asignacionListado, setAsignacionListado] = useState<Asignacion[]>([]);
  const [titulosEncuesta, setTitulosEncuesta] = useState<String[]>([]);
  const [filteredAsignaciones, setFilteredAsignaciones] = useState<
    Asignacion[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTermAsignacion, setSearchTermAsignacion] = useState<string>('');
  const [selectedAsignacionId, setSelectedAsignacionId] = useState<
    number | undefined
  >(undefined);
  const [asignaciones, setAsignaciones] = useState<
    {
      titulo: string;
      descripcion: string;
    }[]
  >([]);
  const [asignacionTest, setAsignacionTest] = useState<any[][]>([]);

  const data = [
    ['Task', 'Hours per Day'],
    ['Work', 11],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7],
  ];

  const dataS = [
    ['Pregunta', 'Visual', 'Kinestésico', 'Auditivo'],
    ['Pregunta 1', 3, 1, 2],
    ['Pregunta 2', 4, 2, 3],
    ['Pregunta 3', 2, 5, 1],
    // Agrega más preguntas y datos según sea necesario
  ];

  const optionsS = {
    chart: {
      title: 'Resultados de Asignación',
      subtitle:'Gráfico'
    },
    bars: 'horizontal', // En lugar de 'vertical'
    series: {
      0: { color: '#1f77b4' }, // Color para Visual
      1: { color: '#ff7f0e' }, // Color para Kinestésico
      2: { color: '#2ca02c' }, // Color para Auditivo
    },
    axes: {
      x: {
        0: { side: 'top', label: 'Número de Respuestas' },
      },
      y: {
        0: { side: 'left', label: 'Preguntas' },
      },
    },
  };

  const options = {
    title: 'Tests por Curso',
    pieHole: 0.4,
    is3D: true,
  };

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

  const fetchAsignacionesByCursoId = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/asignacion/curso/${selectedCursoId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );
      if (response.status != 200) {
        console.log('ERROR');
        setAsignacionListado([]);
        return;
      }
      const result = await response.json();
      setAsignacionListado(result.data);
    } catch (error: any) {
      setAsignacionListado([]);
      setError(error.message);
    }
  };

  const getEncuestaTitulos = (asignaciones: any) => {
    const encuestaMap = new Map();

    asignaciones.forEach((asignacion: any) => {
      const { enc_titulo, enc_id } = asignacion.encuesta;

      if (encuestaMap.has(enc_id)) {
        encuestaMap.get(enc_id)[1] += 1;
      } else {
        encuestaMap.set(enc_id, [enc_titulo, 1]);
      }
    });
    let resultado = Array.from(encuestaMap.values());
    resultado.unshift(['Encuesta', 'Veces que se ha tomado el test']);
    return Array.from(resultado);
  };

  useEffect(() => {
    if (!selectedCursoId) return;
    fetchAsignacionesByCursoId();
  }, [selectedCursoId]);

  useEffect(() => {
    console.log(asignacionListado);
    if (!asignacionListado) return;
    setTitulosEncuesta(getEncuestaTitulos(asignacionListado));
  }, [asignacionListado]);

  useEffect(() => {
    console.log(titulosEncuesta);
  }, [titulosEncuesta]);

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
      if (response.status != 200) {
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
        asignacionesData.push({ titulo, descripcion });
      }

      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/curso',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (response.status != 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setCursos(result.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const filtered = cursos.filter((curso) => {
      const cursoString =
        `${curso.cur_carrera} (Nivel: ${curso.cur_nivel})`.toLowerCase();
      return cursoString.includes(searchTerm.toLowerCase());
    });
    setFilteredCursos(filtered);
  }, [searchTerm, cursos]);

  const handleSelectCurso = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCursoId(Number(event.target.value));
  };

  //ASIGNACIONES
  useEffect(() => {
    if (searchTermAsignacion.trim() === '') {
      setFilteredAsignaciones(asignacionListado);
    } else {
      const filtered = asignacionListado.filter((asignacion) =>
        asignacion.asi_descripcion
          .toLowerCase()
          .includes(searchTermAsignacion.toLowerCase()),
      );
      setFilteredAsignaciones(filtered);
    }
  }, [searchTermAsignacion, asignacionListado]);

  // Manejar cambio de asignación seleccionada
  const handleSelectAsignacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Aquí puedes manejar la lógica para guardar la asignación seleccionada
    // Por ejemplo, puedes guardar el ID de la asignación en un estado
    console.log('Asignación seleccionada:', e.target.value);
    setSelectedAsignacionId(parseInt(e.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/estilos/api/v1/asignacion/test/${selectedAsignacionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
          },
        );

        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setAsignacionTest(result.data);

        // Procesar los datos para crear dataS
        const preguntas = result.data.preguntas;
        const estiloReglas = result.data.encuesta.estilos_aprendizaje.map(
          (estilo: any) => estilo.est_nombre,
        );

        // Crear la estructura base para los datos del gráfico
        const formattedData = [['Pregunta', ...estiloReglas]];

        preguntas.forEach((pregunta: any) => {
          // Inicializar el conteo de respuestas por estilo con ceros
          const counts = estiloReglas.map(() => 0.05);

          // Obtener el valor cuantitativo de la opción seleccionada
          const valorSeleccionado = pregunta.opciones.reduce(
            (acc: any, opcion: any) => {
              if (pregunta.respuesta.opc_id === opcion.opc_id) {
                return opcion.opc_valor_cuantitativo;
              }
              return acc;
            },
            0,
          );

          // Asignar el valor cuantitativo a la opción seleccionada
          const estiloIndex = estiloReglas.indexOf(
            pregunta.respuesta.opc_valor_cualitativo,
          );
          if (estiloIndex !== -1) {
            counts[estiloIndex] = valorSeleccionado;
          }

          // Agregar los datos de la pregunta al array
          formattedData.push([pregunta.pre_enunciado, ...counts]);
        });

        setAsignacionTest(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [selectedAsignacionId]);

  useEffect(() => {
    console.log(asignacionTest);
  }, [asignacionTest]);

  useEffect(() => {
    fetchCursos();
  }, []);

  useEffect(() => {
    fetchEncuestas();
    fetchAsignaciones();
    setTimeout(() => {
      setLoadingTest(false);
    }, 2000);
  }, []);

  useEffect(() => {
    console.log(cursos);
  }, [cursos]);

  useEffect(() => {
    console.log(cursos);
  }, [selectedCursoId]);

  useEffect(() => {
    console.log(asignaciones);
  }, [asignaciones]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="flex flex-col gap-8">
        <TableGeneral
          listado={encuestas}
          titulo="Tests Creados"
          icono="test"
          path="/modelos/nuevo/test"
        />
        <TableGeneral
          listado={asignaciones}
          titulo="Asignaciones Creadas"
          icono="curso"
          path="/perfil"
        />
      </div>
      <div className="col-span-12 mt-8 mb-8 w-full rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="grid grid-cols-4 gap-4 min-w-47.5">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">Lista de Cursos</h1>
            <input
              type="text"
              placeholder="Buscar curso"
              className="border rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              title="Cursos"
              onChange={handleSelectCurso}
              className="p-2 rounded-md border"
              value={selectedCursoId ?? ''}
            >
              <option value="" disabled>
                Selecciona un curso
              </option>
              {filteredCursos.map((curso) => (
                <option key={curso.cur_id} value={curso.cur_id}>
                  {curso.cur_carrera} (Nivel: {curso.cur_nivel})
                </option>
              ))}
            </select>
            {selectedCursoId && (
              <div>
                <h2>Curso Seleccionado</h2>
                <p>ID del Curso: {selectedCursoId}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">Asignaciones</h1>
            <input
              type="text"
              placeholder="Buscar asignación"
              className="border rounded-md p-2"
              value={searchTermAsignacion}
              onChange={(e) => setSearchTermAsignacion(e.target.value)}
            />
            <select
              title="Asignaciones"
              onChange={handleSelectAsignacion}
              className="p-2 rounded-md border"
              value={selectedAsignacionId ?? ''}
            >
              <option value="">Selecciona una asignación</option>
              {filteredAsignaciones.map((asignacion) => (
                <option key={asignacion.asi_id} value={asignacion.asi_id}>
                  {asignacion.usuario.usu_usuario} -{' '}
                  {asignacion.encuesta.enc_titulo} - {asignacion.asi_id}
                </option>
              ))}
            </select>
            {selectedAsignacionId && (
              <div>
                <h2>Asi</h2>
                <p>ID del ASI: {selectedAsignacionId}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">Lista de Cursos</h1>
            <input
              type="text"
              placeholder="Buscar curso"
              className="border rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              title="Cursos"
              onChange={handleSelectCurso}
              className="p-2 rounded-md border"
              value={selectedCursoId ?? ''}
            >
              <option value="" disabled>
                Selecciona un curso
              </option>
              {filteredCursos.map((curso) => (
                <option key={curso.cur_id} value={curso.cur_id}>
                  {curso.cur_carrera} (Nivel: {curso.cur_nivel})
                </option>
              ))}
            </select>
            {selectedCursoId && (
              <div>
                <h2>Curso Seleccionado</h2>
                <p>ID del Curso: {selectedCursoId}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">Lista de Cursos</h1>
            <input
              type="text"
              placeholder="Buscar curso"
              className="border rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              title="Cursos"
              onChange={handleSelectCurso}
              className="p-2 rounded-md border"
              value={selectedCursoId ?? ''}
            >
              <option value="" disabled>
                Selecciona un curso
              </option>
              {filteredCursos.map((curso) => (
                <option key={curso.cur_id} value={curso.cur_id}>
                  {curso.cur_carrera} (Nivel: {curso.cur_nivel})
                </option>
              ))}
            </select>
            {selectedCursoId && (
              <div>
                <h2>Curso Seleccionado</h2>
                <p>ID del Curso: {selectedCursoId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
        {titulosEncuesta && (
          <div className='bg-white p-1 rounded-lg'>
            <GoogleChart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={titulosEncuesta}
            options={options}
          />
          </div>
        )}

        {asignacionTest.length!=0 && (
          <div className='w-full h-screen bg-white p-5 rounded-lg'>
            <GoogleChart
            chartType="Bar"
            width="100%"
            height="100%"
            data={asignacionTest}
            options={optionsS}
          />
          </div>
        )}

        {/* <ChartOne />
        <ChartTwo />
        <ChartThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default Chart;
