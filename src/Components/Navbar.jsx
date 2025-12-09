import { useAuth } from './authContext';
import { useState } from 'react';
import API from './api';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [openalert, setOpenalert] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navigationHandler = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar-modern">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <span className="logo-icon">🥗</span>
                        <span className="logo-text gradient-text">HealthBot</span>
                    </div>

                    <ul className="navbar-links">
                        <li>
                            <a href="/" className="nav-link">Home</a>
                        </li>
                        <li>
                            <a href="/profile" className="nav-link">Profile</a>
                        </li>
                        {loading ? (
                            <li className="nav-link">Loading...</li>
                        ) : loggedIn ? (
                            <li onClick={handleLogout} className="nav-link nav-link-action">
                                Logout
                            </li>
                        ) : (
                            <li>
                                <a href="/login" className="nav-link nav-link-primary">Login</a>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-actions">
                        <button
                            onClick={toggleMobileMenu}
                            className="mobile-menu-button"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <ul className="mobile-menu-links">
                        <li>
                            <button onClick={() => navigationHandler('/')} className="mobile-nav-link">
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigationHandler('/profile')} className="mobile-nav-link">
                                Profile
                            </button>
                        </li>
                        {loading ? (
                            <li className="mobile-nav-link">Loading...</li>
                        ) : loggedIn ? (
                            <li>
                                <button onClick={handleLogout} className="mobile-nav-link mobile-nav-link-action">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <button onClick={() => navigationHandler('/login')} className="mobile-nav-link mobile-nav-link-primary">
                                    Login
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

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
        </>
    );
};
