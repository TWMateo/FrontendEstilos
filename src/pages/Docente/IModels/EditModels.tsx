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
import EscudoUtn from '../../../images/UTN/escudo-utn.svg';
import CardListUpdate from '../../../components/CardListUpdate';
import { BsCurrencyBitcoin } from 'react-icons/bs';

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
  new: boolean;
  min: number;
  max: number;
}

interface Opcion {
  id: number;
  opcion: string;
  estilo: string;
  new: boolean;
}

interface ReglaDeCalculo {
  fila: string;
  columnas: string[];
}

interface Rule {
  estilo: string;
  condiciones: Condition[];
}

interface Condition {
  parametros: Column[];
  condicion: string;
  valor: number;
  comparacion: string;
}

interface Column {
  value: string[];
  operacion: string;
}

interface valoresAsignados {
  mensaje: string;
  tipos: tipoValor[];
}

interface tipoValor {
  tipo: string;
  valor: string;
  new: boolean;
}

interface Encuesta {
  enc_id: number;
  enc_titulo: string;
  enc_descripcion: string;
  enc_autor: string;
  enc_cuantitativa: boolean;
  enc_fecha_creacion: string;
}

interface tipoValor {
  tipo: string;
  valor: string;
}

interface Props {
  onGuardarTest: (test: Pregunta[]) => void;
}

