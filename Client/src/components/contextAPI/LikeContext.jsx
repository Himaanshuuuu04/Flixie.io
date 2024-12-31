import React, { createContext, useContext, useState, useEffect } from 'react';
import { databases, ID, Query } from '../Appwrite/Config';
import { toast } from 'react-toastify';
import { useAuthContext } from './AuthContext';

const LikedMoviesContext = createContext();

export const LikedMoviesProvider = ({ children }) => {
    const [likedMovies, setLikedMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    // Utility function to validate environment variables
    const validateEnvironment = () => {
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionLikedId = import.meta.env.VITE_APPWRITE_COLLECTION_LIKED_ID;
        const collectionWatchedId = import.meta.env.VITE_APPWRITE_COLLECTION_WATCHED_ID;

        if (!databaseId || !collectionLikedId || !collectionWatchedId) {
            console.error('Appwrite environment variables are missing.');
            toast.error('Configuration error: Missing Appwrite environment variables.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return null;
        }
        return { databaseId, collectionLikedId, collectionWatchedId };
    };

    // Utility function to format date for Appwrite
    const formatDateForAppwrite = (date) => {
        const isValidFormat = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}\.\d{3}$/.test(date);
        if (isValidFormat) return date;

        const pad = (n) => n.toString().padStart(2, '0');
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        const milliseconds = pad(date.getMilliseconds(), 3);

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    // Fetch liked movies
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
                env.collectionLikedId,
                [Query.equal('userId', currentUser.$id)]
            );

            const movies = response?.documents?.map((doc) => ({
                movieId: doc.movieId,
                type: doc.type,
            })) || [];
            setLikedMovies(movies);
        } catch (error) {
            console.error('Error fetching liked movies:', error.message);
            toast.error('Unable to load liked movies. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Add liked movie
    const addLikedMovie = async (movieId, media_type) => {
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

            await databases.createDocument(
                env.databaseId,
                env.collectionLikedId,
                ID.unique(),
                {
                    userId: currentUser.$id,
                    movieId: movieId,
                    type: media_type,
                }
            );

            setLikedMovies((prev) => [...prev, { movieId, type: media_type }]);

            toast.success('Movie added to your liked list!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error adding liked movie:', error.message);
            toast.error('Failed to add movie to liked list. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    // Remove liked movie
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

            const response = await databases.listDocuments(
                env.databaseId,
                env.collectionLikedId,
                [
                    Query.equal('userId', currentUser.$id),
                    Query.equal('movieId', movieId),
                    Query.equal('type', media_type),
                ]
            );

            if (response.documents.length === 0) {
                toast.info('Movie is not in your liked list.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }

            const movieDocId = response.documents[0].$id;
            await databases.deleteDocument(env.databaseId, env.collectionLikedId, movieDocId);

            setLikedMovies((prev) =>
                prev.filter((movie) => movie.movieId !== movieId || movie.type !== media_type)
            );

            toast.success('Movie removed from your liked list.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error removing liked movie:', error.message);
            toast.error('Failed to remove movie from liked list. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    // Fetch watched movies
    const fetchWatchedMovies = async () => {
        try {
            if (!currentUser) {
                console.warn('User is not logged in. Skipping watched movies fetch.');
                return;
            }

            const env = validateEnvironment();
            if (!env) return;

            setLoading(true);

            const response = await databases.listDocuments(
                env.databaseId,
                env.collectionWatchedId,
                [Query.equal('userId', currentUser.$id)]
            );

            const movies = response?.documents?.map((doc) => ({
                movieId: doc.movieId,
                type: doc.type,
                playedOn: doc.playedOn,
            })) || [];
            setWatchedMovies(movies);
        
        } catch (error) {
            console.error('Error fetching watched movies:', error.message);
            toast.error('Unable to load watched movies. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
            
        }
    };

    // Add watched movie
    const addWatchedMovie = async (movieId, media_type) => {
        try {
            if (!currentUser) {
                console.error('Cannot add watched movie: User is not logged in.');
                toast.error('You must be logged in to add watched movies.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }

            const env = validateEnvironment();
            if (!env) return;

            const currentDate = new Date();
            const formattedDate = formatDateForAppwrite(currentDate);

            await databases.createDocument(
                env.databaseId,
                env.collectionWatchedId,
                ID.unique(),
                {
                    userId: currentUser.$id,
                    movieId: movieId,
                    type: media_type,
                    playedOn: formattedDate,
                }
            );

            setWatchedMovies((prev) => [...prev, { movieId, type: media_type, playedOn: formattedDate }]);

            toast.success('Movie added to your watched list!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error adding watched movie:', error.message);
            toast.error('Failed to add movie to watched list. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    useEffect(() => {
        fetchLikedMovies();
        fetchWatchedMovies();
       
    }, [currentUser]);

    return (
        <LikedMoviesContext.Provider
            value={{ likedMovies, loading, addLikedMovie, removeLikedMovie, addWatchedMovie, watchedMovies }}
        >
            {children}
        </LikedMoviesContext.Provider>
    );
};

export const useLikedMoviesContext = () => {
    const context = useContext(LikedMoviesContext);
    if (!context) {
        throw new Error('useLikedMoviesContext must be used within a LikedMoviesProvider.');
    }
    return context;
};