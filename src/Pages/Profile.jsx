import { useEffect, useState } from "react";
import axios from "axios";
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
  const [page, setPage] = useState(0);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const rowsPerPage = 4;

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

  useEffect(() => {
    axios.get(`https://healthbotbackend.onrender.com/getProfile`, {
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
  );
};
