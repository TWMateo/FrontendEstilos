import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import SidebarEstudiante from '../components/Sidebar-Estudiante';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usuario = localStorage.getItem('usuario');
  const [rol, setRol] = useState('');

  useEffect(() => {
    let rolUsuario = localStorage.getItem('rol');
    if (rolUsuario === '"estudiante"') {
      console.log('estudiante');
      setRol('estudiante');
      return;
    } else if (rolUsuario == '"docente"') {
      console.log('doc');
      setRol('docente');
      return;
    } else if (rolUsuario == '"administrador"') {
      console.log('admin');
      setRol('administrador');
      return;
    } else if (rolUsuario == '"pruebas"') {
      console.log('prue');
      setRol('prueba');
      return;
    }
    console.log('NO existe el Rol')
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {rol === 'docente' ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : rol === 'estudiante' ? (
          <SidebarEstudiante
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : rol === 'administrador' ? (
          <SidebarEstudiante
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : rol === 'pruebas' ? (
          <SidebarEstudiante
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <div>No existe tu rol</div>
        )}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto bg-stroke dark:bg-boxdark-2 max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
