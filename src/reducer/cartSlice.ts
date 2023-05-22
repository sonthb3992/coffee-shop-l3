// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../domain/selected_item';
import { Order } from '../domain/order';

interface OrderState {
    orderItems: OrderItem[];
    editingItem: OrderItem | null,
    address: string
}

const initialState: OrderState = {
    orderItems: localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')!) : [],
    address: localStorage.getItem('address') ? JSON.parse(localStorage.getItem('address')!) : '',
    editingItem: localStorage.getItem('editingItem') ? JSON.parse(localStorage.getItem('editingItem')!) : null,
};


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // setOrderCount: (state) => {
        //     state.orderCount = state.items.length;
        //     localStorage.setItem('cart', JSON.stringify(state));
        // },
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
            localStorage.setItem('address', JSON.stringify(state.address));
        },
        // setPhoneNumber: (state, action: PayloadAction<string>) => {
        //     state.phoneNumber = action.payload;
        //     localStorage.setItem('cart', JSON.stringify(state));
        // },
        // setStatus: (state, action: PayloadAction<string>) => {
        //     state.status = action.payload;
        //     localStorage.setItem('cart', JSON.stringify(state));
        // },
        // setReceiver: (state, action: PayloadAction<string>) => {
        //     state.receiver = action.payload;
        //     localStorage.setItem('cart', JSON.stringify(state));
        // },
        addToCart: (state, action: PayloadAction<OrderItem>) => {
            state.orderItems.push(action.payload);
            localStorage.setItem('orders', JSON.stringify(state.orderItems));
        },
        deleteFromCart: (state, action: PayloadAction<string>) => {
            const index = state.orderItems.findIndex(order => order.id === action.payload);
            if (index !== -1) {
                state.orderItems.splice(index, 1);
                localStorage.setItem('orders', JSON.stringify(state.orderItems));
            }
        },
        // setEditingItem: (state, action: PayloadAction<OrderItem>) => {
        //     state.editingItem = action.payload;
        //     localStorage.setItem("editingItem", JSON.stringify(state.editingItem));
        // },
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
export const { addToCart, setAddress, deleteFromCart, setItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;