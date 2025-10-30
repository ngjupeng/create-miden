'use client';

import { createMidenSdkStore, MidenSdkStore } from '@/services/store/midenSdk';
import { MIDEN_RPC_URL, SYNC_STATE_INTERVAL } from '@/shared/constants';
import { useEffect, useState } from 'react';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

export type MidenSdkStoreApi = ReturnType<typeof createMidenSdkStore>;

export const MidenSdkStoreContext = createContext<MidenSdkStoreApi | undefined>(
  undefined
);

export interface MidenSdkProviderProps {
  children: ReactNode;
}

export const MidenSdkProvider = ({ children }: MidenSdkProviderProps) => {
  const storeRef = useRef<MidenSdkStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createMidenSdkStore();
  }

  return (
    <MidenSdkStoreContext.Provider value={storeRef.current}>
      {children}
    </MidenSdkStoreContext.Provider>
  );
};

export const useMidenSdkStore = <T,>(
  selector: (store: MidenSdkStore) => T
): T => {
  const midenSdkStoreContext = useContext(MidenSdkStoreContext);

  if (!midenSdkStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(midenSdkStoreContext, selector);
};

export const tickInterval = SYNC_STATE_INTERVAL;
export function useInitAndPollSyncState() {
  const [tick, setTick] = useState(0);
  const syncState = useMidenSdkStore(state => state.syncState);
  const initializeSdk = useMidenSdkStore(state => state.initializeSdk);
  const [client, setClient] = useState<any | null>(null);

  useEffect(() => {
    initializeSdk({});

    const initClient = async () => {
      const { WebClient } = await import('@demox-labs/miden-sdk');
      const clientInstance = await WebClient.createClient(MIDEN_RPC_URL);
      setClient(clientInstance);
    };
    initClient();
  }, []);

  useEffect(() => {
    if (client) {
      syncState(client);
    }
  }, [tick, client, syncState]);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTick(tick => tick + 1),
      tickInterval
    );
    return () => clearInterval(intervalId);
  }, []);
}
