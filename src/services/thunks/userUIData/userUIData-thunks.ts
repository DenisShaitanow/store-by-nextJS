import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IProduct, IFormOrderData } from '../../../types';
import {
  getProductsApi,
  mockedDoOrder,
  toggleLikeApi,
  changeBasketApi,
  resetBasketApi,
  getBasketApi,
} from '../../../services/api';
import { addAndDeleteToFavoriteItems } from '../../slices/userUIData';
import { OperationBasket } from '../../../services/api';

export const getBasket = createAsyncThunk<{ item: IProduct; count: number }[], void>(
  'getBasket',
  async (_, { rejectWithValue }) => {
    try {
      const basket = await getBasketApi();
      return basket;
    } catch (err) {
      return rejectWithValue('Проблемы с загрузкой корзины.');
    }
  }
);

/*export const getProducts = createAsyncThunk<IProduct[], void>(
  'getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProductsApi();
      return products;
    } catch (err) {
      return rejectWithValue('Token expired, please try again');
    }
  }
);*/

export const changeBasket = createAsyncThunk<
  Array<{ item: IProduct; count: number }>,
  { product: IProduct; operation: OperationBasket },
  { rejectValue: string }
>('changeBasket', async (data, { rejectWithValue }) => {
  try {
    const result = await changeBasketApi(data);
    return result;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
  }
});

export const resetBasket = createAsyncThunk<
  Array<{ item: IProduct; count: number }>,
  void,
  { rejectValue: string }
>('resetBasket', async (_, { rejectWithValue }) => {
  try {
    const result = await resetBasketApi();
    return result;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
  }
});

export const doOrder = createAsyncThunk<string, IFormOrderData, { rejectValue: string }>(
  'doOrder',
  async (data, { dispatch, getState, rejectWithValue }) => {
    try {
      const order = await mockedDoOrder(data);
      dispatch(resetBasket());
      return order;
    } catch (err) {
      return rejectWithValue('Error order');
    }
  }
);

export const toggleLike = createAsyncThunk<void, string>(
  'toggleLike',
  async (productId, { dispatch }) => {
    try {
      const data = await toggleLikeApi(productId);
      const favoritItems = data.favoritItems;
      
        dispatch(addAndDeleteToFavoriteItems(favoritItems));
      
    } catch (err) {
      console.error(err);
    }
  }
);
