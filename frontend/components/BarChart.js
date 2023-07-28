import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const BarChart = ({ data, chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // If a previous chart exists, destroy it before initializing a new one
      chartRef.current.destroy();
    }

    const ctx = document.getElementById(chartId);

    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          indexAxis: 'x',
          elements: {
            bar: {
              borderWidth: 2,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          },
        },
      });
    }
  }, [data]);

  return <canvas id={chartId} width="100" height="20"></canvas>;
};

export default BarChart;