// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../domain/selected_item';
import { User } from 'firebase/auth';
import { auth } from '../domain/firebase';

interface OrderState {
  language: string;
  inputValid: boolean;
  orderItems: OrderItem[];
  editingItem: OrderItem | null;
  address: string;
  phone: string;
  customer_name: string;
  user: User | null;
}

const isInputValid = (
  address: string | null | undefined,
  phone: string | null | undefined,
  customer: string | null | undefined
): boolean => {
  if (address === null || address === undefined || address === '') return false;
  if (phone === null || phone === undefined || phone === '') return false;
  if (customer === null || customer === undefined || customer === '')
    return false;

  return true;
};

const getLocalStorageValue = (key: string, defaultValue: any) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const initialState: OrderState = {
  language: getLocalStorageValue('language', 'en'),
  orderItems: getLocalStorageValue('orders', []),
  address: getLocalStorageValue('address', ''),
  phone: getLocalStorageValue('phone', null) ?? auth.currentUser?.phoneNumber,
  customer_name:
    getLocalStorageValue('customer_name', null) ??
    auth.currentUser?.displayName,
  editingItem: localStorage.getItem('editingItem')
    ? JSON.parse(localStorage.getItem('editingItem')!)
    : null,
  inputValid: isInputValid(
    localStorage.getItem('address')
      ? JSON.parse(localStorage.getItem('address')!)
      : '',
    localStorage.getItem('phone')
      ? JSON.parse(localStorage.getItem('phone')!)
      : '',
    localStorage.getItem('customer_name')
      ? JSON.parse(localStorage.getItem('customer_name')!)
      : ''
  ),
  user: auth.currentUser,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        if (action.payload.displayName)
          setCustomerName(action.payload.displayName);
        if (action.payload.phoneNumber) setPhone(action.payload.phoneNumber);
      }
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.inputValid = isInputValid(
        action.payload,
        state.phone,
        state.customer_name
      );
      localStorage.setItem('address', JSON.stringify(state.address));
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', JSON.stringify(state.language));
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
      state.inputValid = isInputValid(
        action.payload,
        state.address,
        state.customer_name
      );
      localStorage.setItem('phone', JSON.stringify(state.phone));
    },
    setCustomerName: (state, action: PayloadAction<string>) => {
      state.customer_name = action.payload;
      state.inputValid = isInputValid(
        action.payload,
        state.phone,
        state.address
      );
      localStorage.setItem(
        'customer_name',
        JSON.stringify(state.customer_name)
      );
    },
    addItemToCart: (state, action: PayloadAction<OrderItem>) => {
      state.orderItems.push(action.payload);
      localStorage.setItem('orders', JSON.stringify(state.orderItems));
    },
    addItemsToCart: (state, action: PayloadAction<OrderItem[]>) => {
      state.orderItems.push(...action.payload);
      localStorage.setItem('orders', JSON.stringify(state.orderItems));
    },
    clearCart: (state) => {
      state.orderItems = [];
      localStorage.setItem('orders', JSON.stringify(state.orderItems));
    },
    deleteFromCart: (state, action: PayloadAction<string>) => {
      const index = state.orderItems.findIndex(
        (order) => order.id === action.payload
      );
      if (index !== -1) {
        state.orderItems.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(state.orderItems));
      }
    },
    setItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const index = state.orderItems.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orderItems[index].quantity = action.payload.quantity;
        localStorage.setItem('orders', JSON.stringify(state.orderItems));
      }
    },
  },
});

// export const { setOrderCount } = cartSlice.actions;
export const {
  addItemToCart,
  addItemsToCart,
  setAddress,
  setPhone,
  setCustomerName,
  deleteFromCart,
  setItemQuantity,
  clearCart,
  setLanguage,
  setUser,
} = cartSlice.actions;
export default cartSlice.reducer;
