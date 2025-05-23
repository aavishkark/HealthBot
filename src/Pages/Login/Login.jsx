import { useState } from "react";
import axios from "axios";
import { useDispatch} from 'react-redux';
import { LOGIN_SUCCESS } from "../../Redux/Login/actionType";
import { TextField, Button } from "@mui/material";
import Box from "@mui/material/Box";
import './login.css';
export const Login = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = { email, password };
        axios.post('https://healthbotbackend-production.up.railway.app/login', user)
        .then((response) => {
            if (response.data.msg === "Login Successfull") { 
                localStorage.setItem("token", response.data.token);
                dispatch({ type: LOGIN_SUCCESS });
                localStorage.setItem("isAuth", true);
                localStorage.setItem("email", email);
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
        <Box className="container">
            <h1>Login</h1>
            <label htmlFor="email">Email</label><br />
            <TextField 
                label="Enter Email" 
                variant="outlined"
                margin="dense"
                fullWidth type="email" id="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}} value={email} /><br />
            <label htmlFor="password">Password</label><br />
            <TextField 
                id="outlined-basic" 
                label="Enter Password" 
                variant="outlined"
                margin="dense"
                fullWidth type="password" placeholder="Your password" onChange={(e)=>{setPassword(e.target.value)}} value={password} /><br />
            <Button type="submit" onClick={handleSubmit}>Login</Button><br />
            <p>Don't have an account? <Button><a href="/signup">Register here</a></Button></p>
        </Box>
    )
}