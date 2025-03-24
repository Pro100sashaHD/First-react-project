import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const { Handle } = Slider;

const handle = (props) => {
  const { value, dragging, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={value}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const DateSlider = ({ dates, onChange }) => {
  // Состояние для текущей даты
  const [currentDate, setCurrentDate] = useState(null);

  if (!dates || dates.length === 0) return null;

  // Уникальные даты, отсортированные по возрастанию
  const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));

  // Если все даты одинаковые, слайдер не отрисовывается
  if (uniqueDates.length === 1) return null;

  // Преобразуем даты в метки времени (timestamp)
  const timestamps = uniqueDates.map((date) => new Date(date).getTime());

  // Определяем шаг слайдера
  const step = uniqueDates.length > 40 ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // Шаг в днях или месяцах

  // Обработчик изменения слайдера
  const handleChange = (value) => {
    const selectedDate = new Date(value);
    setCurrentDate(selectedDate); // Обновляем текущую дату
    onChange(value); // Передаём значение в родительский компонент
  };

  // Форматируем метки для отображения
  const formatLabel = (timestamp) => {
    const date = new Date(timestamp);
    if (uniqueDates.length > 40) {
      return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Slider
        min={Math.min(...timestamps)} // Минимальная дата
        max={Math.max(...timestamps)} // Максимальная дата
        step={step} // Шаг слайдера
        defaultValue={timestamps[0]} // Начальное значение (первая дата)
        handle={handle} // Кастомизация ползунка
        onChange={handleChange} // Обработчик изменения
        marks={{
          [timestamps[0]]: formatLabel(timestamps[0]), // Метка для начальной даты
          [timestamps[timestamps.length - 1]]: formatLabel(timestamps[timestamps.length - 1]), // Метка для конечной даты
        }}
      />
      {/* Отображаем текущую дату под слайдером */}
      <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '16px' }}>
      Выбранная дата: {currentDate ? currentDate.toLocaleDateString('ru-RU') : 'Не выбрана'}
      </div>
    </div>
  );
};

export default DateSlider;