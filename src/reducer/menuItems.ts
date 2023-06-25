import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { Item } from '../models/Item';
import { RootState } from './store';
import callAPI from '../utils/apiCaller';

interface MenuState {
  menuItems: Item[];
  loading: boolean;
  error: Error | null;
}

const initialState: MenuState = {
  menuItems: [],
  loading: false,
  error: null,
};

const menuItems = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    fetchMenuItemsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuItemsSuccess: (state, action: PayloadAction<Item[]>) => {
      state.loading = false;
      state.menuItems = action.payload;
    },
    fetchMenuItemsFailure: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMenuItemsRequest,
  fetchMenuItemsSuccess,
  fetchMenuItemsFailure,
} = menuItems.actions;

export const fetchMenuItems = (): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  Action<any>
> => {
  return async (dispatch) => {
    dispatch(fetchMenuItemsRequest());
    try {
      const response = await callAPI("items", "GET", null);
      const responseData = response.data as Item[]; // Type assertion
      dispatch(fetchMenuItemsSuccess(responseData));
    } catch (error: any) {
      dispatch(fetchMenuItemsFailure(error.message));
    }
  };
};

export default menuItems.reducer;
