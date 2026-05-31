import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdbFetchJson } from "../../../lib/tmdb";

// Initial state
const initialState = {
  movies: [],
  homePageMovies: [],
  loading: false,
  searchTerm: "",
  searchActive: false,
  movieDetails: null,
  trailerUrl: "",
  carouselMovies: [],
  topRatedMovies: [],
  hasMore: true,
  page: 1,
  error: null,
};

const dedupeMovies = (movies) => {
  const seen = new Set();

  return movies.filter((movie) => {
    const key = `${movie.id}-${movie.media_type || movie.type || "movie"}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

// Async thunk for fetching search results
export const fetchSearchMovies = createAsyncThunk(
  "search/fetchSearchMovies", // Action type for fetching search results
  async (term, { rejectWithValue }) => {
    try {
      if (!term.trim()) return [];
      const data = await tmdbFetchJson("/search/multi", {
        query: term,
        include_adult: false,
        language: "en-US",
        page: 1,
        sort_by: "popularity.desc",
      });
      return data.results || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
      return rejectWithValue("Failed to fetch movies");
    }
  },
);

// Async thunk for fetching movie details
export const fetchMovieDetails = createAsyncThunk(
  "search/fetchMovieDetails",
  async ({ id, mediaType }, { rejectWithValue }) => {
    try {
      const data = await tmdbFetchJson(`/${mediaType}/${id}`, {
        append_to_response: "videos,credits,reviews",
      });
      console.log("Movie details:", data);

      // Extract trailer URL
      const trailers = data.videos.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube",
      );
      const trailerUrl =
        trailers.length > 0
          ? `https://www.youtube.com/embed/${trailers[0].key}?autoplay=1&mute=1`
          : "";

      return { movieDetails: data, trailerUrl };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return rejectWithValue("Failed to fetch movie details");
    }
  },
);

export const fetchMoviesPoster = createAsyncThunk(
  "search/fetchMoviesPoster",
  async ({ movies }, { rejectWithValue }) => {
    if (!movies || movies.length === 0) {
      return [];
    }

    try {
      const uniqueMovies = [];
      const seen = new Set();

      movies.forEach((movie) => {
        const key = `${movie.movieId}-${movie.type}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueMovies.push(movie);
        }
      });

      const moviePromises = uniqueMovies.map(async ({ movieId, type }) => {
        return tmdbFetchJson(`/${type}/${movieId}`);
      });

      const fetchedMovies = await Promise.all(moviePromises);

      const validMovies = fetchedMovies.filter((movie) => movie && movie.id);

      return validMovies;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return rejectWithValue("Failed to fetch movies");
    }
  },
);

export const CarouselFetchMovies = createAsyncThunk(
  "search/fetchCarousel",
  async (_, { rejectWithValue }) => {
    try {
      const data = await tmdbFetchJson("/trending/all/day", {
        language: "en-US",
      });

      if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn("No movies found or data format is incorrect.");
        return rejectWithValue("Failed to fetch carousel movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      return rejectWithValue("Failed to fetch carousel movies");
    }
  },
);

export const fetchTopRatedMovies = createAsyncThunk(
  "search/fetchTopRatedMovies",
  async ({ userOptions = {}, page = 1 }, { rejectWithValue }) => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      return `${year}-${month}-${day}`;
    };

    const getDefaultOptions = () => ({
      include_adult: false,
      include_video: false,
      language: "en-US",
      sort_by: "vote_average.desc",
      vote_count: "5000",
      primary_release_date: {
        gte: "2010-01-01",
        lte: formatDate(new Date()),
      },
      with_genres: "",
    });

    const mergeOptions = (defaultOptions, userOptions) => ({
      ...defaultOptions,
      ...userOptions,
      primary_release_date: {
        ...defaultOptions.primary_release_date,
        ...userOptions.primary_release_date,
      },
    });

    const defaultOptions = getDefaultOptions();
    const options = mergeOptions(defaultOptions, userOptions);

    console.log("Fetching top rated movies with options:", options);

    try {
      const data = await tmdbFetchJson("/discover/movie", {
        ...options,
        page,
        "vote_count.gte": options.vote_count,
        "primary_release_date.gte": options.primary_release_date.gte,
        "primary_release_date.lte": options.primary_release_date.lte,
        with_genres: options.with_genres,
      });

      console.log("Received data:", data);

      if (data.results && Array.isArray(data.results)) {
        const hasMorePages = page < (data.total_pages || 0);
        return { topRatedMovies: data.results, hasMorePages };
      } else {
        // No results returned, stop fetching
        return rejectWithValue("Failed to fetch top rated movies");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return rejectWithValue("Failed to fetch top rated movies");
    }
  },
);

export const fetchHomePageMovies = createAsyncThunk(
  "search/fetchHomePageMovies",
  async (page, { rejectWithValue }) => {
    try {
      const data = await tmdbFetchJson("/movie/now_playing", {
        language: "en-US",
        page,
      });
      if (data && data.results) {
        return {
          homePageMovies: data.results,
          hasMore: data.page < data.total_pages,
        };
      } else {
        return rejectWithValue("Failed to fetch home page movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      return rejectWithValue("Failed to fetch home page movies");
    }
  },
);

// Slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, { payload: searchTerm }) => {
      state.searchTerm = searchTerm;
    },
    setSearchActive: (state, { payload: searchActive }) => {
      state.searchActive = searchActive;
    },
    setHasMore: (state, { payload: hasMore }) => {
      state.hasMore = hasMore;
    },
    setPage: (state, { payload: page }) => {
      state.page = page;
    },
    resetSearchState: (state) => {
      state.movies = [];
      state.homePageMovies = [];
      state.loading = false;
      state.searchTerm = "";
      state.searchActive = false;
      state.movieDetails = null;
      state.trailerUrl = "";
      state.carouselMovies = [];
      state.topRatedMovies = [];
      state.hasMore = true;
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchSearchMovies.pending, (state) => {
        state.loading = true;
        state.movies = [];
      })
      .addCase(fetchSearchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = dedupeMovies(action.payload);
      })
      .addCase(fetchSearchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch movie details
      .addCase(fetchMoviesPoster.pending, (state) => {
        state.loading = true;
        state.movies = [];
      })
      .addCase(fetchMoviesPoster.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = dedupeMovies(action.payload);
      })
      .addCase(fetchMoviesPoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload.movieDetails;
        state.trailerUrl = action.payload.trailerUrl;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch movies
      .addCase(CarouselFetchMovies.pending, (state) => {
        state.loading = true;
        state.carouselMovies = [];
      })
      .addCase(CarouselFetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.carouselMovies = dedupeMovies(action.payload);
      })
      .addCase(CarouselFetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.loading = true;
        state.topRatedMovies = [];
        state.hasMore = true;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.topRatedMovies = dedupeMovies(action.payload.topRatedMovies);
        state.hasMore = action.payload.hasMorePages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        state.error = action.payload;
      })
      .addCase(fetchHomePageMovies.pending, (state) => {
        state.loading = true;
        // state.movies = [];
      })
      .addCase(fetchHomePageMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.homePageMovies = dedupeMovies([
          ...state.homePageMovies,
          ...action.payload.homePageMovies,
        ]);
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomePageMovies.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  setSearchTerm,
  setSearchActive,
  setHasMore,
  setPage,
  resetSearchState,
} = searchSlice.actions;
export default searchSlice.reducer;
