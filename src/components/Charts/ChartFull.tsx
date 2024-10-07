import React, { useRef } from 'react';
import { Chart as GoogleChart } from 'react-google-charts';
import html2canvas from 'html2canvas';

interface ChartProps {
  titulosEncuesta: any[];
  asignacionTest: any[];
  resultadoEncuestaCounts: any[];
  optionsCurso: object;
  optionsAsignacion: object;
  optionsTest: object;
}

const EncuestaCharts: React.FC<ChartProps> = ({
  titulosEncuesta,
  asignacionTest,
  resultadoEncuestaCounts,
  optionsCurso,
  optionsAsignacion,
  optionsTest,
}) => {
  const cursoRef = useRef<HTMLDivElement>(null);
  const asignacionRef = useRef<HTMLDivElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  // Función para capturar y descargar el gráfico como imagen usando html2canvas
  const downloadChartAsImage = (
    ref: React.RefObject<HTMLDivElement>,
    fileName: string,
  ) => {
    if (ref.current) {
      html2canvas(ref.current).then((canvas) => {
        const imgUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgUri;
        link.download = `${fileName}.png`;
        link.click();
      });
    }
  };

  // Solución: Ajustar el tamaño del gráfico de acuerdo a la pantalla disponible
  const getChartSize = <T extends number>(
    multiplier: T,
  ): { width: string; height: string } => {
    const width = `${100 * multiplier}%`;
    const height = `${500 * multiplier}px`; // Fija un valor para la altura
    return { width, height };
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
      {/* Gráfico de titulosEncuesta */}
      {titulosEncuesta && (
        <div
          ref={cursoRef}
          className="w-full h-auto overflow-x-scroll bg-whiten dark:bg-boxdark p-5 rounded-lg"
        >
          <h1 className="font-bold text-xl">Respuestas de test por curso:</h1>
          <button
            title="Exportar gráfico como PNG"
            onClick={() => downloadChartAsImage(cursoRef, 'curso-chart')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.88em"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941M224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64s64 28.654 64 64s-28.654 64-64 64m96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A12 12 0 0 1 320 111.48"
              />
            </svg>
          </button>
          <GoogleChart
            chartType="Bar"
            width={getChartSize(1).width}
            height={getChartSize(1.3).height}
            data={titulosEncuesta}
            options={optionsCurso}
          />
        </div>
      )}
      <div
        ref={asignacionRef}
        className="w-full bg-white overflow-x-scroll dark:bg-boxdark p-5 rounded-lg"
      >
        <h1 className="font-bold text-xl">Respuestas por estudiante:</h1>
        <button
          title="Exportar gráfico como PNG"
          onClick={() =>
            downloadChartAsImage(asignacionRef, 'asignacion-chart')
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.88em"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941M224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64s64 28.654 64 64s-28.654 64-64 64m96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A12 12 0 0 1 320 111.48"
            />
          </svg>
        </button>
        {/* {asignacionTest.length !== 0 && ( */}
        <GoogleChart
          chartType="Bar"
          width={getChartSize(1.05).width}
          height={getChartSize(1.3).height}
          data={asignacionTest}
          options={optionsAsignacion}
        />
        {/* )} */}
      </div>
      <div
        ref={resultadoRef}
        className="w-full h-auto overflow-x-scroll bg-whiten dark:bg-boxdark p-5 rounded-lg"
      >
        <h1 className="font-bold text-xl">Resultados del test:</h1>
        <button
          title="Exportar gráfico como PNG"
          onClick={() => downloadChartAsImage(resultadoRef, 'resultado-chart')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.88em"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941M224 416c-35.346 0-64-28.654-64-64s28.654-64 64-64s64 28.654 64 64s-28.654 64-64 64m96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A12 12 0 0 1 320 111.48"
            />
          </svg>
        </button>
        {/* {resultadoEncuestaCounts.length > 1 && ( */}
          <GoogleChart
            chartType="Bar"
            width={getChartSize(1.0).width}
            height={getChartSize(1.3).height}
            data={resultadoEncuestaCounts}
            options={optionsTest}
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default EncuestaCharts;
