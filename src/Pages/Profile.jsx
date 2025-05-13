import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";

export const Profile =() =>{
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }, []);

    const groupedCalories = useMemo(() => {
  return calories.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    const cal = parseInt(entry.calories);
    acc[date] = (acc[date] || 0) + cal;
    return acc;
  }, {});
}, [calories]);


    console.log(groupedCalories);

    if (loading) return <p>Loading...</p>;

  return (
    <>
  <div className="calorie-history-container">
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
  <CalCalendar calories={calories} />
  </>
  );
}