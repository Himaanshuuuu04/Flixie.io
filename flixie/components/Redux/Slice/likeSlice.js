import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, ID, Query } from "../../Appwrite/Config";

const initialState = {
  likedMovies: [],
  watchedMovies: [],
  loading: false,
  error: null,
};

const getAppwriteIds = () => {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionLikedId =
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LIKED_ID;
  const collectionWatchedId =
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_WATCHED_ID;

  if (!databaseId || !collectionLikedId || !collectionWatchedId) {
    throw new Error("Missing Appwrite collection configuration");
  }

  return { databaseId, collectionLikedId, collectionWatchedId };
};

const getCurrentUser = (state) => state.auth.currentUser;
const getProfileCompleted = (state) => state.auth.profileCompleted;

const dedupeMovieRefs = (movies) => {
  const seen = new Set();

  return movies.filter((movie) => {
    const key = `${movie.movieId}-${movie.type}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const fetchLikedMovies = createAsyncThunk(
  "like/fetchLikedMovies",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      const profileCompleted = getProfileCompleted(getState());

      if (!currentUser || !profileCompleted) {
        return [];
      }

      const { databaseId, collectionLikedId } = getAppwriteIds();
      const response = await databases.listDocuments(
        databaseId,
        collectionLikedId,
        [Query.equal("userId", currentUser.$id)],
      );

      return dedupeMovieRefs(
        response?.documents?.map((doc) => ({
          movieId: doc.movieId,
          type: doc.type,
        })) || [],
      );
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load liked movies");
    }
  },
);

export const fetchWatchedMovies = createAsyncThunk(
  "like/fetchWatchedMovies",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      const profileCompleted = getProfileCompleted(getState());

      if (!currentUser || !profileCompleted) {
        return [];
      }

      const { databaseId, collectionWatchedId } = getAppwriteIds();
      const response = await databases.listDocuments(
        databaseId,
        collectionWatchedId,
        [Query.equal("userId", currentUser.$id)],
      );

      return dedupeMovieRefs(
        response?.documents?.map((doc) => ({
          movieId: doc.movieId,
          type: doc.type,
          playedOn: doc.playedOn,
        })) || [],
      );
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load watched movies");
    }
  },
);

export const addLikedMovie = createAsyncThunk(
  "like/addLikedMovie",
  async ({ movieId, media_type }, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const { databaseId, collectionLikedId } = getAppwriteIds();
      await databases.createDocument(
        databaseId,
        collectionLikedId,
        ID.unique(),
        {
          userId: currentUser.$id,
          movieId,
          type: media_type,
        },
      );

      return { movieId, type: media_type };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to like movie");
    }
  },
);

export const removeLikedMovie = createAsyncThunk(
  "like/removeLikedMovie",
  async ({ movieId, media_type }, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const { databaseId, collectionLikedId } = getAppwriteIds();
      const response = await databases.listDocuments(
        databaseId,
        collectionLikedId,
        [
          Query.equal("userId", currentUser.$id),
          Query.equal("movieId", movieId),
          Query.equal("type", media_type),
        ],
      );

      if (response.documents.length === 0) {
        return { movieId, type: media_type };
      }

      await databases.deleteDocument(
        databaseId,
        collectionLikedId,
        response.documents[0].$id,
      );

      return { movieId, type: media_type };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to remove liked movie");
    }
  },
);

export const addWatchedMovie = createAsyncThunk(
  "like/addWatchedMovie",
  async ({ movieId, media_type }, { getState, rejectWithValue }) => {
    try {
      const currentUser = getCurrentUser(getState());
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      const { databaseId, collectionWatchedId } = getAppwriteIds();
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}.${String(currentDate.getMilliseconds()).padStart(3, "0")}`;

      await databases.createDocument(
        databaseId,
        collectionWatchedId,
        ID.unique(),
        {
          userId: currentUser.$id,
          movieId,
          type: media_type,
          playedOn: formattedDate,
        },
      );

      return { movieId, type: media_type, playedOn: formattedDate };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to add watched movie");
    }
  },
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    clearLikeData: (state) => {
      state.likedMovies = [];
      state.watchedMovies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.likedMovies = action.payload;
      })
      .addCase(fetchLikedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchWatchedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.watchedMovies = action.payload;
      })
      .addCase(fetchWatchedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addLikedMovie.fulfilled, (state, action) => {
        if (
          !state.likedMovies.some(
            (movie) =>
              movie.movieId === action.payload.movieId &&
              movie.type === action.payload.type,
          )
        ) {
          state.likedMovies.push(action.payload);
        }
      })
      .addCase(removeLikedMovie.fulfilled, (state, action) => {
        state.likedMovies = state.likedMovies.filter(
          (movie) =>
            movie.movieId !== action.payload.movieId ||
            movie.type !== action.payload.type,
        );
      })
      .addCase(addWatchedMovie.fulfilled, (state, action) => {
        state.watchedMovies.push(action.payload);
      });
  },
});

export const { clearLikeData } = likeSlice.actions;
export default likeSlice.reducer;
