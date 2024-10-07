import React, { useContext, useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';
import { SessionContext } from '../../Context/SessionContext';
import Modal from '../../components/Modal';
import { AlertLoading } from '../../components/Alerts/AlertLoading';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
import { AlertError } from '../../components/Alerts/AlertError';
import { useActionData } from 'react-router-dom';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';

function RegistroUsuarios() {
  const [loadingTest, setLoadingTest] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUsuario, setIsModalOpenUsuario] = useState(false);
  const [genero, setGenero] = useState('Masculino');
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [loadingGuardando, setLoadingGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [errores, setErrores] = useState<{
    cedula?: string;
    nombres?: string;
    apellidos?: string;
  }>({});
  const { sessionToken } = useContext(SessionContext);
  const [personaSeleccionada, setPersonaSeleccionada] = useState('');
  const [listadoCedulas, setListadoCedulas] = useState({
    mensaje: 'Selecciona la cedula de la persona',
    tipos: [
      { tipo: '', valor: '' },
      { tipo: '', valor: '' },
    ],
  });
  const [rolUsuario, setRolUsuario] = useState('');
  const [listadoRoles, setListadoRoles] = useState({
    mensaje: 'Selecciona el rol del usuario',
    tipos: [
      {
        tipo: 'Docente',
        valor: 'DOC',
      },
      { tipo: 'Estudiante', valor: 'EST' },
      {
        tipo: 'Administrador',
        valor: 'ADM',
      },
    ],
  });
  const [listadoCursos, setListadoCursos] = useState({
    mensaje: 'Selecciona el curso',
    tipos: [
      { tipo: '', valor: '' },
      { tipo: '', valor: '' },
    ],
  });
  const [idCurso, setIdCurso] = useState('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const validarCedula = (valor: string) => {
    if (!/^\d+$/.test(valor)) {
      return 'La cédula solo debe contener números.';
    }
    if (valor.length !== 10) {
      return 'La cédula debe tener exactamente 10 caracteres.';
    }
    return '';
  };

  const validarTexto = (valor: string, campo: string) => {
    if (!/^[a-zA-Z\s]+$/.test(valor)) {
      return `${campo} solo debe contener letras.`;
    }
    if (valor.length > 50) {
      return `${campo} no puede tener más de 50 caracteres.`;
    }
    return '';
  };

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCedula(valor);
    setErrores((prev) => ({ ...prev, cedula: validarCedula(valor) }));
  };

  const handleNombresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombres(valor);
    setErrores((prev) => ({
      ...prev,
      nombres: validarTexto(valor, 'Nombres'),
    }));
  };

  const handleApellidosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setApellidos(valor);
    setErrores((prev) => ({
      ...prev,
      apellidos: validarTexto(valor, 'Apellidos'),
    }));
  };

  const confirmSubmit = () => {
    setIsModalOpen(true);
  };

  const confirmSubmitUsuario = () => {
    setIsModalOpenUsuario(true);
  };

  const cancelSubmitUsuario = () => {
    setIsModalOpenUsuario(false);
  };

  const cancelSubmit = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorGuardado(false);
    }, 4000);
  }, [errorGuardado]);

  useEffect(() => {
    setTimeout(() => {
      setGuardado(false);
    }, 4000);
  }, [guardado]);

  const handleSubmit = async () => {
    if (errores.cedula || errores.nombres || errores.apellidos) {
      alert('Por favor, corrija los errores antes de continuar.');
      setErrorGuardado(true);
      setIsModalOpen(false);
      return;
    }
    setLoadingGuardando(true);
    setIsModalOpen(false);
    const data = {
      per_cedula: cedula,
      per_nombres: nombres,
      per_apellidos: apellidos,
      per_genero: genero,
    };

    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/persona',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (response.status != 201) {
        setErrorGuardado(false);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      // console.log('Datos guardados:', result);
      // alert('Datos guardados exitosamente');
      setLoadingGuardando(false);
      setGuardado(true);
    } catch (error: any) {
      setLoadingGuardando(false);
      setMensajeError(error.message);
      console.log(error);
      console.error('Error al enviar los datos:', error);
      // alert('Ocurrió un error al enviar los datos');
      setErrorGuardado(true);
      return;
    }
  };

  const handleCedulas = async () => {
    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/usuario-cedulas',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (response.status != 200) {
        setErrorGuardado(false);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      console.log(result.data);
      const cedulaPersona = result.data.map((cedu: any) => ({
        tipo: cedu,
        valor: cedu,
      }));
      const nuevosDatos = {
        mensaje: 'Selecciona la cedula de la persona',
        tipos: cedulaPersona,
      };
      setListadoCedulas(nuevosDatos);
    } catch (error: any) {
      setLoadingGuardando(false);
      setMensajeError(error.message);
      console.error('Error al obtener los datos:', error);
      setErrorGuardado(true);
      return;
    }
  };

  const handleCursos = async () => {
    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/curso',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (response.status != 200) {
        setErrorGuardado(false);
        setLoadingGuardando(false);
        throw new Error('Error al obtener los datos');
      }

      const result = await response.json();
      const cursoIDs = result.data.map((cedu: any) => ({
        tipo: cedu.cur_id + '.' + cedu.cur_carrera,
        valor: cedu.cur_id,
      }));
      const nuevosDatos = {
        mensaje: 'Selecciona el curso',
        tipos: cursoIDs,
      };
      setListadoCursos(nuevosDatos);
    } catch (error: any) {
      setLoadingGuardando(false);
      setMensajeError(error.message);
      console.error('Error al obtener los datos:', error);
      setErrorGuardado(true);
      return;
    }
  };

  useEffect(() => {
    console.log(personaSeleccionada);
  }, [personaSeleccionada]);

  useEffect(() => {
    console.log(idCurso);
  }, [idCurso]);

  useEffect(() => {
    handleCedulas();
    handleCursos();
  }, []);

  const handleSaveUsuario = async () => {
    console.log(personaSeleccionada);
    console.log(rolUsuario);
    setLoadingGuardando(true);
    let caracterRol = '';
    if (
      personaSeleccionada.length == 0 ||
      rolUsuario.length == 0 ||
      idCurso.length == 0
    ) {
      return;
    }
    if (rolUsuario == 'ADM') {
      caracterRol = 'A';
    } else {
      if (rolUsuario == 'EST') {
        caracterRol = 'E';
      } else {
        caracterRol = 'D';
      }
    }
    const data = {
      cur_id: idCurso,
      per_cedula: personaSeleccionada,
      rol_codigo: rolUsuario,
      usu_estado: false,
      usu_password: personaSeleccionada,
      usu_usuario: caracterRol + personaSeleccionada,
    };
    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/usuario',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );
      setIsModalOpenUsuario(false);
      // setLoadingGuardando(true);
      if (response.status != 201) {
        setErrorGuardado(true);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      // console.log('Datos guardados:', result);
      // alert('Datos guardados exitosamente');
      setLoadingGuardando(false);
      setGuardado(true);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Registro" />
      <div className="h-230">
        {loadingGuardando && (
          <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertLoading titulo="Guardando..." mensaje="" />
          </div>
        )}
        {guardado && (
          <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertSucessfull titulo="Persona registrada con éxito" mensaje="" />
          </div>
        )}
        {errorGuardado && (
          <div className="sticky top-20 dark:bg-boxdark z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertError
              titulo="Revise los datos antes de enviarlos"
              mensaje={''}
            />
          </div>
        )}
        {/* <div>RegistroUsuarios</div> */}
        <div
          className="flex flex-col gap-8 h-screen"
          // style={{
          //   backgroundImage: `url(${EscudoUtn})`,
          //   backgroundRepeat: 'no-repeat',
          //   backgroundSize: 'contain',
          //   backgroundPosition: 'center',
          //   width: '100%',
          //   height: '70vh',
          // }}
        >
          <div className="bg-whiten dark:text-whiten dark:bg-boxdark text-black flex flex-col gap-5 opacity-85 rounded-lg p-10">
            <h1 className="font-bold text-lg">Registro de personas</h1>
            <div>
              <h1 className="font-bold">Número de cédula:</h1>
              <input
                type="text"
                value={cedula}
                maxLength={10}
                onChange={handleCedulaChange}
                placeholder="Ingrese el número de cédula"
                className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errores.cedula && (
                <p className="text-red-500">{errores.cedula}</p>
              )}
            </div>
            <div>
              <h1 className="font-bold">Nombres:</h1>
              <input
                type="text"
                value={nombres}
                maxLength={49}
                onChange={handleNombresChange}
                placeholder="Ingrese los nombres"
                className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errores.nombres && (
                <p className="text-red-500">{errores.nombres}</p>
              )}
            </div>
            <div>
              <h1 className="font-bold">Apellidos:</h1>
              <input
                type="text"
                value={apellidos}
                maxLength={49}
                onChange={handleApellidosChange}
                placeholder="Ingrese los apellidos"
                className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errores.apellidos && (
                <p className="text-red-500">{errores.apellidos}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-black dark:text-white">
                Género:
              </h3>
              <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
                <label className="flex items-center gap-3 pt-2 pb-2">
                  <div className="w-full pl-4 font-semibold">Masculino</div>
                  <div>
                    <input
                      title="Masculino"
                      type="radio"
                      name="tipoTest"
                      onClick={() => setGenero('Masculino')}
                      className="sr-only"
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                        genero == 'Masculino' && 'border-primary'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                          genero == 'Masculino' && '!bg-primary'
                        }`}
                      >
                        {' '}
                      </span>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 pt-2 pb-2">
                  <div className="w-full pl-4 font-semibold">Femenino</div>
                  <div className="relative">
                    <input
                      title="Cuantitativo"
                      type="radio"
                      name="tipoTest"
                      onClick={() => setGenero('Femenino')}
                      className="sr-only"
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                        genero == 'Femenino' && 'border-primary'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                          genero == 'Femenino' && '!bg-primary'
                        }`}
                      >
                        {' '}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <button
              onClick={confirmSubmit}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-4"
            >
              Guardar
            </button>
          </div>
          <div className="bg-whiten dark:text-whiten dark:bg-boxdark text-black flex flex-col gap-5 opacity-85 rounded-lg p-10">
            <h1 className="font-bold text-lg">Usuarios</h1>
            {/* <SelectGroupOne onChange={setPersonaSeleccionada} /> */}
            <div>
              <h1 className="font-bold">Número de cedula:</h1>
              <SelectGroupOne
                onChange={setPersonaSeleccionada}
                opciones={listadoCedulas}
              />
            </div>
            <div>
              <h1 className="font-bold">Rol</h1>
              <SelectGroupOne
                onChange={setRolUsuario}
                opciones={listadoRoles}
              />
            </div>
            <div>
              <h1 className="font-bold">Curso</h1>
              <SelectGroupOne onChange={setIdCurso} opciones={listadoCursos} />
            </div>
            {/* <div>
            <h1 className="font-bold">Apellidos:</h1>
            <input
              type="text"
              placeholder="Ingrese los apellidos"
              maxLength={75}
              // value={nombreTest.length > 0 ? nombreTest : ''}
              // onChange={(e) => setNombreTest(e.target.value)}
              className={`w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
          </div> */}
            <button
              onClick={confirmSubmitUsuario}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-4"
            >
              Guardar
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            mensaje="¿Estás seguro de guardar la persona?"
            onClose={cancelSubmit}
            onConfirm={handleSubmit}
          />
          <Modal
            isOpen={isModalOpenUsuario}
            mensaje="¿Estás seguro de guardar el usuario?"
            onClose={cancelSubmitUsuario}
            onConfirm={handleSaveUsuario}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default RegistroUsuarios;
