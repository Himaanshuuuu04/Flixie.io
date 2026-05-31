import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbFetchJson } from "../../../lib/tmdb";

const initialState = {
  moviesByGenre: [],
  loading: false,
  error: null,
};

export const fetchMoviesByGenre = createAsyncThunk(
  "genre/fetchMoviesByGenre",
  async (genreId, { rejectWithValue }) => {
    try {
      const data = await tmdbFetchJson("/discover/movie", {
        with_genres: genreId,
        include_adult: false,
        language: "en-US",
        page: 1,
      });

      return data.results || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch genre movies");
    }
  },
);

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    clearMoviesByGenre: (state) => {
      state.moviesByGenre = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesByGenre = action.payload;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearMoviesByGenre } = genreSlice.actions;
export default genreSlice.reducer;
