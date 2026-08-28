import { createSlice, type Action, type PayloadAction } from '@reduxjs/toolkit';
import { type IProduct } from '../../types';
import {
  getProducts,
  doOrder,
  changeBasket,
  getBasket,
  resetBasket,
} from '../thunks/userUIData/userUIData-thunks';
import { act } from 'react';
import { type IServerUser } from '../../../my-server/server';

interface IUserState {
  loadingProducts: boolean;
  products: IProduct[];
  favoriteItems: string[];
  notifications: { id: string; text: string }[];
  basket: Array<{ item: IProduct; count: number }>;
  error: string;
  orders: string[];
  errorOrder: string;
  loadingOrder: boolean;
}

export const initialState: IUserState = {
  loadingProducts: false,
  products: [],
  favoriteItems: [],
  notifications: [],
  basket: [],
  error: '',
  orders: [],
  errorOrder: '',
  loadingOrder: false,
};

const userUIDataSlice = createSlice({
  name: 'userUIData',
  initialState,
  reducers: {
    resetFavoriteItems: (state: IUserState) => {
      state.favoriteItems = [];
    },
    resetNotifications: (state: IUserState) => {
      state.notifications = [];
    },
    resetBusket: (state: IUserState) => {
      state.basket = [];
    },
    setUserSlice2: (state: IUserState, action: PayloadAction<IServerUser | null>) => {
      if (action.payload) {
        state.favoriteItems = action.payload.favoriteItems;
        state.notifications = action.payload.notifications;
        state.basket = action.payload.basket;
      } else {
        return 
      }
      
    },
    addAndDeleteToFavoriteItems: (state: IUserState, action: PayloadAction<string>) => {
      const productId = action.payload;
      const indexOfProduct = state.products.findIndex((product) => product.id === productId);

      if (indexOfProduct >= 0) {
        state.products[indexOfProduct].isLiked = !state.products[indexOfProduct].isLiked;

        if (state.favoriteItems.includes(productId)) {
          state.favoriteItems = state.favoriteItems.filter((id) => id !== productId);
        } else {
          state.favoriteItems.push(productId);
        }
      }
    },

    removeFromFavoriteItems: (state: IUserState, action: PayloadAction<string>) => {
      state.favoriteItems = state.favoriteItems.filter((item) => item !== action.payload);
      localStorage.setItem(
        'products',
        JSON.stringify(state.favoriteItems.filter((item) => item !== action.payload))
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getBasket.fulfilled,
        (state, action: PayloadAction<{ item: IProduct; count: number }[]>) => {
          state.basket = action.payload;
        }
      )
      .addCase(getBasket.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        resetBasket.fulfilled,
        (state, action: PayloadAction<Array<{ item: IProduct; count: number }>>) => {
          state.basket = action.payload;
          console.log(state.basket);
        }
      )
      .addCase(
        changeBasket.fulfilled,
        (state, action: PayloadAction<Array<{ item: IProduct; count: number }>>) => {
          state.basket = action.payload;
        }
      )
      .addCase(changeBasket.rejected, (state: IUserState, action) => {
        state.error = action.payload as string;
      })
      /*.addCase(getProducts.pending, (state) => {
        state.loadingProducts = true;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.products = action.payload;
        state.loadingProducts = false;
      })
      .addCase(getProducts.rejected, (state: IUserState, action) => {
        state.error = action.payload as string;
      })*/
      .addCase(doOrder.pending, (state: IUserState) => {
        state.loadingOrder = true;
      })
      .addCase(doOrder.fulfilled, (state: IUserState, action: PayloadAction<string>) => {
        state.orders = [...state.orders, action.payload];
        state.loadingProducts = false;
        state.basket = [];
      })
      .addCase(doOrder.rejected, (state: IUserState, action) => {
        state.errorOrder = action.payload as string;
      });
  },
});

export const {
  resetFavoriteItems,
  resetNotifications,
  resetBusket,
  removeFromFavoriteItems,
  addAndDeleteToFavoriteItems,
  setUserSlice2
} = userUIDataSlice.actions;

export const userUIDataReducer = userUIDataSlice.reducer;
