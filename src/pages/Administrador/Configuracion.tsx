import React, { useContext, useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TableGeneral } from '../../components/Tables/TableGeneral';
import EscudoUtn from '../../images/UTN/escudo-utn.svg';
import { SessionContext } from '../../Context/SessionContext';
import Loader from '../../common/Loader';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import Modal from '../../components/Modal';
import { AlertError } from '../../components/Alerts/AlertError';
import { AlertSucessfull } from '../../components/Alerts/AlertSuccesfull';
import { AlertLoading } from '../../components/Alerts/AlertLoading';

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

function Configuracion() {
  const [loadingTest, setLoadingTest] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idCredencial, setIdCredencial] = useState<number>();
  const [nombreCredencial, setNombreCredencial] = useState('');
  const [loadingGuardando, setLoadingGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [credencial, setCredencial] = useState({
    mensaje: 'Selecciona la credencial Api Key',
    tipos: [
      { tipo: '', valor: '' },
      { tipo: '', valor: '' },
    ],
  });
  const [credencialSeleccionada, setCredencialSeleccionada] = useState('');
  const [credencialFullData, setCredencialFullData] = useState<
    {
      cred_id: number;
      nombre_servicio: string;
      api_key: string;
      fecha_creacion: string;
    }[]
  >([]);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  const changeCredencialValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCredencialSeleccionada(valor);
  };

  const fetchCredenciales = async () => {
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/credencial`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const respuesta = await response.json();
      console.log(respuesta.data);
      let datos = respuesta.data.map((resp: any) => ({
        tipo: resp.nombre_servicio,
        valor: resp.api_key,
      }));
      let responseCredenciales = {
        mensaje: 'Credencial Api Key',
        tipos: datos,
      };
      setCredencialFullData(respuesta.data);
      setCredencial(responseCredenciales);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!credencialFullData) {
      return;
    }
    let searchCredencial = credencialFullData.find(
      (tip) => tip.api_key === credencialSeleccionada,
    );
    if (!searchCredencial) {
      return;
    }
    setNombreCredencial(searchCredencial.nombre_servicio);
    setIdCredencial(searchCredencial.cred_id);
  }, [credencialSeleccionada]);

  useEffect(() => {
    console.log(credencialFullData);
  }, [credencialFullData]);

  useEffect(() => {
    fetchCredenciales();
    setTimeout(() => {
      setLoadingTest(false);
    }, 3000);
  }, []);

  const cancelSubmit = () => {
    setIsModalOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (credencialSeleccionada.length == 0) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleUpdateCredencial = async () => {
    setLoadingGuardando(true);
    if (!idCredencial) {
      return;
    }
    const data = {
      nombre_servicio: nombreCredencial,
      api_key: credencialSeleccionada,
    };
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/credencial/${idCredencial}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );
      setIsModalOpen(false);
      if (response.status != 200) {
        setErrorGuardado(true);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      setLoadingGuardando(false);
      setGuardado(true);
      fetchCredenciales();
    } catch (error) {
      console.log(error);
      return;
    }
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

  return (
    <DefaultLayout>
      {loadingTest ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb pageName="Configuración" />
          {loadingGuardando && (
            <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertLoading titulo="Guardando..." mensaje="" />
            </div>
          )}
          {guardado && (
            <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertSucessfull
                titulo="Credencial actualizada con éxito"
                mensaje=""
              />
            </div>
          )}
          {errorGuardado && (
            <div className="sticky top-20 dark:bg-boxdark z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
              <AlertError
                titulo="Revise los datos antes de actualizarlos"
                mensaje={''}
              />
            </div>
          )}
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
            <div className="bg-whiten dark:text-whiten dark:bg-boxdark text-black flex flex-col gap-5 opacity-85 rounded-lg p-10">
              <h1 className="font-bold text-lg">
                Configuración de credenciales:
              </h1>
              {/* <SelectGroupOne onChange={setPersonaSeleccionada} /> */}
              <div>
                <h1 className="font-bold">Credencial:</h1>
                <SelectGroupOne
                  onChange={setCredencialSeleccionada}
                  opciones={credencial}
                />
              </div>
              <div>
                <h1 className="font-bold">Valor credencial:</h1>
                <input
                  type="text"
                  value={credencialSeleccionada}
                  maxLength={499}
                  onChange={changeCredencialValue}
                  placeholder="Ingrese los apellidos"
                  className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <button
                onClick={handleConfirmUpdate}
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-4"
              >
                Actualizar
              </button>
            </div>
            <Modal
              isOpen={isModalOpen}
              mensaje="¿Estás seguro de guardar la persona?"
              onClose={cancelSubmit}
              onConfirm={handleUpdateCredencial}
            />
          </div>
        </>
      )}
    </DefaultLayout>
  );
}

export default Configuracion;
