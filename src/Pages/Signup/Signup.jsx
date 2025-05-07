import axios from "axios";
import { useState } from "react";

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = { username, email, password };
        axios.post('https://healthbotbackend.onrender.com/signup', user)
        .then((response) => {
            alert("Signup successful! Please login to continue.");
            window.location.href = '/login';
        })
        .catch((error) => {
            alert("Signup failed! Please try again.");
        });
    }
    return (
        <div>
            <h1>Signup</h1>
            <p>Please enter your credentials to signup.</p>
            <label htmlFor="username">Username:</label><br />
            <input type="text" id="username" placeholder="Your Username" onChange={(e)=>{setUsername(e.target.value)}} value={username}/><br />
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}} value={email}/><br />
            <label htmlFor="password">Password:</label><br />
            <input type="password" id="password" placeholder="Your password" onChange={(e)=>{setPassword(e.target.value)}} value={password}/><br />
            <button type="submit" onClick={handleSubmit}>Sign Up</button><br />
            <p>Already have an account? <a href="/login">login here</a></p>
        </div>
    )
}