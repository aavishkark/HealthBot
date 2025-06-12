import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Modal,
  Box,
  Grid,
  Alert,
  Snackbar,
  Typography,
  Container,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  SwapHoriz as SwapHorizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  maxWidth: 400,
  width: '90%',
  textAlign: 'center',
};

export const Home = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [modalResponse, setmodalResponse] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [mode, setMode] = useState('bot');
  const [open, setOpen] = useState(false);
  const [openalert, setOpenalert] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClosealert = () => setOpenalert(false);
  const handleOpenalert = () => setOpenalert(true);

  const email = localStorage.getItem('email');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(
        'https://healthbotbackend-production.up.railway.app/query',
        { query: input },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResponse(res.data.reply || 'No response.');
      handleOpen();
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error fetching data.');
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

  useEffect(() => {
    const modalRes =
      resArray[0] === 'NO!'
        ? `${response}`
        : `${resArray[0]} calories, ${resArray[1]}g proteins, ${resArray[2]}g carbs & ${resArray[3]}g fats in ${resArray[4]}g ${item}`;
    setmodalResponse(modalRes);
  }, [response, item, resArray]);

  async function addCalories() {
    try {
      await axios.post(
        'https://healthbotbackend-production.up.railway.app/addcalories',
        {
          calories: mode === 'bot' ? cal : calories,
          proteins: mode === 'bot' ? pro : proteins,
          carbs: mode === 'bot' ? carb : carbs,
          fats: mode === 'bot' ? fat : fats,
          foodAmount: mode === 'manual' ? foodAmount : amount,
          foodItem: mode === 'bot' ? item : foodItem,
          email: email
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
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
    } catch (err) {
      console.error(err);
      alert('Error adding calories.');
    }
  }

  const switchMode = () => {
    setMode((prev) => (prev === 'bot' ? 'manual' : 'bot'));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" mb={1}>
          Welcome to Calorie Tracker
        </Typography>
        <Typography variant="subtitle1" align="center" mb={2} color="text.secondary">
          Effortlessly track your calories, proteins, carbs, and fats
        </Typography>
      </motion.div>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 3, p: 4, boxShadow: 1, backgroundColor: '#fefefe' }}>
        <Box textAlign="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={switchMode}
            size="small"
          >
            Switch to {mode === 'bot' ? 'Manual' : 'Bot'} Mode
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {mode === 'bot' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                value={input}
                fullWidth
                margin="normal"
                label="e.g. 200g Museli"
                onChange={(e) => setInput(e.target.value)}
                required
              />
              <Button
                className='bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition'
                type="submit"
                fullWidth
                sx={{ mt: 2, color: 'white' }}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {loading ? 'Analyzing...' : 'Ask'}
              </Button>
            </form>
          </motion.div>
        )}

        {mode === 'manual' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={addCalories}>
              {[
                ['Calories', calories, setCalories],
                ['Proteins', proteins, setProteins],
                ['Carbs', carbs, setCarbs],
                ['Fats', fats, setFats],
                ['Food Item', foodItem, setFoodItem],
                ['Food Amount (g)', foodAmount, setFoodAmount]
              ].map(([label, value, setter], idx) => (
                <TextField
                  key={idx}
                  fullWidth
                  label={label}
                  margin="dense"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                />
              ))}
              <Button
                className='bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition'
                type="submit"
                fullWidth
                sx={{ mt: 2, color: 'white' }}
                variant="contained"
              >
                Add Calories
              </Button>
            </form>
          </motion.div>
        )}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              {resArray[0] === 'NO!' ? (
                <Typography color="error">
                  <CancelIcon fontSize="large" /> {modalResponse}
                </Typography>
              ) : (
                <Typography>
                  <CheckCircleIcon color="success" fontSize="large" /> {modalResponse}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Button
                onClick={resArray[0] === 'NO!' ? handleClose : addCalories}
                variant="contained"
              >
                {resArray[0] === 'NO!' ? 'Okay' : 'Consume'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Snackbar
        open={openalert}
        autoHideDuration={3000}
        onClose={handleClosealert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
          Calories Consumed!
        </Alert>
      </Snackbar>
    </Container>
  );
};