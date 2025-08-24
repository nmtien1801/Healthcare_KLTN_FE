import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchBloodSugarService,
} from "../apis/patientService";

const initialState = {
    bloodSugar: []
};

export const fetchBloodSugar = createAsyncThunk(
    "auth/fetchBloodSugar",
    async ({ userId, type, days }, thunkAPI) => {
        const response = await fetchBloodSugarService(userId, type, days);
        return response;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        // fetchBloodSugar
        builder
            .addCase(fetchBloodSugar.pending, (state) => { })
            .addCase(fetchBloodSugar.fulfilled, (state, action) => {
                state.bloodSugar = action.payload;
            })
            .addCase(fetchBloodSugar.rejected, (state, action) => { });
    },
});

// Export actions
export const { } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
