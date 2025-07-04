import { useState } from 'react';
import { useAuth } from '../Components/authContext';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  SwapHoriz as SwapHorizIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../Components/api';

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
      const res = await API.post(
        '/query',
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
      ).then((res)=>{
        console.log(res);
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
      if(err.response.data.msg === "Not Logged in"){
        alert('Please Login to your account to add calories.');
      }
      else{
        alert('Error adding calories.');
      }
    }
  }

  const switchMode = () => {
    setMode((prev) => (prev === 'bot' ? 'manual' : 'bot'));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, px: 2 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          >
            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #00C9FF, #92FE9D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              HealthBot 🤖
            </Typography>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              fontSize: '1.1rem',
              maxWidth: '500px',
              mx: 'auto',
              mb: 3,
            }}
          >
            Effortlessly track your <strong>calories</strong>, <strong>proteins</strong>,
            <strong> carbs</strong>, and <strong>fats</strong> in one place.
          </Typography>
        </motion.div>
      </motion.div>
      <Box>
        <Box
          sx={{
            border: '2px solid transparent',
            borderRadius: '6px',
            backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(90deg, #00C9FF, #92FE9D)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            display: 'inline-block',
          }}
        >
          {loggedIn ? <Button
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={switchMode}
            size="small"
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              color: 'text.primary',
              fontWeight: 500,
              px: 2,
            }}
          >
            Switch to {mode === 'bot' ? 'Manual' : 'Bot'} Mode
          </Button> : <Button
            href='/login'
          >
            Login To Check Manual Mode
          </Button> }
        </Box>
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
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition"
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
            <form onSubmit={(e)=>{addCalories(e)}}>
              {[
                ['Food Item', foodItem, setFoodItem],
                ['Food Amount (g)', foodAmount, setFoodAmount],
                ['Calories', calories, setCalories],
                ['Proteins', proteins, setProteins],
                ['Carbs', carbs, setCarbs],
                ['Fats', fats, setFats],
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
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition"
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
                  <CancelIcon fontSize="large" /> {response}
                </Typography>
              ) : (
                <>
                  <Typography mb={2} fontWeight="bold" color="green">
                    <CheckCircleIcon color="success" fontSize="large" /> Nutritional Breakdown
                  </Typography>
                  <TableContainer component={Box}>
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
                          <TableCell>{cal} kcal</TableCell>
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
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <Button
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition"
                  onClick={resArray[0] === 'NO!' ? handleClose : addCalories}
                  variant="contained"
                >
                  {resArray[0] === 'NO!' ? 'Okay' : 'Consume'}
                </Button>
              </Grid>
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
        <Alert onClose={handleClosealert} severity="success" sx={{ width: '200%' }}>
          Calories Consumed!
        </Alert>
      </Snackbar>
    </Container>
  );
};