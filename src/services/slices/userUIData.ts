import { createSlice, type Action, type PayloadAction } from "@reduxjs/toolkit";
import { type TAppDispatch, type TRootState } from "../store/index";
import { type IProduct } from "../../types";
import { getProducts, doOrder, changeBasket } from "../thunks/userUIData/userUIData-thunks";
import { act } from "react";

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
  error: "",
  orders: [],
  errorOrder: "",
  loadingOrder: false,
};

const userUIDataSlice = createSlice({
  name: "userUIData",
  initialState,
  reducers: {
    resetFavoriteItems: (state: TRootState) => {
      state.favoriteItems = [];
    },
    resetNotifications: (state: TRootState) => {
      state.notifications = [];
    },
    resetBusket: (state: TRootState) => {
      state.basket = [];
    },
    addAndDeleteToFavoriteItems: (state: TRootState, action: PayloadAction<string>) => {
      const productId = action.payload;
      const indexOfProduct = state.products.findIndex(
        (product) => product.id === productId,
      );

      if (indexOfProduct >= 0) {
        state.products[indexOfProduct].isLiked =
          !state.products[indexOfProduct].isLiked;

        if (state.favoriteItems.includes(productId)) {
          state.favoriteItems = state.favoriteItems.filter(
            (id) => id !== productId,
          );
        } else {
          state.favoriteItems.push(productId);
        }
      }
    },
    

    removeFromFavoriteItems: (state: TRootState, action: PayloadAction<string>) => {
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item !== action.payload,
      );
      localStorage.setItem(
        "products",
        JSON.stringify(
          state.favoriteItems.filter((item) => item !== action.payload),
        ),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeBasket.fulfilled, (state, action: PayloadAction<{success: boolean, operation: string, product: IProduct}>) => {
        if (action.payload.operation === 'add') {
          state.basket = [...state.basket, {item: action.payload.product, count: 1} ]
        } else if (action.payload.operation === 'remove') {
          state.basket = state.basket.filter(item => item.item.id !== action.payload.product.id)
        }
      })
      .addCase(changeBasket.rejected, (state: TRootState, action) => {
        state.error = action.payload as string;
      })
      .addCase(getProducts.pending, (state) => {
        state.loadingProducts = true;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.products = action.payload;
          state.loadingProducts = false;
        },
      )
      .addCase(getProducts.rejected, (state: TRootState, action) => {
        state.error = action.payload as string;
      })
      .addCase(doOrder.pending, (state: TRootState) => {
        state.loadingOrder = true;
      })
      .addCase(doOrder.fulfilled, (state: TRootState, action: PayloadAction<string>) => {
        state.orders = [...state.orders, action.payload];
        state.loadingProducts = false;
        state.basket = [];
      })
      .addCase(doOrder.rejected, (state: TRootState, action) => {
        state.errorOrder = action.payload as string;
      });
  },
});

export const {
  resetFavoriteItems,
  resetNotifications,
  resetBusket,
  addToBusket,
  removeFromBusket,
  removeFromFavoriteItems,
  addAndDeleteToFavoriteItems,
} = userUIDataSlice.actions;

export const userUIDataReducer = userUIDataSlice.reducer;
