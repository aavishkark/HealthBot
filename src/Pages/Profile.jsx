import { useEffect, useState } from "react";
import axios from "axios";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";
import { Button } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { TablePagination } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

export const Profile =() =>{
    const [calories, setCalories] = useState([]);
    // const [proteins, setProteins] = useState([]);
    // const [fats, setFats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [selectMode, setSelectMode] = useState(0);
    const [modeBasedEntries, setModeBasedEntries] = useState([]);
    const [userProfile, setuserProfile] = useState();
    const [userBmi, setuserbmi] = useState();
    const [modeName, setModeName] = useState("Today");
    const [requiredcalories, setRequiredcalories] = useState('');
    const [thisWeekCalories, setthisWeekCalories] = useState([]);
    const [thisWeekProteins, setthisWeekProteins] = useState([]);
    const [thisWeekFats, setthisWeekFats] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [pageTwo, setPageTwo] = useState(0);
    const [rowsPerPageTwo, setRowsPerPageTwo] = useState(2);


    const email= localStorage.getItem("email");
    const navigate = useNavigate();

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
      const proteinsPerDay = new Array(7).fill(0);
      const fatsPerDay = new Array(7).fill(0);

      calories.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.getDay();
        const calories = parseInt(entry.calories, 10);
        const index = (day === 0) ? 6 : day - 1;
        caloriesPerDay[index] += calories;
      });

      calories.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.getDay();
        const proteins = parseInt(entry.proteins, 10);
        const index = (day === 0) ? 6 : day - 1;
        proteinsPerDay[index] += proteins;
      });

      calories.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.getDay();
        const fats = parseInt(entry.fats, 10);
        const index = (day === 0) ? 6 : day - 1;
        fatsPerDay[index] += fats;
      });

      setthisWeekCalories(caloriesPerDay);
      setthisWeekProteins(proteinsPerDay);
      setthisWeekFats(fatsPerDay);
    }, [selectMode, calories]);

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

  const handleChangePage = (event, newPage) => {
  setPage(newPage);
  };

  const handleChangePageTwo = (event, newPage) => {
    setPageTwo(newPage);
  };

  const ProBarChart = () => {
    const data = {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: 'Proteins (g)',
          data: thisWeekProteins,
          backgroundColor: ['#4ade80'],
        }
      ]
  };
  
    const options = {
      MaxWidth:"600px",
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'This Week Proteins'
        }
      }
    };
  
      return <div  className="chartContainer"><Bar data={data} responsive options={options} /></div>;
  };
  
  const FatBarChart = () => {
    const data = {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: 'Fats (g)',
          data: thisWeekFats,
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
          text: 'This Week Fats'
        }
      }
    };
  
    return <div  className="chartContainer"><Bar data={data} responsive options={options} /></div>;
  };

    const CalBarChart = () => {
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

    return <div  className="chartContainer"><Bar data={data} responsive options={options} /></div>;
  };
      
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
      <div className="editBtn">
        <Button onClick={()=>{navigate('/editprofile')}}>Edit</Button>
      </div>
      <div className="calorie-history-container">
        <Button onClick={()=>{changeMode(selectMode)}}>{modeName}</Button>
        {modeBasedEntries.length === 0 ? (
          <p>No records found.</p>
        ) : (
              <TableContainer className="food-table-container">
                  <Table aria-label="food table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Food Item</TableCell>
                        <TableCell align="right">Amount(g)</TableCell>
                        <TableCell align="right">Calories(kcal)</TableCell>
                        <TableCell align="right">Proteins(g)</TableCell>
                        <TableCell align="right">Carbs(g)</TableCell>
                        <TableCell align="right">Fats(g)</TableCell>
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {idedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.foodItem}</TableCell>
                          <TableCell align="right">{item.foodAmount}</TableCell>
                          <TableCell align="right">{item.calories}</TableCell>
                          <TableCell align="right">{item.proteins}</TableCell>
                          <TableCell align="right">{item.carbs}</TableCell>
                          <TableCell align="right">{item.fats}</TableCell>
                          <TableCell align="right">{new Date(selectedDate).toDateString(optionsDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={idedRows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={4}
                    onRowsPerPageChange={()=>{}}
                    rowsPerPageOptions={[]}
                    className="pagination"
                  />
                </TableContainer>
            )}
      </div>
      <CalCalendar handleChangePageTwo={handleChangePageTwo} optionsDate={optionsDate} rowsPerPageTwo={rowsPerPageTwo} pageTwo={pageTwo} idedRowsTwo={idedRowsTwo} selectedDate={selectedDate} selectedDayEntries={selectedDayEntries}  proteinchartData={thisWeekProteins} caloriechartData={thisWeekCalories} fatchartData={thisWeekFats} calories={calories} requiredcalories={requiredcalories} onDateClick={(date) => setSelectedDate(date)} />
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <span style={{ backgroundColor: '#4caf50', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Met</span>
          <span style={{ backgroundColor: '#ff9800', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Exceeded</span>
          <span style={{ backgroundColor: '#f44336', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Low</span>
        </div>
      </div>
    {selectedDate && (
      <div className="selected-day-entries">
        <h3>{new Date(selectedDate).toDateString()}</h3>
        {selectedDayEntries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
        <>
          <TableContainer className="food-table-container">
            <Table aria-label="food table">
              <TableHead>
                <TableRow>
                  <TableCell>Food Item</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Proteins(g)</TableCell>
                  <TableCell align="right">Carbs(g)</TableCell>
                  <TableCell align="right">Fats(g)</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {idedRowsTwo.slice(pageTwo * rowsPerPageTwo, pageTwo * rowsPerPageTwo + rowsPerPageTwo).map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.foodItem}</TableCell>
                    <TableCell align="right">{item.foodAmount}</TableCell>
                    <TableCell align="right">{item.calories}</TableCell>
                    <TableCell align="right">{item.proteins}</TableCell>
                    <TableCell align="right">{item.carbs}</TableCell>
                    <TableCell align="right">{item.fats}</TableCell>
                    <TableCell align="right">{new Date(selectedDate).toDateString(optionsDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={idedRowsTwo.length}
              page={pageTwo}
              onPageChange={handleChangePageTwo}
              rowsPerPage={4}
              onRowsPerPageChange={()=>{}}
              rowsPerPageOptions={[]}
            />
          </TableContainer>
        </>
        )}
      </div>
    )}
    <div className="chartsContainer">
      <CalBarChart></CalBarChart>
      <ProBarChart></ProBarChart>
      <FatBarChart></FatBarChart>
    </div>
    </>
  );
}