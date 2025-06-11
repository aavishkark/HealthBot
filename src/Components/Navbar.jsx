import './navbar.css';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    const isAuth = localStorage.getItem('isAuth');
    
    const handleLogout = () => {
        localStorage.setItem('isAuth', false);
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className='navbar'>
            <ul>
                <li><a href="/">Home</a></li>
                {isAuth === "true" ? <li><a href="/profile">Profile</a></li> : <li><a href="/signup">Register</a></li>}
                {isAuth === "true" ? <li onClick={handleLogout}><a href="/login">Logout</a></li> : <li><a href="/login">Login</a></li>}
            </ul>
        </div>
    );
};