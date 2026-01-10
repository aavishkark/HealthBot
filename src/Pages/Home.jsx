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
  Lock as LockIcon,
} from '@mui/icons-material';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../Components/api';
import Card from '../Components/ui/Card';
import LoadingSpinner from '../Components/ui/LoadingSpinner';
import MealImageUpload from '../Components/MealImageUpload';
import AIAnalysisModal from '../Components/AIAnalysisModal';
import VoiceInput from '../Components/VoiceInput';
import MealRecommendations from '../Components/MealRecommendations';
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
  const [aiAnalysisData, setAiAnalysisData] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClosealert = () => setOpenalert(false);
  const handleOpenalert = () => setOpenalert(true);
  const { loggedIn, email } = useAuth();

  async function handleSubmit(e, voiceQuery = null) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const queryText = voiceQuery || input;
      console.log('Sending request to /query with:', { query: queryText });

      const res = await API.post(
        '/query',
        { query: queryText },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Response received:', res.data);
      setResponse(res.data.reply || 'No response.');
      handleOpen();
    } catch (error) {
      console.error('Query error:', error);

      const errorMessage = error.response?.data?.message || error.message;

      if (error.response?.status === 404) {
        setResponse('ERROR: API endpoint not found.');
        alert('The nutrition API is unavailable. Please check if the backend server is running.');
      } else if (error.response?.status === 500) {
        setResponse('ERROR: AI service error.');
        alert('AI service is currently unavailable. Please try again later.');
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        setResponse('ERROR: Cannot connect to server.');
        alert('Network error. Unable to reach the backend server.');
      } else {
        setResponse(`Error: ${errorMessage}`);
        alert(`Error: ${errorMessage || 'Failed to get nutrition information.'}`);
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
    setMode((prev) => {
      if (prev === 'bot') return 'manual';
      if (prev === 'manual') return 'ai-scan';
      return 'bot';
    });
  };

  const handleAIAnalysisComplete = (data) => {
    setAiAnalysisData(data);
    setAiModalOpen(true);
  };

  const handleQuickLog = async (data) => {
    try {
      await API.post(
        '/addcalories',
        {
          calories: data.totalNutrition.calories,
          proteins: data.totalNutrition.proteins,
          carbs: data.totalNutrition.carbs,
          fats: data.totalNutrition.fats,
          foodAmount: data.foodItems.map(item => item.amount).join(', '),
          foodItem: data.foodItems.map(item => item.name).join(', '),
          email: email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setAiModalOpen(false);
      setAiAnalysisData(null);
      handleOpenalert();
    } catch (err) {
      console.error('Error logging AI meal:', err);
      if (err.response?.data?.msg === "Not Logged in") {
        alert('Please Login to your account to add calories.');
      } else {
        alert('Error adding calories.');
      }
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    const syntheticEvent = { preventDefault: () => { } };
    handleSubmit(syntheticEvent, transcript);
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


      <div className="two-column-layout">
        <Container maxWidth="md" className="main-content">
          <Card variant="glass" className="chat-card">

            <div className="mode-switcher-container">
              {loggedIn ? (
                <button onClick={switchMode} className="mode-switcher">
                  <SwapHorizIcon className="switch-icon" />
                  <span>
                    Switch to {mode === 'bot' ? 'Manual' : mode === 'manual' ? 'AI Scan' : 'Bot'} Mode
                  </span>
                </button>
              ) : (
                <div className="login-prompt-container">
                  <div className="login-prompt-content">
                    <LockIcon className="lock-icon" />
                    <div className="login-prompt-text">
                      <span className="login-prompt-title">Manual Mode</span>
                      <span className="login-prompt-subtitle">Login to unlock manual entry</span>
                    </div>
                  </div>
                  <a href='/login' className="login-prompt-link">
                    <span>Login Now</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8.293 2.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 9H3a1 1 0 110-2h8.586L8.293 3.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
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

                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    disabled={loading}
                  />
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
                    Add
                  </button>
                </form>
              </motion.div>
            )}

            {mode === 'ai-scan' && (
              <motion.div
                key="ai-scan-mode"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="ai-scan-interface"
              >
                <div className="manual-header">
                  <h3 className="manual-title">AI Meal Scanner</h3>
                  <p className="manual-subtitle">Upload a photo and let AI analyze the nutrition</p>
                </div>

                <MealImageUpload onAnalysisComplete={handleAIAnalysisComplete} />
              </motion.div>
            )}
          </Card>
        </Container>

        <Container maxWidth="md" className="voice-ai-section">
          <motion.div
            className="voice-ai-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card variant="glass" className="voice-ai-card">
              <div className="voice-ai-content">
                <div className="voice-ai-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="url(#gradient1)" />
                    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="url(#gradient1)" />
                    <defs>
                      <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="voice-ai-text">
                  <h2 className="voice-ai-title">AI Diet Companion</h2>
                  <p className="voice-ai-description">
                    Have natural voice conversations about your health and nutrition goals.
                    Get personalized advice, meal planning, and support - all through voice.
                  </p>

                  <div className="voice-ai-features">
                    <div className="feature-item">
                      <span className="feature-text">Personalized Advice</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-text">Remembers Context</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-text">Natural Conversations</span>
                    </div>
                  </div>
                </div>
              </div>

              <a href="/voice-companion" className="voice-ai-cta">
                <span>Start Conversation</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </Card>
          </motion.div>
        </Container>
      </div>

      <div className="meal-recommendations-section">
        <Container maxWidth={false}>
          <MealRecommendations />
        </Container>
      </div>


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
                {resArray[0] === 'NO!' ? 'Okay' : 'Add Meal to Log'}
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

      <AIAnalysisModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        analysisData={aiAnalysisData}
        onQuickLog={handleQuickLog}
      />
    </div>
  );
};