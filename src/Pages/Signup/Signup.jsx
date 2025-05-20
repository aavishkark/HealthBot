import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('Male');
    const [activitylevel, setActivityLevel] = useState('')
    const navigate= useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = { name, email, password, height, weight, age, gender, activitylevel };
        axios.post('https://healthbotbackend-production.up.railway.app/signup', user)
        .then((response) => {
            alert("Signup successful! Please login to continue.");
            navigate('/login');
        })
        .catch((error) => {
            alert("Signup failed! Please try again.");
        });
    }
    return (
        <div>
            <h1>Signup</h1>
            <p>Please enter your credentials to signup.</p>
            <label htmlFor="username">Name:</label><br />
            <input type="text" id="username" placeholder="Your Username" onChange={(e)=>{setUsername(e.target.value)}} value={name}/><br />
            <label htmlFor="age">Age:</label><br/>
            <input type="number" id="age" placeholder="Your Age" onChange={(e)=>{setAge(e.target.value)}} value={age}/><br />
            <label htmlFor="height">Height:</label><br/>
            <input type="number" id="age" placeholder="Your height in centimeters" onChange={(e)=>{setHeight(e.target.value)}} value={height}/><br />
            <label htmlFor="Weight">Weight:</label><br/>
            <input type="number" id="weight" placeholder="Your weight in Kilograms" onChange={(e)=>{setWeight(e.target.value)}} value={weight}/><br />
            <label htmlFor="gender">Gender</label><br />
            <select id="gender" onChange={(e)=>{setGender(e.target.value)}} value={gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select><br />
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}} value={email}/><br />
            <label htmlFor="password">Password:</label><br />
            <input type="password" id="password" placeholder="Your password" onChange={(e)=>{setPassword(e.target.value)}} value={password}/><br />
            <label htmlFor="gender">Gender</label><br />
            <select id="gender" onChange={(e)=>{setActivityLevel(e.target.value)}} value={activitylevel}>
                <option value="1.2" title="Little to no exercise">Sedentary</option>
                <option value="1.375" title="Light exercise/sports 1–3 days/week">Lightly active</option>
                <option value="1.55" title="Moderate exercise 3–5 days/week">Moderately active</option>
                <option value="1.725" title="Hard exercise 6–7 days/week">Very active</option>
                <option value="1.9" title="Very hard exercise and physical job">Super active</option>
            </select><br />
            <button type="submit" onClick={handleSubmit}>Sign Up</button><br />
            <p>Already have an account? <a href="/login">login here</a></p>
        </div>
    )
}