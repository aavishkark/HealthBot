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
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  minWidth:"300px",
  borderRadius:"10px",
  color:"rgb(16, 46, 73)"
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
        console.log(data.reply)
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

    const resArray = response.split(' ');
    const cal = resArray[0];
    const pro = resArray[1];
    const carb = resArray[2];
    const fat = resArray[3];
    const amount = resArray[4];
    let item ="";

    for ( let i=5; i<=resArray.length-1; i++ ){
        item += resArray[i] + " "
    }

    useEffect(()=>{
        const modalRes = resArray[0] === "NO!" ? `${response}` : `${resArray[0]+' calories, '+ resArray[1]+'g proteins, ' + resArray[2]+'g carbs & ' + resArray[3]+'g fats in ' + resArray[4] + 'g ' + item}`
        setmodalResponse(modalRes);
    },[response,item,resArray])

    const email = localStorage.getItem('email');

  async function addCalories () {
    
     try{
       await axios.post('https://healthbotbackend-production.up.railway.app/addcalories', {
        calories:mode === "bot" ? cal : calories,
        proteins:mode === "bot" ? pro : proteins,
        carbs:mode === "bot" ? carb : carbs,
        fats:mode === "bot" ? fat : fats,
        foodAmount:mode === "manual" ? foodAmount : amount,
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
        setProteins('');
        setFats('');
        setCarbs('');
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
          <div className="calorie-bot">
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
              >
                <Box sx={style}>
                  {response && (
                    <Box sx={{ flexGrow: 1, fontSize:"1.6rem" }}>
                      <Grid container spacing={2} justifyContent={"space-evenly"}>
                        <Grid size={5}>
                          {modalResponse}
                        </Grid>
                        <Grid size={5} alignSelf={"center"}>
                          {resArray[0] === "NO!" ? <Button onClick={handleClose} className='closeBtn'>Okay</Button> : <Button onClick={addCalories} className='consumeBtn'>Consume</Button>}
                        </Grid>
                      </Grid>
                    </Box>
                    )}
                </Box>
              </Modal>
            </div>
          </div>
          <form onSubmit={addCalories} className='manual'>
              <TextField 
                id="outlined-basic" 
                label="Enter Calories" 
                variant="outlined"
                margin="dense"
                fullWidth
                type="number"
                value={calories}
                placeholder="Enter Calories"
                onChange={(e) => setCalories(e.target.value)}
                required
              /><br />
              <TextField 
                id="outlined-basic" 
                label="Enter food Proteins" 
                variant="outlined"
                margin="dense"
                type="text"
                fullWidth
                value={proteins}
                placeholder="Enter food Proteins"
                onChange={(e) => setProteins(e.target.value)}
                required
                /><br />
                <TextField 
                id="outlined-basic" 
                label="Enter food Carbs" 
                variant="outlined"
                margin="dense"
                type="text"
                fullWidth
                value={carbs}
                placeholder="Enter food Carbs"
                onChange={(e) => setCarbs(e.target.value)}
                required
                /><br />
                <TextField 
                id="outlined-basic" 
                label="Enter food Fats" 
                variant="outlined"
                margin="dense"
                type="text"
                fullWidth
                value={fats}
                placeholder="Enter food Fats"
                onChange={(e) => setFats(e.target.value)}
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
              <Button type='submit'>Add Calories</Button>
          </form>
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