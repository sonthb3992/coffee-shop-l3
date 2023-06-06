import { combineReducers } from '@reduxjs/toolkit';
import CartReducer from './cartSlice';
import menuOptionSlice from './menu-option-slice';
import newItemSlice from './new-order-slice';
import userSlice from './user-slice';

const rootReducer = combineReducers({
  cart: CartReducer,
  menuOptions: menuOptionSlice,
  newItem: newItemSlice,
  user: userSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
