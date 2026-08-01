"use client";
import { Provider } from "react-redux";
import { makeStore } from '../services/store/store';
import { ReactNode } from "react";

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = makeStore();
  return <Provider store={store}>{children}</Provider>;
}