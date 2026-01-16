import { useAuth } from './authContext';
import { useState, useEffect } from 'react';
import API from './api';
import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [openalert, setOpenalert] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleClosealert = () => setOpenalert(false);
    const handleOpenalert = () => setOpenalert(true);
    const { loggedIn, logout, loading } = useAuth();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleLogout = () => {
        API.post('/logout', {}, { withCredentials: true })
            .then((res) => {
                handleOpenalert();
                logout();
                navigate('/login');
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
            <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            <img
                                src='/logo.png'
                                alt='HealthBot Logo'
                                style={{ width: '106px', height: 'auto' }}
                            />
                        </Link>
                    </div>

                    <ul className="navbar-links">
                        <li>
                            <a href="/" className="nav-link">Home</a>
                        </li>
                        <li>
                            <a href="/profile" className="nav-link">Profile</a>
                        </li>
                        {loading ? (
                            <li className="nav-link-loading">
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </li>
                        ) : loggedIn ? (
                            <li>
                                <button onClick={handleLogout} className="btn-logout">

                                    <span>Logout</span>
                                </button>
                            </li>
                        ) : (
                            <li>
                                <a href="/login" className="btn-login">Login</a>
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
                            <li className="mobile-nav-link-loading">
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </li>
                        ) : loggedIn ? (
                            <li>
                                <button onClick={handleLogout} className="mobile-btn-logout">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </li>
                        ) : (
                            <li>
                                <button onClick={() => navigationHandler('/login')} className="mobile-btn-login">
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
