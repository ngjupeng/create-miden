'use client';

import { ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ConnectWalletButton from './ConnectWallet/ConnectWalletButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  WalletProvider,
  WalletModalProvider,
  MidenWalletAdapter,
  WalletError,
  PrivateDataPermission,
} from '@demox-labs/miden-wallet-adapter';
import { MidenSdkProvider } from '@/contexts/MidenSdkProvider';
import '@demox-labs/miden-wallet-adapter/styles.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const queryClient = new QueryClient();
  const wallets = [new MidenWalletAdapter({ appName: 'Your Miden App' })];

  const handleError = (error: WalletError) => {
    console.error(error);
    switch (error.error.name) {
      case 'NotGrantedMidenWalletError':
        toast.error('User denied access to their wallet');
        break;
      default:
        toast.error('An error occurred while connecting to your wallet');
        break;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MidenSdkProvider>
        <WalletProvider
          privateDataPermission={PrivateDataPermission.Auto}
          wallets={wallets}
          autoConnect
          onError={handleError}
        >
          <WalletModalProvider>
            <Toaster />
            <ConnectWalletButton />
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </MidenSdkProvider>
    </QueryClientProvider>
  );
}
