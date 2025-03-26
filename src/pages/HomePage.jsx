import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart/BarChart';
import SubtopicChart from '../components/SubtopicChart/SubtopicChart';
import DateSlider from '../components/DateSlider/DateSlider';
import '../styles/global.css';

const HomePage = () => {
  const [subtopics, setSubtopics] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState(''); // Состояние для хранения ссылки

  // Загрузка данных из public/data/topics.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/topics.json')
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setFilteredData(data); // Инициализируем отфильтрованные данные
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      });
  }, []);

  // Обработчик изменения слайдера
  const handleSliderChange = (value) => {
    // value — это timestamp выбранной даты
    const selectedDate = new Date(value).toISOString().split('T')[0]; // Преобразуем в формат YYYY-MM-DD

    // Фильтруем данные: оставляем только те, чья дата меньше или равна выбранной
    const filtered = allData.filter((item) => item.date <= selectedDate);
    console.log('Отфильтрованные данные:', filtered); // Проверьте, что данные фильтруются правильно
    setFilteredData(filtered);

    // Обновляем подтемы для SubtopicChart
    if (subtopics.length > 0) {
      const filteredSubtopics = filtered.filter((item) =>
        subtopics.some((sub) => sub.topic === item.topic)
      );
      setSubtopics(filteredSubtopics);
    }
  };

  // Обработчик отправки ссылки
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправленная ссылка:', link);
    // Здесь можно добавить логику для обработки ссылки, например, отправку на сервер
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div>
      <h1>Анализ тональности комментариев</h1>
      <DateSlider
        dates={allData.map((item) => item.date)}
        onChange={handleSliderChange}
      />
      <BarChart data={filteredData} onTopicClick={setSubtopics} />
      {subtopics.length > 0 && <SubtopicChart subtopics={subtopics} />}

      {/* Поле для ввода ссылки */}
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