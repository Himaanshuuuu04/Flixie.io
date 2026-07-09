import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  logged: false,
  profileCompleted: false, // You might need another API endpoint to fetch/set preferences, leaving this false initially or derived from user
  loading: true,
  currentUser: null,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/me", { method: "GET" });
      if (!res.ok) {
        throw new Error("Not authenticated");
      }
      const data = await res.json();
      if (!data.authenticated) {
        throw new Error("Not authenticated");
      }

      // If you still use Appwrite for preferences or other DB models, you might combine this with your custom user. 
      // For now, we use the custom user data from the API route.
      return {
        currentUser: {
          ...data.user,
          prefs: {}, // Assuming preferences will be migrated or added to User model later
        },
        profileCompleted: false, // Or derive from data.user
      };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to initialize auth");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        throw new Error("Failed to logout");
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to log out");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfileCompleted: (state, action) => {
      state.profileCompleted = Boolean(action.payload);
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          prefs: {
            ...(state.currentUser.prefs || {}),
            profileCompleted: Boolean(action.payload),
          },
        };
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.logged = true;
        state.profileCompleted = action.payload.profileCompleted;
        state.currentUser = action.payload.currentUser;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.logged = false;
        state.profileCompleted = false;
        state.currentUser = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logged = false;
        state.profileCompleted = false;
        state.currentUser = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setProfileCompleted, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
