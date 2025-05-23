import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import './signup.css';

export const Signup = () => {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('Male');
    const [activitylevel, setActivityLevel] = useState('1.2')
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
        <Box sx={{width:"40%",margin:"auto"}}>
            <h1>Signup</h1>
            <label htmlFor="username">Name</label><br />
            <TextField 
                label="Enter Username" 
                variant="outlined"
                margin="dense"
                fullWidth type="text" id="username" placeholder="Your Username" onChange={(e)=>{setUsername(e.target.value)}} value={name}/><br />
            <label htmlFor="age">Age</label><br/>
            <TextField 
                label="Enter Age" 
                variant="outlined"
                margin="dense"
                fullWidth type="number" id="age" placeholder="Your Age" onChange={(e)=>{setAge(e.target.value)}} value={age}/><br />
            <label htmlFor="height">Height</label><br/>
            <TextField 
                label="Enter Height" 
                variant="outlined"
                margin="dense"
                fullWidth type="number" id="height" placeholder="Your height in centimeters" onChange={(e)=>{setHeight(e.target.value)}} value={height}/><br />
            <label htmlFor="Weight">Weight</label><br/>
            <TextField 
                label="Enter Weight" 
                variant="outlined"
                margin="dense"
                fullWidth type="number" id="weight" placeholder="Your weight in Kilograms" onChange={(e)=>{setWeight(e.target.value)}} value={weight}/><br />
            <label htmlFor="gender">Gender</label><br />
            <Select
                label="Select Gender"
                id="gender" onChange={(e)=>{setGender(e.target.value)}} value={gender}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
            </Select><br />
            <label htmlFor="email">Email</label><br />
            <TextField 
                label="Enter Email" 
                variant="outlined"
                margin="dense"
                fullWidth type="email" id="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}} value={email}/><br />
            <label htmlFor="password">Password</label><br />
            <TextField 
                label="Enter Password" 
                variant="outlined"
                margin="dense"
                fullWidth type="password" id="password" placeholder="Your password" onChange={(e)=>{setPassword(e.target.value)}} value={password}/><br />
            <label htmlFor="activity">Choose level of Activity</label><br />
            <Select id="activity" onChange={(e)=>{setActivityLevel(e.target.value)}} value={activitylevel}>
                <MenuItem value="1.2" title="Little to no exercise">Sedentary</MenuItem>
                <MenuItem value="1.375" title="Light exercise/sports 1–3 days/week">Lightly active</MenuItem>
                <MenuItem value="1.55" title="Moderate exercise 3–5 days/week">Moderately active</MenuItem>
                <MenuItem value="1.725" title="Hard exercise 6–7 days/week">Very active</MenuItem>
                <MenuItem value="1.9" title="Very hard exercise and physical job">Super active</MenuItem>
            </Select><br />
            <Button type="submit" onClick={handleSubmit}>Sign Up</Button><br />
            Already have an account? <Button><a href="/login">login here</a></Button>
        </Box>
    )
}