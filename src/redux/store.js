import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import foodAiReducer from "./foodAiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    foodAi: foodAiReducer
  },
});
