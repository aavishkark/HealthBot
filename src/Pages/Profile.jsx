import { useEffect, useState } from "react";
import axios from "axios";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";
import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

export const Profile =() =>{
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [selectMode, setSelectMode] = useState(0);
    const [modeBasedEntries, setModeBasedEntries] = useState([]);
    const [userProfile, setuserProfile] = useState();
    const [userBmi, setuserbmi] = useState();
    const email= localStorage.getItem("email");
    const [modeName, setModeName] = useState("Today");
    const [requiredcalories, setRequiredcalories] = useState('');
    const [thisWeekCalories, setthisWeekCalories] = useState([]);

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    useEffect(() => {
        axios.get(`https://healthbotbackend-production.up.railway.app/getProfile`, {
            params: { email },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const userCalories = response.data.user.calories;
            setuserProfile(response.data.user);
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
          const now = new Date();

          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

        if (selectMode === 0) {
          setModeBasedEntries(calories.filter((entry) => new Date(entry.timestamp).getDate() === new Date().getDate()));
        } else if (selectMode === 1) {
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

const caloriesPerDay = new Array(7).fill(0);

calories.forEach(entry => {
  const date = new Date(entry.timestamp);
  const day = date.getDay();
  const calories = parseInt(entry.calories, 10);
  const index = (day === 0) ? 6 : day - 1;
  caloriesPerDay[index] += calories;
});

setthisWeekCalories(caloriesPerDay)
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

  useEffect(() => {
  if (userProfile) {
    const heightInMeters = userProfile.height / 100;
    const bmi = userProfile.weight / (heightInMeters * heightInMeters);
    setuserbmi(bmi.toFixed(2));

    const bmr = (10 * userProfile.weight) + (6.25 * userProfile.height) - (5 * userProfile.age) + (userProfile.gender === "Male" ? +5 : -162);
    const tdee = bmr * userProfile.activitylevel ;
    setRequiredcalories(tdee.toFixed(0))
  }
}, [userProfile]);

const optionsDate = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

const idedRows = modeBasedEntries.map(row => ({
  ...row,
  id: row._id,
  timestamp: new Date(row.timestamp).toLocaleString( 'en-US', optionsDate )
}));

const idedRowsTwo = selectedDayEntries.map(row => ({
  ...row,
  id: row._id,
  timestamp: new Date(row.timestamp).toLocaleString( 'en-US', optionsDate )
}));

const BarChart = () => {
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: 'Calories (kcal)',
        data: thisWeekCalories,
        backgroundColor: ['#4ade80'],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'This Week Calories'
      }
    }
  };

  return <div style={{width:"40%", height:"400px", margin:"auto"}}><Bar data={data} options={options} /></div>;
};

  const columns = [
  { field: 'foodItem', headerName: 'Food Item', width: 150 },
  { field: 'foodAmount', headerName: 'Food Amount', width: 150 },
  { field: 'calories', headerName: 'Calories', width: 150 },
  { field: 'timestamp', headerName: 'Day & Time', width: 200 }
];

  const paginationModel = { page: 0, pageSize: 4 };
      
    if (loading) return <p>Loading...</p>;

  return (
    <>
    <div className="infoContainer">
      <div className="info">
        <label>Name</label>
        <div>{userProfile.name}</div><br/>
      </div>
      <div className="info">
        <label>Height</label>
        <div>{userProfile.height}cm</div><br/>
      </div>
      <div className="info">
        <label>Weight</label>
        <div>{userProfile.weight}kg</div><br/>
      </div>
      <div className="info">
        <label>Age</label>
        <div>{userProfile.age}</div><br/>
      </div>
      <div className="info">
        <label>BMI</label>
        <div>{userBmi}</div><br/>
      </div>
      <div className="info">
        <label>Required calories</label>
        <div>{requiredcalories}</div><br/>
      </div>
    </div>
  <div className="calorie-history-container">
    <Button onClick={()=>{changeMode(selectMode)}}>{modeName}</Button>
    {calories.length === 0 ? (
      <p>No records found.</p>
    ) : (
    <DataGrid
        className="custom-data-grid"
        rows={idedRows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[1, 2, 4]}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableColumnResize
        disableMultipleRowSelection
        disableRowSelectionOnClick
        sx={{width:"35%", margin:"auto", border: 1, backgroundColor: 'transparent', padding:"1rem",

              '& .MuiDataGrid-iconButtonContainer': {
                display: 'none',
              },

              '& .MuiDataGrid-sortIcon': {
                display: 'none',
              },

              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },

              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'transparent',
              },
        }}
      />
    )}
  </div>
    <CalCalendar calories={calories} requiredcalories={requiredcalories} onDateClick={(date) => setSelectedDate(date)} />
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ backgroundColor: '#4caf50', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Met</span>
        <span style={{ backgroundColor: '#ff9800', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Exceeded</span>
        <span style={{ backgroundColor: '#f44336', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Low</span>
      </div>
    </div>
    {selectedDate && (
  <div className="selected-day-entries">
    <p>Entries for {new Date(selectedDate).toDateString()}</p>
    {selectedDayEntries.length === 0 ? (
      <p>No entries found.</p>
    ) : (
      <DataGrid
        className="custom-data-grid"
        rows={idedRowsTwo}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[1, 2, 4]}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableColumnResize
        disableMultipleRowSelection
        disableRowSelectionOnClick
        sx={{width:"35%", margin:"auto", border: 1, backgroundColor: 'transparent', padding:"1rem",

              '& .MuiDataGrid-iconButtonContainer': {
                display: 'none',
              },

              '& .MuiDataGrid-sortIcon': {
                display: 'none',
              },

              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },

              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'transparent',
              },
        }}
      />
    )}
  </div>
)}
<div className="chartContainer">
  <BarChart></BarChart>
</div>
  </>
  );
}