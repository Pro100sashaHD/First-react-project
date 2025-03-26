import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubtopicChart = ({ subtopics }) => {
  const aggregatedData = subtopics.reduce((acc, item) => {
    if (!acc[item.subtopic]) {
      acc[item.subtopic] = { positive: 0, negative: 0 };
    }
    if (item.sentiment === 'positive') {
      acc[item.subtopic].positive += 1;
    } else if (item.sentiment === 'negative') {
      acc[item.subtopic].negative += 1;
    }
    return acc;
  }, {});

  const labels = Object.keys(aggregatedData);
  const positiveData = labels.map((label) => aggregatedData[label].positive);
  const negativeData = labels.map((label) => -aggregatedData[label].negative);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Позитивные',
        data: positiveData,
        backgroundColor: 'green',
      },
      {
        label: 'Негативные',
        data: negativeData,
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => Math.abs(value),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Распределение оценок по подтемам',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = labels[context.dataIndex];
            const positiveCount = aggregatedData[label].positive;
            const negativeCount = aggregatedData[label].negative;
            return `${context.dataset.label}: ${context.dataset.label === 'Позитивные' ? positiveCount : negativeCount}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SubtopicChart;