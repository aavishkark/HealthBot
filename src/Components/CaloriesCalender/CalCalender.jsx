import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

function CalorieCalendar({ calories }) {
  const [value, setValue] = useState(new Date());
  console.log(calories);

  const groupedCalories = calories.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    const cal = parseInt(entry.calories);

    if (!acc[date]) acc[date] = cal;
    else acc[date] += cal;

    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    const key = date.toDateString();
    if (view === 'month' && groupedCalories[key]) {
      return (
        <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: 4 }}>
          {groupedCalories[key]} kcal
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Calorie Calendar</h2>
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
      />
    </div>
  );
}

export default CalorieCalendar;
