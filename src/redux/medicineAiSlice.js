import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrendMedicine } from "../apis/medicineAiService";

const initialState = {
  trendMedicine: null,
  loading: false,
  error: null
};

export const fetchTrendMedicine = createAsyncThunk(
  "medicineAi/fetchTrendMedicine",
  async ({ age, gender, BMI, HbA1c, bloodSugar }, thunkAPI) => {
    try {
      const response = await getTrendMedicine({ age, gender, BMI, HbA1c, bloodSugar });
      return response.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.result || error.message);
    }
  }
);

const medicineAiSlice = createSlice({
  name: "medicineAi",
  initialState,

  reducers: {
    clearTrendMedicine: (state) => {
      state.trendMedicine = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.trendMedicine = action.payload;
        state.error = null;
      })
      .addCase(fetchTrendMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch trend medicine";
      });
  },
});

// Export actions
export const { clearTrendMedicine, clearError } = medicineAiSlice.actions;

// Export selectors
export const selectTrendMedicine = (state) => state.medicineAi.trendMedicine;
export const selectMedicineLoading = (state) => state.medicineAi.loading;
export const selectMedicineError = (state) => state.medicineAi.error;

// Export reducer
export default medicineAiSlice.reducer;
