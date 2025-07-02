import './navbar.css';
import API from './api';
import { useState, useEffect } from 'react';

export const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(true);

    useEffect(()=>{
        API.get('/verify')
        .then(res => {
            setLoggedIn(res.data.loggedIn);
        })
        .catch(err => {
            setLoggedIn(false);
        });
    },[])
    
    const handleLogout = () => {
        API.post('/logout',(res,req)=>{
            
        })
        .then((res)=>{
            alert("Logged Out Successfully!")
        })

    }

    return (
        <div className='navbar'>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                {loggedIn ? <li onClick={handleLogout}><a href='/'>Logout</a></li> : <li><a href="/login">Login</a></li>}
            </ul>
        </div>
    );
};