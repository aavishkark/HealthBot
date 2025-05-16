import { useEffect, useState } from "react";
import axios from "axios";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";

export const Profile =() =>{
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [selectMode, setSelectMode] = useState(0);
    const [modeBasedEntries, setModeBasedEntries] = useState([]);
    const email= localStorage.getItem("email");
    const [modeName, setModeName] = useState("Today");
    useEffect(() => {
        axios.get(`https://healthbotbackend.onrender.com/getProfile`, {
            params: { email },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const userCalories = response.data.user.calories;
            setCalories(userCalories);
            const today = new Date().getDate();
            const filtered = userCalories.filter(entry => new Date(entry.timestamp).getDate() === today);
            setModeBasedEntries(filtered);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        }); 
    }, [email]);

    useEffect(() => {
      calories.forEach(() => {
        if (selectMode === 0) {
          setModeBasedEntries(calories.filter((entry) => new Date(entry.timestamp).getDate() === new Date().getDate()));
        } else if (selectMode === 1) {
          const now = new Date();

          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          setModeBasedEntries(
            calories.filter((entry) => {
              const entryDate = new Date(entry.timestamp);
              return entryDate >= startOfWeek && entryDate <= endOfWeek;
            })
          );

        } else if (selectMode === 2) {
          setModeBasedEntries(calories.filter((entry) => new Date(entry.timestamp).getMonth() === new Date().getMonth()));
        }
        else if (selectMode === 3) {
          setModeBasedEntries(calories);
        }
      });
        
    }, [selectMode, calories]);

const selectedDayEntries = selectedDate
  ? calories.filter(entry => 
      new Date(entry.timestamp).toDateString() === new Date(selectedDate).toDateString()
    )
  : [];

  const changeMode = (mode) => {

    if(mode === 0){
      setSelectMode(1);
      setModeName("This Week");
    }
    else if(mode === 1){
      setSelectMode(2);
      setModeName("This Month");
    }
    else if(mode === 2){
      setSelectMode(3);
      setModeName("Total");
    }
    else if(mode === 3){
      setSelectMode(0);
      setModeName("Today");
    }    
  }
    if (loading) return <p>Loading...</p>;

  return (
    <>
  <div className="calorie-history-container">
    <button onClick={()=>{changeMode(selectMode)}}>{modeName}</button>
  <h2>Your Calorie History</h2>
    {calories.length === 0 ? (
      <p>No records found.</p>
    ) : (
      <ul>
        {modeBasedEntries.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.foodAmount}{" "}{entry.foodItem}</strong>: {entry.calories} kcal on{" "}
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
            <strong>{entry.foodAmount}{" "}{entry.foodItem}</strong>: {entry.calories} kcal on{" "}
            {new Date(entry.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    )}
  </div>
)}
  </>
  );
}