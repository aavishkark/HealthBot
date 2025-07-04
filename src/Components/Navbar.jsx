import { useAuth } from './authContext';
import { useState } from 'react';
import API from './api';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

export const Navbar = () => {
    const [openalert, setOpenalert] = useState(false);
    const handleClosealert = () => setOpenalert(false);
    const handleOpenalert = () => setOpenalert(true);
    const { loggedIn, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        API.post('/logout', {}, { withCredentials: true })
            .then((res) => {
                handleOpenalert()
                logout();
                navigate('/login')
            });
    };

    return (
        <div className='navbar'>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                 {loading ? (
                    <li>Logout</li>
                ) : loggedIn ? (
                    <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                ) : (
                    <li><a href="/login">Login</a></li>
                )}
            </ul>
            <Snackbar
                open={openalert}
                autoHideDuration={3000}
                onClose={handleClosealert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
                    Logged Out Successfully!
                </Alert>
            </Snackbar> 
        </div>
    );
};
