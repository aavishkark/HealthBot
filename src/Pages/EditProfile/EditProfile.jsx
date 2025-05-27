import axios from "axios";
import { useEffect, useState } from "react";
import './editprofile.css';
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

export const EditProfile = () =>{
    const [userEmail, setUserEmail] = useState('');
    const [userProfile, setUserProfile] = useState('');
    const [userName, setUserName] = useState('');
    const [userHeight, setUserHeight] = useState('');
    const [userWeight, setUserWeight] = useState('');
    const [userGender,setUserGender]=useState('')
    const [userAge, setUserAge] = useState('');
    const [userActivityLevel, setUserActivityLevel] = useState('');

    const email = localStorage.getItem('email')


    useEffect(()=>{
        
        axios.get('https://healthbotbackend-production.up.railway.app/getProfile',{
            params:{email},
            headers:{
                'content-type':'application/json',
            }
        })
        .then((res)=>{
            setUserProfile(res.data.user);
            setUserName(res.data.user.name);
            setUserAge(res.data.user.age);
            setUserHeight(res.data.user.height);
            setUserWeight(res.data.user.weight);
            setUserEmail(res.data.user.email);
            setUserGender(res.data.user.gender);
            setUserActivityLevel(res.data.user.activitylevel);
        })
    },[email])

    const handleUpdate = (e) => {
        e.preventDefault()
        axios.patch(`http://localhost:8080/updateProfile/${userProfile._id}`,{
            
                _id: userProfile._id,
                email: userEmail,
                name: userName,
                password: userProfile.password,
                weight: userWeight,
                height: userHeight,
                age: userAge,
                gender: userGender,
                activitylevel: userActivityLevel,
                calories: userProfile.calories,
                __v: userProfile.__v
            
        })
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    
    return(
        <>
        <form onSubmit={handleUpdate}>
            <Box sx={{width:"50%",margin:"auto", padding:"50px"}}>
                <label htmlFor="username">Name</label><br />
                <TextField 
                    label="Enter Username" 
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth type="text" id="username" placeholder="Your Username" onChange={(e)=>{setUserName(e.target.value)}} value={userName}/><br />
                <label htmlFor="age">Age</label><br/>
                <TextField 
                    label="Enter Age" 
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth type="number" id="age" placeholder="Your Age" onChange={(e)=>{setUserAge(e.target.value)}} value={userAge}/><br />
                <label htmlFor="height">Height</label><br/>
                <TextField 
                    label="Enter Height" 
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth type="number" id="height" placeholder="In Centimeters" onChange={(e)=>{setUserHeight(e.target.value)}} value={userHeight}/><br />
                <label htmlFor="Weight">Weight</label><br/>
                <TextField 
                    label="Enter Weight" 
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth type="number" id="weight" placeholder="In Kilograms" onChange={(e)=>{setUserWeight(e.target.value)}} value={userWeight}/><br />
                <label htmlFor="gender">Gender</label><br />
                <Select
                    label="Select Gender"
                    required
                    id="gender" onChange={(e)=>{setUserGender(e.target.value)}} value={userGender}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select><br />
                <label htmlFor="email">Email</label><br />
                <TextField 
                    label="Enter Email" 
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth type="email" id="email" placeholder="Your Email" onChange={(e)=>{setUserEmail(e.target.value)}} value={userEmail}/><br />
                <label htmlFor="activity">Choose level of Activity</label><br />
                <Select required id="activity" onChange={(e)=>{setUserActivityLevel(e.target.value)}} value={userActivityLevel}>
                    <MenuItem value="1.2" title="Little to no exercise">Sedentary</MenuItem>
                    <MenuItem value="1.375" title="Light exercise/sports 1–3 days/week">Lightly active</MenuItem>
                    <MenuItem value="1.55" title="Moderate exercise 3–5 days/week">Moderately active</MenuItem>
                    <MenuItem value="1.725" title="Hard exercise 6–7 days/week">Very active</MenuItem>
                    <MenuItem value="1.9" title="Very hard exercise and physical job">Super active</MenuItem>
                </Select><br />
                <Button sx={{padding:'2rem'}} type="submit">Update</Button><br />
            </Box>
        </form>
        </>
    )
}