import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logged, setLogged] = useState(localStorage.getItem("LoggedIn") === 'true');

    const loginDone = () => {
        localStorage.setItem('LoggedIn', 'true');
        setLogged(true);
    };

    const logout = () => {
        localStorage.setItem('LoggedIn', 'false');
        setLogged(false);
    };

    return (
        <AuthContext.Provider value={{ logged, loginDone, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};