const EditModels = () => {
  const [nombreTest, setNombreTest] = useState('');
  const [loadingCargando, setLoadingCargando] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const [loadingGuardando, setLoadingGuardando] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState('');
  const [opcionesPregunta, setOpcionesPregunta] = useState<Opcion[]>([]);
  const [estilosAprendizaje, setEstilosAprendizaje] = useState<tipoValor[]>([
    { tipo: '', valor: '', new: true },
  ]);
  const [estilosAprendizajeAux, setEstilosAprendizajeAux] = useState<
    tipoValor[]
  >([{ tipo: '', valor: '', new: true }]);
  const [nuevoEstiloAprendizaje, setNuevoEstiloAprendizaje] = useState('');
  const [parametrosAprendizaje, setParametrosAprendizaje] = useState<
    tipoValor[]
  >([{ tipo: '', valor: '', new: true }]);
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [estiloNuevaOpcion, setEstiloNuevaOpcion] = useState('');
  const [actualizandoEstilo, setActualizandoEstilo] = useState(false);
  const [estiloBuscado, setEstiloBuscado] = useState('');
  const [nuevoParametro, setNuevoParametro] = useState('');
  const [parametroBuscado, setParametroBuscado] = useState('');
  const [actualizandoParametro, setActualizandoParametro] = useState(false);
  const [listaPreguntas, setListaPreguntas] = useState<Pregunta[]>([]);
  const [listaPreguntasAux, setListaPreguntasAux] = useState<Pregunta[]>([]);
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
  const [encuestas, setEncuestas] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<Rule[]>([]);
  const [test, setTest] = useState('');
  const [datosPrueba, setDatosPrueba] = useState<any>([]);
  const [probandoo, setProbandoo] = useState<any>([]);
  const [probandooAux, setProbandooAux] = useState<any>([]);
  const [reglasActualizadas, setReglasActualizadas] = useState<any>([]);
  const [idRegla, setIdRegla] = useState('');
  const [datosTests, setDatosTests] = useState<valoresAsignados>({
    mensaje: 'Listado de Tests',
    tipos: [
      { tipo: 'Kolb', valor: 'Kolb', new: true },
      { tipo: 'Sperry', valor: 'Sperry', new: true },
    ],
  });
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

  const [tiposEstilosAprendizaje, setTiposEstilosAprendizaje] = useState({
    mensaje: 'Estilo de aprendizaje',
    tipos: estilosAprendizaje,
  });

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
      nuevoIdOpcion = opciones[opciones?.length - 1].id + 2;
    }
    const opcion: Opcion = {
      id: nuevoIdOpcion,
      opcion: 'Opción ' + nuevoIdOpcion,
      estilo: '',
      new: true,
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
    console.log(idOpcion);
    if (idPregunta == undefined && idOpcion == undefined) return;
    let currentListaPreguntas = [...listaPreguntas];
    const indexPregunta = currentListaPreguntas.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta == -1) return;
    const currentListaOpciones = currentListaPreguntas[indexPregunta].opciones;
    console.log(currentListaOpciones);
    if (currentListaOpciones.length == 1) return;
    const indexOpcion = currentListaOpciones.findIndex(
      (opc) => opc.id === idOpcion,
    );
    console.log(currentListaPreguntas[indexPregunta].opciones[indexOpcion]);
    console.log(currentListaPreguntas[indexPregunta].opciones[indexOpcion].new);
    if (currentListaPreguntas[indexPregunta].opciones[indexOpcion].new) {
      currentListaPreguntas[indexPregunta].opciones.splice(indexOpcion, 1);
      setListaPreguntas(currentListaPreguntas);
    }
  };

  const handleClickDeletePregunta = (idPregunta: number) => {
    if (idPregunta === undefined) return;
    let currentListaPregunta = [...listaPreguntas];
    let indexPregunta = currentListaPregunta.findIndex(
      (pre) => pre.id === idPregunta,
    );
    if (indexPregunta === -1) return;
    if (currentListaPregunta[indexPregunta].new) {
      currentListaPregunta.splice(indexPregunta, 1);
      setListaPreguntas(currentListaPregunta);
    }
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
    console.log('POR ACA 11');
    try {
      console.log('PROBANDO 22');
      setLoadingGuardando(true);
      const responseTest = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/encuesta/' + test,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(encuestaData),
        },
      );
      console.log('ERROR 2');
      if (responseTest.status !== 200) {
        console.log('ERROR');
        setLoadingGuardando(false);
        setMensajeError('Error al actualizar la encuesta en el servidor');
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }
      console.log('POR ACAAA');
      console.log(test);
      console.log(rules);
      console.log('POR ACA TRES');
      const data = await responseTest.json();
      let arregloEstilosApr: tipoValor[] = [];

      // ACTUALIZADO CON EL ID TEST CORRECTO
      console.log(test);
      console.log(rules);
      const reglaCalculoData = {
        enc_id: test,
        reglas_json: rules,
      };
      console.log(reglaCalculoData);
      try {
        const responseRegla = await fetch(
          'https://backendestilos.onrender.com/estilos/api/v1/reglas/' + test,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(reglaCalculoData),
          },
        );
        // if (responseRegla.status !== 200) {
        //   const errorData = await responseRegla.json();
        //   setLoadingGuardando(false);
        //   setMensajeError('Error al actualizar la regla de cálculo!');
        //   cambiarEstadoErrorGuardadoTemporalmente();
        //   throw new Error(
        //     errorData.mensaje || 'Error al actualizar la regla de cálculo',
        //   );
        // }
      } catch (error) {
        setLoadingGuardando(false);
        setMensajeError('Error al actualizar la regla de cálculo!');
        cambiarEstadoErrorGuardadoTemporalmente();
        throw new Error('Error al actualizar la regla de cálculo');
      }

      // ACTUALIZANDO ESTILOS HASTA 17/09/2024
      try {
        const apiUrl = 'https://backendestilos.onrender.com/estilos/api/v1/estilo';
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        };
        for (let estilo of estilosAprendizaje) {
          let estilos = {
            est_descripcion: estilo.tipo,
            est_nombre: estilo.tipo,
            enc_id: test,
            est_parametro: false,
          };
          if (estilo.new) {
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
              new: true,
            });
          } else {
            console.log('actualizando estilo');
            let estiloActualizado = {
              est_nombre: estilo.tipo,
              est_descripcion: estilo.tipo,
              enc_id: test,
              est_parametro: false,
            };
            const responseEstilo = await fetch(
              'https://backendestilos.onrender.com/estilos/api/v1/estilo/' + estilo.valor,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(estiloActualizado),
              },
            );
            arregloEstilosApr.push({
              tipo: estilo.tipo,
              valor: estilo.valor,
              new: false,
            });
          }
        }
        for (let estilo of parametrosAprendizaje) {
          let estilos = {
            est_descripcion: estilo.tipo,
            est_nombre: estilo.tipo,
            enc_id: test,
            est_parametro: true,
          };

          if (estilo.new) {
            console.log('nuevo parametro');
            const responseEstilo = await fetch(apiUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(estilos),
            });

            if (responseEstilo.status !== 201) {
              setLoadingGuardando(false);
              setMensajeError(`Error al guardar el parametro ${estilo}!`);
              cambiarEstadoErrorGuardadoTemporalmente();
              throw new Error('Error al guardar el parametro');
            }

            const dataEstilo = await responseEstilo.json();
            arregloEstilosApr.push({
              tipo: estilo.tipo,
              valor: dataEstilo.data.est_id,
              new: true,
            });
          } else {
            const responseEstilo = await fetch(
              'https://backendestilos.onrender.com/estilos/api/v1/estilo/' + estilo.valor,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(estilos),
              },
            );
            const dataEstilo = await responseEstilo.json();
            arregloEstilosApr.push({
              tipo: estilo.tipo,
              valor: estilo.valor,
              new: false,
            });
          }
        }
      } catch (error) {
        setLoadingGuardando(false);
        setMensajeError(`Error al guardar los parametros: ${error}`);
        cambiarEstadoErrorGuardadoTemporalmente();
        return;
      }

      for (let i = 0; i < listaPreguntas.length; i++) {
        const pregunta = listaPreguntas[i];
        console.log(pregunta);
        const preguntaData = {
          enc_id: test,
          pre_enunciado: pregunta.pregunta,
          pre_num_respuestas_max: pregunta.max,
          pre_num_respuestas_min: pregunta.min,
          pre_orden: pregunta.orden,
          pre_tipo_pregunta: pregunta.tipoPregunta,
          pre_valor_total: valorPregunta,
        };
        console.log(preguntaData);

        try {
          let preguntaId;
          if (pregunta.new) {
            console.log('Nueva pregunta');
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
            preguntaId = dataPregunta.data.pre_id;
          } else {
            console.log('Actualizando pregunta');
            console.log(preguntaData);
            preguntaId = pregunta.id;
            const responsePregunta = await fetch(
              'https://backendestilos.onrender.com/estilos/api/v1/pregunta/' + preguntaId,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(preguntaData),
              },
            );

            if (responsePregunta.status !== 200) {
              setLoadingGuardando(false);
              setMensajeError(
                `Error al guardar la pregunta ${pregunta.pregunta}!`,
              );
              cambiarEstadoErrorGuardadoTemporalmente();
              throw new Error('Error al actualizar la pregunta');
            }
          }

          for (const opcion of pregunta.opciones) {
            let estiloId = arregloEstilosApr.find(
              (estiloApr) => estiloApr.valor === opcion.estilo.toString(),
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

            console.log('OPCIONES');
            try {
              if (opcion.new) {
                console.log('NUEVA OPCION');
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
                if (responseOpcion.status !== 201) {
                  setLoadingGuardando(false);
                  setMensajeError(
                    `Error al actualizar la opción ${opcion.opcion}!`,
                  );
                  cambiarEstadoErrorGuardadoTemporalmente();
                  throw new Error('Error al actualizar la opción');
                }
              } else {
                console.log('ACTUALIZANDO OPCION');
                const opcionDataActualizacion = {
                  est_id: estiloIdNumerico,
                  opc_texto: opcion.opcion,
                  opc_valor_cualitativo: opcion.estilo,
                  opc_valor_cuantitativo: valorPregunta,
                  pre_id: preguntaId,
                };
                const responseOpcion = await fetch(
                  'https://backendestilos.onrender.com/estilos/api/v1/opcion/' + opcion.id,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify(opcionDataActualizacion),
                  },
                );
                if (responseOpcion.status !== 200) {
                  setLoadingGuardando(false);
                  setMensajeError(
                    `Error al actualizar la opción ${opcion.opcion}!`,
                  );
                  cambiarEstadoErrorGuardadoTemporalmente();
                  throw new Error('Error al guardar la opción');
                }
              }
            } catch (error) {
              console.error('Error al enviar la opción:', error);
            }
          }
        } catch (error) {
          console.error(
            `Error al actualizar la pregunta ${pregunta.pregunta}:`,
            error,
          );
        } finally {
          setLoadingGuardando(false);
        }
      }
      setLoadingGuardando(false);
      cambiarEstadoGuardadoTemporalmente();
      return;
    } catch (error) {
      setMensajeError('Error al guardar la encuesta');
      cambiarEstadoErrorGuardadoTemporalmente();
      return;
    } finally {
      setLoadingGuardando(false);
    }
  };

  const onGuardarNuevoEstiloAprendizaje = (dim: string) => {
    const estilo = nuevoEstiloAprendizaje.toLowerCase();
    const nuevoParam = nuevoParametro.toLowerCase();
    if (estilosAprendizaje[0].tipo.length == 0) {
      if (parametrosAprendizaje[0].tipo.length == 0 && dim == 'dimension') {
        let auxParam = { tipo: nuevoParam, valor: nuevoParam, new: true };
        setEstilosAprendizaje([auxParam]);
        setParametrosAprendizaje([auxParam]);
      }
      if (estilosAprendizajeAux[0].tipo.length == 0 && dim == '') {
        setEstilosAprendizaje([{ tipo: estilo, valor: estilo, new: true }]);
        setEstilosAprendizajeAux([{ tipo: estilo, valor: estilo, new: true }]);
      }
    } else {
      if (
        dim == '' &&
        !estilosAprendizaje.find((estiloA) => estiloA.tipo === estilo)
      ) {
        setEstilosAprendizaje((prevState) => [
          ...prevState,
          { tipo: estilo, valor: estilo, new: true },
        ]);
        let aux = [...estilosAprendizajeAux];
        if (aux.length == 1 && aux[0].tipo.length == 0) {
          aux[0] = { tipo: estilo, valor: estilo, new: true };
          setEstilosAprendizajeAux(aux);
        } else {
          setEstilosAprendizajeAux((prevState) => [
            ...prevState,
            { tipo: estilo, valor: estilo, new: true },
          ]);
        }
      }
      if (
        dim == 'dimension' &&
        !parametrosAprendizaje.find((estiloA) => estiloA.tipo === nuevoParam)
      ) {
        console.log('AGREGANDO PARAMETRO');
        let aux = [...parametrosAprendizaje];
        if (aux.length == 1 && aux[0].tipo.length == 0) {
          aux[0] = { tipo: nuevoParam, valor: nuevoParam, new: true };
          console.log('CASO 1');
          setParametrosAprendizaje(aux);
        } else {
          console.log('CASO 2');
          setParametrosAprendizaje((prevState) => [
            ...prevState,
            { tipo: nuevoParam, valor: nuevoParam, new: true },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    console.log(rules);
  }, [rules]);

  useEffect(() => {
    console.log(parametrosAprendizaje);
  }, [parametrosAprendizaje]);

  const handleClickDeleteEstiloAprendizaje = (estilo: tipoValor) => {
    const index = estilosAprendizaje.findIndex(
      (itemEst) =>
        itemEst.tipo === estilo.tipo && itemEst.valor === estilo.valor,
    );
    console.log(estilo);
    console.log('INDICE: ' + index);
    console.log(estilosAprendizaje[index].new);
    if (estilosAprendizaje[index].new) {
      let currentEstilosAprendizaje = [...estilosAprendizaje];
      let currentEstilosAux = [...estilosAprendizajeAux];
      let nuevasReglas;
      let nuevasPreguntas: Pregunta[] = [];
      if (index != -1) {
        if (currentEstilosAux.length == 1) {
          currentEstilosAux[0] = { tipo: '', valor: '', new: true };
        }
        if (currentEstilosAprendizaje.length == 1) {
          currentEstilosAprendizaje[0] = { tipo: '', valor: '', new: true };
          setListaPreguntas(nuevasPreguntas);
        } else {
          const preguntasActualizadas = listaPreguntas.map((pregunta) => ({
            ...pregunta,
            opciones: pregunta.opciones.filter(
              (opc) => opc.estilo !== estilo.tipo,
            ),
          }));
          setListaPreguntas(preguntasActualizadas);
          let currentAuxi = [...estilosAprendizaje];
          currentEstilosAprendizaje = currentAuxi.filter(
            (item) => item.tipo !== estilo.tipo,
          );
          currentEstilosAux = estilosAprendizajeAux.filter(
            (item) => item.tipo !== estilo.tipo,
          );
        }
        nuevasReglas = reglaCalculo.filter((regla) => {
          const valorCoincide =
            regla.fila === estilo.tipo || regla.columnas.includes(estilo.tipo);
          return !valorCoincide;
        });
        const updatedRules = rules.filter(
          (rule) =>
            rule.estilo !== estilo.tipo &&
            !rule.condiciones.some((condicion) =>
              condicion.parametros.some((col) =>
                col.value.includes(estilo.tipo),
              ),
            ),
        );
        setRules(updatedRules);
        setEstilosAprendizaje(currentEstilosAprendizaje);
        setEstilosAprendizajeAux(currentEstilosAux);
        setReglaCalculo(nuevasReglas);
      }
    }
  };

  const handleClickDeleteParametroAprendizaje = (estilo: tipoValor) => {
    const index = parametrosAprendizaje.findIndex(
      (itemEst) => itemEst.tipo === estilo.tipo,
    );
    // const indexAux = parametrosAprendizaje.indexOf({
    //   tipo: estilo,
    //   valor: estilo,
    // });
    console.log('BORRANDO PARAM:');
    console.log(estilo);
    // let currentEstilosAprendizaje = [...estilosAprendizaje];
    let currentParametrosAux = [...parametrosAprendizaje];
    let nuevasReglas;
    let nuevasPreguntas: Pregunta[] = [];
    console.log(currentParametrosAux);
    console.log(index);
    if (index != -1) {
      // if (currentParametrosAux.length == 1) {
      //   currentParametrosAux[0] = { tipo: '', valor: '', new: true };
      // }
      if (currentParametrosAux.length == 1) {
        currentParametrosAux[0] = { tipo: '', valor: '', new: true };
        setListaPreguntas(nuevasPreguntas);
      } else {
        // const preguntasActualizadas = listaPreguntas.map((pregunta) => ({
        //   ...pregunta,
        //   opciones: pregunta.opciones.filter(
        //     (opc) => opc.estilo !== estilo.tipo,
        //   ),
        // }));
        // setListaPreguntas(preguntasActualizadas);
        console.log(currentParametrosAux[index]);
        if (currentParametrosAux[index].new) {
          currentParametrosAux = currentParametrosAux.filter(
            (item) => item.tipo != estilo.tipo,
          );
        }
      }
      // nuevasReglas = reglaCalculo.filter((regla) => {
      //   const valorCoincide =
      //     regla.fila === estilo.tipo || regla.columnas.includes(estilo.tipo);
      //   return !valorCoincide;
      // });
      // const updatedRules = rules.filter(
      //   (rule) =>
      //     !rule.condiciones.some((condicion) =>
      //       condicion.parametros.some((col) => col.value.includes(estilo.tipo)),
      //     ),
      // );
      // setRules(updatedRules);
      // setEstilosAprendizaje(currentEstilosAprendizaje);
      setParametrosAprendizaje(currentParametrosAux);
      // setReglaCalculo(nuevasReglas);
    }
  };

  useEffect(() => {
    console.log(rules);
  }, [rules]);

  function replaceValue(
    obj: Rule[],
    targetValue: string,
    newValue: string,
  ): Rule[] {
    return obj.map((rule) => {
      const updatedRule = { ...rule }; // Creamos una copia del objeto para mantener la inmutabilidad

      // Iterar sobre las condiciones y parámetros de cada regla
      updatedRule.condiciones = updatedRule.condiciones.map((condicion) => {
        const updatedCondicion = { ...condicion };

        updatedCondicion.parametros = updatedCondicion.parametros.map(
          (parametro) => {
            const updatedParametro = { ...parametro };

            // Reemplazar el valor si coincide con el valor objetivo
            updatedParametro.value = updatedParametro.value.map((val) =>
              val === targetValue ? newValue : val,
            );

            return updatedParametro;
          },
        );

        return updatedCondicion;
      });

      return updatedRule;
    });
  }

  const onActualizarEstiloAprendizaje = (dim: string) => {
    let posicion;
    console.log(rules);
    if (dim == 'dimension') {
      console.log('DIMENSION');
      posicion = parametrosAprendizaje.findIndex(
        (item) => item.tipo == parametroBuscado,
      );
    } else {
      posicion = estilosAprendizaje.findIndex(
        (item) => item.tipo == estiloBuscado,
      );
    }
    if (posicion == -1) {
      setActualizandoParametro(false);
      setActualizandoEstilo(false);
      return;
    }
    // const auxEstilosAprendizaje = [...estilosAprendizaje];
    // auxEstilosAprendizaje[posicion] = {
    //   tipo: nuevoEstiloAprendizaje,
    //   valor: auxEstilosAprendizaje[posicion].valor,
    //   new: auxEstilosAprendizaje[posicion].new,
    // };
    // setEstilosAprendizaje(auxEstilosAprendizaje);
    if (dim == 'dimension') {
      console.log('ACTUALIZANDO DIMENSION');
      const posicionAux = parametrosAprendizaje.findIndex(
        (item) => item.tipo == parametroBuscado,
      );
      const parametrosAux = [...parametrosAprendizaje];
      parametrosAux[posicionAux] = {
        tipo: nuevoParametro,
        valor: parametrosAux[posicionAux].valor,
        new: parametrosAux[posicionAux].new,
      };
      setParametrosAprendizaje(parametrosAux);
      setActualizandoParametro(false);
    } else {
      const posicionAux = estilosAprendizaje.findIndex(
        (item) => item.tipo == estiloBuscado,
      );
      if (posicionAux != -1) {
        console.log('ESTILO');
        const estilosAprendizajeAuxDos = [...estilosAprendizaje];
        estilosAprendizajeAuxDos[posicionAux] = {
          tipo: nuevoEstiloAprendizaje,
          valor: estilosAprendizajeAuxDos[posicionAux].valor,
          new: estilosAprendizajeAuxDos[posicionAux].new,
        };
        setEstilosAprendizaje(estilosAprendizajeAuxDos);
      }
      setActualizandoEstilo(false);
    }
  };

  useEffect(() => {
    console.log(estilosAprendizaje);
  }, [estilosAprendizaje]);

  useEffect(() => {
    console.log(parametrosAprendizaje);
  }, [parametrosAprendizaje]);

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
    setTipoPregunta(valor);
    setOpcionesPregunta([]);
    setNuevaOpcion('');
    setEstiloNuevaOpcion('');
  };

  const handleClickAddPregunta = () => {
    console.log('add preg');
    console.log(estilosAprendizajeAux);
    if(tipoPregunta.length==0) return;
    if (estilosAprendizaje[0].tipo == '') return;
    console.log('PASO');
    let IdUltimaPregunta;
    if (listaPreguntas.length == 0) {
      IdUltimaPregunta = 1;
    } else {
      IdUltimaPregunta = listaPreguntas[listaPreguntas.length - 1].id + 2;
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
      orden: listaPreguntas.length + 2,
      pregunta: 'Nueva pregunta',
      tipoPregunta: tipoPregunta,
      opciones: [
        { id: 1, opcion: 'Opción 1', estilo: '', new: true },
        { id: 2, opcion: 'Opción 2', estilo: '', new: true },
      ],
      new: true,
      escalas: escalas,
      min: 0,
      max: 0,
    };
    const nuevaLista = listaPreguntas
      .concat(pregunta)
      .sort((a, b) => a.orden - b.orden);
    console.log(nuevaLista);
    setListaPreguntas(nuevaLista);
    ResetCamposPregunta();
  };

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
  const addRule = () => {
    const newRule: Rule = { estilo: '', condiciones: [] };
    setRules([...rules, newRule]);
  };

  useEffect(() => {
    console.log(listaPreguntas);
  }, [listaPreguntas]);

  const deleteRule = (index: number) => {
    console.log('BORRAR REGLAS:');
    console.log(rules);
    console.log(index);
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const handleRuleChange = (index: number, updatedRule: Rule) => {
    const updatedRules = [...rules];
    updatedRules[index] = updatedRule;
    // setReglasActualizadas(updatedRules);
    setRules(updatedRules);
  };

  const fetchEncuestas = async () => {
    try {
      const response = await fetch(
        'https://backendestilos.onrender.com/estilos/api/v1/encuesta',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Reemplaza `tuToken` con el token real
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status != 200) {
        throw new Error('Error al obtener las encuestas');
      }
      const data = await response.json();

      const tipos = data.data.map((encuesta: Encuesta) => ({
        tipo: `${encuesta.enc_id}. ${encuesta.enc_titulo} - ${encuesta.enc_autor}`,
        valor: encuesta.enc_id.toString(),
      }));

      setDatosTests({
        mensaje: 'Listado de Tests ',
        tipos: tipos,
      });
      setEncuestas(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
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

  useEffect(() => {
    fetchEncuestas();
  }, []);

  useEffect(() => {
    console.log(valorPregunta);
  }, [valorPregunta]);

  // useEffect(() => {
  //   if (parametrosAprendizaje.length > 0) {
  //     const newRules = rules.map((rul) => ({ ...rul, condiciones: [] }));
  //     setRules(newRules);
  //   }
  // }, [parametrosAprendizaje]);

  const handleTestInformation = async (id: any) => {
    try {
      const response = await fetch(
        `https://backendestilos.onrender.com/estilos/api/v1/encuesta/detalles/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status != 200) {
        throw new Error('Error al obtener las encuestas');
      }
      const data = await response.json();

      // Manejo de otros estados
      setAutor(data.data.enc_autor);
      setNombreTest(data.data.enc_titulo);
      setEncuestaCuantitativa(data.data.enc_cuantitativa);
      setDescripcion(data.data.enc_descripcion);
      setValorPregunta(data.data.preguntas[0].pre_valor_total);

      // Procesamiento de estilos y parámetros
      let totalParametros = [];
      let totalEstilos = [];
      for (const ESTILO of data.data.estilos) {
        if (ESTILO.est_parametro) {
          let parametro = {
            tipo: ESTILO.est_nombre,
            valor: ESTILO.est_id,
            new: false,
          };
          totalParametros.push(parametro);
        } else {
          let estilo = {
            tipo: ESTILO.est_nombre,
            valor: ESTILO.est_id,
            new: false,
          };
          totalEstilos.push(estilo);
        }
      }
      setParametrosAprendizaje(totalParametros);
      setEstilosAprendizaje(totalEstilos);

      // Procesamiento de reglas y condiciones
      setProbandooAux(data.data.reglas[0].reglas_json);
      setIdRegla(data.data.reglas[0].reg_id);
      let reglasAuxi = [] as Rule[];

      let totalReglas: Rule[] = await data.data.reglas[0].reglas_json.map(
        (REGLAS_JSON: any) => {
          const condiciones = REGLAS_JSON.condiciones.map((CONDICION: any) => ({
            parametros: CONDICION.parametros.map((COLUMN: any) => ({
              value: COLUMN.value,
              operacion: COLUMN.operacion,
            })),
            condicion: CONDICION.condicion,
            valor: CONDICION.valor,
            comparacion: CONDICION.comparacion,
          }));

          return {
            estilo: REGLAS_JSON.estilo,
            condiciones,
          };
        },
      );
      setProbandoo(reglasAuxi);
      setRules(totalReglas); // Asumiendo que `setDatosPrueba` es otra función de estado
      setRules(totalReglas); // Actualización del estado `rules`
      let preguntasConsultadas = data.data.preguntas;
      let opcion: Opcion = { id: 0, opcion: '', estilo: '', new: false };
      const preguntasListadas: Pregunta[] = preguntasConsultadas.map(
        (preguntaConsultada: any) => {
          const opciones =
            preguntaConsultada.opciones?.map((opcion: any) => ({
              id: opcion.opc_id,
              opcion: opcion.opc_texto,
              estilo: opcion.est_id,
              new: false,
            })) || [];

          return {
            id: preguntaConsultada.pre_id ?? 0,
            orden: preguntaConsultada.pre_orden ?? 0,
            pregunta: preguntaConsultada.pre_enunciado ?? '',
            tipoPregunta: preguntaConsultada.pre_tipo_pregunta ?? '',
            opciones: opciones,
            new: false,
            escalas: [],
            min: preguntaConsultada.pre_num_respuestas_min ?? 0,
            max: preguntaConsultada.pre_num_respuestas_max ?? 0,
          };
        },
      );
      setListaPreguntasAux(preguntasListadas);
    } catch (error: any) {
      console.error('Error: ', error.message);
    } finally {
      handleChangeLoadingCargando();
    }
  };

  const handleChangeLoadingCargando = () => {
    setTimeout(() => {
      setLoadingCargando(false);
    }, 5000);
  };

  useEffect(() => {
    if (parametrosAprendizaje) {
      setTiposEstilosAprendizaje({
        mensaje: 'Estilo de aprendizaje ',
        tipos: parametrosAprendizaje,
      });
    } else {
      setTiposEstilosAprendizaje({
        mensaje: 'Estilo de aprendizaje ',
        tipos: estilosAprendizaje,
      });
    }
  }, [parametrosAprendizaje, estilosAprendizaje]);

  useEffect(() => {
    setListaPreguntas(listaPreguntasAux);
  }, [listaPreguntasAux]);

  useEffect(() => {
    setRules(probandooAux);
  }, [probandoo]);

  const handleChangeIdTest = (id: any) => {
    setTest(id);
    setLoadingCargando(true);
    handleTestInformation(id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log('CAMBIO ESTILOS');
    console.log(estilosAprendizaje);
  }, [estilosAprendizaje]);

  const handleConfirm = () => {
    onGuardarTest();
    handleCloseModal();
    console.log(datosPrueba);
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edición de modelos" />
      {loadingCargando ? (
        <Loader />
      ) : (
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
          <div className="w-[50%]">
            <h3 className="text-title-xsm font-semibold text-black dark:text-white">
              Test:
            </h3>
            <SelectGroupOne
              opciones={datosTests}
              onChange={handleChangeIdTest}
              opcionPorDefecto={test}
            />
          </div>
          <div
            className="flex flex-col gap-3 opacity-85"
            // style={{
            //   backgroundImage: `url(${EscudoUtn})`,
            //   backgroundRepeat: 'no-repeat',
            //   backgroundSize: '400px 350px',
            //   backgroundPosition: 'center',
            //   width: '100%', // Asegúrate de que el contenedor tenga el ancho adecuado
            // }}
          >
            <div className="grid grid-cols-2 gap-4 opacity-95">
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
            <div className="grid grid-cols-2 gap-4 opacity-95">
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
                    <div className="w-full pl-4 font-semibold">
                      Cuantitativo
                    </div>
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
            <div className="flex flex-col gap-5 opacity-95">
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
                {estilosAprendizaje.length > 0 &&
                  errorCamposGuardar &&
                  estilosAprendizaje[0].tipo == '' && (
                    <AlertError mensaje="La lista no debe estar vacía" />
                  )}
                <ul className="grid grid-cols-3 gap-4 pt-3">
                  {estilosAprendizaje.length > 0 &&
                    estilosAprendizaje[0].tipo.length > 0 &&
                    estilosAprendizaje.map((estilo) => (
                      <>
                        {/* {console.log(estilo)} */}
                        <CardListUpdate
                          actualizar={prepararActualizacionEstilo}
                          eliminar={handleClickDeleteEstiloAprendizaje}
                          valor={estilo}
                          limite={20}
                        />
                      </>
                    ))}
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-title-xsm pb-3 font-semibold text-black dark:text-white">
                  Parametro de aprendizaje:
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
                      Actualizar parametro de aprendizaje
                    </button>
                  ) : (
                    <button
                      className="flex w-[50%] justify-center rounded-r-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                      onClick={() =>
                        onGuardarNuevoEstiloAprendizaje('dimension')
                      }
                    >
                      Agregar parámetro
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
                      <CardListUpdate
                        actualizar={prepararActualizacionParametro}
                        eliminar={handleClickDeleteParametroAprendizaje}
                        valor={estilo}
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
                    {rules.map((rule: any, index: any) => (
                      <div>
                        <div className="font-bold text-black dark:text-white text-lg mb-5">
                          Regla {index + 1}:
                        </div>
                        <RuleComponent
                          key={index}
                          rule={rule}
                          onChange={(updatedRule) =>
                            handleRuleChange(index, updatedRule)
                          }
                          onDelete={() => deleteRule(index)}
                          parametrosAprendizaje={
                            parametrosAprendizaje.every(
                              (param) => param.tipo === '',
                            )
                              ? estilosAprendizaje
                              : parametrosAprendizaje
                          }
                          estilosAprendizaje={estilosAprendizaje}
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
            <div className="flex flex-col gap-6 opacity-95">
              <h3 className="text-title-xsm pt-4 placeholder:b-4 font-semibold text-black dark:text-white">
                Test:
              </h3>
              {listaPreguntas &&
                listaPreguntas.map((pre) => (
                  <div className="gap-4 p-5 pt-2 border-[1.5px] bg-whiten rounded-lg dark:border-form-strokedark dark:bg-form-input">
                    {pre.tipoPregunta === 'seleccion' && (
                      <MultiChoiceQuestion
                        pregunta={pre}
                        tiposEstilosAprendizaje={
                          parametrosAprendizaje.length > 0
                            ? {
                                mensaje: 'Seleccione el parametro',
                                tipos: parametrosAprendizaje,
                              }
                            : {
                                mensaje: 'Seleccione el estilo',
                                tipos: estilosAprendizajeAux,
                              }
                        }
                        onUpdatePregunta={handleChangePregunta}
                        onUpdateOpcion={handleChangeOpcion}
                        onDeleteOpcion={handleClickDeleteOpcion}
                        onDeletePregunta={handleClickDeletePregunta}
                        onAddOpcion={handleClickAddOpcion}
                        onUpdateLimiteRespuesta={handleChangeLimiteRespuesta}
                      />
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
      )}
    </DefaultLayout>
  );
};

export default EditModels;
