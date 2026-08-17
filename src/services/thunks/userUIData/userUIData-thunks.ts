import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IProduct, IFormOrderData } from "../../../types";
import { mockedGetProductsApi, mockedDoOrder, toggleLikeApi, changeBasketApi,  resetBasketApi} from "../../../services/api";
import { addAndDeleteToFavoriteItems } from '../../slices/userUIData';
import { useAppDispatch, useAppSelector  }  from '../../hooks/hooks';
import { selectIdUser  } from '../../selectors/user-selectors/user-selectors';





export const getProducts = createAsyncThunk<IProduct[], void>(
  "getProducts",
  async (_, { rejectWithValue}) => {

    try {
      const products = await mockedGetProductsApi();
      return products;
    } catch (err) {
      
            return rejectWithValue('Token expired, please try again');
          }  
    
  },
);

export const changeBasket = createAsyncThunk<{success: boolean, operation: string, product: IProduct}, IProduct, { rejectValue: string }>('changeBasket',
  async (data, { rejectWithValue}) => {
    try {
      const result = await changeBasketApi(data)
      return {
        ...result,           
        product: data        
      };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
    }
  }
)

export const resetBasket = createAsyncThunk<{success: boolean}, IProduct, { rejectValue: string }>('changeBasket',
  async (data, { rejectWithValue}) => {
    try {
      const result = await changeBasketApi(data)
      return result;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
    }
  }
)

export const doOrder = createAsyncThunk<string, IFormOrderData,  { rejectValue: string }>(
  "doOrder",
  async (data, { rejectWithValue}) => {
    try {
      const order = await mockedDoOrder(data);
      return order;
    } catch (err) {
      return rejectWithValue('Error order')
  }
}
);

export const toggleLike = createAsyncThunk<
  void, 
  string
 
>(
  'toggleLike', 
  async (productId, { dispatch }) => {  
    
    try {
      const data = await toggleLikeApi({productId: productId});
      const success = data.success;
      if (success ) {
        dispatch(addAndDeleteToFavoriteItems(productId));
      }
    } catch (err) {
      
      console.error(err)
    }
  }
);