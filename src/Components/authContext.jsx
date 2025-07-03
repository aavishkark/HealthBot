import { createContext, useContext, useState, useEffect } from 'react';
import API from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setemail] = useState('');

    useEffect(() => {
        API.get('/verify')
            .then(res => {setLoggedIn(res.data.loggedIn); if(res.data.loggedIn)setemail(res.data.user.email)})
            .catch(() => setLoggedIn(false));
    }, []);

    const login = () => setLoggedIn(true);
    const logout = () => setLoggedIn(false);

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout, email }}>
            {children}
        </AuthContext.Provider>
    );
};
