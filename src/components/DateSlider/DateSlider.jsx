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
  const [currentDate, setCurrentDate] = useState(null);

  if (!dates || dates.length === 0) return null;
  if (dates.length === 1) return null;

  const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
  const timestamps = uniqueDates.map(date => new Date(date).getTime());
  const step = uniqueDates.length > 40 ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const handleChange = (value) => {
    const selectedDate = new Date(value);
    setCurrentDate(selectedDate);
    onChange(value);
  };

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
        min={Math.min(...timestamps)}
        max={Math.max(...timestamps)}
        step={step}
        defaultValue={timestamps[0]}
        handle={handle}
        onChange={handleChange}
        marks={{
          [timestamps[0]]: formatLabel(timestamps[0]),
          [timestamps[timestamps.length - 1]]: formatLabel(timestamps[timestamps.length - 1]),
        }}
      />
      <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '16px' }}>
        Выбранная дата: {currentDate ? currentDate.toLocaleDateString('ru-RU') : 'Не выбрана'}
      </div>
    </div>
  );
};

export default DateSlider;