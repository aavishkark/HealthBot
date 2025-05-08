import { useState } from "react";
import axios from "axios";
import { useDispatch} from 'react-redux';
import { LOGIN_SUCCESS } from "../../Redux/Login/actionType";
export const Login = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = { email, password };
        axios.post('https://healthbotbackend.onrender.com/login', user)
        .then((response) => {
            if (response.data.msg === "Login Successfull") { 
                localStorage.setItem("token", response.data.token);
                dispatch({ type: LOGIN_SUCCESS });
                localStorage.setItem("isAuth", true);
                alert("Login successful! Redirecting to dashboard.");
                window.location.href = '/';
            } else {
                alert("Login failed! Please check your credentials.");
            }
        })
        .catch((error) => {
            alert("Login failed! Please try again.");
        });
    }
    return (
        <div>
            <h1>Login</h1>
            <p>Please enter your credentials to log in.</p>
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}} value={email} /><br />
            <label htmlFor="password">Password:</label><br />
            <input type="password" id="password" placeholder="Your password" onChange={(e)=>{setPassword(e.target.value)}} value={password} /><br />
            <button type="submit" onClick={handleSubmit}>Login</button><br />
            <p>Don't have an account? <a href="/signup">Register here</a></p>
        </div>
    )
}