import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { suggestFoods, GetCaloFoodService } from "../apis/foodAiService";

const initialState = {
  caloFood: 0,
  medicines: {},
};

export const suggestFoodsByAi = createAsyncThunk(
  "auth/suggestFoodsByAi",
  async ({ min, max, trend, stdDev, currentCalo }, thunkAPI) => {
    const response = await suggestFoods(min, max, trend, stdDev, currentCalo);
    return response;
  }
);

export const GetCaloFood = createAsyncThunk(
  "auth/GetCaloFood",
  async (userId, thunkAPI) => {
    const response = await GetCaloFoodService(userId);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setMedicine: (state, action) => {
      state.medicines = action.payload;
      localStorage.setItem("medicines", JSON.stringify(action.payload));
    },
    getMedicine: (state, action) => {
      state.medicines = JSON.parse(localStorage.getItem("medicines"));
    },
  },

  extraReducers: (builder) => {
    // suggestFoodsByAi
    builder
      .addCase(suggestFoodsByAi.pending, (state) => {})
      .addCase(suggestFoodsByAi.fulfilled, (state, action) => {})
      .addCase(suggestFoodsByAi.rejected, (state, action) => {});

    // GetCaloFood
    builder
      .addCase(GetCaloFood.pending, (state) => {})
      .addCase(GetCaloFood.fulfilled, (state, action) => {})
      .addCase(GetCaloFood.rejected, (state, action) => {});
  },
});

// Export actions
export const { setMedicine, getMedicine } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
