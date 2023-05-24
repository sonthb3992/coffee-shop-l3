// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../domain/selected_item';
import { Order } from '../domain/order';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
    language: string;
    inputValid: boolean;
    orderItems: OrderItem[],
    editingItem: OrderItem | null,
    address: string,
    phone: string,
    customer_name: string
}

const isInputValid = (address: string | null | undefined, phone: string | null | undefined, customer: string | null | undefined): boolean => {
    if (address === null || address === undefined || address == '')
        return false;
    if (phone === null || phone === undefined || phone == '')
        return false;
    if (customer === null || customer === undefined || customer == '')
        return false;

    return true;
}

const initialState: OrderState = {
    language: localStorage.getItem('language') ? JSON.parse(localStorage.getItem('language')!) : 'en',
    orderItems: localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')!) : [],
    address: localStorage.getItem('address') ? JSON.parse(localStorage.getItem('address')!) : '',
    phone: localStorage.getItem('phone') ? JSON.parse(localStorage.getItem('phone')!) : '',
    customer_name: localStorage.getItem('customer_name') ? JSON.parse(localStorage.getItem('customer_name')!) : '',
    editingItem: localStorage.getItem('editingItem') ? JSON.parse(localStorage.getItem('editingItem')!) : null,
    inputValid: isInputValid(
        localStorage.getItem('address') ? JSON.parse(localStorage.getItem('address')!) : '',
        localStorage.getItem('phone') ? JSON.parse(localStorage.getItem('phone')!) : '',
        localStorage.getItem('customer_name') ? JSON.parse(localStorage.getItem('customer_name')!) : '',
    ),
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

// export const { setOrderCount } = cartSlice.actions;
export const { addToCart, setAddress, setPhone, setCustomerName, deleteFromCart, setItemQuantity, clearCart, setLanguage } = cartSlice.actions;
export default cartSlice.reducer;