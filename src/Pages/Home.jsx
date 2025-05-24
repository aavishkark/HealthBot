import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import './home.css';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  flexGrow:1,
  borderRadius:"10px",
  color:"rgb(16, 46, 73)"
};

export const Home = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [mode, setMode] = useState('bot');
  const [open, setOpen] = useState(false);
  const [openalert, setOpenalert] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClosealert= () => setOpenalert(false);
  const handleOpenalert= () => setOpenalert(true);

  useEffect(() => {
    const manual = document.querySelector('.manual');
    manual.style.display = 'none';
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      await axios.post('https://healthbotbackend-production.up.railway.app/query', 
      {
      query: input}, 
      {
      headers: {
        'Content-Type': 'application/json'}})
      .then((response) => {
        const data = response.data;
        setResponse(data.reply || 'No response.');
        handleOpen()
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponse('Error fetching data.');
      });
      } catch (err) {
        console.error(err);
        setResponse('Error fetching data.');
      } finally {
        setLoading(false);
      }
  }

  async function addCalories () {
    
    const newResponse = response.replace(' Calories In', '');
    const resArray = newResponse.split(' ');
    const cal = resArray[0];
    const amount = resArray[1];
    const item = resArray[2];

    const email = localStorage.getItem('email');
    
     try{
       await axios.post('https://healthbotbackend-production.up.railway.app/addcalories', {
        calories:mode === "bot" ? cal : calories,
        foodAmount:mode === "manual" ? foodAmount + 'g' : amount,
        foodItem:mode === "bot" ? item : foodItem,
        email:email},
        {
          headers: {
            'Content-Type': 'application/json',
          }, 
        })
      .then(() => {
        setInput('');
        setResponse('');
        setCalories('');
        setFoodAmount('');
        setFoodItem('');
        handleOpenalert();
        handleClose();
      })
      .catch(err => {
        console.error(err);
        alert('Error adding calories.');
      });
    }
    catch (err) {
      console.error(err);
      alert('Error adding calories.');
      }
  }

  const switchMode = () => {
    const caloriebot = document.querySelector('.calorie-bot');
    const manual = document.querySelector('.manual');
    if (mode === 'bot') {
      setMode('manual');
      caloriebot.style.display = 'none';
      manual.style.display = 'block';
    } else {
      setMode('bot');
      caloriebot.style.display = 'block';
      manual.style.display = 'none';
    }
  }
    return (
      <>
        <div className='botContainer'>
          <Box sx={{width:"60%",margin:"auto"}} className="calorie-bot">
            <form onSubmit={handleSubmit} >
              <TextField
                type="text"
                value={input}
                placeholder="200g Chicken"
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                required
                label="Ask Calories"
              /><br/>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Thinking...' : 'Ask'}
              </Button>
            </form>

            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {response && (
                    <Box sx={{ flexGrow: 1, fontSize:"3rem" }}>
                      <Grid container spacing={2}>
                        <Grid size={10}>
                          {response}
                        </Grid>
                        <Grid size={2}>
                          <Button onClick={addCalories}>Consume</Button>
                        </Grid>
                      </Grid>
                    </Box>
                    )}
                </Box>
              </Modal>
            </div>
          </Box>
          <Box className='manual'>
              <TextField 
                id="outlined-basic" 
                label="Enter calories" 
                variant="outlined"
                margin="dense"
                fullWidth
                type="number"
                value={calories}
                placeholder="Enter calories"
                onChange={(e) => setCalories(e.target.value)}
                required
              /><br />
              <TextField 
                id="outlined-basic" 
                label="Enter food item" 
                variant="outlined"
                margin="dense"
                type="text"
                fullWidth
                value={foodItem}
                placeholder="Enter food item"
                onChange={(e) => setFoodItem(e.target.value)}
                required
                /><br />
              <TextField 
                id="outlined-basic" 
                label="Enter food amount" 
                variant="outlined"
                margin="dense"
                type="text"
                fullWidth
                value={foodAmount}
                placeholder="Enter food amount"
                onChange={(e) => setFoodAmount(e.target.value)}
                required
                /><br />
              <Button onClick={addCalories}>Add Calories</Button>
            </Box>
        </div>
        <div>
          <Box sx={{marginBottom:"30px", width:"60%", margin:"auto"}}>
              <Button onClick={switchMode} className="switch-mode">
                Switch
              </Button>
            </Box>
            <Snackbar open={openalert} autoHideDuration={3000} onClose={handleClosealert}>
                <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
                  Calories Consumed!
                </Alert>
            </Snackbar>
        </div>
      </>
    )
}