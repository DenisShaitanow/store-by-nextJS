'use client';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '../services/store/store';
import { ReactNode, useRef } from 'react';

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const store = makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
