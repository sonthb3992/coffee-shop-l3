// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../domain/selected_item';

interface OrderState {
    language: string;
    inputValid: boolean;
    orderItems: OrderItem[],
    editingItem: OrderItem | null,
    address: string,
    phone: string,
    customer_name: string
}

const getLocalStorageValue = (key: string, defaultValue: any) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };
  
const initialState: OrderState = {
    language: getLocalStorageValue('language', 'en'),
    orderItems: getLocalStorageValue('orders', []),
    address: getLocalStorageValue('address', ''),
    phone: getLocalStorageValue('phone', ''),
    customer_name: getLocalStorageValue('customer_name', ''),
    editingItem: getLocalStorageValue('editingItem', null),
    inputValid: false,
};

const isInputValid = (address: string, phone: string, customer: string): boolean => {
return address !== '' && phone !== '' && customer !== '';
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
            state.inputValid = isInputValid(action.payload, state.phone, state.customer_name);
            localStorage.setItem('address', JSON.stringify(state.address));
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
            localStorage.setItem('language', JSON.stringify(state.language));
        },
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
            state.inputValid = isInputValid(action.payload, state.address, state.customer_name);
            localStorage.setItem('phone', JSON.stringify(state.phone));
        },
        setCustomerName: (state, action: PayloadAction<string>) => {
            state.customer_name = action.payload;
            state.inputValid = isInputValid(action.payload, state.phone, state.address);
            localStorage.setItem('customer_name', JSON.stringify(state.customer_name));
        },
        addToCart: (state, action: PayloadAction<OrderItem>) => {
            state.orderItems.push(action.payload);
            localStorage.setItem('orders', JSON.stringify(state.orderItems));
        },
        clearCart: (state) => {
            state.orderItems = [];
            localStorage.setItem('orders', JSON.stringify(state.orderItems));
        },
        deleteFromCart: (state, action: PayloadAction<string>) => {
            const index = state.orderItems.findIndex(order => order.id === action.payload);
            if (index !== -1) {
                state.orderItems.splice(index, 1);
                localStorage.setItem('orders', JSON.stringify(state.orderItems));
            }
        },
        setItemQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const index = state.orderItems.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.orderItems[index].quantity = action.payload.quantity;
                localStorage.setItem('orders', JSON.stringify(state.orderItems));
            }
        },

    },
});

export const { addToCart, setAddress, setPhone, setCustomerName, deleteFromCart, setItemQuantity, clearCart, setLanguage } = cartSlice.actions;
export default cartSlice.reducer;