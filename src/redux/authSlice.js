import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Get initial user info from localStorage (no tokens stored here)
const getInitialAuth = () => {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw || userRaw === "undefined") return null;
    return { user: JSON.parse(userRaw) };
  } catch {
    localStorage.clear();
    return null;
  }
};

// Async thunk examples remain similar but do not store tokens in state/localStorage explicitly
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/users/register", formData);
      const { user } = res.data.data;  // tokens managed by cookies, not returned/stored
      dispatch(login({ user }));
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Registration failed. Try again.",
      });
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/users/login", { username, password });
      const { user } = res.data.data;  // tokens handled automatically by cookies
      dispatch(login({ user }));
      return { success: true };
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Login failed. Please check your credentials.",
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { auth: getInitialAuth() },
  reducers: {
    login: (state, action) => {
      const { user } = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      state.auth = { user };
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.auth = null;
      // Tokens and cookies handled by backend, no localStorage cleanup needed beyond user
    },
    updateUser: (state, action) => {
      if (state.auth && state.auth.user) {
        state.auth.user = { ...state.auth.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.auth.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.rejected, (state, action) => {
        // Optionally handle errors
      })
      .addCase(loginThunk.rejected, (state, action) => {
        // Optionally handle errors
      });
  }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
