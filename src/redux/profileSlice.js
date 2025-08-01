import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Async thunk to fetch user profile details & submissions
export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, thunkAPI) => {
    try {
      const [userRes, submissionsRes] = await Promise.all([
        axios.get('/users/getuser'),
        axios.get('/submissions/user-submissions'),
      ]);

      return {
        user: userRes.data.data,
        submissions: submissionsRes.data.data.submissions,
        problemStats: submissionsRes.data.data.problemStats,
        activityData: submissionsRes.data.data.submissionMapActivity,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to fetch profile data');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    submissions: [],
    problemStats: null,
    activityData: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.submissions = action.payload.submissions;
        state.problemStats = action.payload.problemStats;
        state.activityData = action.payload.activityData;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load profile data';
      });
  },
});

export const { updateUser } = profileSlice.actions;
export default profileSlice.reducer;
