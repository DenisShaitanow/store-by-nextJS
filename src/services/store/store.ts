
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../slices/user/userSlice";
import { userUIDataReducer } from "../slices/userUIData";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,              
      userUIData: userUIDataReducer,  
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Типы для TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
   