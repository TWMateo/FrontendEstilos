import React, { useContext, useEffect, useRef, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import { SessionContext } from '../../Context/SessionContext';
import { Chart as GoogleChart } from 'react-google-charts';
import Loader from '../../common/Loader';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';
import ChartFull from '../../components/Charts/ChartFull';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import html2canvas from 'html2canvas';

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
  cur_periodo_academico: string;
}

interface Test {
  titulo: string;
  descripcion: string;
}

interface Tipo {
  tipo: string;
  valor: string;
}

interface DatosMateria {
  mensaje: string;
  tipos: Tipo[];
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
  const [respuestaHistorial, setRespuestasHistorial] = useState('');
  const [searchTermAsignacion, setSearchTermAsignacion] = useState<string>('');
  const [tituloAsignacionSeleccionada, setTituloAsignacionSeleccionada] =
    useState<Asignacion>();
  const [listadoMaterias, setListadoMaterias] = useState<Tipo[]>([]);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState<
    number | undefined
  >(undefined);
  const [asignaciones, setAsignaciones] = useState<
    {
      titulo: string;
      descripcion: string;
    }[]
  >([]);
  const [idMateria, setIdMateria] = useState('');
  const [idParcial, setIdParcial] = useState('');
  const [asignacionTest, setAsignacionTest] = useState<any[][]>([['Probando','Probando','Probando','Probando'],['Probando',0,0,0],['Probando',0,0,0],['Probando',0,0,0]]);
  const [datosMateria, setDatosMateria] = useState({
    mensaje: 'Selecciona la materia',
    tipos: [
      {
        tipo: 'Ética',
        valor: '1',
      },
      {
        tipo: 'Investigación científica',
        valor: '2',
      },
    ],
  });
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [datosParcial, setDatosParcial] = useState({
    mensaje: 'Selecciona el parcial',
    tipos: [
      {
        tipo: 'Parcial 1',
        valor: '1',
      },
      {
        tipo: 'Parcial 2',
        valor: '2',
      },
    ],
  });
  const optionsAsignacion = {
    chart: {
      title: `Resultados de Asignación ${tituloAsignacionSeleccionada?.asi_id} de ${tituloAsignacionSeleccionada?.usuario.usu_usuario}`,
      subtitle: `Test de ${tituloAsignacionSeleccionada?.encuesta.enc_titulo} Estilo(s) predominante: ${respuestaHistorial}`,
      bar: { groupWidth: '60px' },
    },
    bars: 'horizontal',
    backgroundColor: 'transparent',
    series: {
      0: { color: '#1f77b4' },
      1: { color: '#ff7f0e' },
      2: { color: '#2ca02c' },
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
    chart: {
      title: `Cantidad de respuestas por test ${datosCursoSeleccionado?.cur_carrera} - ${datosCursoSeleccionado?.cur_nivel}`,
    },
    bar: { groupWidth: '15%' },
    animation: {
      startup: true, // Activa la animación al cargar
      duration: 1000, // Duración de la animación en milisegundos
      easing: 'out', // Tipo de animación
    },
    series: {
      0: { color: '#1f77b4' }, // Color de la primera serie de datos
      1: { color: '#ff7f0e' }, // Color de la segunda serie de datos (si hay más series)
    },
  };

  const optionsNotas = {
    title: 'Promedio de Notas por Estilo de Aprendizaje',
    hAxis: { title: 'Estilo de Aprendizaje' }, // Eje horizontal
    vAxis: { title: 'Promedio de Notas' }, // Eje vertical
    colors: ['#FF5733', '#33FF57', '#3357FF'],
    // backgroundColor: 'transparent',
    animation: {
      startup: true,
      duration: 1500,
      easing: 'out',
    },
    legend: { position: 'bottom' },
    isStacked: true, // Apila las áreas
  };

  const optionsTest = {
    chart: {
      title: `Resultado del curso ${datosCursoSeleccionado?.cur_nivel} - ${datosCursoSeleccionado?.cur_carrera}`,
      subtitle: `En el test ${encuestaSeleccionada?.enc_titulo}`,
    },
    bar: { groupWidth: '15%' },
    animation: {
      startup: true, // Activa la animación al cargar
      duration: 1000, // Duración de la animación en milisegundos
      easing: 'out', // Tipo de animación
    },
    series: {
      0: { color: '#1f77b4' }, // Color de la primera serie de datos
      1: { color: '#ff7f0e' }, // Color de la segunda serie de datos (si hay más series)
    },
  };
  const [datosNotas, setDatosNotas] = useState<any>([
    ['', 0],
    ['', 0],
  ]);

  const dataGoogleCharts = [
    ['Estilo de aprendizaje', 'Promedio de notas'], // Encabezados
    ...datosNotas,
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
      const resultMaterias: string[] = Array.from(
        new Set(
          await result.data.map((item: any) =>
            JSON.stringify({ tipo: item.materia, valor: item.mat_id }),
          ),
        ),
      );
      const resultMateriasFiltradas: Tipo[] = resultMaterias.map((item) => {
        return JSON.parse(item) as Tipo; // Aquí TypeScript ya sabe que item es un string
      });
      setListadoMaterias(resultMateriasFiltradas);
      // datosMateria.tipos(resultMateriasFiltradas);
      console.log(resultMateriasFiltradas);
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
    if (listadoMaterias) {
      setDatosMateria({
        mensaje: 'Selecciona la materia',
        tipos: listadoMaterias,
      });
      // datosMateria.tipos(listadoMaterias)
    }
  }, [listadoMaterias]);

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
    resultado.unshift(['Test', 'Veces que se ha tomado el test']);
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
    const fetchData = async (url: any) => {
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
        `http://127.0.0.1:5000/estilos/api/v1/asignacion/usuario/${usuId}`,
      );

