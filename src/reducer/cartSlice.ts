// cartSlice.ts
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { calculatePrice, OrderItem } from '../domain/selected_item';
import { User } from 'firebase/auth';
import { auth } from '../domain/firebase';
import { RootState } from './root-reducer';
import { Order } from '../domain/order';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { or } from 'firebase/firestore';

interface OrderState {
  language: string;
  inputValid: boolean;
  orderItems: OrderItem[];
  address: string;
  phone: string;
  customer_name: string;
  user: User | null;
  userRole: string;
  table: string | null;
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
  userRole: '',
  table: localStorage.getItem('table')
    ? JSON.parse(localStorage.getItem('table')!)
    : '',
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
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
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
    setTable: (state, action: PayloadAction<string>) => {
      state.table = action.payload;
      localStorage.setItem('table', JSON.stringify(action.payload));

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


const calculateSubTotal = (items: OrderItem[]) => {
  var total = 0;
  items.forEach((i) => (total += calculatePrice(i)));
  return total;
};

const calculateTax = (subtotal: number) => {
  return subtotal * 0.075;
};

const calculateTotal = (items: OrderItem[]) => {
  var total = calculateSubTotal(items);
  total += calculateTax(total);
  return total;
};


export const placeOrder = (): ThunkAction<
  Promise<false | string>,
  RootState,
  unknown,
  Action<any>
> => {
  return async (dispatch, getState) => {

    const address = getState().cart.address;
    const phone = getState().cart.phone;
    const items = getState().cart.orderItems;
    const customerName = getState().cart.customer_name;
    const inputValid = getState().cart.inputValid;
    const user = getState().cart.user;
    const table = getState().cart.table ?? '';

    var order = new Order();
    order.address = address;
    order.receiver = customerName;
    order.phoneNumber = phone;
    order.items = items;
    order.tableId = table;
    order.status = 0;
    order.price = calculateTotal(items);
    order.id = uuidv4().toLowerCase();
    order.placeTime = new Date(Date.now());
    order.itemcount = 0;
    order.items.forEach((i) => (order.itemcount += i.quantity!));
    order.useruid = user !== null ? user.uid : '';

    var s = await Order.pushToFirebase(order);
    if (s === 'success') {
      dispatch(clearCart());
      return order.id;
    } else {
      alert(s);
      return false;
    }
  };
};


// export const { setOrderCount } = cartSlice.actions;
export const {
  addItemToCart,
  addItemsToCart,
  setAddress,
  setPhone,
  setTable,
  setCustomerName,
  deleteFromCart,
  setItemQuantity,
  clearCart,
  setLanguage,
  setUser,
  setUserRole,
} = cartSlice.actions;
export default cartSlice.reducer;
