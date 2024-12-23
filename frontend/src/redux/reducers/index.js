import { combineReducers } from 'redux';
import cartReducer from '../cartSlice';
import authReducer from '../authSlice';
import modalReducer from '../modalSlice';

const rootReducer = combineReducers({
  modal: modalReducer,
  cart: cartReducer,
  auth: authReducer,
});

export default rootReducer;
