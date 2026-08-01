import { type TRootState } from "../../store";

export const selectProducts = (state: TRootState) => state.userUIData.products;
export const selectLoadingProducts = (state: TRootState) =>
  state.userUIData.loadingProducts;
export const selectFavorirsProducts = (state: TRootState) => {
  return state.userUIData.products.filter((item) => item.isLiked === true);
};
export const selectBasket = (state: TRootState) => state.userUIData.basket;
export const selectOrders = (state: TRootState) => state.userUIData.orders;
