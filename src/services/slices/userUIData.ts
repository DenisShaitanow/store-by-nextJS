import { createSlice, type Action, type PayloadAction } from '@reduxjs/toolkit';
import { type IProduct } from '../../types';
import {
  
  doOrder,
  changeBasket,
  getBasket,
  resetBasket,
} from '../thunks/userUIData/userUIData-thunks';
import { act } from 'react';
import { type IServerUser } from '../../../my-server/server';

interface IUserState {
  loadingProducts: boolean;
  favoriteItems: IProduct[];
  notifications: { id: string; text: string }[];
  basket: Array<{ item: IProduct; count: number }>;
  error: string;
  orders: string[];
  errorOrder: string;
  loadingOrder: boolean;
}

export const initialState: IUserState = {
  loadingProducts: false,
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
    addAndDeleteToFavoriteItems: (state: IUserState, action: PayloadAction<IProduct[]>) => {
      state.favoriteItems = action.payload
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
  addAndDeleteToFavoriteItems,
  setUserSlice2
} = userUIDataSlice.actions;

export const userUIDataReducer = userUIDataSlice.reducer;
