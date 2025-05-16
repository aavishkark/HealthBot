import { useState } from 'react';
import { useDispatch} from 'react-redux';
import { LOGOUT } from '../Redux/Login/actionType';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const Home = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    console.log(response)
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
        query: input
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

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    localStorage.setItem('isAuth', false);
    localStorage.removeItem('token');
    navigate('/login');
  }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold mb-6">🍎 Calorie Bot</h1>

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
            <input
              className="border rounded p-2 w-full"
              type="text"
              value={input}
              placeholder="e.g., How many calories in a banana?"
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </form>

          <div className="mt-6 w-full max-w-md">
            {response && (
              <div className="border rounded p-4">
                <strong>Bot:</strong> {response}
                <button onClick={addCalories}>Add</button>
              </div>
            )}
          </div>
          <div>
            <button onClick={handleLogout} className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition mt-4">
              Logout
            </button>
          </div>
    </div>
    )
}