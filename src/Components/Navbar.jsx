import { useAuth } from './authContext';
import API from './api';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const { loggedIn, logout, loading } = useAuth();
    const navigate = useNavigate()

    const handleLogout = () => {
        API.post('/logout', {}, { withCredentials: true })
            .then((res) => {
                alert("Logged Out Successfully!");
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
        </div>
    );
};
