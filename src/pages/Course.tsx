import React, { useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../components/Tables/TableGeneral';
import SelectGroupOne from '../components/Forms/SelectGroup/SelectGroupOne';
import { AlertSucessfull } from '../components/Alerts/AlertSuccesfull';
// FECHAS
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styled from '@emotion/styled';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Card, CardContent, Grid } from '@mui/material';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';
import DatePickerTwo from '../components/Forms/DatePicker/DatePickerTwo';

const Course = () => {
  const [actualizandoCurso, setActualizandoCurso] = useState(false);
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

  const listadoCursojs = [
    { titulo: 'Software-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Telecomunicaciones-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Software-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Electricidad-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Automotriz-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Textil-P1', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mecatrónica-P2', descripcion: 'Jan 9, 2014' },
    { titulo: 'Industrial-P1', descripcion: 'Jan 9, 2014' },
  ];
  const datosCarrera = {
    mensaje: 'Listado de Carreras',
    tipos: ['Software', 'Telecomunicaciones','Textil'],
  };
  const datosSemestre = {
    mensaje: 'Listado de Semestres',
    tipos: ['1', '2','3','4','5','6','7','8'],
  };
  const datosAsignaturas = {
    mensaje: 'Listado de Asignaturas',
    tipos: ['Realidad Nacional', 'Ética','Calculo 1'],
  };
  const datosTests = {
    mensaje: 'Listado de Tests',
    tipos: ['A1', 'B1'],
  };

  const listadoCursos = {
    mensaje:'Listado de Cursos',
    tipos:['Curso - Semestre - Materia - Test']
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cursos" />
        <div className="flex justify-between sticky top-20 z-50 ">
          <div></div>
          <button className="rounded-b-lg w-40 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
            Agregar curso
          </button>
        </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Carrera:
        </h3>
        <SelectGroupOne opciones={datosCarrera} />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Semestre:
        </h3>
        <SelectGroupOne opciones={datosSemestre} />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Asignatura:
        </h3>
        <SelectGroupOne opciones={datosAsignaturas} />
        <h3 className="text-title-xsm font-semibold text-black dark:text-white">
          Test:
        </h3>
        <SelectGroupOne opciones={datosTests} />
        <h2 className="text-title-xsm font-semibold text-black dark:text-white">
          Aginaciones:
        </h2>
        <div className="flex flex-col gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Cursos creados:
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <SelectGroupOne opciones={listadoCursos} advertencia='n'/>
            </div>
            <button className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Actualizar
            </button>
            <button className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Eliminar
            </button>
          </div>
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Fechas de asignación:
          </h3>
          <input
            type="text"
            placeholder="Fechas asignadas"
            disabled={true}
            className={`w-[50%] rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
          <h3 className="text-title-xsm font-semibold text-black dark:text-white">
            Nueva fecha:
          </h3>
          <div className="grid grid-cols-5 gap-7">
            <div className="flex flex-row col-span-2 rounded-lg">
            <DatePickerOne />
            </div>
            <div className="col-span-2">
              <SelectGroupOne opciones={datosCarrera} advertencia='n'/>
            </div>
            <button className="rounded-b-lg col-span-1 h-13 justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Asignar
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Course;
