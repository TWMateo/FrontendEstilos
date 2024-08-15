import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Loader from '../../../common/Loader';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import TypeWriter from '../../../components/Effects/TypeWriter';
import OpenAI from 'openai';

interface TestResponse {
  resultado: string;
}

interface StudyTechnique {
  technique: string;
}

interface TestResultProps {
  testResult: TestResponse;
}

const TestResult = () => {
  const [techniques, setTechniques] = useState<StudyTechnique[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [tecnicasDeAprendizaje, setTecnicasDeAprendizaje] = useState<
    string | null
  >('');
  const { resultado, titulo, autor } = location.state || {};
  const openai = new OpenAI({
    apiKey:
      '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',
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    getPracticasGPT();
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  async function getPracticasGPT() {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un experto en técnicas de estudio y estilos de aprendizaje.',
        },
        {
          role: 'user',
          content: `Hice el test ${titulo} del autor ${autor} relacionado a los estilos de aprendizaje y los resultados indicaron que tengo un estilo de aprendizaje ${resultado}. ¿Puedes proporcionarme 6 técnicas y estrategias de estudio específicamente adaptadas a un estilo de aprendizaje ${resultado}?. Solo dame una pequeña descripción del estilo de aprendzizaje relacionado al test nombra al test con el nombre que te di no lo pongas entre comillas y no nombres al autor, y el listado de técnicas y estrategias no indiques la cantidad de tecnicas y estrategias.`,
        },
      ],
    });
    setTecnicasDeAprendizaje(stream.choices[0].message.content);
    console.log(stream.choices[0].message.content);
    console.log(autor);
    console.log(titulo);
    // for await (const chunk of stream) {
    //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
    // }
  }

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <div className="">
          <Breadcrumb pageName="Resultados" />
          {loading && <p>Cargando técnicas de estudio...</p>}
          {resultado && (
            <div className="rounded-lg dark:bg-black flex flex-col justify-center items-center">
              <div className="bg-white p-15 gap-5 rounded-lg dark:bg-black flex flex-col justify-center items-center">
                <h1 className="font-bold text-4xl">
                  Gracias por participar 🥳🎉!!
                </h1>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="font-bold text-4xl">
                    Tu estilo de aprendizaje es:
                  </h1>
                  <h1 className="text-4xl">
                    <TypeWriter text={resultado+'😎'} speed={50} /> 
                  </h1>
                </div>
                <h3 className="font-bold text-center text-4xl">
                  Descripción y Técnicas de Estudio:
                </h3>
                
                {tecnicasDeAprendizaje ? (
                  <TypeWriter text={tecnicasDeAprendizaje} speed={40} />
                ) : (
                  <div>
                    Oooops! por el momento no se han encontrado técnicas de
                    aprendizaje.
                  </div>
                )}
                <h1 className="font-bold text-4xl text-center">
                  Revisa la sección de inicio en busca de nuevos test 👌
                </h1>
                {/* <div>{tecnicasDeAprendizaje}</div> */}
              </div>
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default TestResult;
