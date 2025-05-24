import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import './calcalender.css';

function CalorieCalendar({ calories, onDateClick, requiredcalories }) {
  const [value, setValue] = useState(new Date());

  const groupedCalories = calories.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    const cal = parseInt(entry.calories);

    if (!acc[date]) acc[date] = cal;
    else acc[date] += cal;

    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    const key = date.toDateString();
    const calorie = groupedCalories[key];

    if (view === 'month') {
      let bgColor = '';
      if (calorie === requiredcalories) bgColor = '#4caf50';
      else if (calorie > requiredcalories) bgColor = '#ff9800';
      else if (calorie > 0) bgColor = '#f44336';

      return calorie ? (
        <div
          style={{
            marginTop: 4,
            fontSize: '0.50rem',
            backgroundColor: bgColor,
            color: 'white',
            borderRadius: '4px',
            padding: '1px 3px',
            textAlign: 'center',
            maxWidth: '100%',
          }}
        >
          {calorie}
        </div>
      ) : null;
    }
    return null;
  };

  const handleDateChange = (date) => {
    setValue(date);
    if (onDateClick) onDateClick(date);
  };

  return (
    <div className='calContainer'>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
      />
    </div>
  );
}

export default CalorieCalendar;
