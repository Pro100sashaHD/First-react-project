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

const BarChart = ({ data, onTopicClick }) => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.topic]) {
      acc[item.topic] = { positive: 0, negative: 0 };
    }
    if (item.sentiment === 'positive') {
      acc[item.topic].positive += 1;
    } else if (item.sentiment === 'negative') {
      acc[item.topic].negative += 1;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Позитивные',
        data: Object.values(groupedData).map((topic) => topic.positive),
        backgroundColor: 'green',
      },
      {
        label: 'Негативные',
        data: Object.values(groupedData).map((topic) => -topic.negative),
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
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
        text: 'Распределение комментариев по темам',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const topic = Object.keys(groupedData)[context.dataIndex];
            const positiveCount = groupedData[topic].positive;
            const negativeCount = groupedData[topic].negative;
            return `${context.dataset.label}: ${context.dataset.label === 'Позитивные' ? positiveCount : negativeCount}`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedTopic = Object.keys(groupedData)[index];
        const subtopics = data.filter((item) => item.topic === selectedTopic);
        onTopicClick(subtopics);
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;