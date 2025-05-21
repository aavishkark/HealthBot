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
    const color = groupedCalories[key] === requiredcalories ? "green" : "red";
    if (view === 'month' && groupedCalories[key] && color) {
      return (
        <div style={{ fontSize: '0.7rem', marginTop: 4, backgroundColor: color }}>
          {groupedCalories[key]} kcal
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (date) => {
    setValue(date);
    if (onDateClick) {
      onDateClick(date); 
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Calorie Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
      />
    </div>
  );
}


export default CalorieCalendar;
