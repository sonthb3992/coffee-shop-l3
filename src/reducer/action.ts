import { ADD_TO_CART } from './actionTypes';

export const addToCart = (order: any) => ({
  type: ADD_TO_CART,
  payload: order,
});
