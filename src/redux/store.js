import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import problemReducer from './problemSlice'; 
import profileReducer from './profileSlice';


const store= configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer, 
    profile: profileReducer,
  }
});

export default store;
