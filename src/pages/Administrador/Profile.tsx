import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import CoverUtn from '../../images/cover/cover-utn.png';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../Context/SessionContext';

interface Usuario {
  cedula: string;
  nombres: string;
  descripcion: string;
}

interface Persona {
  per_cedula: string;
  per_nombres: string;
  per_apellidos: string;
  per_genero: string;
}

interface ApiResponse {
  data: Persona;
  mensaje: string;
}

const Profile = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('1234567890');
  const [usuario, setUsuario] = useState<Usuario>();
  const [actualizando, setActualizando] = useState(false);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [error, setError] = useState('');
  const [persona, setPersona] = useState<Persona>();

  const handleContraseñaVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCambiarContraseña = () => {
    if (password.length < 10) return;
    let auxUsuario = usuario;
    if (auxUsuario?.cedula === undefined) return;
    auxUsuario.contraseña = password;
    setUsuario(auxUsuario);
    actualizandoCampo();
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/usuario/cedula/${usuCedula}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`, // Asegúrate de tener un token de sesión válido
          },
        },
      );

      if (response.status !== 200) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const result = await response.json();
      setUsuario(result.data);
      console.log(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPersonaPorCedula = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/persona/${usuCedula}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`, // Asegúrate de tener un token de sesión válido
          },
        },
      );

      if (response.status !== 200) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const resultados: ApiResponse = await response.json();
      setUsuario({
        cedula: usuCedula,
        nombres:
          resultados.data.per_nombres + ' ' + resultados.data.per_apellidos,
        descripcion:
          rolContext == 'EST'
            ? 'Un estudiante tiene acceso a los recursos educativos proporcionados por la plataforma, puede participar en encuestas, revisar sus asignaciones, y seguir el progreso de sus cursos. Los estudiantes pueden interactuar con el contenido del curso y enviar tareas según las indicaciones de los docentes.'
            : rolContext == 'DOC'
            ? 'Un docente tiene la responsabilidad de crear y gestionar los contenidos del curso, asignar tareas, evaluar y calificar a los estudiantes. Los docentes pueden acceder a las encuestas relacionadas con sus cursos, proporcionar retroalimentación y supervisar el progreso académico de sus estudiantes.'
            : 'Un administrador tiene la responsabilidad de crear y gestionar a usuarios dentro de la aplicación.',
      });
      const result = await response.json();
      setPersona(result.data);
      console.log(result.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPersonaPorCedula();
    setPassword(password);
  }, []);

  useEffect(() => {
    console.log(usuario);
  }, [usuario]);

  const actualizandoCampo = () => {
    setActualizando(true);
    setTimeout(() => {
      setActualizando(false);
    }, 3000);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Perfil" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative h-50 z-20 md:h-80">
          <img
            src={CoverUtn}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative border-[1.5px] border-black z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="flex justify-center drop-shadow-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="150"
                viewBox="0 0 450 512"
                className="dark:fill-white"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {usuario?.nombres}
            </h3>
            <p className="font-medium">{rolContext}</p>
            <div className="mx-auto p-5 mt-4.5 mb-5.5 grid max-w-94 grid-cols-1 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <span className="text-sm">
                <div className="font-bold">Descripción: </div>
                <div>{usuario?.descripcion}</div>
              </span>
            </div>
            <div className="flex flex-col w-[50%] gap-2">
              <label htmlFor="cedula" className="text-left">
                Cedula:
              </label>
              <input
                value={usuario?.cedula}
                type="text"
                id="cedula"
                disabled={true}
                className={`w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              <label htmlFor="nombre" className="text-left">
                Nombres:
              </label>
              <input
                value={usuario?.nombres}
                type="text"
                id="nombre"
                disabled={true}
                className={`w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {/* <div className="text-left">
                <label htmlFor="contraseña" className="text-left">
                  Contraseña:
                </label>
                <div className="flex flex-col items-center mb-2">
                  <input
                    value={password}
                    type={passwordVisible ? 'text' : 'password'}
                    id="contraseña"
                    minLength={10}
                    maxLength={10}
                    className={`w-full ${
                      password.length < 10 ? 'rounded-t-lg' : 'rounded-lg'
                    } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length < 10 && (
                    <AlertError mensaje="Llene el campo" />
                  )}
                </div>
                {actualizando && (
                  <div className="animate-fade animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
                    <AlertSucessfull
                      titulo="Contraseña actualizada"
                      mensaje=""
                    />
                  </div>
                )}
                <div className="flex mt-4 justify-between">
                  <SwitcherThree
                    enabled={passwordVisible}
                    setEnabled={handleContraseñaVisible}
                  />
                  <button
                    className={`flex w-[50%] rounded-lg justify-center bg-primary p-2 font-medium text-gray hover:bg-opacity-90`}
                    onClick={handleCambiarContraseña}
                  >
                    Guardar
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
