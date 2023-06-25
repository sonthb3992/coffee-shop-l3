import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Item } from '../models/Item';
import callAPI from '../utils/apiCaller';

interface ItemState {
  items: Item[];
}

const initialState: ItemState = {
  items: [],
};

export const createNewItem = createAsyncThunk(
  'item/createNewItem',
  async (newItem: Item) => {
    console.log(newItem)
    const response = await callAPI('/items', 'POST', newItem);
    return response.data as Item; // Type assertion to Item
  }
);

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    addNewItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNewItem.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  },
});

export const { addNewItem } = itemSlice.actions;

export const selectItems = (state: RootState) => state.item.items;

export default itemSlice.reducer;
