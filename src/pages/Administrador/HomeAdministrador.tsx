import React, { useContext, useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';
import { SessionContext } from '../../Context/SessionContext';
import Loader from '../../common/Loader';

interface Assignment {
  asi_id: number;
  enc_id: number;
  cur_id: number;
  usu_id: number;
  asi_descripcion: string;
  asi_fecha_completado: string;
  titulo: string;
}

interface FormattedData {
  titulo: string;
  descripcion: string;
}

function HomeAdministrador() {
  const [loadingTest, setLoadingTest] = useState(true);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);
  const [docAssignments, setDocAssignments] = useState<FormattedData[]>([]);
  const [estAssignments, setEstAssignments] = useState<FormattedData[]>([]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/usuario`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const respuesta = await response.json();
      const data = respuesta.data;
      const docData = data
        .filter((item: any) => item.rol_codigo === 'DOC')
        .map((item: any) => ({
          titulo: `${item.usu_id}.${item.usu_usuario}`,
          descripcion: item.rol_codigo,
        }));

      const estData = data
        .filter((item: any) => item.rol_codigo === 'EST')
        .map((item: any) => ({
          titulo: `${item.usu_id}.${item.usu_usuario}`,
          descripcion: item.rol_codigo,
        }))
        .sort(
          (a: any, b: any) =>
            parseInt(a.titulo.split('.')[0]) - parseInt(b.titulo.split('.')[0]),
        );
      setDocAssignments(docData);
      setEstAssignments(estData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(estAssignments);
  }, [estAssignments]);

  useEffect(() => {
    console.log('PROBANDO ADM');
    fetchUsuarios();
    setTimeout(() => {
      setLoadingTest(false);
    }, 3000);
  }, []);
  return (
    <DefaultLayout>
      {loadingTest ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Inicio" />
          <div
            className="flex flex-col gap-8"
            style={{
              backgroundImage: `url(${EscudoUtn})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              width: '100%',
              height: '70vh',
            }}
          >
            <TableGeneral
              listado={docAssignments}
              titulo="Docentes"
              icono="test"
              path="/registro-usuarios"
            />
            <TableGeneral
              listado={estAssignments}
              titulo="Estudiantes"
              icono="curso"
              path="/registro-usuarios"
            />
          </div>
        </>
      )}
    </DefaultLayout>
  );
}

export default HomeAdministrador;
