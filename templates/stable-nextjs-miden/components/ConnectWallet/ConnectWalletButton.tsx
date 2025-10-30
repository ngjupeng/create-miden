import React from 'react';
import { WalletMultiButton } from '@demox-labs/miden-wallet-adapter';

export default function ConnectWalletButton() {
  return (
    <div className="flex justify-end p-5">
      <WalletMultiButton />
    </div>
  );
}
