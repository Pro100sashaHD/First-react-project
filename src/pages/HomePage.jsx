import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart/BarChart';
import SubtopicChart from '../components/SubtopicChart/SubtopicChart';
import DateSlider from '../components/DateSlider/DateSlider';
import { fetchTopics } from '../API/api';
import '../styles/global.css';

const HomePage = () => {
  const [subtopics, setSubtopics] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTopics();
        setAllData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSliderChange = (value) => {
    const selectedDate = new Date(value).toISOString().split('T')[0];
    const filtered = allData.filter(item => item.date <= selectedDate);
    setFilteredData(filtered);

    if (subtopics.length > 0) {
      const topic = subtopics[0].topic;
      const filteredSubtopics = filtered.filter(item => item.topic === topic);
      setSubtopics(filteredSubtopics);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправленная ссылка:', link);
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div>
      <h1>Анализ тональности комментариев</h1>
      <DateSlider 
        dates={allData.map(item => item.date)} 
        onChange={handleSliderChange} 
      />
      <BarChart data={filteredData} onTopicClick={setSubtopics} />
      {subtopics.length > 0 && <SubtopicChart subtopics={subtopics} />}

      <div className="link-input-container">
        <form onSubmit={handleSubmit} className="link-form">
          <input
            type="text"
            placeholder="Введите ссылку"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="link-input"
          />
          <button type="submit" className="link-submit-button">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;