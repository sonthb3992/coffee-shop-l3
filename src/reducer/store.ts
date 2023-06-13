import thunk from 'redux-thunk'; // Import Redux Thunk middleware
import cartReducer from './cartSlice'; // Import your cart reducer
import { configureStore } from '@reduxjs/toolkit';
import menuOptionSlice from './menu-option-slice';
import rootReducer from './root-reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable actions
    }),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
