import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { account } from "../../Appwrite/Config";

const initialState = {
  logged: false,
  profileCompleted: false,
  loading: true,
  currentUser: null,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      await account.getSession("current");
      const currentUser = await account.get();
      const prefs = await account.getPrefs();

      return {
        currentUser: {
          ...currentUser,
          prefs: {
            ...(currentUser.prefs || {}),
            ...(prefs || {}),
          },
        },
        profileCompleted: prefs?.profileCompleted === true,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to initialize auth");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession("current");
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to log out");
    }
  },
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
