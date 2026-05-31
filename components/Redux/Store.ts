import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import genreReducer from "./Slice/genreSlice";
import likeReducer from "./Slice/likeSlice";
import friendReducer from "./Slice/friendSlice";
import searchReducer from "./Slice/searchSlice";
import aiSearchReducer from "./Slice/aiSearchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    genre: genreReducer,
    like: likeReducer,
    friend: friendReducer,
    search: searchReducer,
    aiSearch: aiSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
