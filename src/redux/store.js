import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import foodAiReducer from "./foodAiSlice";
import patientReducer from "./patientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    foodAi: foodAiReducer,
    patient: patientReducer
  },
});
