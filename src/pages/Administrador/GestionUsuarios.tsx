import React, { useContext, useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { SessionContext } from '../../Context/SessionContext';
import { AlertLoading } from '../../components/Alerts/AlertLoading';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
import { AlertError } from '../../components/Alerts/AlertError';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import Modal from '../../components/Modal';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';

function GestionUsuarios() {
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
  const [errorConsulta, settErrorConsulta] = useState(false);
  const [loadingConsultando, setLoadingConsultando] = useState(false);
  const [consultado, setConsultado] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [errores, setErrores] = useState<{
    cedula?: string;
    nombres?: string;
    apellidos?: string;
  }>({});
  const { sessionToken } = useContext(SessionContext);
  const [personaSeleccionada, setPersonaSeleccionada] = useState('');
  const [usuarioPass, setUsuarioPass] = useState('');
  const [usuarioId, setUsuarioId] = useState();
  const [primeraPersonaSeleccionada, setPrimeraPersonaSeleccionada] =
    useState('');
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
      {
        tipo: 'Estudiante',
        valor: 'EST',
      },
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
    console.log('ENTRA')
    if (errores.cedula || errores.nombres) {
      alert('Por favor, corrija los errores antes de continuar.');
      setErrorGuardado(true);
      setIsModalOpen(false);
      return;
    }
    setLoadingGuardando(true);
    setIsModalOpen(false);
    const data = {
      per_cedula: primeraPersonaSeleccionada,
      per_nombres: nombres,
    };

    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/persona/${primeraPersonaSeleccionada}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (response.status != 200) {
        setErrorGuardado(false);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      setLoadingGuardando(false);
      setGuardado(true);
      handleCedulas();
      if (rolUsuario) {
        handleSaveUsuario();
      }
    } catch (error: any) {
      setLoadingGuardando(false);
      setMensajeError(error.message);
      console.log(error);
      console.error('Error al enviar los datos:', error);
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

  const handleGetDataPersona = async () => {
    setLoadingConsultando(true);
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/persona/` +
          primeraPersonaSeleccionada,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (response.status != 200) {
        settErrorConsulta(true);
        setLoadingConsultando(false);
        throw new Error('Error al consultar los datos');
      }

      const responseUsuario = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/usuario/cedula/` +
          primeraPersonaSeleccionada,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      if (responseUsuario.status != 200) {
        setRolUsuario('');
        setIdCurso('');
      } else {
        const datosUsuario = await responseUsuario.json();
        setRolUsuario(datosUsuario.data.rol_codigo);
        setUsuarioPass(datosUsuario.data.usu_password);
        setUsuarioId(datosUsuario.data.usu_id);
        setIdCurso(datosUsuario.data.cur_id);
      }

      const result = await response.json();
      setNombres(result.data.per_nombres);
      setApellidos(result.data.per_apellidos);
      setGenero(result.data.per_genero);
      setLoadingConsultando(false);
      setConsultado(true);
    } catch (error: any) {
      setLoadingConsultando(false);
      setMensajeError(error.message);
      console.error('Error al consultar los datos:', error);
      settErrorConsulta(true);
      return;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      settErrorConsulta(false);
    }, 4000);
  }, [errorConsulta]);

  useEffect(() => {
    setTimeout(() => {
      setConsultado(false);
    }, 4000);
  }, [consultado]);

  useEffect(() => {
    console.log(primeraPersonaSeleccionada);
    if (primeraPersonaSeleccionada != '') {
      handleGetDataPersona();
    }
  }, [primeraPersonaSeleccionada]);

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
    setLoadingGuardando(true);
    let caracterRol = '';
    if (
      primeraPersonaSeleccionada.length == 0 ||
      rolUsuario.length == 0 ||
      idCurso.length == 0
    ) {
      console.log('ERRROR')
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
      per_cedula: primeraPersonaSeleccionada,
      rol_codigo: rolUsuario,
      usu_estado: false,
      usu_password: primeraPersonaSeleccionada,
      usu_usuario: caracterRol + primeraPersonaSeleccionada,
    };
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/usuario/${usuarioId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );
      setIsModalOpenUsuario(false);
      if (response.status != 200) {
        setErrorGuardado(true);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      setLoadingGuardando(false);
      setGuardado(true);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    console.log('PROBANDO ADM');
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gestión de usuarios" />
      <div className="h-230">
        {loadingGuardando && (
          <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertLoading titulo="Guardando..." mensaje="" />
          </div>
        )}
        {guardado && (
          <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertSucessfull titulo="Datos de la persona actualizados con éxito" mensaje="" />
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
        {errorConsulta && (
          <div className="sticky top-20 dark:bg-boxdark z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertError
              titulo="Revise los datos antes de enviarlos"
              mensaje={''}
            />
          </div>
        )}
        {loadingConsultando && (
          <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertLoading titulo="Guardando..." mensaje="" />
          </div>
        )}
        {consultado && (
          <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertSucessfull titulo="Datos obtenidos con éxito" mensaje="" />
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
              <div>
                <h1 className="font-bold">Número de cedula:</h1>
                <SelectGroupOne
                  onChange={setPrimeraPersonaSeleccionada}
                  opciones={listadoCedulas}
                />
              </div>
            </div>
            <div>
              <h1 className="font-bold">Nombres:</h1>
              <input
                type="text"
                value={nombres}
                maxLength={99}
                onChange={handleNombresChange}
                placeholder="Ingrese los nombres"
                className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errores.nombres && (
                <p className="text-red-500">{errores.nombres}</p>
              )}
            </div>           
            {rolUsuario ? (
              <div>
                <h1 className="font-bold">Rol</h1>
                <SelectGroupOne
                  onChange={setRolUsuario}
                  opciones={listadoRoles}
                  opcionPorDefecto={rolUsuario}
                />
              </div>
            ) : (
              <></>
            )}
            {/* {idCurso ? (
              <div>
                <h1 className="font-bold">Curso</h1>
                <SelectGroupOne
                  onChange={setIdCurso}
                  opciones={listadoCursos}
                  opcionPorDefecto={idCurso}
                />
              </div>
            ) : (
              <></>
            )} */}
            <button
              onClick={confirmSubmit}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-4"
            >
              Actualizar
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            mensaje="¿Estás seguro de actualizar los datos de la persona?"
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

export default GestionUsuarios;
