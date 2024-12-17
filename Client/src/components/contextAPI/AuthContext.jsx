import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../Appwrite/Config'; // Removed 'client' as it's unused
import Loading from '../Loading';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logged, setLogged] = useState(false); // Initially, assume not logged in
    const [loading, setLoading] = useState(true); // Initially true since session check is pending
    const [loginWithOAuth, setLoginWithOAuth] = useState(false);

    // Check if the user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get(); // If this succeeds, the user is logged in
                setLogged(true);
            } catch (error) {
                setLogged(false); // If there's an error, the user is not logged in
                console.error('Session check failed:', error);
            } finally {
                setLoading(false); // Set loading to false after check
            }
        };

        checkSession();
    }, []);

    // Log in user
    

    // Log out user
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setLogged(false);
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    if (loading) {
        return <Loading />; // Optional: Show a loading indicator while checking the session
    }

    return (
        <AuthContext.Provider
            value={{ logged, loginWithOAuth, setLoginWithOAuth,  logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook to access AuthContext
export const useAuthContext = () => {
    return useContext(AuthContext);
};
