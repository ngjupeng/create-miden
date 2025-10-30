'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Asset,
  MidenWalletAdapter,
  SendTransaction,
  useWallet,
} from '@demox-labs/miden-wallet-adapter';
import { WalletMultiButton } from '@demox-labs/miden-wallet-adapter';
import { mintToken } from '@/services/miden/faucet';

export default function Home() {
  const { accountId, connected, wallet, requestAssets, requestTransaction } =
    useWallet();
  const [activeTab, setActiveTab] = useState<'transfer' | 'faucet' | 'assets'>(
    'transfer'
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Transfer form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [faucetId, setFaucetId] = useState(
    'mtst1qrpftjy5eds4ggqx4de4xj0r79cqqvxrnea'
  ); // @note: feel free to replace this

  // Faucet form state
  const [faucetAddress, setFaucetAddress] = useState(
    'mtst1qrpftjy5eds4ggqx4de4xj0r79cqqvxrnea'
  );
  const [faucetAmount, setFaucetAmount] = useState('');

  // Assets state
  const [assets, setAssets] = useState<Asset[]>([]);
  const short = (v: string) =>
    v && v.length > 16 ? `${v.slice(0, 8)}...${v.slice(-6)}` : v;

  useEffect(() => {
    const load = async () => {
      if (!connected || !accountId) return;
      try {
        const a = await requestAssets?.();
        if (Array.isArray(a)) setAssets(a);
      } catch {}
    };

    load();
  }, [connected, accountId, requestAssets]);

  const handleSend = async () => {
    if (!accountId || !recipient || !amount || !faucetId || !wallet) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const transaction = new SendTransaction(
        accountId,
        recipient,
        faucetId,
        'public', // or 'private'
        Number(amount) // amount
      );

      await (wallet.adapter as MidenWalletAdapter).requestSend(transaction);

      setRecipient('');
      setAmount('');
    } catch (error) {
      console.log(error);
      setMessage(`Transaction failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimFaucet = async () => {
    if (!accountId || !faucetAddress || !faucetAmount) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log(accountId, faucetAddress, BigInt(parseInt(faucetAmount)));
      await mintToken(accountId, faucetAddress, BigInt(parseInt(faucetAmount)));
      setMessage('Tokens claimed successfully!');
      setFaucetAddress('');
      setFaucetAmount('');
    } catch (error) {
      setMessage(`Claim failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white rounded-md border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Miden Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to get started
          </p>
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-md border border-gray-200">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                Miden Wallet
              </h1>
              <WalletMultiButton />
            </div>
            <p className="text-sm text-gray-600 mt-1">Account: {accountId}</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'transfer'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Transfer
            </button>
            <button
              onClick={() => setActiveTab('faucet')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'faucet'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Claim Faucet
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'assets'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Assets
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'transfer' && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Send Tokens
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter recipient address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faucet ID
                    </label>
                    <input
                      type="text"
                      value={faucetId}
                      onChange={e => setFaucetId(e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter faucet ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="w-full border border-orange-500 text-orange-600 bg-white py-2 px-4 rounded-md hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'faucet' && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Claim from Faucet
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faucet Address
                    </label>
                    <input
                      type="text"
                      value={faucetAddress}
                      onChange={e => setFaucetAddress(e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter faucet address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={faucetAmount}
                      onChange={e => setFaucetAmount(e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter amount to claim"
                    />
                  </div>
                  <button
                    onClick={handleClaimFaucet}
                    disabled={loading}
                    className="w-full border border-orange-500 text-orange-600 bg-white py-2 px-4 rounded-md hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Claiming...' : 'Claim Tokens'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="text-xs text-gray-600 mb-1">Assets</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {assets.length}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Account Assets
                  </h3>
                  <div className="space-y-2">
                    {assets.length === 0 && (
                      <div className="text-sm text-gray-600">
                        No assets found
                      </div>
                    )}
                    {assets.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-orange-600 text-sm font-medium">
                            TOKEN
                          </div>
                          <div className="text-xs text-gray-600">
                            {short(it.faucetId)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-900">{it.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm ${
                  message.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
