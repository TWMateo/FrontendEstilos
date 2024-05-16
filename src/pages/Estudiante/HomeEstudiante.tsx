import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import { SessionContext } from '../../Context/SessionContext';
import { useContext } from 'react';

const HomeEstudiante= () => {
  const listadoTests = [
    { titulo: 'Kolb', descripcion: 'Jan 9, 2014' },
    { titulo: 'Honney y Alonso', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
  ];

  const listadoCursos = [
    { titulo: 'Software-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Telecomunicaciones-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Software-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Electricidad-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Automotriz-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Textil-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mecatrónica-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Industrial-P1', descripcion: 'Jan 9, 2014' },
  ];

  const {login,logout,isLoggedIn} = useContext(SessionContext)

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Inicio" />
      <div className="flex flex-col gap-8">
        <TableGeneral listado={listadoTests} titulo='Tests Asignados' icono='test' path='/modelos/nuevo/test' crear={false}/>    
        <TableGeneral listado={listadoCursos} titulo='Cursos Asignados' icono='curso' path='/perfil' crear={false} />
      </div>
    </DefaultLayout>
  );
};

export default HomeEstudiante;
