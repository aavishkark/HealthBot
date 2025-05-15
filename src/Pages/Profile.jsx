import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";

export const Profile =() =>{
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectMode, setSelectMode] = useState(0);
    const email= localStorage.getItem("email");
    useEffect(() => {
        axios.get(`https://healthbotbackend.onrender.com/getProfile`, {
            params: { email },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            setCalories(response.data.user.calories);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        }); 
    }, [email]);

    const groupedCalories = useMemo(() => {
  return calories.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    const cal = parseInt(entry.calories);
    acc[date] = (acc[date] || 0) + cal;
    return acc;
  }, {});
}, [calories]);

const selectedDayEntries = selectedDate
  ? calories.filter(entry => 
      new Date(entry.timestamp).toDateString() === new Date(selectedDate).toDateString()
    )
  : [];

  const changeMode = (mode) => {

    if(mode === 0){
      setSelectMode(1);
    }
    else if(mode === 1){
      setSelectMode(2);
    }
    else if(mode === 2){
      setSelectMode(0);
    }  
  }
    if (loading) return <p>Loading...</p>;

  return (
    <>
  <div className="calorie-history-container">
    <button onClick={()=>{changeMode(selectMode)}}>{selectMode}</button>
  <h2>Your Calorie History</h2>
    {calories.length === 0 ? (
      <p>No records found.</p>
    ) : (
      <ul>
        {calories.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.query}</strong>: {entry.calories} kcal on{" "}
            {new Date(entry.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    )}
  </div>
  <CalCalendar calories={calories} onDateClick={(date) => setSelectedDate(date)} />
    {selectedDate && (
  <div className="selected-day-entries">
    <h3>Entries for {new Date(selectedDate).toDateString()}</h3>
    {selectedDayEntries.length === 0 ? (
      <p>No entries found.</p>
    ) : (
      <ul>
        {selectedDayEntries.map(entry => (
          <li key={entry._id}>
            <strong>{entry.query}</strong>: {entry.calories} kcal at{" "}
            {new Date(entry.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    )}
  </div>
)}
  </>
  );
}