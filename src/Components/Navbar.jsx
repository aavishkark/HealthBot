import { useAuth } from './authContext';
import API from './api';
import './navbar.css';

export const Navbar = () => {
    const { loggedIn, logout } = useAuth();

    const handleLogout = () => {
        API.post('/logout')
            .then(() => {
                logout();
                alert("Logged Out Successfully!");
            });
    };

    return (
        <div className='navbar'>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                {loggedIn ? (
                    <li onClick={handleLogout}><a href="/">Logout</a></li>
                ) : (
                    <li><a href="/login">Login</a></li>
                )}
            </ul>
        </div>
    );
};
