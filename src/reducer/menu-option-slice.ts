import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { MenuOption } from '../domain/menu_option';
import { RootState } from './store';

interface MenuState {
  menuItems: MenuOption[];
  loading: boolean;
  error: Error | null;
}

const initialState: MenuState = {
  menuItems: [],
  loading: false,
  error: null,
};

const menuItemsSlice = createSlice({
  name: 'userSlices',
  initialState,
  reducers: {
    fetchMenuItemsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuItemsSuccess: (state, action: PayloadAction<MenuOption[]>) => {
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
} = menuItemsSlice.actions;

export const fetchMenuItems = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<any>
> => {
  return (dispatch) => {
    dispatch(fetchMenuItemsRequest());
    MenuOption.getAll()
      .then((data) => {
        dispatch(fetchMenuItemsSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchMenuItemsFailure(error));
      });
  };
};

export default menuItemsSlice.reducer;
