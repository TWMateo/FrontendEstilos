import { useEffect, useState, ChangeEvent, useContext } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { AlertError } from '../../components/Alerts/AlertError';
import * as XLSX from 'xlsx';
import { SessionContext } from '../../Context/SessionContext';

interface Asignacion {
  fecha: string;
  periodo: string;
}

interface Asignaciones {
  asi_descripcion: string;
  asi_fecha_completado: string;
  cur_id: number;
  enc_id: number;
  usu_id: number;
}

interface Persona {
  per_cedula: string;
  per_nombres: string;
  per_apellidos: string;
  per_genero: string;
}

interface Usuario {
  cur_id: number;
  per_cedula: string;
  rol_codigo: string;
  usu_estado: boolean;
  usu_password: string;
  usu_usuario: string;
}

interface Student {
  nombre: string;
  apellido: string;
  cedula: string;
  genero: string;
}

interface Curso {
  cur_id: number;
  cur_carrera: string;
  cur_nivel: number;
}

interface Encuesta {
  enc_id: number;
  enc_titulo: string;
  enc_descripcion: string;
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_fecha_creacion: string;
}

interface Student {
  cedula: string;
  nombre: string;
  [key: string]: any;
}

interface StudentListo {
  nombre: string;
  apellido: string;
  cedula: string;
  genero: string;
}

interface Curso {
  carrera: string;
  semestre: string;
  asignatura: string;
  test: string;
  asignaciones: Asignacion[];
  datosCombinados: string;
}

interface valoresAsignados {
  mensaje: string;
  tipos: tipoValor[];
}

interface tipoValor {
  tipo: string;
  valor: string;
}

