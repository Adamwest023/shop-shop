//import React Hook
import { useReducer } from "react";
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from './actions';

const initialState = {
    products: [],
    categories: [],
    currentCategory: '',
    cart: [],
    cartOpen: false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        //if action type value is the value of `UPDATES_PRODUCTS, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };
        //if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories],
            };
        //if action type value is the value of `UPDATE_CURRENT_CATEGORIES`, return a new state object with an updated current category string
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        //action value to add one to cart
        case ADD_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        //action value to add multiple to cart
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.products],
            };
        // action value to remove items
        case REMOVE_FROM_CART:
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });
            //check the array length to set cartOpen to false 
            return {
                ...state,
                cartOpen: newState.length > 0,
                cart: newState
            };

        //action value to update quantity by id 
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map(product => {
                    if (action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity;
                    }
                    return product;
                })
            };

        //action value to clear cart
        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };

        //action value to check carts visibility
        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            };

        //if it's none of these actions, do not update state at all and keep things the same!
        default:
            return state;
    }
};
//help initialize our global state object and then provide us with the functionality for updating that state by automatically running it through our custom reducer() function.
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}