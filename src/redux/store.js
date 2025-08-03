import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import problemReducer from './problemSlice'; 
import profileReducer from './profileSlice';
import leaderboardReducer from './leaderboardSlice';


const store= configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer, 
    profile: profileReducer,
    leaderboard: leaderboardReducer,
  }
});

export default store;
