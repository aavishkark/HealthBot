import { useState } from 'react';
import { useAuth } from '../Components/authContext';
import {
  TextField,
  Modal,
  Box,
  Grid,
  Alert,
  Snackbar,
  Typography,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
} from '@mui/material';
import {
  SwapHoriz as SwapHorizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../Components/api';
import Card from '../Components/ui/Card';
import LoadingSpinner from '../Components/ui/LoadingSpinner';
import heroImg from '../assets/illustrations/hero_illustration_1765284652849.png';
import chatbotImg from '../assets/illustrations/ai_chatbot_illustration_1765284957931.png';
import './home.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-2xl)',
  p: 4,
  borderRadius: 'var(--radius-xl)',
  maxWidth: 500,
  width: '90%',
  border: '1px solid var(--color-border)',
};

const popularFoods = [
  '100g Chicken Breast',
  '1 Banana',
  '200g Brown Rice',
  '2 Boiled Eggs',
  '100g Oatmeal',
  '1 Apple'
];

export const Home = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [mode, setMode] = useState('bot');
  const [open, setOpen] = useState(false);
  const [openalert, setOpenalert] = useState(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClosealert = () => setOpenalert(false);
  const handleOpenalert = () => setOpenalert(true);
  const { loggedIn, email } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      console.log('Sending request to /query with:', { query: input });

      const res = await API.post(
        '/query',
        { query: input },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Response received:', res.data);
      setResponse(res.data.reply || 'No response.');
      handleOpen();
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 404) {
        setResponse('ERROR: API endpoint not found. Please check the backend server.');
        alert('Error: The nutrition API endpoint is not available. Please check if the backend server is running.');
      } else if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || '';
        console.error('Server error details:', errorMsg);

        setResponse('ERROR: AI service error. The Groq API is not responding correctly.');
        alert('⚠️ AI Service Error\n\nThe nutrition AI service (Groq API) is currently having issues. This could be due to:\n\n1. Invalid or expired API key\n2. API rate limit reached\n3. Groq service downtime\n\nPlease contact the administrator or try again later.');
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        setResponse('ERROR: Cannot connect to server. Please check your internet connection.');
        alert('Network error: Cannot connect to the backend server. Please check if the server is running at https://healthbotbackend.onrender.com');
      } else {
        setResponse('Error fetching data: ' + (error.response?.data?.message || error.message));
        alert('Error: ' + (error.response?.data?.message || 'Failed to get nutrition information. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  }

  const resArray = response.split(' ');
  const cal = resArray[0];
  const pro = resArray[1];
  const carb = resArray[2];
  const fat = resArray[3];
  const amount = resArray[4];
  let item = '';
  for (let i = 5; i <= resArray.length - 1; i++) {
    item += resArray[i] + ' ';
  }

  async function addCalories(e) {
    e.preventDefault();
    try {
      await API.post(
        '/addcalories',
        {
          calories: mode === 'bot' ? cal : calories,
          proteins: mode === 'bot' ? pro : proteins,
          carbs: mode === 'bot' ? carb : carbs,
          fats: mode === 'bot' ? fat : fats,
          foodAmount: mode === 'manual' ? foodAmount : amount,
          foodItem: mode === 'bot' ? item : foodItem,
          email: email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ).then((res) => {
        setInput('');
        setResponse('');
        setCalories('');
        setProteins('');
        setFats('');
        setCarbs('');
        setFoodAmount('');
        setFoodItem('');
        handleOpenalert();
        handleClose();
      });
    } catch (err) {
      if (err.response.data.msg === "Not Logged in") {
        alert('Please Login to your account to add calories.');
      }
      else {
        alert('Error adding calories.');
      }
    }
  }

  const switchMode = () => {
    setMode((prev) => (prev === 'bot' ? 'manual' : 'bot'));
  };

  const handleQuickFood = (food) => {
    setInput(food);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <Container maxWidth="lg">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-badge animate-fade-in-down">
                <Sparkles size={16} className="badge-icon" />
                <span>AI-Powered Nutrition Tracking</span>
              </div>

              <h1 className="hero-title">
                Track Your Health
                <br />
                <span className="gradient-text">Effortlessly</span>
              </h1>

              <p className="hero-description">
                Get instant nutritional insights with our AI chatbot or log meals manually.
                Track calories, macros, and achieve your health goals.
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number gradient-text">AI</div>
                  <div className="stat-label">Powered</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number gradient-text">Real-time</div>
                  <div className="stat-label">Analysis</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number gradient-text">Free</div>
                  <div className="stat-label">Forever</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={heroImg} alt="Health Tracking" className="hero-img" />
            </motion.div>
          </div>
        </Container>
      </section>


      <Container maxWidth="md" className="main-content">
        <Card variant="glass" className="chat-card">

          <div className="mode-switcher-container">
            {loggedIn ? (
              <button onClick={switchMode} className="mode-switcher">
                <SwapHorizIcon className="switch-icon" />
                <span>Switch to {mode === 'bot' ? 'Manual' : 'AI Bot'} Mode</span>
              </button>
            ) : (
              <a href='/login' className="login-prompt-link">
                <span>🔒 Login to unlock Manual Mode</span>
              </a>
            )}
          </div>


          {mode === 'bot' && (
            <motion.div
              key="bot-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="chat-interface"
            >
              <div className="chat-header">
                <img src={chatbotImg} alt="AI Assistant" className="chatbot-avatar" />
                <div>
                  <h3 className="chat-title">AI Nutrition Assistant</h3>
                  <p className="chat-subtitle">Ask me about any food item!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="chat-form">
                <div className="input-group">
                  <TextField
                    type="text"
                    value={input}
                    fullWidth
                    placeholder="e.g., 200g Muesli, 1 Banana, 100g Chicken..."
                    onChange={(e) => setInput(e.target.value)}
                    required
                    variant="outlined"
                    className="chat-input"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 'var(--radius-xl)',
                        backgroundColor: 'var(--color-surface)',
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-send"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="small" color="white" />
                    ) : (
                      <SendIcon />
                    )}
                  </button>
                </div>
              </form>


              <div className="quick-suggestions">
                <p className="suggestions-label">Quick suggestions:</p>
                <div className="suggestions-chips">
                  {popularFoods.map((food, idx) => (
                    <Chip
                      key={idx}
                      label={food}
                      onClick={() => handleQuickFood(food)}
                      className="suggestion-chip"
                      size="small"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}


          {mode === 'manual' && (
            <motion.div
              key="manual-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="manual-form"
            >
              <div className="manual-header">
                <h3 className="manual-title">Manual Entry</h3>
                <p className="manual-subtitle">Enter nutritional information directly</p>
              </div>

              <form onSubmit={(e) => { addCalories(e) }} className="manual-fields">
                <div className="form-row">
                  <TextField
                    fullWidth
                    label="Food Item"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                    required
                    variant="outlined"
                  />
                </div>
                <div className="form-row-2">
                  <TextField
                    label="Amount (g)"
                    type="number"
                    value={foodAmount}
                    onChange={(e) => setFoodAmount(e.target.value)}
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                    variant="outlined"
                  />
                </div>
                <div className="form-row-3">
                  <TextField
                    label="Proteins (g)"
                    type="number"
                    value={proteins}
                    onChange={(e) => setProteins(e.target.value)}
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Carbs (g)"
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Fats (g)"
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    required
                    variant="outlined"
                  />
                </div>
                <button type="submit" className="btn-submit gradient-primary">
                  Add to Diary
                </button>
              </form>
            </motion.div>
          )}
        </Card>
      </Container>


      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              {resArray[0] === 'NO!' ? (
                <div className="modal-error">
                  <CancelIcon className="modal-icon-error" />
                  <Typography variant="h6" color="error" className="modal-error-text">
                    {response}
                  </Typography>
                </div>
              ) : (
                <>
                  <div className="modal-success-header">
                    <CheckCircleIcon className="modal-icon-success" />
                    <Typography variant="h5" fontWeight="bold" className="gradient-text">
                      Nutritional Breakdown
                    </Typography>
                  </div>
                  <TableContainer component={Box} className="nutrition-table">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Food Item</strong></TableCell>
                          <TableCell>{item.trim()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Amount</strong></TableCell>
                          <TableCell>{amount} g</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Calories</strong></TableCell>
                          <TableCell className="highlight-cal">{cal} kcal</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Proteins</strong></TableCell>
                          <TableCell>{pro} g</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Carbs</strong></TableCell>
                          <TableCell>{carb} g</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Fats</strong></TableCell>
                          <TableCell>{fat} g</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Grid>
            <Grid container spacing={2} justifyContent="center" className="modal-actions">
              <button
                onClick={resArray[0] === 'NO!' ? handleClose : addCalories}
                className="btn-modal gradient-primary"
              >
                {resArray[0] === 'NO!' ? 'Okay' : 'Add to Diary'}
              </button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Snackbar
        open={openalert}
        autoHideDuration={3000}
        onClose={handleClosealert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
          ✨ Meal logged successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};