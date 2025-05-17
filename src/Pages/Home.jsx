import { useEffect, useState } from 'react';
import axios from 'axios';
export const Home = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [mode, setMode] = useState('bot');


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
       await axios.post('https://healthbotbackend.onrender.com/query', {
        query: input,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data;
        setResponse(data.reply || 'No response.');
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
    const newResponse = response.replace(' calories in', '');
    const resArray = newResponse.split(' ');
    const calories = resArray[0];
    const foodAmount = resArray[1];
    const foodItem = resArray[2];

    const email = localStorage.getItem('email');
    try{
     await axios.post('https://healthbotbackend.onrender.com/addcalories', {
        calories,
        foodAmount,
        foodItem,
        email:email,
    },
    {
        headers: {
          'Content-Type': 'application/json',
        }, 
    })
    .then((response) => {
      alert('Calories added successfully!');
      setInput('');
      setResponse('');
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
  useEffect(() => {
    const manual = document.querySelector('.manual');
    manual.style.display = 'none';
  }, []);
    return (
      <>
        <div className="calorie-bot">
          <h1>🍎 Calorie Bot</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              placeholder="e.g., How many calories in a banana?"
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </form>

          <div>
            {response && (
              <div>
                <strong>Bot:</strong> {response}
                <button onClick={addCalories}>Add</button>
              </div>
            )}
          </div>
        </div>
        <div className='manual'>
            <input
              type="number"
              value={calories}
              placeholder="Enter calories"
              onChange={(e) => setCalories(e.target.value)}
              required
            /><br />
            <input
              type="text"
              value={foodItem}
              placeholder="Enter food item"
              onChange={(e) => setFoodItem(e.target.value)}
              required
              /><br />
            <input
              type="text"
              value={foodAmount}
              placeholder="Enter food amount"
              onChange={(e) => setFoodAmount(e.target.value)}
              required
              /><br />
            <button onClick={addCalories}>Add Calories</button>
          </div>
          <div>
            <button onClick={switchMode} className="switch-mode">
              Switch
            </button>
          </div>
        </>
    )
}