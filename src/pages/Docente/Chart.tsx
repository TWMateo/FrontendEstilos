import React, { useContext, useEffect, useRef, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import { SessionContext } from '../../Context/SessionContext';
import { Chart as GoogleChart } from 'react-google-charts';
import Loader from '../../common/Loader';

interface Encuesta {
  enc_id: number;
  enc_titulo: string;
  enc_descripcion: string;
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_fecha_creacion: string;
}

interface Historial {
  his_id: number;
  cur_id: number;
  asi_id: number;
  est_cedula: string;
  his_resultado_encuesta: string;
  his_nota_estudiante: string;
  his_fecha_encuesta: string;
}

interface EncuestaUnica {
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_descripcion: string;
  enc_fecha_creacion: string;
  enc_id: number;
  enc_titulo: string;
  ids_asignacion: number[];
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
  const [encuestaSeleccionada, setEncuestaSeleccionada] =
    useState<EncuestaUnica>();
  const [datosCursoSeleccionado, setDatosCursoSeleccionado] = useState<Curso>();
  const [encuestasPorAsignacion, setEncuestasPorAsignacion] =
    useState<EncuestaUnica[]>();
  const [idsAsignacion, setIdsAsignacion] = useState<number[]>();
  const [resultadoEncuestaCounts, setResultadoEncuestaCounts] = useState<
    String[]
  >([]);
  const [historialData, setHistorialData] = useState([]);
  const [searchTermTest, setSearchTermTest] = useState<string>('');
  const [idEncuestaPorAsignacion, setIdEncuestaPorAsignacion] =
    useState<number>(0);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [asignacionListado, setAsignacionListado] = useState<Asignacion[]>([]);
  const [titulosEncuesta, setTitulosEncuesta] = useState<String[]>([]);
  const [filteredAsignaciones, setFilteredAsignaciones] = useState<
    Asignacion[]
  >([]);
  const [filteredEncuestas, setFilteredEncuestas] = useState<EncuestaUnica[]>();
  const [error, setError] = useState<string | null>(null);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTermAsignacion, setSearchTermAsignacion] = useState<string>('');
  const [tituloAsignacionSeleccionada, setTituloAsignacionSeleccionada] =
    useState<Asignacion>();
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

  const optionsAsignacion = {
    chart: {
      title: `Resultados de Asignación ${tituloAsignacionSeleccionada?.asi_id} de ${tituloAsignacionSeleccionada?.usuario.usu_usuario}`,
      subtitle: `Test de ${tituloAsignacionSeleccionada?.encuesta.enc_titulo}`,
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

  const optionsCurso = {
    title: 'Tests por Curso',
    pieHole: 0.4,
    is3D: true,
  };

  const optionsTest = {
    chart: {
      title: `Resultado del curso ${datosCursoSeleccionado?.cur_nivel} - ${datosCursoSeleccionado?.cur_carrera}`,
      subtitle: `En el test ${encuestaSeleccionada?.enc_titulo}`,
    },
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
      console.log(result.data);
      let datosNuevos = await result.data.filter(
        (dato: any) => dato.asi_realizado === true,
      );
      let encuestasU = crearEncuestasUnicas(datosNuevos);
      setEncuestasPorAsignacion(encuestasU);
      setAsignacionListado(datosNuevos);
    } catch (error: any) {
      setAsignacionListado([]);
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log(encuestasPorAsignacion);
  }, [encuestasPorAsignacion]);

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

  const crearEncuestasUnicas = (asignaciones: Asignacion[]) => {
    const encuestasMap: { [key: number]: EncuestaUnica } = {};

    asignaciones.forEach((asignacion: Asignacion) => {
      const { encuesta, asi_id } = asignacion;
      const enc_id = encuesta.enc_id;

      if (!encuestasMap[enc_id]) {
        encuestasMap[enc_id] = { ...encuesta, ids_asignacion: [] };
      }

      encuestasMap[enc_id].ids_asignacion.push(asi_id);
    });

    return Object.values(encuestasMap);
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
      console.log(result.data)
      setCursos(result.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log(cursos)
    const filtered = cursos.filter((curso) => {
      const cursoString =
        `${curso.cur_carrera} (Nivel: ${curso.cur_nivel})`.toLowerCase();
      return cursoString.includes(searchTerm.toLowerCase());
    });
    setFilteredCursos(filtered);
  }, [searchTerm, cursos]);

  const handleSelectCurso = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setResultadoEncuestaCounts(['']);
    setSelectedCursoId(Number(event.target.value));
    let index = cursos.find((cur) => cur.cur_id == Number(event.target.value));
    setDatosCursoSeleccionado(index);
    setSelectedAsignacionId(0);
  };

  useEffect(() => {
    setAsignacionTest([]);
    setEncuestasPorAsignacion([]);
  }, [selectedCursoId]);

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

  const handleSelectAsignacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let index = e.target.value;
    let asignacionSeleccionada = filteredAsignaciones.find(
      (asi) => asi.asi_id == parseInt(index),
    );
    console.log(asignacionSeleccionada);
    setTituloAsignacionSeleccionada(asignacionSeleccionada);
    setSelectedAsignacionId(parseInt(e.target.value));
  };

  const handleSelectTestSeleccionado = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let index = e.target.value;
    setIdEncuestaPorAsignacion(parseInt(index));
    let enc = encuestasPorAsignacion?.find(
      (encu) => encu.enc_id == parseInt(index),
    );
    setEncuestaSeleccionada(enc);
  };

  const contarResultadoEncuesta = (data: Historial[]) => {
    const resultadoMap = new Map<string, number>();

    data.forEach((historial) => {
      const resultado = historial.his_resultado_encuesta;
      if (resultadoMap.has(resultado)) {
        resultadoMap.set(resultado, resultadoMap.get(resultado)! + 1);
      } else {
        resultadoMap.set(resultado, 1);
      }
    });

    const resultadoArray: any = Array.from(resultadoMap.entries());
    resultadoArray.unshift(['Estilos', 'Valor']);
    setResultadoEncuestaCounts(resultadoArray);
  };

  useEffect(() => {
    console.log(resultadoEncuestaCounts);
  }, [resultadoEncuestaCounts]);

  useEffect(() => {
    if (searchTermTest.trim() === '') {
      setFilteredEncuestas(encuestasPorAsignacion ?? []);
    } else {
      const filtered = encuestasPorAsignacion?.filter((encuesta) =>
        encuesta.enc_titulo
          .toLowerCase()
          .includes(searchTermTest.toLowerCase()),
      );
      setFilteredEncuestas(filtered);
    }
  }, [searchTermTest, encuestasPorAsignacion]);

  const fetchHistorialData = async () => {
    console.log(idsAsignacion);
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/historial/asignacion',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ ids_asignacion: idsAsignacion }),
        },
      );

      if (!response.ok) {
        throw new Error('Error al obtener los datos del historial');
      }

      const data = await response.json();
      setHistorialData(data.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log(resultadoEncuestaCounts);
  }, [resultadoEncuestaCounts]);
  useEffect(() => {
    contarResultadoEncuesta(historialData);
  }, [historialData]);

  useEffect(() => {
    fetchHistorialData();
  }, [idsAsignacion]);

  useEffect(() => {
    console.log(encuestasPorAsignacion);
    let indexAsignacion = encuestasPorAsignacion?.find(
      (enc) => enc.enc_id == idEncuestaPorAsignacion,
    );
    console.log(idEncuestaPorAsignacion);
    console.log(indexAsignacion?.ids_asignacion);
    setIdsAsignacion(indexAsignacion?.ids_asignacion);
  }, [idEncuestaPorAsignacion]);

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

        const preguntas = result.data.preguntas;
        const estiloReglas = result.data.encuesta.estilos_aprendizaje.map(
          (estilo: any) => estilo.est_nombre,
        );

        const formattedData = [['Pregunta', ...estiloReglas]];

        preguntas.forEach((pregunta: any) => {
          const counts = estiloReglas.map(() => 0.05);

          const valorSeleccionado = pregunta.opciones.reduce(
            (acc: any, opcion: any) => {
              if (pregunta.respuesta.opc_id === opcion.opc_id) {
                return opcion.opc_valor_cuantitativo;
              }
              return acc;
            },
            0,
          );

          const estiloIndex = estiloReglas.indexOf(
            pregunta.respuesta.opc_valor_cualitativo,
          );
          if (estiloIndex !== -1) {
            counts[estiloIndex] = valorSeleccionado;
          }

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

  return (
    <DefaultLayout>
      {loadingTest ? (
        <Loader />
      ) : (
        <>
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
              path="/curso"
            />
          </div>
          <div className="col-span-12 mt-8 mb-8 w-full rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="grid grid-cols-3 gap-4 min-w-47.5">
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
                <h1 className="font-bold">Lista de Tests</h1>
                <input
                  type="text"
                  placeholder="Buscar asignación"
                  className="border rounded-md p-2"
                  value={searchTermTest}
                  onChange={(e) => setSearchTermTest(e.target.value)}
                />

                <select
                  title="Asignaciones"
                  onChange={handleSelectTestSeleccionado}
                  className="p-2 rounded-md border"
                  value={idEncuestaPorAsignacion ?? ''}
                >
                  <option value="">Selecciona una asignación</option>
                  {filteredEncuestas?.map((asi) => (
                    <option key={asi.enc_id} value={asi.enc_id}>
                      Test: {asi.enc_titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
            {titulosEncuesta && (
              <div className="bg-white p-1 rounded-lg">
                <GoogleChart
                  chartType="PieChart"
                  width="100%"
                  height="400px"
                  data={titulosEncuesta}
                  options={optionsCurso}
                />
              </div>
            )}

            <div className="w-full h-screen bg-white p-5 rounded-lg">
              {asignacionTest.length != 0 && (
                <GoogleChart
                  chartType="Bar"
                  width="100%"
                  height="100%"
                  data={asignacionTest}
                  options={optionsAsignacion}
                />
              )}
            </div>

            <div className="w-full h-screen bg-white p-5 rounded-lg">
              {resultadoEncuestaCounts.length > 1 && (
                <GoogleChart
                  chartType="Bar"
                  width="100%"
                  height="100%"
                  data={resultadoEncuestaCounts}
                  options={optionsTest}
                />
              )}
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default Chart;
