import { useEffect, useState, ChangeEvent } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
// FECHAS
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { AlertError } from '../../components/Alerts/AlertError';
import * as XLSX from 'xlsx';

interface Asignacion {
  fecha: string;
  periodo: string;
}

interface Student {
  cedula: string;
  nombre: string;
  [key: string]: any;
}

interface Curso {
  carrera: string;
  semestre: string;
  asignatura: string;
  test: string;
  asignaciones: Asignacion[];
  datosCombinados: string;
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
  const [datosCursosCombinados, setDatosCursosCombinados] = useState({
    mensaje: 'Listado de Cursos',
    tipos: ['datos-prueba'],
  });
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [asignacionesCursoSeleccionado, setAsignacionesCursoSeleccionado] =
    useState<Asignacion[]>([]);
  const [indiceCursoSeleccionado, setIndiceCursoSeleccionado] =
    useState<number>();
  const datosCarrera = {
    mensaje: 'Listado de Carreras',
    tipos: ['Software', 'Telecomunicaciones', 'Textil'],
  };
  const datosParciales = {
    mensaje: 'Escoja el parcial',
    tipos: ['Primer parcial', 'Segundo parcial'],
  };
  const datosSemestre = {
    mensaje: 'Listado de Semestres',
    tipos: ['1', '2', '3', '4', '5', '6', '7', '8'],
  };
  const datosAsignaturas = {
    mensaje: 'Listado de Asignaturas',
    tipos: ['Realidad Nacional', 'Ética', 'Calculo 1'],
  };
  const datosTests = {
    mensaje: 'Listado de Tests',
    tipos: ['Kolb', 'Sperry'],
  };
  const [errorListado, setErrorListado] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

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
        const studentData = extractStudentData(jsonData);
        setStudents(studentData);
        setErrorListado(null); 
        console.log(studentData);
      } catch (err: any) {
        setErrorListado(err.message);
      }
    };

    reader.readAsArrayBuffer(file);
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
        throw new Error(`La cédula en la fila ${i + 1} no tiene 10 dígitos: ${student.cedula}`);
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
    console.log('hh')
    if (carrera == '' || semestre == '' || asignatura == '' || test == '') {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Todos los datos del curso deben ser llenados');
      return;
    }
    if(errorListado!=null){
      setMensajeError('El listado de los datos debe contener los datos correctos.');
      return;
    }
    let datosCombinados: string =
      carrera + ' - ' + semestre + ' - ' + asignatura + ' - ' + test;
    let indexDuplicado = listaCursos.findIndex(
      (cur) => cur.datosCombinados == datosCombinados,
    );
    if (indexDuplicado != -1 && actualizandoCurso == false) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Ya existe un curso con estos datos');
      return;
    }
    let nuevoCurso: Curso;
    let listadoCursosActual = [...listaCursos];
    let datosCombinadosActuales = datosCursosCombinados;
    let nuevosDatosCombinados =
      datosCombinadosActuales.tipos.concat(datosCombinados);

    let nuevaListaDeCursos;
    if (actualizandoCurso && indiceCursoSeleccionado != undefined) {
      nuevoCurso = {
        carrera: carrera,
        semestre: semestre,
        asignatura: asignatura,
        test: test,
        datosCombinados: datosCombinados,
        asignaciones: listadoCursosActual[indiceCursoSeleccionado].asignaciones,
      };
      listadoCursosActual[indiceCursoSeleccionado] = nuevoCurso;
      nuevaListaDeCursos = listadoCursosActual;
      setActualizandoCurso(false);
    } else {
      nuevoCurso = {
        carrera: carrera,
        semestre: semestre,
        asignatura: asignatura,
        test: test,
        datosCombinados: datosCombinados,
        asignaciones: [],
      };
      nuevaListaDeCursos = listadoCursosActual.concat(nuevoCurso);
    }
    datosCombinadosActuales.tipos = nuevosDatosCombinados;
    setDatosCursosCombinados(datosCombinadosActuales);
    setListaCursos(nuevaListaDeCursos);
    cambiarEstadoGuardadoTemporalmente('ok');
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
    const index = listaCursos.findIndex(
      (list) => list.datosCombinados == cursoSeleccionado,
    );
    if (index == -1) {
      cambiarEstadoGuardadoTemporalmente('error');
      setMensajeError('Selecciona el curso para actualizar');
      return;
    }
    setActualizandoCurso(true);
    setCarrera(listaCursos[index].carrera);
    setSemestre(listaCursos[index].semestre);
    setAsignatura(listaCursos[index].asignatura);
    setTest(listaCursos[index].test);
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

  useEffect(() => {
    console.log(listaCursos);
    let mensajeDatosCombinados = datosCursosCombinados.mensaje;
    let newDatosCursosCombinados: string[] = [];
    listaCursos.map((curso) => {
      newDatosCursosCombinados.push(curso.datosCombinados);
    });
    let newCursosCombinados = {
      mensaje: mensajeDatosCombinados,
      tipos: newDatosCursosCombinados,
    };
    setDatosCursosCombinados(newCursosCombinados);
  }, [listaCursos]);

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
          onClick={handleAgregarActualizarCurso}
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
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Asignatura:
        </h3>
        <SelectGroupOne
          opciones={datosAsignaturas}
          onChange={setAsignatura}
          opcionPorDefecto={asignatura}
        />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Test:
        </h3>
        <SelectGroupOne
          opciones={datosTests}
          onChange={setTest}
          opcionPorDefecto={test}
        />
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
                opciones={datosCursosCombinados}
                advertencia="n"
                onChange={setCursoSeleccionado}
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
              onClick={handleAgregarAsignacion}
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
