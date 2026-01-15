import { useEffect, useState } from "react";
import './profile.css';
import CalCalendar from "../Components/CaloriesCalender/CalCalender";
import {
  MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import eating2Gif from '../assets/eating2.gif';
import excerciseGif from '../assets/excercise.gif';
import {
  Edit, TrendingUp, Activity, Award, Lock, ChevronRight, Sparkles,
  BarChart3, CalendarDays, Brain, Sun, Sunset, Moon, Coffee, Utensils
} from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

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
  const [requiredCarbs, setRequiredCarbs] = useState('');
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filtered = userCalories.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectMode === 0) {
      setModeBasedEntries(calories.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      }));
    } else if (selectMode === 1) {
      setModeBasedEntries(calories.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      }));
    } else if (selectMode === 2) {
      setModeBasedEntries(calories.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      }));
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
      const carbCalories = 0.55 * tdee;

      const proteinGrams = proteinCalories / 4;
      const fatGrams = fatCalories / 9;
      const carbGrams = carbCalories / 4;

      setRequiredProteins(proteinGrams.toFixed(0));
      setRequiredCarbs(carbGrams.toFixed(0));
      setRequiredFats(fatGrams.toFixed(0));
    }
  }, [userProfile]);

  const todayTotals = modeBasedEntries.reduce((acc, entry) => ({
    calories: acc.calories + parseFloat(entry.calories || 0),
    proteins: acc.proteins + parseFloat(entry.proteins || 0),
    carbs: acc.carbs + parseFloat(entry.carbs || 0),
    fats: acc.fats + parseFloat(entry.fats || 0),
  }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

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

  const idedRows = modeBasedEntries
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(row => ({
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

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getEncouragement = () => {
    if (!modeBasedEntries.length) return "Ready to fuel your day?";
    if (todayTotals.calories > parseFloat(requiredCalories)) return "You've energized your body well!";
    return "Keep up the great rhythm!";
  };

  const getMealIcon = (dateString) => {
    const hour = new Date(dateString).getHours();
    if (hour >= 5 && hour < 11) return <Coffee size={16} />;
    if (hour >= 11 && hour < 16) return <Sun size={16} />;
    if (hour >= 16 && hour < 21) return <Utensils size={16} />;
    return <Moon size={16} />;
  };

  const getMealLabel = (dateString) => {
    const hour = new Date(dateString).getHours();
    if (hour >= 5 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 21) return "Dinner";
    return "Late Snack";
  };

  if (loading) return (
    <div className="profile-loading">
      <img src={excerciseGif} alt="Loading..." style={{ width: '120px', height: '120px', borderRadius: '20px', marginBottom: '1rem' }} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Getting your insights...
      </motion.p>
    </div>
  );

  return (
    <>
      {authorized ? (
        <motion.div
          className="profile-container"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="profile-header-human" variants={itemVariants}>
            <div className="header-greeting">
              <span className="greeting-pill">{getTimeGreeting()}</span>
              <h1 className="human-name">{userProfile.name}</h1>
            </div>

            <button onClick={() => navigate('/editprofile')} className="btn-edit-minimal">
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          </motion.div>

          <div className="wellness-pillars">
            <motion.div variants={itemVariants}>
              <Card variant="glass" className="pillar-card">
                <div className="pillar-icon-wrapper primary">
                  <TrendingUp size={20} />
                </div>
                <div className="pillar-content">
                  <span className="pillar-label">Body Harmony (BMI)</span>
                  <div className="pillar-value-group">
                    <span className="pillar-value">{userBmi}</span>
                    <span className="pillar-badge" style={{ backgroundColor: getBMICategory(parseFloat(userBmi)).color }}>
                      {getBMICategory(parseFloat(userBmi)).text}
                    </span>
                  </div>
                  <p className="pillar-insight">Based on your height & weight</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="glass" className="pillar-card">
                <div className="pillar-icon-wrapper secondary">
                  <div className="gif-icon-container">
                    <img src={excerciseGif} alt="Exercise" className="pillar-gif-icon" />
                  </div>
                </div>
                <div className="pillar-content">
                  <span className="pillar-label">Daily Energy Target</span>
                  <div className="pillar-value-group">
                    <span className="pillar-value">{requiredCalories}</span>
                    <span className="pillar-unit">kcal</span>
                  </div>
                  <p className="pillar-insight">Recommended for your goal</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="glass" className="pillar-card">
                <div className="pillar-icon-wrapper accent">
                  <CalendarDays size={20} />
                </div>
                <div className="pillar-content">
                  <span className="pillar-label">Consistency</span>
                  <div className="pillar-value-group">
                    <span className="pillar-value">{modeBasedEntries.length}</span>
                    <span className="pillar-unit">logs</span>
                  </div>
                  <p className="pillar-insight">Entries this period</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="dashboard-grid">
            <motion.div variants={itemVariants}>
              <Card variant="glass" className="nutrition-insight-card">
                <div className="card-header-human">
                  <h3>Today's Fuel Balance</h3>
                  <p>Track your energy sources</p>
                </div>

                <div className="progress-showcase">
                  <div className="ring-group">
                    <ProgressRing
                      progress={Math.min(((todayTotals.calories / (parseFloat(requiredCalories) || 1)) * 100) || 0, 100)}
                      size={120}
                      strokeWidth={8}
                      label="Energy"
                      color="#6366f1"
                      animated
                    />
                  </div>
                  <div className="macro-bars">
                    <div className="macro-bar-item">
                      <div className="macro-info">
                        <span className="macro-name">Protein (Muscle)</span>
                        <span className="macro-stat">{todayTotals.proteins.toFixed(1)} / {requiredProteins}g</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill protein" style={{ width: `${Math.min(((todayTotals.proteins / parseFloat(requiredProteins)) * 100) || 0, 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="macro-bar-item">
                      <div className="macro-info">
                        <span className="macro-name">Carbs (Energy)</span>
                        <span className="macro-stat">{todayTotals.carbs.toFixed(1)} / {requiredCarbs}g</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill carbs" style={{ width: `${Math.min(((todayTotals.carbs / parseFloat(requiredCarbs)) * 100) || 0, 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="macro-bar-item">
                      <div className="macro-info">
                        <span className="macro-name">Fats (Health)</span>
                        <span className="macro-stat">{todayTotals.fats.toFixed(1)} / {requiredFats}g</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill fats" style={{ width: `${Math.min(((todayTotals.fats / parseFloat(requiredFats)) * 100) || 0, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="glass" className="journal-card">
                <div className="journal-header">
                  <div>
                    <h3 className="section-title-human">Nourishment Log</h3>
                    <p className="journal-subtitle">Your food timeline</p>
                  </div>
                  <Select
                    value={selectMode}
                    onChange={(e) => setSelectMode(e.target.value)}
                    size="small"
                    variant="standard"
                    disableUnderline
                    className="human-select"
                  >
                    <MenuItem value={0}>Today</MenuItem>
                    <MenuItem value={1}>This Week</MenuItem>
                    <MenuItem value={2}>This Month</MenuItem>
                    <MenuItem value={3}>All Time</MenuItem>
                  </Select>
                </div>

                <div className="journal-list">
                  {modeBasedEntries.length === 0 ? (
                    <div className="journal-empty">
                      <motion.div
                        className="empty-gif-wrapper"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img src={eating2Gif} alt="Waiting for meal" className="empty-gif" />
                      </motion.div>
                      <p>No meals logged yet.</p>
                      <span className="empty-hint">Time to eat something nutritious?</span>
                      <button
                        onClick={() => navigate('/')}
                        className="btn-log-meal"
                      >
                        <Utensils size={14} />
                        Log a Meal
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {idedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="journal-entry"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="entry-time-line">
                            <div className="time-icon-container">
                              {getMealIcon(item.timestamp)}
                            </div>
                            <div className="time-line"></div>
                          </div>
                          <div className="entry-card">
                            <div className="entry-main">
                              <div className="entry-header-row">
                                <span className="entry-label">{getMealLabel(item.timestamp)}</span>
                                <span className="entry-time">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <h4 className="entry-food">{item.foodItem}</h4>
                              <div className="entry-macros">
                                <span className="macro-tag cal">{item.calories} cal</span>
                                <span className="macro-tag pro">{item.proteins}g P</span>
                              </div>
                            </div>
                            <div className="entry-amount">
                              {item.foodAmount}g
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {modeBasedEntries.length > 0 && (
                  <TablePagination
                    component="div"
                    count={idedRows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                    className="human-pagination"
                  />
                )}
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="glass" className="calendar-card-human">
                <h3 className="section-title-human">Consistency Tracker</h3>
                <CalCalendar
                  selectedDayEntries={selectedDayEntries}
                  calories={calories}
                  requiredcalories={requiredCalories}
                  requiredProteins={requiredProteins}
                  requiredCarbs={requiredCarbs}
                  requiredFats={requiredFats}
                  onDateClick={(date) => setSelectedDate(date)}
                />
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="chart-section-human">
              <ChartSection calories={calories} />
            </motion.div>
          </div>
        </motion.div>
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