      const asignaciones = response.data;
      const fechaActual = new Date();
      const asignacionesData: any = [];

      const fetchDetailsPromises = asignaciones.map(async (asignacion: any) => {
        const cursoPromise = fetchData(
          `http://127.0.0.1:5000/estilos/api/v1/curso/${asignacion.cur_id}`,
        );
        const encuestaPromise = fetchData(
          `http://127.0.0.1:5000/estilos/api/v1/encuesta/${asignacion.enc_id}`,
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

        // if (fechaActual <= fecha && !asignacion.asi_realizado) {
        asignacionesData.push({ id, idAsignacion, titulo, descripcion });
        // }
      });

      await Promise.all(fetchDetailsPromises);
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
      console.log(result.data);
      setCursos(result.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log(cursos);
    const filtered = cursos.filter((curso) => {
      const cursoString =
        `${curso.cur_carrera} (Nivel: ${curso.cur_nivel}) - ${curso.cur_periodo_academico}`.toLowerCase();
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
    console.log(resultadoArray);
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

  const fetchHistorialByCursoMateria = async (
    curId: number,
    matId: number,
    parId: number,
  ) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/historial/curso/materia',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`, // Token de autenticación
          },
          body: JSON.stringify({
            cur_id: curId,
            mat_id: matId,
            par_id: parId,
          }),
        },
      );

      if (response.status != 200) {
        setDatosNotas([
          ['', 0],
          ['', 0],
        ]);
        throw new Error('Error al obtener los datos del historial');
      }

      const data = await response.json();
      const agrupados: { [key: string]: { suma: number; count: number } } = {};
      data.data.forEach(
        (item: { not_nota: number; his_resultado_encuesta: string }) => {
          const { not_nota, his_resultado_encuesta } = item;
          if (!agrupados[his_resultado_encuesta]) {
            agrupados[his_resultado_encuesta] = { suma: 0, count: 0 };
          }
          agrupados[his_resultado_encuesta].suma += not_nota;
          agrupados[his_resultado_encuesta].count += 1;
        },
      );

      const promedios: [string, number][] = [];
      for (const resultado in agrupados) {
        const { suma, count } = agrupados[resultado];
        const promedio = suma / count;
        promedios.push([resultado, promedio]);
      }
      setDatosNotas(promedios);
      console.log(promedios);
      return data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const downloadChartAsImage = (
    ref: React.RefObject<HTMLDivElement>,
    fileName: string,
  ) => {
    if (ref.current) {
      html2canvas(ref.current).then((canvas) => {
        const imgUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgUri;
        link.download = `${fileName}.png`;
        link.click();
      });
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
        const preguntas = result.data.preguntas;
        setRespuestasHistorial(result.data.respuesta_historial);
        const estiloReglas = result.data.encuesta.estilos_aprendizaje.map(
          (estilo: any) => estilo.est_nombre,
        );

        const formattedData = [['Pregunta', ...estiloReglas]];

        preguntas.forEach((pregunta: any) => {
          const counts = estiloReglas.map((estiloR: any) => {
            const indice = pregunta.respuesta.findIndex(
              (opcion: any) => opcion.opc_valor_cualitativo === estiloR,
            );
            if (indice != -1) {
              console.log(pregunta.respuesta[indice]);
              return pregunta.respuesta[indice].opc_valor_cuantitativo;
            } else {
              console.log(estiloR);
              return 0;
            }
          });
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

          formattedData.push([
            pregunta.pre_enunciado.substring(0, 15),
            ...counts,
          ]);
        });
        console.log(formattedData)
        setAsignacionTest(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [selectedAsignacionId]);

  useEffect(() => {
    if (idMateria && selectedCursoId && idParcial) {
      fetchHistorialByCursoMateria(
        selectedCursoId,
        parseInt(idMateria),
        parseInt(idParcial),
      );
    }
  }, [idMateria, idParcial]);

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
        <div
        // style={{
        //   backgroundImage: `url(${EscudoUtn})`,
        //   backgroundRepeat: 'repeat-y',
        //   backgroundSize: '400px 495px',
        //   backgroundPosition: 'center',
        //   width: '100%', // Asegúrate de que el contenedor tenga el ancho adecuado
        // }}
        >
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
              titulo="Asignaciones"
              icono="curso"
              path="/curso"
            />
          </div>
          <div className="col-span-12 opacity-85 text-black dark:text-white mt-8 mb-8 w-full rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="grid grid-cols-3 gap-4 min-w-47.5">
              <div className="flex flex-col pt-6 lg:pt-0 gap-4 text-black">
                <h1 className="font-bold dark:text-white">Lista de Cursos</h1>
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
                      {curso.cur_carrera} (Nivel: {curso.cur_nivel}) /{' '}
                      {curso.cur_periodo_academico}
                    </option>
                  ))}
                </select>
                {/* {selectedCursoId && (
                  <div>
                    <h2>Curso Seleccionado</h2>
                    <p>ID del Curso: {selectedCursoId}</p>
                  </div>
                )} */}
              </div>
              <div className="flex flex-col gap-4 text-black">
                <h1 className="font-bold dark:text-white">
                  Resultados por estudiante
                </h1>
                <input
                  type="text"
                  placeholder="Buscar un estudiante"
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
                  <option value="">Selecciona un estudiante</option>
                  {filteredAsignaciones.map((asignacion) => (
                    <option key={asignacion.asi_id} value={asignacion.asi_id}>
                      {asignacion.usuario.usu_usuario} -{' '}
                      {asignacion.encuesta.enc_titulo} - {asignacion.asi_id}
                    </option>
                  ))}
                </select>
                {/* {selectedAsignacionId && (
                  <div>
                    <h2>Asi</h2>
                    <p>ID del ASI: {selectedAsignacionId}</p>
                  </div>
                )} */}
              </div>
              <div className="flex flex-col gap-4 pt-6 lg:pt-0 text-black">
                <h1 className="font-bold dark:text-white">Resultados curso</h1>
                <input
                  type="text"
                  placeholder="Buscar curso"
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
                  <option value="">Selecciona un curso</option>
                  {filteredEncuestas?.map((asi) => (
                    <option key={asi.enc_id} value={asi.enc_id}>
                      Test: {asi.enc_titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <ChartFull
              titulosEncuesta={titulosEncuesta}
              asignacionTest={asignacionTest}
              resultadoEncuestaCounts={resultadoEncuestaCounts}
              optionsCurso={optionsCurso}
              optionsAsignacion={optionsAsignacion}
              optionsTest={optionsTest}
            />
          </div>
          <div className="flex flex-col col-span-12 opacity-85 text-black dark:text-white mt-8 mb-8 w-full rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <h1 className="font-bold text-xl">Notas:</h1>
            <div className="flex gap-10">
              <div className="w-[48%]">
                <h1 className="font-bold">Materia:</h1>
                <SelectGroupOne
                  opciones={datosMateria}
                  onChange={setIdMateria}
                  opcionPorDefecto={idMateria}
                  advertencia="n"
                />
              </div>
              <div className="w-[48%]">
                <h1 className="font-bold">Parcial:</h1>
                <SelectGroupOne
                  opciones={datosParcial}
                  onChange={setIdParcial}
                  opcionPorDefecto={idParcial}
                  advertencia="n"
                />
              </div>
            </div>
            <div
              ref={resultadoRef}
              className="bg-whiten dark:bg-boxdark p-1 rounded-lg"
            >
              <button
                title="Exportar gráfico como PNG"
                onClick={() =>
                  downloadChartAsImage(resultadoRef, 'promedio-chart')
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.88em"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941M224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64s64 28.654 64 64s-28.654 64-64 64m96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A12 12 0 0 1 320 111.48"
                  />
                </svg>
              </button>
              <GoogleChart
                chartType="AreaChart"
                width="100%"
                height="400px"
                data={dataGoogleCharts}
                options={optionsNotas}
              />
            </div>
          </div>
          {/* <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
            {titulosEncuesta && (
              <div className="bg-whiten dark:bg-boxdark p-1 rounded-lg">
                <GoogleChart
                  chartType="PieChart"
                  width="100%"
                  height="400px"
                  data={titulosEncuesta}
                  options={optionsCurso}
                />
              </div>
            )}

            <div className="w-full h-screen overflow-x-scroll bg-white dark:bg-boxdark p-5 rounded-lg">
              <div className="h-[100%] w-[100%]">
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
            </div>

            <div className="w-full h-screen bg-whiten dark:bg-boxdark p-5 rounded-lg">
              {resultadoEncuestaCounts.length > 1 && (
                <GoogleChart
                  chartType="Bar"
                  // width="100%"
                  // height="100%"
                  data={resultadoEncuestaCounts}
                  options={optionsTest}
                />
              )}
            </div>
          </div> */}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Chart;
