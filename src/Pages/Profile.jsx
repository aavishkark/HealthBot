import { useEffect, useState } from "react";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";
import {
  MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, TrendingUp, Activity, Award, Lock, ChevronRight, Sparkles, BarChart3, CalendarDays, Brain } from 'lucide-react';
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
import Card from "../Components/ui/Card";
import ProgressRing from "../Components/ui/ProgressRing";
import LoadingSpinner from "../Components/ui/LoadingSpinner";

export const Profile = () => {
  const [calories, setCalories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectMode, setSelectMode] = useState(0);
  const [modeBasedEntries, setModeBasedEntries] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [userBmi, setUserBmi] = useState();
  const [email, setemail] = useState('');
  const [requiredCalories, setRequiredCalories] = useState('');
  const [requiredProteins, setRequiredProteins] = useState('');
  const [requiredFats, setRequiredFats] = useState('');
  const [authorized, setauthorized] = useState(true);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const rowsPerPage = 5;

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

  useEffect(() => {
    API.get('/verify')
      .then(res => {
        let email = res.data.user.email

        return API.get(`/getProfile`, {
          params: { email },
          headers: { 'Content-Type': 'application/json' }
        })
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
        if (error) {
          setauthorized(false)
          setLoading(false);
        }
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

  const todayTotals = modeBasedEntries.reduce((acc, entry) => ({
    calories: acc.calories + parseFloat(entry.calories || 0),
    proteins: acc.proteins + parseFloat(entry.proteins || 0),
    fats: acc.fats + parseFloat(entry.fats || 0),
  }), { calories: 0, proteins: 0, fats: 0 });

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

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: '#f59e0b' };
    if (bmi < 25) return { text: 'Normal', color: '#10b981' };
    if (bmi < 30) return { text: 'Overweight', color: '#f59e0b' };
    return { text: 'Obese', color: '#ef4444' };
  };

  if (loading) return (
    <div className="profile-loading">
      <LoadingSpinner size="large" />
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <>
      {authorized ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-header-content">
              <div className="profile-avatar">
                <span className="avatar-text">{userProfile.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="profile-name">Hello, {userProfile.name}! 👋</h1>
                <p className="profile-subtitle">Here's your health summary</p>
              </div>
            </div>
            <button onClick={() => navigate('/editprofile')} className="btn-edit">
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="stats-grid">
            <Card variant="glass" className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">BMI</div>
                <div className="stat-value">{userBmi}</div>
                <div className="stat-badge" style={{ backgroundColor: getBMICategory(parseFloat(userBmi)).color }}>
                  {getBMICategory(parseFloat(userBmi)).text}
                </div>
              </div>
            </Card>

            <Card variant="glass" className="stat-card">
              <div className="stat-icon stat-icon-secondary">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Daily Goal</div>
                <div className="stat-value">{requiredCalories}</div>
                <div className="stat-unit">kcal</div>
              </div>
            </Card>

            <Card variant="glass" className="stat-card">
              <div className="stat-icon stat-icon-accent">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Meals Logged</div>
                <div className="stat-value">{modeBasedEntries.length}</div>
                <div className="stat-unit">today</div>
              </div>
            </Card>
          </div>

          <Card variant="glass" className="progress-card">
            <h3 className="section-title">Today's Progress</h3>
            <div className="progress-rings">
              <ProgressRing
                progress={Math.min((todayTotals.calories / requiredCalories) * 100, 100)}
                size={140}
                strokeWidth={10}
                label="Calories"
                color="var(--color-primary)"
                animated
              />
              <ProgressRing
                progress={Math.min((todayTotals.proteins / requiredProteins) * 100, 100)}
                size={140}
                strokeWidth={10}
                label="Proteins"
                color="var(--color-secondary)"
                animated
              />
              <ProgressRing
                progress={Math.min((todayTotals.fats / requiredFats) * 100, 100)}
                size={140}
                strokeWidth={10}
                label="Fats"
                color="var(--color-accent)"
                animated
              />
            </div>
            <div className="macro-details">
              <div className="macro-item">
                <span className="macro-label">Calories</span>
                <span className="macro-value">{todayTotals.calories.toFixed(0)} / {requiredCalories} kcal</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Proteins</span>
                <span className="macro-value">{todayTotals.proteins.toFixed(1)} / {requiredProteins} g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Fats</span>
                <span className="macro-value">{todayTotals.fats.toFixed(1)} / {requiredFats} g</span>
              </div>
            </div>
          </Card>
          <ChartSection calories={calories} />

          <Card variant="glass" className="history-card">
            <div className="history-header">
              <h3 className="section-title">Meal History</h3>
              <Select
                value={selectMode}
                onChange={(e) => setSelectMode(e.target.value)}
                size="small"
                className="history-select"
              >
                <MenuItem value={0}>Today</MenuItem>
                <MenuItem value={1}>This Week</MenuItem>
                <MenuItem value={2}>This Month</MenuItem>
                <MenuItem value={3}>All Time</MenuItem>
              </Select>
            </div>

            {modeBasedEntries.length === 0 ? (
              <div className="empty-state">
                <p>No meals logged for this period</p>
              </div>
            ) : (
              <>
                <TableContainer className="meal-table">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Food Item</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Proteins</TableCell>
                        <TableCell align="right">Carbs</TableCell>
                        <TableCell align="right">Fats</TableCell>
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {idedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                        <TableRow key={item.id} className="meal-row">
                          <TableCell>{item.foodItem}</TableCell>
                          <TableCell align="right">{item.foodAmount}g</TableCell>
                          <TableCell align="right" className="cal-cell">{item.calories}</TableCell>
                          <TableCell align="right">{item.proteins}g</TableCell>
                          <TableCell align="right">{item.carbs}g</TableCell>
                          <TableCell align="right">{item.fats}g</TableCell>
                          <TableCell align="right" className="date-cell">{item.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={idedRows.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  className="table-pagination"
                />
              </>
            )}
          </Card>

          <Card variant="glass" className="calendar-card">
            <h3 className="section-title">Calendar View</h3>
            <CalCalendar
              selectedDayEntries={selectedDayEntries}
              calories={calories}
              requiredcalories={requiredCalories}
              requiredProteins={requiredProteins}
              requiredFats={requiredFats}
              onDateClick={(date) => setSelectedDate(date)}
            />
          </Card>
        </div>
      ) : (
        <div className="not-authorized">
          <div className="not-auth-content">
            <div className="lock-animation">
              <Lock className="lock-icon" size={64} />
              <div className="lock-glow"></div>
            </div>

            <div className="not-auth-header">
              <h1 className="not-auth-title">Access Your Health Dashboard</h1>
              <p className="not-auth-subtitle">
                Sign in to unlock your personalized nutrition tracking and AI-powered health insights
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon feature-icon-primary">
                  <BarChart3 size={24} />
                </div>
                <h3 className="feature-title">Track Progress</h3>
                <p className="feature-desc">Monitor calories, macros, and achieve your health goals</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-secondary">
                  <Brain size={24} />
                </div>
                <h3 className="feature-title">AI Companion</h3>
                <p className="feature-desc">Get personalized advice from your voice AI health assistant</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-accent">
                  <CalendarDays size={24} />
                </div>
                <h3 className="feature-title">Daily Insights</h3>
                <p className="feature-desc">Visualize your nutrition journey with interactive charts</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="btn-login gradient-primary">
              <Sparkles size={20} />
              <span>Sign In to Get Started</span>
              <ChevronRight size={20} />
            </button>

            <p className="signup-prompt">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="signup-link"
              >
                Create one for free
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
