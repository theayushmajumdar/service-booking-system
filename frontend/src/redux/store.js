import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Import rootReducer

const store = configureStore({
  reducer: rootReducer, // Use the combined reducers
});

export default store;
