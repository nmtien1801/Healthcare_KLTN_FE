import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginService,
  registerService,
  sendCodeService,
  resetPasswordService,
  changePasswordService,
  changePasswordFirebaseService,
  verifyEmailService,
} from "../apis/authService";

const initialState = {
  userInfo: {},
  isLoggedIn: false, // Kiểm tra xem người dùng đã đăng nhập chưa
  isLoading: false, // Trạng thái loading
};

export const Login = createAsyncThunk(
  "auth/Login",
  async ({ user }, thunkAPI) => {
    const response = await loginService(user);
    return response;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    const response = await registerService(formData);
    return response;
  }
);

export const sendCode = createAsyncThunk(
  "auth/sendCode",
  async (email, thunkAPI) => {
    const response = await sendCodeService(email);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, code, password }, thunkAPI) => {
    const response = await resetPasswordService(email, code, password);
    return response;
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ email, currentPassword, newPassword }, thunkAPI) => {
    // Gọi cả BE và Firebase
    const beResponse = await changePasswordService(
      email,
      currentPassword,
      newPassword
    );

    // Nếu BE thành công, cập nhật Firebase
    if (beResponse.EC === 0) {
      const firebaseResponse = await changePasswordFirebaseService(
        email,
        currentPassword,
        newPassword
      );
      return firebaseResponse;
    }

    return beResponse;
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (email, thunkAPI) => {
    const response = await verifyEmailService(email);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.userInfo = null; // Xóa thông tin người dùng
      state.isLoggedIn = false; // Đặt trạng thái đăng xuất
    },
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true; // Bắt đầu loading
      })
      .addCase(Login.fulfilled, (state, action) => {
        if (action.payload.EC === 0) {
          state.userInfo = action.payload.DT || {};

          state.isLoggedIn = true;
          state.isLoading = false; // Kết thúc loading
        }
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isLoading = false; // Kết thúc loading
      });

    // Register
    builder
      .addCase(register.pending, (state) => {})
      .addCase(register.fulfilled, (state, action) => {})
      .addCase(register.rejected, (state, action) => {});

    // sendCode
    builder
      .addCase(sendCode.pending, (state) => {})
      .addCase(sendCode.fulfilled, (state, action) => {})
      .addCase(sendCode.rejected, (state, action) => {});

    // resetPassword
    builder
      .addCase(resetPassword.pending, (state) => {})
      .addCase(resetPassword.fulfilled, (state, action) => {})
      .addCase(resetPassword.rejected, (state, action) => {});

    // changePassword
    builder
      .addCase(changePassword.pending, (state) => {})
      .addCase(changePassword.fulfilled, (state, action) => {})
      .addCase(changePassword.rejected, (state, action) => {});

    //verifyEmail
    builder
      .addCase(verifyEmail.pending, (state) => {})
      .addCase(verifyEmail.fulfilled, (state, action) => {})
      .addCase(verifyEmail.rejected, (state, action) => {});
  },
});

// Export actions
export const { setUser, clearUser, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
