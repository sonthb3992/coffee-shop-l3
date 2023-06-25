import { combineReducers } from '@reduxjs/toolkit';
import CartReducer from './cartSlice';
import menuItems from './menuItems';
import newItemSlice from './new-order-slice';
import userSlice from './user-slice';
import item from './item';

const rootReducer = combineReducers({
  cart: CartReducer,
  newItem: newItemSlice,
  user: userSlice,

  menuItems: menuItems,
  item: item,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
