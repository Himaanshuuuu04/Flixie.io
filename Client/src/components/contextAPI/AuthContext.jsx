import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../Appwrite/Config';
import Loading from '../Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        logged: false,
        profileCompleted: false,
        loading: true,
        currentUser: null,
    });

    // Check if the user is already logged in and check for profile completion
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Check if the user has a session
                const session = await account.getSession('current'); // Fetch the current session
                if (!session) {
                    throw new Error('No active session found');
                }
        
                // If the session exists, fetch user data and preferences
                const currentUser = await account.get();
                const prefs = await account.getPrefs();
        
                const profileCompleted = prefs?.profileCompleted === true;
        
                setUserData({
                    logged: true,
                    profileCompleted,
                    loading: false,
                    currentUser,
                });
            } catch (error) {
                // Handle case where no session exists or an error occurs
                setUserData({
                    logged: false,
                    profileCompleted: false,
                    loading: false,
                    currentUser: null,  
                });
                console.error('Session check failed:', error);
            }
        };
        

        checkSession();
    }, []); // Empty dependency array to run once when the component mounts

    // Exportable function to update profileCompleted state
    const setProfileCompleted = (status) => {
        setUserData((prev) => ({
            ...prev,
            profileCompleted: status,
        }));
    };

    // Log out user
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUserData({ logged: false, profileCompleted: false, loading: false });
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    if (userData.loading) {
        return <Loading />; // Optional: Show a loading indicator while checking the session
    }

    return (
        <AuthContext.Provider
            value={{
                logged: userData.logged,
                setLogged: (status) => setUserData((prev) => ({ ...prev, logged: status })),
                logout,
                profileCompleted: userData.profileCompleted,
                setProfileCompleted,
                currentUser: userData.currentUser, // Expose the function to update profileCompleted
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook to access AuthContext
export const useAuthContext = () => {
    return useContext(AuthContext);
};
