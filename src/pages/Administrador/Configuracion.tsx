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
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [idCredencial, setIdCredencial] = useState<number>();
  const [idPrompt, setIdPrompt] = useState<number>();
  const [nombreCredencial, setNombreCredencial] = useState('');
  const [promptTitulo, setPromptTitulo] = useState('');
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
  const [prompt, setPrompt] = useState({
    mensaje: 'Selecciona el prompt',
    tipos: [
      { tipo: '', valor: '' },
      { tipo: '', valor: '' },
    ],
  });
  const [credencialSeleccionada, setCredencialSeleccionada] = useState('');
  const [promptSeleccionado, setPromptSeleccionado] = useState('');
  const [credencialFullData, setCredencialFullData] = useState<
    {
      cred_id: number;
      nombre_servicio: string;
      api_key: string;
      fecha_creacion: string;
    }[]
  >([]);
  const [promptFullData, setPromptFullData] = useState<
    {
      pro_id: number;
      pro_titulo: string;
      pro_descripcion: string;
    }[]
  >([]);
  const { sessionToken, usuId, usuCedula, rolContext } =
    useContext(SessionContext);

  const changeCredencialValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCredencialSeleccionada(valor);
  };

  const changePromptValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setPromptSeleccionado(valor);
  };

  const fetchCredenciales = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/credencial`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const respuesta = await response.json();
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

  const fetchPrompts = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/prompt`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const respuesta = await response.json();
      let datos = respuesta.data.map((resp: any) => ({
        tipo: resp.pro_titulo,
        valor: resp.pro_descripcion,
      }));
      let responseCredenciales = {
        mensaje: 'Selecciona el prompt',
        tipos: datos,
      };
      setPromptFullData(respuesta.data);
      setPrompt(responseCredenciales);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(promptSeleccionado);
    if (!promptFullData) {
      return;
    }
    let searchCredencial = promptFullData.find(
      (tip) => tip.pro_descripcion === promptSeleccionado,
    );
    if (!searchCredencial) {
      return;
    }
    setPromptTitulo(searchCredencial.pro_titulo);
    console.log(searchCredencial.pro_id);
    setIdPrompt(searchCredencial.pro_id);
  }, [promptSeleccionado]);

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
    fetchPrompts();
    setTimeout(() => {
      setLoadingTest(false);
    }, 3000);
  }, []);

  const cancelSubmit = () => {
    setIsModalOpen(false);
  };
  const cancelPromptSubmit = () => {
    setIsPromptModalOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (credencialSeleccionada.length == 0) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmPromptUpdate = () => {
    if (promptSeleccionado.length == 0) {
      return;
    }
    setIsPromptModalOpen(true);
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
        `http://127.0.0.1:5000/estilos/api/v1/credencial/${idCredencial}`,
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

  const handleUpdatePrompt = async () => {
    console.log('PROMPT ACT');
    setIsPromptModalOpen(false);
    setLoadingGuardando(true);
    if (!idPrompt) {
      setLoadingGuardando(false);
      return;
    }
    const data = {
      pro_titulo: promptTitulo,
      pro_descripcion: promptSeleccionado,
    };
    console.log('PROMPT 1');
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/estilos/api/v1/prompt/${idPrompt}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(data),
        },
      );
      setIsPromptModalOpen(false);
      if (response.status != 200) {
        setErrorGuardado(true);
        setLoadingGuardando(false);
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      setLoadingGuardando(false);
      setGuardado(true);
      fetchPrompts();
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
        <div className="flex flex-col gap-5">
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
              mensaje="¿Estás seguro de guardar la credencial?"
              onClose={cancelSubmit}
              onConfirm={handleUpdateCredencial}
            />
          </div>
          <div
            className="flex flex-col gap-8"
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
              <h1 className="font-bold text-lg">Configuración de prompts:</h1>
              {/* <SelectGroupOne onChange={setPersonaSeleccionada} /> */}
              <div>
                <h1 className="font-bold">Prompt:</h1>
                <SelectGroupOne
                  onChange={setPromptSeleccionado}
                  opciones={prompt}
                />
              </div>
              <div>
                <h1 className="font-bold">Valor credencial:</h1>
                <input
                  type="text"
                  value={promptSeleccionado}
                  maxLength={699}
                  onChange={changePromptValue}
                  placeholder="Ingrese los apellidos"
                  className="w-full rounded-lg border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <button
                onClick={handleConfirmPromptUpdate}
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-4"
              >
                Actualizar
              </button>
            </div>
            <Modal
              isOpen={isPromptModalOpen}
              mensaje="¿Estás seguro de guardar el prompt?"
              onClose={cancelPromptSubmit}
              onConfirm={handleUpdatePrompt}
            />
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default Configuracion;
