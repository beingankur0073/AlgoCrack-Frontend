import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

export const fetchProblems = createAsyncThunk(
  'problem/fetchProblems',
  async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const response = await axios.get(`/problems?page=${page}&limit=${limit}`);
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const initialState = {
  problems: [],
  totalProblems: 0,
  totalPages: 0,
  currentPage: 1,
  selectedProblem: null,
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    // Action to clear problems (useful when searching or unmounting)
    resetProblems(state) {
      state.problems = [];
      state.currentPage = 1;
    },
    setSelectedProblem(state, action) {
      state.selectedProblem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        
        // --- KEY CHANGE FOR INFINITE SCROLL ---
        if (action.payload.page === 1) {
          // If page is 1, replace the data (initial load or refresh)
          state.problems = action.payload.problems;
        } else {
          // If page > 1, APPEND the new problems to the existing list
          // We use a Set to prevent potential duplicates just in case
          const currentIds = new Set(state.problems.map(p => p._id));
          const newUniqueProblems = action.payload.problems.filter(p => !currentIds.has(p._id));
          state.problems = [...state.problems, ...newUniqueProblems];
        }

        state.totalProblems = action.payload.totalProblems;
        state.currentPage = action.payload.page;
        state.totalPages = Math.ceil(action.payload.totalProblems / action.payload.limit);
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch problems';
      });
  },
});

export const { setSelectedProblem, resetProblems } = problemSlice.actions;
export default problemSlice.reducer;