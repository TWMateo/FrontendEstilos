import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import EscudoUtn from '../../images/UTN/escudo-utn.png';
import ClassIcon from '@mui/icons-material/Class';
import BluePrint from '../../images/backgroundHeader/backGround-v2.gif';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Confirmación del modal
  const [redirectTo, setRedirectTo] = useState('');

  const handleNavLinkClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const shouldShowConfirmation =
      location.pathname === '/test' && path !== '/test';
    if (shouldShowConfirmation) {
      setIsModalOpen(true);
      setRedirectTo(path);
      e.preventDefault();
    } else {
      return true;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    handleCloseModal();
    navigate(redirectTo);
    return true;
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute border-r-[1.5px] left-0 top-0 z-9999 flex h-screen bg-bodydark1 dark:border-none w-72.5 flex-col overflow-y-hidden duration-300 ease-linear dark:bg-black lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div
        className="flex items-center bg-black justify-between gap-2 px-6 py-5.5 lg:py-6.5"
        style={{
          backgroundImage: `url(${BluePrint})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <NavLink className={''} to="/">
          <img src={EscudoUtn} alt="Logo" />
        </NavLink>
        <h3 className="text-title-xsm w-[70%] text-center font-bold text-white dark:text-white">
          UNIVERSIDAD TÉCNICA DEL NORTE
        </h3>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="no-scrollbar dark:border-none flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-1 py-4 px-4 lg:mt-3 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold ">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Inicio --> */}
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-bodydark1 duration-300 ease-in-out text-black hover:bg-black hover:text-white dark:hover:bg-meta-4 ${
                    pathname === '/' && 'bg-black text-white dark:bg-meta-4'
                  }`}
                  onClick={(e) => handleNavLinkClick('/', e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 576 512"
                    className="fill-current"
                  >
                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                  </svg>
                  Inicio
                </NavLink>
              </li>
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/test' || pathname.includes('test')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-bodydark1 duration-300 ease-in-out text-black hover:bg-black hover:text-white dark:hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes('usuario') &&
                          'bg-black text-white dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4m3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75M11 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2" clipRule="evenodd"/></svg>
                        Usuarios
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/registro-usuarios"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium dark:text-bodydark2 duration-300 ease-in-out text-slate-500 hover:text-black dark:hover:text-white ' +
                                (isActive && 'text-black dark:!text-white')
                              }
                              onClick={(e) =>
                                handleNavLinkClick('/registro-usuarios', e)
                              }
                            >
                              Registro
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/gestion-usuarios"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium dark:text-bodydark2 duration-300 ease-in-out text-slate-500 hover:text-black dark:hover:text-white ' +
                                (isActive && 'text-black dark:!text-white')
                              }
                              onClick={(e) =>
                                handleNavLinkClick('/gestion-usuarios', e)
                              }
                            >
                              Gestión usuarios
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to="/resultados"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium dark:text-bodydark2 duration-300 ease-in-out text-slate-500 hover:text-black dark:hover:text-white ' +
                                (isActive && 'text-black dark:!text-white')
                              }
                              onClick={(e) =>
                                handleNavLinkClick('/resultados', e)
                              }
                            >
                              Resultados
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* * <!--Input Modelos-->
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/modelos' || pathname.includes('modelos')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-bodydark1 duration-300 ease-in-out text-black hover:bg-black hover:text-white dark:hover:text-white dark:hover:bg-meta-4 ${
                          pathname.includes('modelos') &&
                          'bg-black text-white dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 640 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z" />
                        </svg>
                        Modelos
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/modelos/nuevo/test"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium dark:text-bodydark2 duration-300 ease-in-out text-slate-500 hover:text-black dark:hover:text-white ' +
                                (isActive && 'text-black dark:!text-white')
                              }
                              onClick={(e) =>
                                handleNavLinkClick('/modelos/nuevo/test', e)
                              }
                            >
                              Ingresar modelos
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/modelos/editar/test"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium dark:text-bodydark2 duration-300 ease-in-out text-slate-500 hover:text-black dark:hover:text-white ' +
                                (isActive && 'text-black dark:!text-white')
                              }
                              onClick={(e) =>
                                handleNavLinkClick('/modelos/editar/test', e)
                              }
                            >
                              Editar modelos
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* Menu item curso */}
              {/* <li>
                <NavLink
                  to="/curso"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-3 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:text-white text-black hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('curso') &&
                    'bg-graydark text-white dark:bg-meta-4'
                  }`}
                  onClick={(e) => handleNavLinkClick('/curso', e)}
                >
                  <ClassIcon />
                  Cursos
                </NavLink>
              </li> */}
              {/* <!-- Menu Item Perfil --> */}
              <li>
                <NavLink
                  to="/perfil"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-bodydark1 duration-300 ease-in-out text-black hover:bg-black hover:text-white dark:hover:bg-meta-4 ${
                    pathname.includes('perfil') &&
                    'bg-black text-white dark:bg-meta-4'
                  }`}
                  onClick={(e) => handleNavLinkClick('/perfil', e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Perfil
                </NavLink>
              </li>
              {/* <!-- Menu Item Configuración --> */}
              <li>
                <NavLink
                  to="/configuracion"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-bodydark1 duration-300 ease-in-out text-black hover:bg-black hover:text-white dark:hover:bg-meta-4 ${
                    pathname.includes('configuracion') &&
                    'bg-black text-white dark:bg-meta-4'
                  }`}
                  onClick={(e) => handleNavLinkClick('/configuracion', e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.97em"
                    height="1em"
                    viewBox="0 0 416 432"
                  >
                    <path
                      fill="currentColor"
                      d="m366 237l45 35q7 6 3 14l-43 74q-4 8-13 4l-53-21q-18 13-36 21l-8 56q-1 9-11 9h-85q-9 0-11-9l-8-56q-19-8-36-21l-53 21q-9 3-13-4L1 286q-4-8 3-14l45-35q-1-12-1-21t1-21L4 160q-7-6-3-14l43-74q5-8 13-4l53 21q18-13 36-21l8-56q2-9 11-9h85q10 0 11 9l8 56q19 8 36 21l53-21q9-3 13 4l43 74q4 8-3 14l-45 35q2 12 2 21t-2 21m-158.5 54q30.5 0 52.5-22t22-53t-22-53t-52.5-22t-52.5 22t-22 53t22 53t52.5 22"
                    />
                  </svg>
                  Configuración
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres cambiar de página? Se perderán los
          cambios no guardados.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
