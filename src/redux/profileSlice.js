import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Async thunk to fetch profile data
export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async ({ page = 1, limit = 5 } = {}, thunkAPI) => {
    try {
      const [userRes, submissionsRes] = await Promise.all([
        axios.get('/users/getuser'),
        axios.get(`/submissions/user-submissions?page=${page}&limit=${limit}`),
      ]);

      return {
        user: userRes.data.data,
        submissions: submissionsRes.data.data.submissions,
        pagination: submissionsRes.data.data.pagination,
        problemStats: submissionsRes.data.data.problemStats,
        activityData: submissionsRes.data.data.submissionMapActivity,
        page, // Return the requested page number to helper reducer logic
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
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalSubmissions: 0,
        limit: 5
    },
    problemStats: null,
    activityData: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateUser(state, action) {
        if (state.user) state.user = { ...state.user, ...action.payload };
        else state.user = action.payload;
    },
    // Action to clear submissions when unmounting or refreshing
    resetSubmissions(state) {
        state.submissions = [];
        state.pagination.currentPage = 1;
    }
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
        
        // --- INFINITE SCROLL LOGIC ---
        if (action.payload.page === 1) {
            // If it's the first page, replace the list
            state.submissions = action.payload.submissions;
        } else {
            // If it's a subsequent page, append new unique submissions
            const currentIds = new Set(state.submissions.map(s => s._id));
            const newUniqueSubmissions = action.payload.submissions.filter(s => !currentIds.has(s._id));
            state.submissions = [...state.submissions, ...newUniqueSubmissions];
        }

        state.pagination = action.payload.pagination;
        state.problemStats = action.payload.problemStats;
        state.activityData = action.payload.activityData;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load profile data';
      });
  },
});

export const { updateUser, resetSubmissions } = profileSlice.actions;
export default profileSlice.reducer;