const Course = () => {
  const [actualizandoCurso, setActualizandoCurso] = useState(false);
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [test, setTest] = useState('');
  const [listaCursos, setListaCursos] = useState<Curso[]>([]);
  const [succesfull, setSuccesfull] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [datosCursosCombinados, setDatosCursosCombinados] =
    useState<valoresAsignados>({
      mensaje: 'Listado de Cursos',
      tipos: [
        { tipo: 'datos-prueba', valor: 'datos-prueba' },
        { tipo: 'datos-prueba', valor: 'datos-prueba' },
      ],
    });
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [encuestas, setEncuestas] = useState([]);
  const [asignacionesCursoSeleccionado, setAsignacionesCursoSeleccionado] =
    useState<Asignacion[]>([]);
  const [indiceCursoSeleccionado, setIndiceCursoSeleccionado] =
    useState<number>();
  const datosCarrera = {
    mensaje: 'Listado de Carreras',
    tipos: [
      {
        tipo: 'Ingeniería Mecatrónica',
        valor: 'Ingeniería Mecatrónica',
      },
      {
        tipo: 'Ingeniería en Telecomunicaciones',
        valor: 'Ingeniería en Telecomunicaciones',
      },
      {
        tipo: 'Ingeniería Textil',
        valor: 'Ingeniería Textil',
      },
      {
        tipo: 'Ingeniería Industrial',
        valor: 'Ingeniería Industrial',
      },
      {
        tipo: 'Ingeniería de Software',
        valor: 'Ingeniería de Software',
      },
    ],
  };
  const datosParciales = {
    mensaje: 'Escoja el parcial',
    tipos: [
      { tipo: 'Primer parcial', valor: 'Primer parcial' },
      { tipo: 'Segundo parcial', valor: 'Segundo parcial' },
    ],
  };
  const datosSemestre = {
    mensaje: 'Listado de Semestres',
    tipos: [
      { tipo: '1', valor: '1' },
      { tipo: '2', valor: '2' },
      { tipo: '3', valor: '3' },
      { tipo: '4', valor: '4' },
      { tipo: '5', valor: '5' },
      { tipo: '6', valor: '6' },
      { tipo: '7', valor: '7' },
      { tipo: '8', valor: '8' },
    ],
  };
  const [datosAsignaturas, setDatosAsignaturas] = useState<valoresAsignados>({
    mensaje: 'Listado de Asignaturas',
    tipos: [
      { tipo: 'Investigación científica', valor: 'Investigación científica' },
      { tipo: 'Realidad nacional', valor: 'Realidad nacional' },
      { tipo: 'Cálculo diferencial', valor: 'Cálculo diferencial' },
      { tipo: 'Ética', valor: 'Ética' },
    ],
  });
  const [datosTests, setDatosTests] = useState<valoresAsignados>({
    mensaje: 'Listado de Tests',
    tipos: [
      { tipo: 'Kolb', valor: 'Kolb' },
      { tipo: 'Sperry', valor: 'Sperry' },
    ],
  });
  const [errorListado, setErrorListado] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsListo, setStudentsListo] = useState<StudentListo[]>([]);
  const [loading, setLoading] = useState(true);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  // const crearCurso = async (curso) => {
  //   try {
  //     const response = await fetch('https://tu-dominio/api/cursos', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${tuToken}`, // Reemplaza `tuToken` con el token real
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(curso),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('Curso creado exitosamente:', data);
  //   } catch (error) {
  //     console.error('Error al crear el curso:', error.message);
  //   }
  // };

  // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) {
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });

  //     const firstSheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[firstSheetName];

  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  //       header: 1,
  //     }) as any[][];

  //     try {
  //       const studentData = extractStudentData(jsonData);
  //       setStudents(studentData);
  //       setErrorListado(null);
  //       console.log(studentData);
  //     } catch (err: any) {
  //       setErrorListado(err.message);
  //     }
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as any[][];

      try {
        if (jsonData.length === 0) {
          cambiarEstadoGuardadoTemporalmente('error');
          setMensajeError('El archivo esta vacio');
          throw new Error('El archivo está vacío');
        }

        const headers = jsonData[0];
        const expectedHeaders = ['nombre', 'apellido', 'cedula', 'genero'];

        const missingHeaders = expectedHeaders.filter(
          (header) => !headers.includes(header),
        );
        if (missingHeaders.length > 0) {
          cambiarEstadoGuardadoTemporalmente('error');
          setMensajeError('Completa el formtao del documento excel.');
          throw new Error(
            `Faltan las siguientes columnas: ${missingHeaders.join(', ')}`,
          );
        }

        // const studentData = jsonData.slice(1).map((row) => {
        //   const student: Student = {
        //     nombre: row[headers.indexOf('nombre')],
        //     apellido: row[headers.indexOf('apellido')],
        //     cedula: row[headers.indexOf('cedula')],
        //     genero: row[headers.indexOf('genero')],
        //   };
        //   return student;
        // });
        const studentData = jsonData
          .slice(1)
          .filter((row) => {
            // Filtrar filas que tienen al menos un valor no nulo o no vacío
            return row.some(
              (cell) => cell !== null && cell !== undefined && cell !== '',
            );
          })
          .map((row) => {
            // Crear objeto Student solo si todos los campos necesarios tienen valores válidos
            if (
              row[headers.indexOf('nombre')] &&
              row[headers.indexOf('apellido')] &&
              row[headers.indexOf('cedula')] &&
              row[headers.indexOf('genero')]
            ) {
              const student: Student = {
                nombre: row[headers.indexOf('nombre')],
                apellido: row[headers.indexOf('apellido')],
                cedula: row[headers.indexOf('cedula')],
                genero: row[headers.indexOf('genero')],
              };
              return student;
            }
            return null; // Devolver null si la fila no es válida
          })
          .filter((student) => student !== null); // Filtrar cualquier entrada nula


        console.log(studentData.length);
        console.log(studentData);
        if (studentData.length < 1) {
          cambiarEstadoGuardadoTemporalmente('error');
          setMensajeError('El listado debe contener estudiantes.');
          throw new Error(`El listado debe contener estudiantes.`);
        }
        setStudentsListo(studentData);
        cambiarEstadoGuardadoTemporalmente('ok');
        setMensajeError('Los datos de estudiante fueron subidos con exito!!');
        setErrorListado(null);
        console.log(studentData);
        return;
      } catch (err: any) {
        setErrorListado(err.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmitAsignaciones = async () => {
    // if (!file) {
    //   setError('No se ha seleccionado ningún archivo');
    //   return;
    // }
    setLoading(true);
    // setError(null);
    // setMensaje(null);

    try {
      const usuarios: Usuario[] = studentsListo.map((student) => ({
        cur_id: 1,
        per_cedula: student.cedula.toString(),
        rol_codigo: 'EST',
        usu_estado: false,
        usu_password: student.cedula.toString(),
        usu_usuario: `E` + student.cedula,
      }));

      const fechaISO = new Date(fechaAsignacion).toISOString();
      const asignaciones: Asignaciones[] = studentsListo.map(
        (student, index) => ({
          asi_descripcion: `Asignación para ${student.nombre} ${student.apellido}`,
          asi_fecha_completado: fechaISO,
          cur_id: parseInt(cursoSeleccionado),
          enc_id: parseInt(test),
          usu_id: 0,
        }),
      );

      console.log('PROBANDO');
      for (const student of studentsListo) {
        const persona: Persona = {
          per_cedula: student.cedula.toString(),
          per_nombres: `${student.nombre}`,
          per_apellidos: `${student.apellido}`,
          per_genero: student.genero == 'm' ? 'Masculino' : 'Femenino',
        };
        await crearPersona(persona);
      }
      for (let i = 0; i < usuarios.length; i++) {
        const usuario = usuarios[i];
        const response = await crearUsuario(usuario);
        const usuarioCreado = await response.json();
        asignaciones[i].usu_id = usuarioCreado.data.usu_id;
        await registrarAsignacion(asignaciones[i]);
      }
      const asignacionCreador = {
        asi_descripcion: `Asignación para ${usuCedula} con el rol ${rolContext}`,
        asi_fecha_completado: fechaISO,
        cur_id: parseInt(cursoSeleccionado),
        enc_id: parseInt(test),
        usu_id: usuId ? usuId : 0,
      };
      registrarAsignacion(asignacionCreador);
      cambiarEstadoGuardadoTemporalmente('ok');
      setMensajeError(
        'El listado de estudiantes y la asignación fueron registrados exitosamente!!',
      );
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractStudentData = (data: any[][]): Student[] => {
    const headers = data[0];
    const studentData: Student[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const student: Student = {} as Student;
      headers.forEach((header: string, index: number) => {
        student[header] = row[index];
      });

      // Validar que la cédula tenga exactamente 10 dígitos
      if (!/^\d{10}$/.test(student.cedula)) {
        throw new Error(
          `La cédula en la fila ${i + 1} no tiene 10 dígitos: ${
            student.cedula
          }`,
        );
      }

      studentData.push(student);
    }

    return studentData;
  };

  const saveStudents = async () => {
    if (students.length === 0) return;

    try {
      // const response = await fetch('/save-students', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(students)
      // });

      // if (response.ok) {
      console.log(students);
      console.log('Estudiantes guardados con éxito');
      // } else {
      //   console.error('Error al guardar los estudiantes');
      // }
    } catch (error) {
      console.error('Error al guardar los estudiantes:', error);
    }
  };

  const handleAgregarActualizarCurso = () => {
    if (carrera == '' || semestre == '') {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Todos los datos del curso deben ser llenados');
      return;
    }
    if (errorListado != null) {
      setMensajeError(
        'El listado de los datos debe contener los datos correctos.',
      );
      return;
    }
    let datosCombinados: string = carrera + ' ' + semestre;
    let indexDuplicado = datosCursosCombinados.tipos.findIndex(
      (cur) => cur.tipo == datosCombinados,
    );
    if (indexDuplicado != -1 && actualizandoCurso == false) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Ya existe un curso con estos datos');
      return;
    }
    const semesteNumber = parseInt(semestre);
    fetchCreateCursos(carrera, semesteNumber);
    cambiarEstadoGuardadoTemporalmente('ok');
  };

  const handleActualizarCurso = () => {
    if (carrera == '' || semestre == '') {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Todos los datos del curso deben ser llenados');
      return;
    }
    const ind = cursos.findIndex(
      (cur) =>
        cur.cur_carrera == carrera && cur.cur_nivel == parseInt(semestre),
    );
    console.log(ind);
    if (ind != -1) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Ya existe un curso con estos datos');
      return;
    }
    console.log(ind);
    fetchUpdateCurso(parseInt(cursoSeleccionado), carrera, parseInt(semestre));
    cambiarEstadoGuardadoTemporalmente('ok');
    setMensajeError('Curso actualizado!');
    setActualizandoCurso(false);
  };

  const handleAgregarAsignacion = () => {
    const index = listaCursos.findIndex(
      (curso) => curso.datosCombinados == cursoSeleccionado,
    );
    if (fechaAsignacion.length == 0 || periodo.length == 0) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Los campos de fecha y período deben ser seleccionados');
      return;
    }
    if (index == -1) return;
    let currentListaCursos = [...listaCursos];
    const asignacion: Asignacion = { fecha: fechaAsignacion, periodo: periodo };
    currentListaCursos[index].asignaciones.push(asignacion);
    setListaCursos(currentListaCursos);
  };

  const handleDeleteCurso = () => {
    let index = listaCursos.findIndex(
      (cur) => cur.datosCombinados == cursoSeleccionado,
    );
    let indexDatosCombinados = datosCursosCombinados.tipos.findIndex(
      (dat) => dat == cursoSeleccionado,
    );
    if (index == -1 && indexDatosCombinados != -1) return;
    let listaCursosActual = [...listaCursos];
    let datosCombinadosActual = datosCursosCombinados;
    datosCombinadosActual.tipos.splice(indexDatosCombinados, 1);
    listaCursosActual.splice(index, 1);
    setDatosCursosCombinados(datosCombinadosActual);
    setListaCursos(listaCursosActual);
  };

  const handlePrepararActualizacionCurso = () => {
    const index = cursos.findIndex(
      (cur) => cur.cur_id == parseInt(cursoSeleccionado),
    );
    console.log(cursoSeleccionado);
    console.log(listaCursos);
    console.log(cursos);
    if (index == -1) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Selecciona el curso para actualizar');
      return;
    }
    setActualizandoCurso(true);
    setCarrera(cursos[index].cur_carrera.toString());
    setSemestre(cursos[index].cur_nivel.toString());
  };

  const cambiarEstadoGuardadoTemporalmente = (estado: string) => {
    if (estado == 'ok') {
      setSuccesfull(true);
    } else {
      setError(true);
    }
    setTimeout(() => {
      if (estado == 'ok') {
        setSuccesfull(false);
      } else {
        setError(false);
      }
    }, 4000);
  };

  const crearPersona = async (persona: Persona) => {
    try {
      // Verificar si la persona ya existe en la base de datos
      const consultaPersona = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/persona/${persona.per_cedula}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (consultaPersona.status == 200) {
        return;
      }

      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/persona',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(persona),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear la persona');
      }
    } catch (error: any) {
      throw new Error(
        `Error al crear la persona con cédula ${persona.per_cedula}: ${error.message}`,
      );
    }
  };

  const crearUsuario = async (usuario: Usuario): Promise<Response> => {
    try {
      const responseUsuario = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/usuario/cedula/${usuario.per_cedula}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(responseUsuario);
      if (responseUsuario.status == 200) {
        return responseUsuario;
      }

      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/usuario',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario),
        },
      );

      if (response.status != 201) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear el usuario');
      }

      return response;
    } catch (error: any) {
      throw new Error(
        `Error al crear el usuario con cédula ${usuario.per_cedula}: ${error.message}`,
      );
    }
  };

  const registrarAsignacion = async (asignacion: Asignaciones) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/asignacion',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(asignacion),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al registrar asignación');
      }
    } catch (error: any) {
      throw new Error(
        `Error al registrar la asignación para el usuario con ID ${asignacion.usu_id}: ${error.message}`,
      );
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/curso',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Reemplaza `tuToken` con el token real
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { mensaje: string; data: Curso[] } = await response.json();
      const tipos = data.data.map((curso) => ({
        tipo: `${curso.cur_carrera} ${curso.cur_nivel}`,
        valor: curso.cur_id.toString(),
      }));

      setDatosCursosCombinados({
        mensaje: 'Listado de Cursos',
        tipos: tipos,
      });

      setCursos(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreateCursos = async (carrera: string, nivel: number) => {
    try {
      const cursoData = {
        cur_carrera: carrera,
        cur_nivel: nivel,
      };
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/curso',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Reemplaza `tuToken` con el token real
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cursoData),
        },
      );

      if (response.status != 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchCursos();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdateCurso = async (
    cursoId: number,
    carrera: string,
    nivel: number,
  ) => {
    try {
      console.log('VAMOS A');
      const cursoData = {
        cur_carrera: carrera,
        cur_nivel: nivel,
      };
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/curso/${cursoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Reemplaza `tuToken` con el token real
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cursoData),
        },
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el curso');
      }

      fetchCursos();
    } catch (error: any) {
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const fetchEncuestas = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/estilos/api/v1/encuesta',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Reemplaza `tuToken` con el token real
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Error al obtener las encuestas');
      }
      const data = await response.json();

      const tipos = data.data.map((encuesta: Encuesta) => ({
        tipo: `${encuesta.enc_id}. ${encuesta.enc_titulo} - ${encuesta.enc_autor}`,
        valor: encuesta.enc_id.toString(),
      }));
      setDatosTests({
        mensaje: 'Listado de Tests',
        tipos: tipos,
      });
      setEncuestas(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(cursoSeleccionado);
  }, [cursoSeleccionado]);

  useEffect(() => {
    console.log(fechaAsignacion);
  }, [fechaAsignacion]);
  useEffect(() => {
    console.log(periodo);
  }, [periodo]);

  useEffect(() => {
    fetchCursos();
    fetchEncuestas();
  }, []);

  // useEffect(() => {
  //   console.log(listaCursos);
  //   let mensajeDatosCombinados = datosCursosCombinados.mensaje;
  //   let newDatosCursosCombinados: string[] = [];
  //   listaCursos.map((curso) => {
  //     newDatosCursosCombinados.push(curso.datosCombinados);
  //   });
  //   let newCursosCombinados = {
  //     mensaje: mensajeDatosCombinados,
  //     tipos: newDatosCursosCombinados,
  //   };
  //   setDatosCursosCombinados(newCursosCombinados);
  // }, [listaCursos]);

  useEffect(() => {
    console.log(semestre);
  }, [semestre]);

  useEffect(() => {
    console.log(cursoSeleccionado);
  }, [cursoSeleccionado]);

  useEffect(() => {
    if (listaCursos.length == 0) return;
    const currentListaCurso = [...listaCursos];
    let indiceCurso = currentListaCurso.findIndex(
      (listaItem) => listaItem.datosCombinados == cursoSeleccionado,
    );
    if (indiceCurso == -1) return;
    let listadoAsignaciones = listaCursos[indiceCurso].asignaciones;
    setIndiceCursoSeleccionado(indiceCurso);
    setAsignacionesCursoSeleccionado(listadoAsignaciones);
  }, [cursoSeleccionado, listaCursos]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cursos" />
      <div className="flex flex-row justify-between gap-80 sticky top-20 z-50">
        <div className="w-100">
          {succesfull && (
            <div className="z-50 animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertSucessfull titulo="Curso agregado" mensaje="" />
            </div>
          )}
          {error && (
            <div className="z-50 animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertError titulo={mensajeError} mensaje="" />
            </div>
          )}
        </div>
        <button
          className="rounded-b-lg w-90 min-h-14 max-h-14 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          onClick={
            actualizandoCurso
              ? handleActualizarCurso
              : handleAgregarActualizarCurso
          }
        >
          {actualizandoCurso ? 'Actualizar Curso' : 'Agregar curso'}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Carrera:
        </h3>
        <SelectGroupOne
          opciones={datosCarrera}
          onChange={setCarrera}
          opcionPorDefecto={carrera}
        />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Semestre:
        </h3>
        <SelectGroupOne
          opciones={datosSemestre}
          onChange={setSemestre}
          opcionPorDefecto={semestre}
        />

        <h2 className="text-title-xsm font-semibold text-black dark:text-white">
          Aginaciones:
        </h2>
        <div className="flex flex-col gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Cursos creados:
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <SelectGroupOne
                onChange={setCursoSeleccionado}
                opciones={datosCursosCombinados}
                advertencia="n"
              />
            </div>
            <button
              className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={handlePrepararActualizacionCurso}
            >
              Actualizar
            </button>
            <button
              className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              disabled={actualizandoCurso ? true : false}
              onClick={handleDeleteCurso}
            >
              Eliminar
            </button>
          </div>
          <div className="flex gap-5">
            <div className="w-[50%]">
              <h3 className="text-title-xsm font-semibold text-black dark:text-white">
                Asignatura:
              </h3>
              <SelectGroupOne
                opciones={datosAsignaturas}
                onChange={setAsignatura}
                opcionPorDefecto={asignatura}
              />
            </div>
            <div className="w-[50%]">
              <h3 className="text-title-xsm font-semibold text-black dark:text-white">
                Test:
              </h3>
              <SelectGroupOne
                opciones={datosTests}
                onChange={setTest}
                opcionPorDefecto={test}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-title-xsm font-semibold text-black dark:text-white">
              Listado de estudiantes:
            </h3>
            {errorListado && <div style={{ color: 'red' }}>{errorListado}</div>}
            <input
              title="Listado estudiantes"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              type="file"
              className="rounded-b-lg w-[45%] col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            />
          </div>
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Fechas de asignación:
          </h3>
          {asignacionesCursoSeleccionado.map((asig) => (
            <div className="flex gap-4">
              <input
                type="text"
                value={asig.fecha}
                placeholder="Fechas asignadas"
                disabled={true}
                className={`w-[30%] rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              <input
                type="text"
                value={asig.periodo}
                placeholder="Fechas asignadas"
                disabled={true}
                className={`w-[30%] rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
            </div>
          ))}
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Nueva fecha:
          </h3>
          <div className="grid grid-cols-5 gap-7">
            <div className="flex flex-row col-span-2 rounded-lg">
              <DatePickerOne setFechaActual={setFechaAsignacion} />
            </div>
            <div className="col-span-2">
              <SelectGroupOne
                opciones={datosParciales}
                onChange={setPeriodo}
                opcionPorDefecto={periodo}
                advertencia="n"
              />
            </div>
            <button
              className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={handleSubmitAsignaciones}
            >
              Asignar
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Course;
