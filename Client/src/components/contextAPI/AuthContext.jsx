import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases } from '../Appwrite/Config'; // Import Appwrite account & databases
import Loading from '../Loading';

const AuthContext = createContext();
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // Replace with your database ID
const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID; // Replace with your status collection ID

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        logged: false,
        profileCompleted: false,
        loading: true,
        currentUser: null,
    });

    useEffect(() => {
        let isMounted = true;
        let heartbeatInterval;

        const checkSession = async () => {
            try {
                const session = await account.getSession('current');
                if (!session) throw new Error('No active session found');

                const currentUser = await account.get();
                const prefs = await account.getPrefs();
                const profileCompleted = prefs?.profileCompleted === true;

                if (isMounted) {
                    setUserData({
                        logged: true,
                        profileCompleted: profileCompleted,
                        loading: false,
                        currentUser: currentUser,
                    });

                    // Set user online in the database
                    await databases.updateDocument(DATABASE_ID,USER_COLLECTION_ID, currentUser.$id, {
                        status: true,
                        lastSeen: new Date().toISOString(),
                    });

                    // Start heartbeat to keep user online
                    heartbeatInterval = setInterval(async () => {
                        await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, currentUser.$id, {
                            status: true,
                            lastSeen: new Date().toISOString(),
                        });
                    }, 50000); // Update every 50 seconds
                }
            } catch (error) {
                if (isMounted) {
                    setUserData({
                        logged: false,
                        profileCompleted: false,
                        loading: false,
                        currentUser: null,
                    });
                }
                console.error('Session check failed:', error);
            }
        };

        checkSession();

        // Cleanup: stop heartbeat and set user offline when unmounting
        return () => {
            isMounted = false;
            clearInterval(heartbeatInterval);
            if (userData.currentUser) {
                databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, userData.currentUser.$id, {
                    status: false,
                    lastSeen: new Date().toISOString(),
                }).catch((err) => console.error('Failed to set user offline:', err));
            }
        };
    }, []); // Empty dependency array to run once when the component mounts

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUserData({ logged: false, profileCompleted: false, loading: false });
            // Set user offline on logout
            if (userData.currentUser) {
                await databases.updateDocument(DATABASE_ID, USER_COLLECTION_ID, userData.currentUser.$id, {
                    status: false,
                    lastSeen: new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    if (userData.loading) {
        return (
            <div className="w-screen h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                logged: userData.logged,
                setLogged: (status) => setUserData((prev) => ({ ...prev, logged: status })),
                logout,
                profileCompleted: userData.profileCompleted,
                setProfileCompleted: (status) =>
                    setUserData((prev) => ({ ...prev, profileCompleted: status })),
                currentUser: userData.currentUser,
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
