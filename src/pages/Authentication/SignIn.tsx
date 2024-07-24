import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLogoUTN from '../../images/UTN/App-Utn.png';
import { AlertError } from '../../components/Alerts/AlertError';
// import { Props } from 'react-apexcharts';
import { SessionContext } from '../../Context/SessionContext';
import Campus from '../../images/UTN/1-CAMPUS-EL-OLIVO.png';
import { AlertLoading } from '../../components/Alerts/AlertLoading';

interface Props {
  handleLogin: () => void;
}

const SignIn: React.FC<Props> = ({ handleLogin }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [succesfullStatus, setSuccesfullStatus] = useState();
  const [loadingGuardando, setLoadingGuardando] = useState(false);
  const {
    isLoggedIn,
    setNewUserContext,
    setNewUserPassword,
    setNewUserRol,
    login,
    setNewSessionToken,
    setNewUsuCedula,
    setNewUsuId,
    setNewCurId,
  } = useContext(SessionContext);

  // Función para iniciar sesión
  const authenticateUser = async () => {
    setLoadingGuardando(true);
    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usu_usuario: user,
            usu_password: password,
          }),
        },
      );

      if (response.status != 200) {
        throw new Error('Error en la solicitud');
      }

      const result = await response.json();
      const { data } = result;

      if (response.status == 200) {
        setNewUserContext(data.usu_usuario);
        setNewUserPassword(data.usu_password);
        setNewUserRol(data.rol_codigo);
        setNewSessionToken(data.token);
        setNewUsuCedula(data.per_cedula);
        setNewUsuId(data.usu_id);
        login(data.usu_estado);
        setNewCurId(data.cur_id);
        handleLogin();
        setLoadingGuardando(false);
      } else {
        setLoadingGuardando(false);
        cambiarStatusError();
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setLoadingGuardando(false);
      cambiarStatusError();
    }
  };

  // Se encarga del control del inicio de sesión
  const loginApp = () => {
    authenticateUser();
  };

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    console.log(user);
    console.log(password);
  }, [user]);

  const cambiarStatusError = () => {
    setLoadingGuardando(false);
    setErrorStatus(true);
    setTimeout(() => {
      setErrorStatus(false);
    }, 4000);
  };

  return (
    <div
      className="flex justify-center items-center bg-boxdark h-screen"
      style={{ backgroundImage: `url(${Campus})` }}
    >
      {/* <Breadcrumb pageName="Inicio de Sesión" /> */}
      {/* <img src={Campus} alt="Logo" /> */}
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="" src={AppLogoUTN} alt="Logo" />
              </Link>
              <p className="2xl:px-20 font-bold">
                Aplicación para el análisis de estilos de aprendizaje.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">UTN</span>
              <h2
                className={`${
                  errorStatus ? 'mb-0' : 'mb-9'
                } border-b-[5.5px] text-2xl font-bold text-black sm:text-title-xl2`}
              >
                Iniciar Sesión
              </h2>
              {errorStatus && (
                <div className="flex items-center z-50 w-full animate-fade-down min-h-14 max-h-14 animate-once animate-duration-[4000ms] animate-ease-in-out animate-reverse animate-fill-both">
                  <AlertError mensaje="Credenciales incorrectas" />
                </div>
              )}
              {loadingGuardando && (
                <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
                  <AlertLoading titulo="Iniciando..." mensaje="" />
                </div>
              )}
              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black">
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      onChange={(e) => setUser(e.target.value)}
                      placeholder="Ingrese su usuario"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                    />

                    <span className="absolute right-4 top-4">
                      {/* <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg> */}
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          />
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite su contraseña"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="button"
                    value="Entrar"
                    onClick={() => loginApp()}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                {/* <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign in with Google
                </button> */}

                {/* <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{' '}
                    <Link to="/auth/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
