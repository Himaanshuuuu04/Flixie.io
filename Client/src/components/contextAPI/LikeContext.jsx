import React, { createContext, useContext, useState, useEffect } from 'react';
import { databases, ID, Query } from '../Appwrite/Config';
import { toast } from 'react-toastify';
import { useAuthContext } from './AuthContext';

const LikedMoviesContext = createContext();

export const LikedMoviesProvider = ({ children }) => {
    const [likedMovies, setLikedMovies] = useState([{
            movieId: '',
            type: ''
    }]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();
    

    // Utility function to validate critical variables
    const validateEnvironment = () => {
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_LIKED_ID;

        if (!databaseId || !collectionId) {
            console.error('Appwrite environment variables are missing.');
            toast.error('Configuration error: Missing Appwrite environment variables.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return null;
        }
        return { databaseId, collectionId };
    };

    const fetchLikedMovies = async () => {
        try {
            if (!currentUser) {
                console.warn('User is not logged in. Skipping liked movies fetch.');
                return;
            }
    
            const env = validateEnvironment();
            if (!env) return;
    
            setLoading(true);
    
            const response = await databases.listDocuments(
                env.databaseId,
                env.collectionId,
                [Query.equal('userId', currentUser.$id)]
            );
    
            const movies =
                response?.documents?.map((doc) => ({
                    movieId: doc.movieId,
                    type: doc.type,
                })) || [];
            setLikedMovies(movies);
           
        } catch (error) {
            console.error('Error fetching liked movies:', error);
            toast.error('Unable to load liked movies. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const addLikedMovie = async (movieId,media_type) => {
       
        try {
            if (!currentUser) {
                console.error('Cannot add liked movie: User is not logged in.');
                toast.error('You must be logged in to like movies.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }

            const env = validateEnvironment();
            if (!env) return;
           
            // Add movie to database
            await databases.createDocument(
                env.databaseId,
                env.collectionId,
                ID.unique(),
                {   
                    
                    userId: currentUser.$id,
                    movieId: movieId,
                    type: media_type
                    
                }
            );

            // Update local state without refetching
            setLikedMovies((prev) => [...prev, {
                movieId: movieId,
                type: media_type
            }]);

            toast.success('Movie added to your liked list!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error adding liked movie:', error);
            toast.error('Failed to add movie to liked list. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };


    const removeLikedMovie = async (movieId, media_type) => {
        try {
            if (!currentUser) {
                console.error('Cannot remove liked movie: User is not logged in.');
                toast.error('You must be logged in to remove liked movies.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
    
            const env = validateEnvironment();
            if (!env) return;
    
            // Query the database for the document with the specified movieId, userId, and type
            const existingMovies = await databases.listDocuments(
                env.databaseId,
                env.collectionId,
                [
                    Query.equal('userId', currentUser.$id),
                    Query.equal('movieId', movieId),
                    Query.equal('type', media_type),
                ]
            );
    
            if (existingMovies.documents.length === 0) {
                toast.info('Movie is not in your liked list.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }
    
            // Remove the first document (should only be one due to unique constraints)
            const movieDocId = existingMovies.documents[0].$id;
    
            await databases.deleteDocument(env.databaseId, env.collectionId, movieDocId);
    
            // Update local state without refetching
            setLikedMovies((prev) =>
                prev.filter(
                    (movie) => movie.movieId !== movieId || movie.type !== media_type
                )
            );
    
            toast.success('Movie removed from your liked list.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error removing liked movie:', error);
            toast.error('Failed to remove movie from liked list. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };
    

    useEffect(() => {
        fetchLikedMovies();
    }, [currentUser]);

    return (
        <LikedMoviesContext.Provider value={{ likedMovies, loading, addLikedMovie,removeLikedMovie }}>
            {children}
        </LikedMoviesContext.Provider>
    );
};

export const useLikedMoviesContext = () => {
    const context = useContext(LikedMoviesContext);
    if (!context) {
        throw new Error('useLikedMoviesContext must be used within a LikedMoviesProvider');
    }
    return context;
};
