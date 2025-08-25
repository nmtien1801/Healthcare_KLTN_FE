import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  suggestFoods,
  GetCaloFoodService,
  updateMenuFoodService,
  getMenuFoodService
} from "../apis/foodAiService";

const initialState = {
  caloFood: 0,
  medicines: {},
  menuFood: {}
};

export const suggestFoodsByAi = createAsyncThunk(
  "auth/suggestFoodsByAi",
  async ({ min, max, mean, currentCalo, menuFoodId }, thunkAPI) => {
    const response = await suggestFoods(min, max, mean, currentCalo, menuFoodId);
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

export const updateMenuFood = createAsyncThunk(
  "auth/updateMenuFood",
  async ({ menuFoodId, userId }, thunkAPI) => {
    const response = await updateMenuFoodService(menuFoodId, userId);
    return response;
  }
);

export const getMenuFood = createAsyncThunk(
  "auth/getMenuFood",
  async (thunkAPI) => {
    const response = await getMenuFoodService();
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
      .addCase(suggestFoodsByAi.pending, (state) => { })
      .addCase(suggestFoodsByAi.fulfilled, (state, action) => { })
      .addCase(suggestFoodsByAi.rejected, (state, action) => { });

    // GetCaloFood
    builder
      .addCase(GetCaloFood.pending, (state) => { })
      .addCase(GetCaloFood.fulfilled, (state, action) => { })
      .addCase(GetCaloFood.rejected, (state, action) => { });

    // updateMenuFood
    builder
      .addCase(updateMenuFood.pending, (state) => { })
      .addCase(updateMenuFood.fulfilled, (state, action) => {
        state.menuFood = action.payload.DT.menuFood
      })
      .addCase(updateMenuFood.rejected, (state, action) => { });

    // getMenuFood
    builder
      .addCase(getMenuFood.pending, (state) => { })
      .addCase(getMenuFood.fulfilled, (state, action) => { })
      .addCase(getMenuFood.rejected, (state, action) => { });
  },
});

// Export actions
export const { setMedicine, getMedicine } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
