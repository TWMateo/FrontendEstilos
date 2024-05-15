import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartThree from '../../components/Charts/ChartThree';
// import Breadcrumb from '';
// import ChartOne from '../components/Charts/ChartOne';
// import ChartThree from '../components/Charts/ChartThree';
// import ChartTwo from '../components/Charts/ChartTwo';
// import DefaultLayout from '../layout/DefaultLayout';
// import { TableGeneral } from '../components/Tables/TableGeneral';

const Chart: React.FC = () => {
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="flex flex-col gap-8">
        <TableGeneral
          listado={listadoTests}
          titulo="Tests Creados"
          icono="test"
          path="/modelos/nuevo/test"
        />
        <TableGeneral
          listado={listadoCursos}
          titulo="Cursos creados"
          icono="curso"
          path="/perfil"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </DefaultLayout>
  );
};

export default Chart;
