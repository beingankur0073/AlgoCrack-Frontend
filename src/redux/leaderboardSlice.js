import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Thunk to fetch data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/submissions/leaderboard');
      return res.data.data.leaderboard;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    leaders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaders = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default leaderboardSlice.reducer;
