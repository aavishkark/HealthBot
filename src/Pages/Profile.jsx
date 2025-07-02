import { useEffect, useState } from "react";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";
import {
  Button, MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import ClipLoader from "react-spinners/ClipLoader";
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
import ChartSection from "../Components/ChartSection";
import API from "../Components/api";
import signin from '../assets/signin.gif'

export const Profile = () => {
  const [calories, setCalories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectMode, setSelectMode] = useState(0);
  const [modeBasedEntries, setModeBasedEntries] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [userBmi, setUserBmi] = useState();
  const [requiredCalories, setRequiredCalories] = useState('');
  const [requiredProteins, setRequiredProteins] = useState('');
  const [requiredFats, setRequiredFats] = useState('');
  const [authorized, setauthorized] = useState(true);
  const [page, setPage] = useState(0);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const rowsPerPage = 4;

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

  useEffect(() => {
    API.get(`/getProfile`, {
      params: { email },
      headers: { 'Content-Type': 'application/json' }
    })
      .then((response) => {
        const userCalories = response.data.user.calories;
        setUserProfile(response.data.user);
        setCalories(userCalories);
        const today = new Date().getDate();
        const filtered = userCalories.filter(entry => new Date(entry.timestamp).getDate() === today);
        setModeBasedEntries(filtered);
        setLoading(false);
      })
      .catch((error) => {
        if(error.response.data.msg){
          setauthorized(false)
          setLoading(false);
        }
        console.error("Error fetching user data:", error.response.data.msg);
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
      setModeBasedEntries(calories.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      }));
    } else if (selectMode === 2) {
      setModeBasedEntries(calories.filter((entry) => new Date(entry.timestamp).getMonth() === new Date().getMonth()));
    } else if (selectMode === 3) {
      setModeBasedEntries(calories);
    }
  }, [selectMode, calories]);

  useEffect(() => {
    if (userProfile) {
      const heightInMeters = userProfile.height / 100;
      const bmi = userProfile.weight / (heightInMeters * heightInMeters);
      setUserBmi(bmi.toFixed(2));

      const bmr = (10 * userProfile.weight) + (6.25 * userProfile.height) - (5 * userProfile.age) + (userProfile.gender === "Male" ? 5 : -161);
      const tdee = bmr * userProfile.activitylevel;
      setRequiredCalories(tdee.toFixed(0));

      const proteinCalories = 0.2 * tdee;
      const fatCalories = 0.25 * tdee;

      const proteinGrams = proteinCalories / 4;
      const fatGrams = fatCalories / 9;

      setRequiredProteins(proteinGrams.toFixed(0));
      setRequiredFats(fatGrams.toFixed(0));
    }
  }, [userProfile]);

  const selectedDayEntries = selectedDate
    ? calories.filter(entry =>
      new Date(entry.timestamp).toDateString() === new Date(selectedDate).toDateString()
    )
    : [];

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
    timestamp: new Date(row.timestamp).toLocaleString('en-US', optionsDate)
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <ClipLoader size={40} color="#36d7b7" />
    </div>
  );

  return (
    <>
    {authorized ? 
      <>
      <div className="infoContainerWithHeader">
        <div className="infoHeader">
          <h2>Profile Info</h2>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate('/editprofile')}
            className="editProfileBtn rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition"
          >
            Edit
          </Button>
        </div>

        <div className="infoGrid">
          {[
            { label: "Name", value: userProfile.name },
            { label: "Height", value: `${userProfile.height} cm` },
            { label: "Weight", value: `${userProfile.weight} kg` },
            { label: "Age", value: userProfile.age },
            { label: "BMI", value: userBmi },
            { label: "Required Calories", value: `${requiredCalories} kcal` },
            { label: "Required Proteins", value: `${requiredProteins} g` },
            { label: "Required Fats", value: `${requiredFats} g` }
          ].map((item, idx) => (
            <div className="infoCard" key={idx}>
              <label>{item.label}</label>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="calorie-history-container section-block">
        <Select
          value={selectMode}
          onChange={(e) => setSelectMode(e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginBottom: '1rem' }}
        >
          <MenuItem value={0}>Today</MenuItem>
          <MenuItem value={1}>This Week</MenuItem>
          <MenuItem value={2}>This Month</MenuItem>
          <MenuItem value={3}>Total</MenuItem>
        </Select>

        {modeBasedEntries.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <TableContainer className="food-table-container">
            <Table>
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
                  <TableRow key={item.id}>
                    <TableCell>{item.foodItem}</TableCell>
                    <TableCell align="right">{item.foodAmount}</TableCell>
                    <TableCell align="right">{item.calories}</TableCell>
                    <TableCell align="right">{item.proteins}</TableCell>
                    <TableCell align="right">{item.carbs}</TableCell>
                    <TableCell align="right">{item.fats}</TableCell>
                    <TableCell align="right">{item.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={idedRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              className="pagination"
            />
          </TableContainer>
        )}
      </div>

      <div className="calendar-section section-block">
        <CalCalendar
          selectedDayEntries={selectedDayEntries}
          calories={calories}
          requiredcalories={requiredCalories}
          requiredProteins={requiredProteins}
          requiredFats={requiredFats}
          onDateClick={(date) => setSelectedDate(date)}
        />
      </div>

      <ChartSection calories={calories}/>
      </>
    : <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 max-w-xl mx-auto mt-24 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Please Log In</h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            You must be Logged in to access your profile, track your calories, and view insights.
          </p>
          
          <img
            src={signin}
            alt="Sign in illustration"
            className="w-60 sm:w-72 h-auto rounded-xl shadow-lg mb-6 transition-transform duration-300 hover:scale-105"
          />
          
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full shadow-lg font-semibold hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300"
          >
            Log In to Continue
          </button>
      </div>
 }
    </>
  );
};
