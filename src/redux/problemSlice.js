import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/api';

// Optional: Async thunk to fetch problems list
export const fetchProblems = createAsyncThunk(
  'problem/fetchProblems',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/problems');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const initialState = {
  problems: [],
  selectedProblem: null,
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setProblems(state, action) {
      state.problems = action.payload;
    },
    setSelectedProblem(state, action) {
      state.selectedProblem = action.payload;
    },
    clearSelectedProblem(state) {
      state.selectedProblem = null;
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
        state.problems = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch problems';
      });
  },
});

export const { setProblems, setSelectedProblem, clearSelectedProblem } = problemSlice.actions;

export default problemSlice.reducer;
