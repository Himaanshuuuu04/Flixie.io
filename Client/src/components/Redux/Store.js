import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./Slice/searchSlice";
import aiSearchReducer from "./Slice/aiSearchSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    aiSearch: aiSearchReducer,
  },
});