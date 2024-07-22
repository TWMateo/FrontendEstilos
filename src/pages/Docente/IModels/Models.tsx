import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import CardList from '../../../components/CardList';
import MultiChoiceQuestion from '../../../components/TypesQuestionInput/MultiChoiceQuestion';
import Likert from '../../../components/TypesQuestionInput/Likert';
import { AlertError } from '../../../components/Alerts/AlertError';
import { AlertSucessfull } from '../../../components/Alerts/AlertSuccesfull';
import Modal from '../../../components/Modal';
import RuleComponent from './ReglaCalculo/RuleComponent';
import { Hidden } from '@mui/material';
import { SessionContext } from '../../../Context/SessionContext';
import Loader from '../../../common/Loader';
import { AlertLoading } from '../../../components/Alerts/AlertLoading';

interface Opcion {
  id: number;
  opcion: string;
  estilo: string;
}

interface EstiloAprendizaje {
  id: number;
  nombre: string;
}

interface Test {
  titulo: string;
  autor: string;
  descripcion: string;
  cuantitativa: boolean;
  fechaCreacion: string;
  estilosAprendizaje: tipoValor[];
  valorPregunta: number;
  preguntas: Pregunta[];
  reglaCalculo: Rule[];
}

interface Pregunta {
  id: number;
  orden: number;
  pregunta: string;
  tipoPregunta: string;
  opciones: Opcion[];
  escalas: string[];
  min: number;
  max: number;
}

interface ReglaDeCalculo {
  fila: string;
  columnas: string[];
}

interface Column {
  value: string[];
  operacion: string;
}

interface Condition {
  parametros: Column[];
  condicion: string;
  valor: number;
  comparacion: string;
}

interface Rule {
  estilo: string;
  condiciones: Condition[];
}

interface tipoValor {
  tipo: string;
  valor: string;
}

interface Props {
  onGuardarTest: (test: Pregunta[]) => void;
}

