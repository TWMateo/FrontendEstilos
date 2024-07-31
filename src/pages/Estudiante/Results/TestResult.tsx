import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Loader from '../../../common/Loader';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

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
  const { resultado, titulo, autor } = location.state || {};

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  // useEffect(() => {
  //   fetchStudyTechniques(testResult.resultado);
  // }, [testResult]);

  // const fetchStudyTechniques = async (result: string) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://api.example.com/techniques?result=${result}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Error en la solicitud');
  //     }

  //     const data: StudyTechnique[] = await response.json();
  //     setTechniques(data);
  //   } catch (error) {
  //     console.error('Error al obtener técnicas de estudio:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Breadcrumb pageName="Resultados" />
          {loading && <p>Cargando técnicas de estudio...</p>}
          {resultado && (
            <div>
              <div className="h-screen bg-white rounded-lg dark:bg-black flex flex-col justify-center items-center">
                <h1 className="font-bold text-4xl">
                  Gracias por participar 🥳🎉!!
                </h1>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="font-bold text-4xl">
                    Tu estilo de aprendizaje es:
                  </h1>
                  <h1 className="text-4xl">{resultado} 😎</h1>
                </div>
                <h3 className="font-bold text-4xl">Técnicas de Estudio:</h3>
                {techniques.length > 0 ? (
                  <ul>
                    {techniques.map((technique, index) => (
                      <li className='text-4xl' key={index}>{technique.technique}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-4xl text-center">
                    No se encontraron técnicas de estudio.
                  </p>
                )}
                <h1 className="font-bold text-4xl text-center">
                  Revisa la sección de inicio en busca de nuevos test 👌
                </h1>
              </div>
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default TestResult;
