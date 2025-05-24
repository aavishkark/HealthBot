import './navbar.css';
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import { LOGOUT } from '../Redux/Login/actionType';
import { useNavigate } from 'react-router-dom';
export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector((store) => store.AuthReducer.isAuth);
    
    const handleLogout = () => {
        dispatch({ type: LOGOUT });
        localStorage.setItem('isAuth', false);
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <div className='navbar'>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                {isAuth === "true" ? <li onClick={handleLogout}><a href="/login">Logout</a></li> : <li><a href="/login">Login</a></li>}
            </ul>
        </div>
    )
}