const Models = () => {
  const [nombreTest, setNombreTest] = useState('');
  const [savingState, setSavingState] = useState(false);
  const [loadingGuardando, setLoadingGuardando] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState('');
  const [opcionesPregunta, setOpcionesPregunta] = useState<Opcion[]>([]);
  const [estilosAprendizaje, setEstilosAprendizaje] = useState<tipoValor[]>([
    { tipo: '', valor: '' },
  ]);
  const [estilosAprendizajeAux, setEstilosAprendizajeAux] = useState<
    tipoValor[]
  >([{ tipo: '', valor: '' }]);
  const [nuevoEstiloAprendizaje, setNuevoEstiloAprendizaje] = useState('');
  const [parametrosAprendizaje, setParametrosAprendizaje] = useState<
    tipoValor[]
  >([{ tipo: '', valor: '' }]);
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [estiloNuevaOpcion, setEstiloNuevaOpcion] = useState('');
  const [actualizandoEstilo, setActualizandoEstilo] = useState(false);
  const [estiloBuscado, setEstiloBuscado] = useState('');
  const [nuevoParametro, setNuevoParametro] = useState('');
  const [parametroBuscado, setParametroBuscado] = useState('');
  const [actualizandoParametro, setActualizandoParametro] = useState(false);
  const [listaPreguntas, setListaPreguntas] = useState<Pregunta[]>([]);
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encuestaCuantitativa, setEncuestaCuantitativa] = useState(false);
  const [valorPregunta, setValorPregunta] = useState(1);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorRegla, setErrorRegla] = useState(false);
  const { sessionToken } = useContext(SessionContext);
  const [mensajeError, setMensajeError] = useState<string>();
  const [reglaCalculo, setReglaCalculo] = useState<ReglaDeCalculo[]>([
    {
      fila: '',
      columnas: [''],
    },
  ]);

  const [errorCamposGuardar, setErrorCamposGuardar] = useState(false);

  const [tiposPreguntas, setTiposPreguntas] = useState({
    mensaje: 'Selecciona el tipo de pregunta',
    tipos: [
      { tipo: 'Selección múltiple', valor: 'seleccion' },
      { tipo: 'Likert', valor: 'likert' },
    ],
  });

  const tiposEstilosAprendizaje = {
    mensaje: 'Estilo de aprendizaje',
    tipos: estilosAprendizaje,
  };

  /* {Código relacionado al funcionamiento de las preguntas
   de opción multiple} */
  const handleClickAddOpcion = (idPregunta: number) => {
    let nuevoIdOpcion;
    if (idPregunta === undefined) return;
    let opciones = listaPreguntas.find((pre) => pre.id === idPregunta)
      ?.opciones;
    if (opciones === undefined) return;
    if (opciones.length == 0) {
      nuevoIdOpcion = 1;
    } else {
      nuevoIdOpcion = opciones[opciones?.length - 1].id + 1;
    }
    const opcion: Opcion = {
      id: nuevoIdOpcion,
      opcion: 'Opción ' + nuevoIdOpcion,
      estilo: '',
    };
    let copiaPreguntas = [...listaPreguntas];
    let pregunta = copiaPreguntas.find((pre) => pre.id === idPregunta);
    if (pregunta === undefined) return;
    pregunta.opciones = pregunta?.opciones.concat(opcion);
    setListaPreguntas(copiaPreguntas);
  };

  const handleChangePregunta = (idPregunta: number, pregunta: string) => {
    if (idPregunta === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    const index = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (index === -1) return;
    currentListaPregunta[index].pregunta = pregunta;
    setListaPreguntas(currentListaPregunta);
  };

  const handleChangeOpcion = (
    idPregunta: number,
    idOpcion: number,
    opcion: string = '',
    estilo: string = '',
  ) => {
    if (idPregunta === undefined || idOpcion === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    const indexPregunta = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    let currentOpciones = currentListaPregunta[indexPregunta].opciones;
    const indexOpciones = currentOpciones.findIndex(
      (opc) => opc.id === idOpcion,
    );
    if (estilo == '')
      currentListaPregunta[indexPregunta].opciones[indexOpciones].opcion =
        opcion;
    if (estilo != '')
      currentListaPregunta[indexPregunta].opciones[indexOpciones].estilo =
        estilo;
    setListaPreguntas(currentListaPregunta);
  };

  const handleClickDeleteOpcion = (idPregunta: number, idOpcion: number) => {
    if (idPregunta == undefined && idOpcion == undefined) return;
    let currentListaPreguntas = [...listaPreguntas];
    const indexPregunta = currentListaPreguntas.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta == -1) return;
    const currentListaOpciones = currentListaPreguntas[indexPregunta].opciones;
    if (currentListaOpciones.length == 1) return;
    const indexOpcion = currentListaOpciones.findIndex(
      (opc) => opc.id === idOpcion,
    );
    currentListaPreguntas[indexPregunta].opciones.splice(indexOpcion, 1);
    setListaPreguntas(currentListaPreguntas);
  };

  const handleClickDeletePregunta = (idPregunta: number) => {
    if (idPregunta === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    let indexPregunta = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta === -1) return;
    currentListaPregunta.splice(indexPregunta, 1);
    setListaPreguntas(currentListaPregunta);
  };

  const handleChangeLimiteRespuesta = (
    idPregunta: number,
    indicador: string,
    valor: number,
  ) => {
    if (idPregunta === undefined) return;
    let currentListaPreguntas = [...listaPreguntas];
    let index = currentListaPreguntas.findIndex((pre) => pre.id === idPregunta);
    if (index === -1) return;
    currentListaPreguntas[index].min = 0;
    currentListaPreguntas[index].max = 0;
    if (indicador === 'min') {
      currentListaPreguntas[index].min = valor;
    }
    if (indicador === 'max') {
      currentListaPreguntas[index].max = valor;
    }
    setListaPreguntas(currentListaPreguntas);
  };

  const handleChangeValorPregunta = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let valor = parseInt(e.target.value);
    if (isNaN(valor)) {
      setValorPregunta(1);
      return;
    }
    if (valor <= 0) return;
    setValorPregunta(valor);
  };

  /*{Código relacionado al funcionamiento del ingreso de los datos
     del test}*/
  const onGuardarTest = async () => {
    if (
      nombreTest.length === 0 ||
      autor.length === 0 ||
      descripcion.length === 0 ||
      estilosAprendizaje.length === 0 ||
      listaPreguntas.length === 0 ||
      rules.length === 0
    ) {
      setErrorCamposGuardar(true);
      cambiarEstadoErrorGuardadoTemporalmente();
      return;
    }

    for (const pregunta of listaPreguntas) {
      if (pregunta.pregunta.length === 0) {
        setMensajeError('Debe llenar todos los campos!');
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }
      for (const opcion of pregunta.opciones) {
        if (opcion.estilo.length === 0 || opcion.opcion.length === 0) {
          setMensajeError('Debe llenar todos los campos!');
          cambiarEstadoErrorGuardadoTemporalmente();
          return;
        }
      }
    }

    const fecha = new Date();

    const encuestaData = {
      enc_autor: autor.toString(),
      enc_cuantitativa: encuestaCuantitativa,
      enc_descripcion: descripcion.toString(),
      enc_fecha_creacion: fecha.toISOString(),
      enc_titulo: nombreTest.toString(),
    };
    console.log(encuestaData);
    try {
      console.log('UNOOO');
      setLoadingGuardando(true);
      const responseTest = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/encuesta',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(encuestaData),
        },
      );
      console.log('DOSS');
      if (responseTest.status !== 201) {
        setLoadingGuardando(false);
        setMensajeError('Error al guardar la encuesta en el servidor');
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }

      const data = await responseTest.json();
      let testId = data.data.enc_id;
      let arregloEstilosApr: tipoValor[] = [];

      const reglaCalculoData = {
        enc_id: testId,
        reglas_json: rules,
      };

      console.log(reglaCalculoData);

      try {
        const responseRegla = await fetch(
          'https://backendestilos.onrender.com/estilos/api/v1/reglas',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(reglaCalculoData),
          },
        );

        if (responseRegla.status !== 201) {
          const errorData = await responseRegla.json();
          setLoadingGuardando(false);
          setMensajeError('Error al crear la regla de cálculo!');
          cambiarEstadoErrorGuardadoTemporalmente();
          throw new Error(
            errorData.mensaje || 'Error al crear la regla de cálculo',
          );
        }
      } catch (error) {
        setLoadingGuardando(false);
        setMensajeError('Error al crear la regla de cálculo!');
        cambiarEstadoErrorGuardadoTemporalmente();
        throw new Error('Error al guardar la regla de cálculo');
      }

      try {
        const apiUrl =
          'https://backendestilos.onrender.com/estilos/api/v1/estilo';
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        };

        for (let estilo of estilosAprendizaje) {
          let estilos = {
            est_descripcion: estilo.tipo,
            est_nombre: estilo.tipo,
            enc_id: testId,
          };

          console.log(estilos);
          const responseEstilo = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(estilos),
          });

          if (responseEstilo.status !== 201) {
            setLoadingGuardando(false);
            setMensajeError(`Error al guardar el estilo ${estilo}!`);
            cambiarEstadoErrorGuardadoTemporalmente();
            throw new Error('Error al guardar el estilo');
          }

          const dataEstilo = await responseEstilo.json();
          arregloEstilosApr.push({
            tipo: estilo.tipo,
            valor: dataEstilo.data.est_id,
          });
        }
      } catch (error) {
        setLoadingGuardando(false);
        setMensajeError(`Error al guardar los estilos: ${error}`);
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }

      for (let i = 0; i < listaPreguntas.length; i++) {
        const pregunta = listaPreguntas[i];

        const preguntaData = {
          enc_id: testId,
          pre_enunciado: pregunta.pregunta,
          pre_num_respuestas_max: pregunta.max,
          pre_num_respuestas_min: pregunta.min,
          pre_orden: pregunta.orden,
          pre_tipo_pregunta: pregunta.tipoPregunta,
          pre_valor_total: valorPregunta,
        };

        try {
          console.log(preguntaData);
          const responsePregunta = await fetch(
            'https://backendestilos.onrender.com/estilos/api/v1/pregunta',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionToken}`,
              },
              body: JSON.stringify(preguntaData),
            },
          );

          if (responsePregunta.status !== 201) {
            setLoadingGuardando(false);
            setMensajeError(
              `Error al guardar la pregunta ${pregunta.pregunta}!`,
            );
            cambiarEstadoErrorGuardadoTemporalmente();
            throw new Error('Error al guardar la pregunta');
          }

          let dataPregunta = await responsePregunta.json();
          let preguntaId = dataPregunta.data.pre_id;

          for (const opcion of pregunta.opciones) {
            let estiloId = arregloEstilosApr.find(
              (estiloApr) => estiloApr.tipo === opcion.estilo,
            );

            if (estiloId === undefined) {
              return;
            }

            let estiloIdNumerico = parseInt(estiloId.valor);

            const opcionData = {
              est_id: estiloIdNumerico,
              opc_texto: opcion.opcion,
              valor_cualitativo: opcion.estilo,
              valor_cuantitativo: valorPregunta,
              pre_id: preguntaId,
            };

            try {
              console.log(opcionData);
              const responseOpcion = await fetch(
                'https://backendestilos.onrender.com/estilos/api/v1/opcion',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                  },
                  body: JSON.stringify(opcionData),
                },
              );
              console.log('pasando primer');
              if (responseOpcion.status !== 201) {
                setLoadingGuardando(false);
                setMensajeError(`Error al guardar la opción ${opcion.opcion}!`);
                cambiarEstadoErrorGuardadoTemporalmente();
                throw new Error('Error al guardar la opción');
              }
            } catch (error) {
              console.error('Error al enviar la opción:', error);
            }
          }
        } catch (error) {
          console.error(
            `Error al guardar la pregunta ${pregunta.pregunta}:`,
            error,
          );
        }
      }
      setLoadingGuardando(false);
      cambiarEstadoGuardadoTemporalmente();
      return;
    } catch (error) {
      setMensajeError('Error al guardar la encuesta');
      cambiarEstadoErrorGuardadoTemporalmente();
      console.log(error);
      return;
    }
  };

  const onGuardarNuevoEstiloAprendizaje = (dim: string) => {
    console.log('AGREGANDO');
    const estilo = nuevoEstiloAprendizaje.toLowerCase();
    const nuevoParam = nuevoParametro.toLowerCase();
    if (estilosAprendizaje[0].tipo.length == 0) {
      if (parametrosAprendizaje[0].tipo.length == 0 && dim == 'dimension') {
        let auxParam = { tipo: nuevoParam, valor: nuevoParam };
        setEstilosAprendizaje([auxParam]);
        setParametrosAprendizaje([auxParam]);
      }
      if (estilosAprendizajeAux[0].tipo.length == 0 && dim == '') {
        setEstilosAprendizaje([{ tipo: estilo, valor: estilo }]);
        setEstilosAprendizajeAux([{ tipo: estilo, valor: estilo }]);
      }
    } else {
      if (
        dim == '' &&
        !estilosAprendizaje.find((estiloA) => estiloA.tipo === estilo)
      ) {
        setEstilosAprendizaje((prevState) => [
          ...prevState,
          { tipo: estilo, valor: estilo },
        ]);
        let aux = [...estilosAprendizajeAux];
        if (aux.length == 1 && aux[0].tipo.length == 0) {
          aux[0] = { tipo: estilo, valor: estilo };
          setEstilosAprendizajeAux(aux);
        } else {
          setEstilosAprendizajeAux((prevState) => [
            ...prevState,
            { tipo: estilo, valor: estilo },
          ]);
        }
      }
      if (
        dim == 'dimension' &&
        !estilosAprendizaje.find((estiloA) => estiloA.tipo === nuevoParam)
      ) {
        console.log('viendo');
        setEstilosAprendizaje((prevState) => [
          ...prevState,
          { tipo: nuevoParam, valor: nuevoParam },
        ]);
        console.log('NUEVA DIMENSION');
        let aux = [...parametrosAprendizaje];
        if (aux.length == 1 && aux[0].tipo.length == 0) {
          aux[0] = { tipo: nuevoParam, valor: nuevoParam };
          setParametrosAprendizaje(aux);
        } else {
          setParametrosAprendizaje((prevState) => [
            ...prevState,
            { tipo: nuevoParam, valor: nuevoParam },
          ]);
        }
      }
    }
  };

  const handleClickDeleteEstiloAprendizaje = (estilo: string) => {
    const index = estilosAprendizaje.findIndex(
      (itemEst) => itemEst.tipo === estilo && itemEst.valor === estilo,
    );
    const indexAux = estilosAprendizajeAux.indexOf({
      tipo: estilo,
      valor: estilo,
    });
    let currentEstilosAprendizaje = [...estilosAprendizaje];
    let currentEstilosAux = [...estilosAprendizajeAux];
    let nuevasReglas;
    let nuevasPreguntas: Pregunta[] = [];
    if (index != -1) {
      if (currentEstilosAux.length == 1) {
        currentEstilosAux[0] = { tipo: '', valor: '' };
      }
      if (currentEstilosAprendizaje.length == 1) {
        currentEstilosAprendizaje[0] = { tipo: '', valor: '' };
        setListaPreguntas(nuevasPreguntas);
      } else {
        const preguntasActualizadas = listaPreguntas.map((pregunta) => ({
          ...pregunta,
          opciones: pregunta.opciones.filter((opc) => opc.estilo !== estilo),
        }));
        setListaPreguntas(preguntasActualizadas);
        let currentAuxi = [...estilosAprendizaje];
        currentEstilosAprendizaje = currentAuxi.filter(
          (item) => item.tipo !== estilo,
        );
        currentEstilosAux = estilosAprendizajeAux.filter(
          (item) => item.tipo !== estilo,
        );
      }
      nuevasReglas = reglaCalculo.filter((regla) => {
        const valorCoincide =
          regla.fila === estilo || regla.columnas.includes(estilo);
        return !valorCoincide;
      });
      const updatedRules = rules.filter(
        (rule) =>
          rule.estilo !== estilo &&
          !rule.condiciones.some((condicion) =>
            condicion.parametros.some((col) => col.value.includes(estilo)),
          ),
      );
      setRules(updatedRules);
      setEstilosAprendizaje(currentEstilosAprendizaje);
      setEstilosAprendizajeAux(currentEstilosAux);
      console.log(currentEstilosAux);
      setReglaCalculo(nuevasReglas);
    }
  };

  const handleClickDeleteParametroAprendizaje = (estilo: string) => {
    const index = estilosAprendizaje.findIndex(
      (itemEst) => itemEst.tipo === estilo && itemEst.valor === estilo,
    );
    const indexAux = parametrosAprendizaje.indexOf({
      tipo: estilo,
      valor: estilo,
    });
    let currentEstilosAprendizaje = [...estilosAprendizaje];
    let currentParametrosAux = [...parametrosAprendizaje];
    let nuevasReglas;
    let nuevasPreguntas: Pregunta[] = [];
    if (index != -1) {
      if (currentParametrosAux.length == 1) {
        currentParametrosAux[0] = { tipo: '', valor: '' };
      }
      if (currentEstilosAprendizaje.length == 1) {
        currentEstilosAprendizaje[0] = { tipo: '', valor: '' };
        setListaPreguntas(nuevasPreguntas);
      } else {
        const preguntasActualizadas = listaPreguntas.map((pregunta) => ({
          ...pregunta,
          opciones: pregunta.opciones.filter((opc) => opc.estilo !== estilo),
        }));
        setListaPreguntas(preguntasActualizadas);
        currentEstilosAprendizaje = currentEstilosAprendizaje.filter(
          (item) => item.tipo != estilo,
        );
        currentParametrosAux = currentParametrosAux.filter(
          (item) => item.tipo != estilo,
        );
      }
      nuevasReglas = reglaCalculo.filter((regla) => {
        const valorCoincide =
          regla.fila === estilo || regla.columnas.includes(estilo);
        return !valorCoincide;
      });
      const updatedRules = rules.filter(
        (rule) =>
          !rule.condiciones.some((condicion) =>
            condicion.parametros.some((col) => col.value.includes(estilo)),
          ),
      );
      setRules(updatedRules);
      setEstilosAprendizaje(currentEstilosAprendizaje);
      setParametrosAprendizaje(currentParametrosAux);
      setReglaCalculo(nuevasReglas);
    }
  };

  const onActualizarEstiloAprendizaje = (dim: string) => {
    let posicion;
    if (dim == 'dimension') {
      posicion = estilosAprendizaje.findIndex(
        (item) =>
          item.tipo == parametroBuscado && item.valor == parametroBuscado,
      );
    } else {
      posicion = estilosAprendizaje.findIndex(
        (item) => item.tipo == estiloBuscado && item.valor == estiloBuscado,
      );
    }
    const auxEstilosAprendizaje = [...estilosAprendizaje];
    auxEstilosAprendizaje[posicion] = {
      tipo: nuevoEstiloAprendizaje,
      valor: nuevoEstiloAprendizaje,
    };
    setEstilosAprendizaje(auxEstilosAprendizaje);
    if (dim == 'dimension') {
      const posicionAux = parametrosAprendizaje.findIndex(
        (item) =>
          item.tipo == parametroBuscado && item.valor == parametroBuscado,
      );
      const parametrosAux = [...parametrosAprendizaje];
      parametrosAux[posicionAux] = {
        tipo: nuevoParametro,
        valor: nuevoParametro,
      };
      setParametrosAprendizaje(parametrosAux);
      setActualizandoParametro(false);
    } else {
      const posicionAux = estilosAprendizajeAux.findIndex(
        (item) => item.tipo == estiloBuscado && item.valor == estiloBuscado,
      );
      if (posicionAux != -1) {
        const estilosAprendizajeAuxDos = [...estilosAprendizajeAux];
        estilosAprendizajeAuxDos[posicionAux] = {
          tipo: nuevoEstiloAprendizaje,
          valor: nuevoEstiloAprendizaje,
        };
        setEstilosAprendizajeAux(estilosAprendizajeAuxDos);
      }
      console.log('actual');
      setActualizandoParametro(false);
      setActualizandoEstilo(false);
    }
  };

  const onActualizarParametroAprendizaje = () => {
    const posicion = parametrosAprendizaje.indexOf({
      tipo: parametroBuscado,
      valor: parametroBuscado,
    });
    const auxParam = [...parametrosAprendizaje];
    auxParam[posicion] = { tipo: nuevoParametro, valor: nuevoParametro };
    setParametrosAprendizaje(auxParam);
    setActualizandoParametro(false);
  };

  const prepararActualizacionEstilo = (valor: string) => {
    setActualizandoEstilo(true);
    setNuevoEstiloAprendizaje(valor);
    setEstiloBuscado(valor);
  };

  const prepararActualizacionParametro = (valor: string) => {
    setActualizandoParametro(true);
    setNuevoParametro(valor);
    setParametroBuscado(valor);
  };

  const cambiarTipoPregunta = (valor: string) => {
    console.log(valor);
    setTipoPregunta(valor);
    setOpcionesPregunta([]);
    setNuevaOpcion('');
    setEstiloNuevaOpcion('');
  };

  const handleClickAddPregunta = () => {
    if (estilosAprendizaje[0].tipo == '') return;
    let IdUltimaPregunta;
    if (listaPreguntas.length == 0) {
      IdUltimaPregunta = 1;
    } else {
      IdUltimaPregunta = listaPreguntas[listaPreguntas.length - 1].id + 1;
    }
    let escalas: string[] = [];
    if (tipoPregunta == 'likert')
      escalas = [
        'Muy insatisfecho',
        'Insatisfecho',
        'Neutral',
        'Satisfecho',
        'Muy satisfecho',
      ];
    const pregunta: Pregunta = {
      id: IdUltimaPregunta,
      orden: listaPreguntas.length + 1,
      pregunta: 'Nueva pregunta',
      tipoPregunta: tipoPregunta,
      opciones: [
        { id: 1, opcion: 'Opción 1', estilo: '' },
        { id: 2, opcion: 'Opción 2', estilo: '' },
      ],
      escalas: escalas,
      min: 0,
      max: 0,
    };
    const nuevaLista = listaPreguntas
      .concat(pregunta)
      .sort((a, b) => a.orden - b.orden);
    setListaPreguntas(nuevaLista);
    ResetCamposPregunta();
  };

  useEffect(() => {
    console.log(tipoPregunta);
  }, [tipoPregunta]);

  const ResetCamposPregunta = () => {
    setNuevaPregunta('');
    setOpcionesPregunta([]);
    setNuevaOpcion('');
  };

  const cambiarOrden = (valor: string, direccion: string) => {
    const indice = listaPreguntas.findIndex(
      (pre) => pre.pregunta.toLowerCase() == valor.toLowerCase(),
    );
    if (indice == -1) return;

    const cambio = direccion === 'arriba' ? -1 : 1;
    const nuevoOrden = listaPreguntas[indice].orden + cambio;

    if (nuevoOrden < 1 || nuevoOrden > listaPreguntas.length) return;

    const indiceIntercambio = listaPreguntas.findIndex(
      (pre) => pre.orden === nuevoOrden,
    );

    let nuevaLista = [...listaPreguntas];
    if (indiceIntercambio > -1) {
      nuevaLista[indice].orden = nuevoOrden;
      nuevaLista[indiceIntercambio].orden -= cambio;
    }

    nuevaLista = nuevaLista.sort((a, b) => a.orden - b.orden);
    setListaPreguntas(nuevaLista);
  };

  /*{Código relacionado al funcionamiento del registro de las reglas 
    de cálculo
  }*/
  const [rules, setRules] = useState<Rule[]>([]);
  const addRule = () => {
    const newRule: Rule = { estilo: '', condiciones: [] };
    setRules([...rules, newRule]);
  };

  const deleteRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const handleRuleChange = (index: number, updatedRule: Rule) => {
    const updatedRules = [...rules];
    updatedRules[index] = updatedRule;
    setRules(updatedRules);
  };

  useEffect(() => {
    console.log('REGLASS');
    console.log(rules);
    console.log(rules.length);
  }, [rules]);
  // -------------------------

  useEffect(() => {
    setValorPregunta(1);
  }, [encuestaCuantitativa]);

  useEffect(() => {
    if (!encuestaCuantitativa) setValorPregunta(1);
    if (encuestaCuantitativa) {
      setTiposPreguntas({
        mensaje: 'Selecciona el tipo de pregunta',
        tipos: [{ tipo: 'Selección múltiple', valor: 'seleccion' }],
      });
      setListaPreguntas([]);
      setTipoPregunta('seleccion');
    } else {
      setTiposPreguntas({
        mensaje: 'Selecciona el tipo de pregunta',
        tipos: [
          { tipo: 'Selección múltiple', valor: 'seleccion' },
          { tipo: 'Likert', valor: 'likert' },
        ],
      });
      setListaPreguntas([]);
    }
  }, [encuestaCuantitativa]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    onGuardarTest();
    handleCloseModal();
  };

  const cambiarEstadoGuardadoTemporalmente = () => {
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
    }, 4000);
  };

  const cambiarEstadoErrorGuardadoTemporalmente = () => {
    setErrorGuardado(true);
    setTimeout(() => {
      setErrorGuardado(false);
    }, 4000);
  };

  useEffect(() => {
    if (parametrosAprendizaje.length > 0) {
      const newRules = rules.map((rul) => ({ ...rul, condiciones: [] }));
      setRules(newRules);
    }
  }, [parametrosAprendizaje]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Modelos" />
      {/* {loadingGuardando ? (
        <Loader />
      ) : ( */}
      <>
        {guardado && (
          <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertSucessfull titulo="Test Guardado" mensaje="" />
          </div>
        )}
        {loadingGuardando && (
          <div className="sticky top-20 bg-[#cec043] z-50 rounded-b-lg animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertLoading titulo="Guardando..." mensaje="" />
          </div>
        )}
        {errorRegla && (
          <div className="sticky top-20 bg-[#93e6c7] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[3000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertError
              titulo="Agregue al menos un estilo de aprendizaje"
              mensaje=""
            />
          </div>
        )}
        {errorGuardado && mensajeError && (
          <div className="sticky mb-4 top-20 bg-[#e4bfbf] dark:bg-[#1B1B24] z-50 rounded-b-lg animate-fade-down animate-once animate-duration-[4000ms] animate-ease-in-out animate-reverse animate-fill-both">
            <AlertError titulo="Test no guardado" mensaje={mensajeError} />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                Título:
              </h3>
              <input
                type="text"
                placeholder="Nombre del modelo"
                maxLength={75}
                value={nombreTest.length > 0 ? nombreTest : ''}
                onChange={(e) => setNombreTest(e.target.value)}
                className={`w-full ${
                  errorCamposGuardar && nombreTest.length == 0
                    ? 'rounded-t-lg'
                    : 'rounded-lg'
                } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {errorCamposGuardar && nombreTest.length == 0 && (
                <AlertError mensaje="El campo no debe estar vacío" />
              )}
            </div>
            <div className="">
              <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                Autor:
              </h3>
              <input
                type="text"
                placeholder="Nombre del autor"
                value={autor}
                maxLength={100}
                onChange={(e) => setAutor(e.target.value)}
                className={`w-full ${
                  errorCamposGuardar && autor.length == 0
                    ? 'rounded-t-lg'
                    : 'rounded-lg'
                } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {errorCamposGuardar && autor.length == 0 && (
                <AlertError mensaje="El campo no debe estar vacío" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-title-xsm font-semibold text-black dark:text-white">
                Tipo de test:
              </h3>
              <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
                <label className="flex items-center gap-3 pt-2 pb-2">
                  <div className="w-full pl-4 font-semibold">Cualitativo</div>
                  <div>
                    <input
                      title="Cualitativo"
                      type="radio"
                      name="tipoTest"
                      onClick={() => setEncuestaCuantitativa(false)}
                      className="sr-only"
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                        !encuestaCuantitativa && 'border-primary'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                          !encuestaCuantitativa && '!bg-primary'
                        }`}
                      >
                        {' '}
                      </span>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 pt-2 pb-2">
                  <div className="w-full pl-4 font-semibold">Cuantitativo</div>
                  <div className="relative">
                    <input
                      title="Cuantitativo"
                      type="radio"
                      name="tipoTest"
                      onClick={() => setEncuestaCuantitativa(true)}
                      className="sr-only"
                    />
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                        encuestaCuantitativa && 'border-primary'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                          encuestaCuantitativa && '!bg-primary'
                        }`}
                      >
                        {' '}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                Descripción:
              </h3>
              <textarea
                placeholder="Descripción del test"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={100}
                className={`w-full h-[83%] ${
                  errorCamposGuardar && descripcion.length == 0
                    ? 'rounded-t-lg'
                    : 'rounded-lg'
                } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {errorCamposGuardar && descripcion.length == 0 && (
                <AlertError mensaje="El campo no debe estar vacío" />
              )}
            </div>
          </div>
          <div className={`gap-4 ${!encuestaCuantitativa && 'hidden'}`}>
            <h3 className="text-title-xsm pt-2 pb-4 font-semibold text-black dark:text-white">
              Valor de preguntas:
            </h3>
            <input
              type="number"
              placeholder="Valor cuantitativo"
              value={valorPregunta}
              onChange={handleChangeValorPregunta}
              className="rounded-lg w-full h-13 border-[1.5px] border-strokedark bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-5 ">
            <div className="flex flex-col">
              <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                Estilos de aprendizaje:
              </h3>
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Agregar nuevo estilo"
                  value={nuevoEstiloAprendizaje}
                  onChange={(e) => setNuevoEstiloAprendizaje(e.target.value)}
                  className={`w-[50%] ${
                    errorCamposGuardar && estilosAprendizaje[0].tipo == ''
                      ? 'rounded-tl-lg'
                      : 'rounded-l-lg'
                  } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                />
                {actualizandoEstilo === true ? (
                  <button
                    className={`flex w-[50%] justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
                    onClick={() => onActualizarEstiloAprendizaje('')}
                  >
                    Actualizar Estilo de Aprendizaje
                  </button>
                ) : (
                  <button
                    className={`flex w-[50%] justify-center rounded-r-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
                    onClick={() => onGuardarNuevoEstiloAprendizaje('')}
                  >
                    Agregar Estilo de Aprendizaje
                  </button>
                )}
              </div>
              {estilosAprendizajeAux.length > 0 &&
                errorCamposGuardar &&
                estilosAprendizajeAux[0].tipo == '' && (
                  <AlertError mensaje="La lista no debe estar vacía" />
                )}
              <ul className="grid grid-cols-3 gap-4 pt-3">
                {estilosAprendizajeAux.length > 0 &&
                  estilosAprendizajeAux[0].tipo.length > 0 &&
                  estilosAprendizajeAux.map((estilo) => (
                    <CardList
                      actualizar={prepararActualizacionEstilo}
                      eliminar={handleClickDeleteEstiloAprendizaje}
                      valor={estilo.tipo}
                      limite={20}
                    />
                  ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                Dimensiones de aprendizaje:
              </h3>
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Agregar nueva dimensión"
                  value={nuevoParametro}
                  onChange={(e) => setNuevoParametro(e.target.value)}
                  className={`w-[50%] ${
                    errorCamposGuardar && estilosAprendizaje[0].tipo == ''
                      ? 'rounded-tl-lg'
                      : 'rounded-l-lg'
                  } border-[1.5px] bg-whiten border-strokedark bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                />
                {actualizandoParametro === true ? (
                  <button
                    className={`flex w-[50%] justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90`}
                    onClick={() => onActualizarEstiloAprendizaje('dimension')}
                  >
                    Actualizar Dimensión de aprendizaje
                  </button>
                ) : (
                  <button
                    className="flex w-[50%] justify-center rounded-r-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    onClick={() => onGuardarNuevoEstiloAprendizaje('dimension')}
                  >
                    Agregar Dimensión de Aprendizaje
                  </button>
                )}
              </div>
              {/* {parametrosAprendizaje.length > 0 &&
              errorCamposGuardar &&
              parametrosAprendizaje[0] == '' && (
                <AlertError mensaje="La lista no debe estar vacía" />
              )} */}
              <ul className="grid grid-cols-3 gap-4 pt-3">
                {parametrosAprendizaje.length > 0 &&
                  parametrosAprendizaje[0].tipo.length > 0 &&
                  parametrosAprendizaje.map((estilo) => (
                    <CardList
                      actualizar={prepararActualizacionParametro}
                      eliminar={handleClickDeleteParametroAprendizaje}
                      valor={estilo.tipo}
                      limite={11}
                    />
                  ))}
              </ul>
            </div>
            {/* Sección de reglas de cálculo */}
            <div>
              <h3 className="text-title-xsm pt-3 pb-3 font-semibold text-black dark:text-white">
                Regla de cálculo:
              </h3>
              <div className="flex flex-col bg-whiten dark:bg-form-input gap-5 rounded-t-lg border-[1.5px] border-black py-8 px-5 dark:text-white outline-none transition dark:border-form-strokedark">
                {/* INGRESO DE REGLA ESPECIAL */}
                <div className="App flex flex-col gap-10">
                  {rules.map((rule, index) => (
                    <div>
                      <div className="font-bold text-black dark:text-white text-lg mb-5">
                        Regla {index + 1} :
                      </div>
                      <RuleComponent
                        key={index}
                        rule={rule}
                        onChange={(updatedRule) =>
                          handleRuleChange(index, updatedRule)
                        }
                        onDelete={() => deleteRule(index)}
                        estilosAprendizaje={estilosAprendizajeAux}
                        parametrosAprendizaje={
                          parametrosAprendizaje.every(
                            (param) => param.tipo === '',
                          )
                            ? estilosAprendizajeAux
                            : parametrosAprendizaje
                        }
                      />
                    </div>
                  ))}
                  <button
                    className={`flex justify-center lg:justify-between items-center w-[40%] lg:w-[20%] gap-3 ${`rounded-lg`} bg-primary p-2 font-medium text-gray hover:bg-opacity-90`}
                    onClick={addRule}
                    disabled={
                      estilosAprendizajeAux.length == 0 ||
                      estilosAprendizajeAux[0].tipo.length == 0
                        ? true
                        : false
                    }
                  >
                    <div className="lg:w-[12%] flex items-center h-1">
                      <svg
                        className="fill-white dark:fill-bodydark1 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 612"
                      >
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                      </svg>
                    </div>
                    <div className={`flex w-[100%]`}>Crear Regla</div>
                  </button>
                </div>
              </div>
              {errorCamposGuardar && rules.length == 0 && (
                <AlertError mensaje="Debe determinar una regla de calculo" />
              )}

              {reglaCalculo.length == 0 && (
                <AlertError mensaje="La regla de calculo debe definirse" />
              )}
            </div>
          </div>
          {/* Sección de previsualizacion del test */}
          <div className="flex flex-col gap-6">
            <h3 className="text-title-xsm pt-4 placeholder:b-4 font-semibold text-black dark:text-white">
              Test:
            </h3>
            {listaPreguntas &&
              listaPreguntas.map((pre) => (
                <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
                  {pre.tipoPregunta === 'seleccion' && (
                    <>
                      <MultiChoiceQuestion
                        pregunta={pre}
                        tiposEstilosAprendizaje={tiposEstilosAprendizaje}
                        onUpdatePregunta={handleChangePregunta}
                        onUpdateOpcion={handleChangeOpcion}
                        onDeleteOpcion={handleClickDeleteOpcion}
                        onDeletePregunta={handleClickDeletePregunta}
                        onAddOpcion={handleClickAddOpcion}
                        onUpdateLimiteRespuesta={handleChangeLimiteRespuesta}
                      />
                    </>
                  )}
                  {pre.tipoPregunta === 'likert' && (
                    <Likert
                      pregunta={pre}
                      tiposEstilosAprendizaje={tiposEstilosAprendizaje}
                      onUpdatePregunta={handleChangePregunta}
                      onAddOpcion={handleClickAddOpcion}
                      onDeleteOpcion={handleClickDeleteOpcion}
                      onDeletePregunta={handleClickDeletePregunta}
                      onUpdateOpcion={handleChangeOpcion}
                    />
                  )}
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-title-xsm font-semibold text-black dark:text-white">
              Tipo de pregunta:
            </h3>
            <SelectGroupOne
              onChange={cambiarTipoPregunta}
              opciones={tiposPreguntas}
              opcionPorDefecto={tipoPregunta}
            />
          </div>
          <div className="flex gap-4">
            <button
              className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={handleClickAddPregunta}
            >
              Agregar Pregunta
            </button>
            <button
              className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              onClick={handleOpenModal}
            >
              Guardar Test
            </button>
            <Modal
              isOpen={isModalOpen}
              mensaje="¿Estás seguro de guardar el test?"
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </>
      {/* )} */}
    </DefaultLayout>
  );
};

export default Models;
