import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

const getInitialAuth = () => {
  try {
    const userRaw = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!userRaw || !accessToken || !refreshToken || userRaw === "undefined") return null;
    const user = JSON.parse(userRaw);
    return { user, accessToken, refreshToken };
  } catch {
    localStorage.clear();
    return null;
  }
};

// Async thunk for registration (you can do similarly for login if desired)
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/user/register", formData);
      const { user, accessToken, refreshToken } = res.data.data;
      dispatch(login({ user, accessToken, refreshToken }));
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Registration failed. Try again.",
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { auth: getInitialAuth() },
  reducers: {
    login: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      state.auth = { user, accessToken, refreshToken };
    },
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.auth = null;
    },
    updateUser: (state, action) => {
      if (state.auth && state.auth.user) {
        state.auth.user = { ...state.auth.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.auth.user));
      }
    }
  },
  // Optionally: handle async thunks here...
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.rejected, (state, action) => {
        // You can handle failed registration here if you want (show error state, etc.)
      });
  }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
