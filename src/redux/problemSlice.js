// src/store/problemSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  problems: [],
  selectedProblem: null,
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
    // Optionally add helper for clearing (not required, but handy sometimes)
    clearSelectedProblem(state) {
      state.selectedProblem = null;
    }
  },
});

export const {
  setProblems,
  setSelectedProblem,
  clearSelectedProblem
} = problemSlice.actions;

export default problemSlice.reducer;
