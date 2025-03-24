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
  console.log('Подтемы в SubtopicChart:', subtopics); // Проверьте, что подтемы передаются правильно

  // Агрегируем данные по подтемам
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

  // Преобразуем агрегированные данные в массивы для графика
  const labels = Object.keys(aggregatedData);
  const positiveData = labels.map((label) => aggregatedData[label].positive);
  const negativeData = labels.map((label) => -aggregatedData[label].negative); // Отрицательные значения для негативных оценок

  // Данные для графика
  const data = {
    labels: labels, // Названия подтем
    datasets: [
      {
        label: 'Позитивные', // Позитивные оценки
        data: positiveData,
        backgroundColor: 'green', // Цвет для позитивных оценок
      },
      {
        label: 'Негативные', // Негативные оценки
        data: negativeData,
        backgroundColor: 'red', // Цвет для негативных оценок
      },
    ],
  };

  // Настройки графика
  const options = {
    scales: {
      x: {
        stacked: true,
        display: false, // Показываем названия подтем на оси X
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => Math.abs(value), // Отображаем абсолютные значения
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Скрываем легенду
      },
      title: {
        display: false, // Скрываем заголовок
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