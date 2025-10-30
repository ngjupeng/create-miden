'use client';
import { MIDEN_RPC_URL } from '@/shared/constants';
import { AssetWithMetadata } from '@/shared/types/faucet';
import { FungibleAsset } from '@demox-labs/miden-sdk';
import { getFaucetMetadata } from './faucet';

export async function deployAccount(isPublic: boolean = false) {
  const { AccountStorageMode, WebClient } = await import(
    '@demox-labs/miden-sdk'
  );

  const client = await WebClient.createClient(MIDEN_RPC_URL);
  const account = await client.newWallet(
    isPublic ? AccountStorageMode.public() : AccountStorageMode.private(),
    true
  );
  return account;
}

export const getAccountAssets = async (
  accountInBech32: string
): Promise<AssetWithMetadata[]> => {
  try {
    const { AccountInterface, NetworkId } = await import(
      '@demox-labs/miden-sdk'
    );

    let account = await importAndGetAccount(accountInBech32);

    const accountAssets: FungibleAsset[] = account.vault().fungibleAssets();
    const assetsWithMetadata = [];
    for (let index = 0; index < accountAssets.length; index++) {
      const asset = accountAssets[index];
      try {
        // get token metadata
        const faucet = asset.faucetId();

        const metadata = await getFaucetMetadata(
          faucet.toBech32(NetworkId.Testnet, AccountInterface.Unspecified)
        );
        assetsWithMetadata.push({
          faucetId: asset
            .faucetId()
            .toBech32(NetworkId.Testnet, AccountInterface.Unspecified),
          amount: asset.amount().toString(),
          metadata,
        });
      } catch (error) {
        console.error(`Error processing asset ${index + 1}:`, error);
        console.log(`Skipping asset ${index + 1} due to error`);
      }
    }

    return assetsWithMetadata;
  } catch (err) {
    console.error('Error in getAccountAssets:', err);
    return [];
  }
};

export const importAndGetAccount = async (
  accountInBech32: string
): Promise<any> => {
  const { WebClient, Address } = await import('@demox-labs/miden-sdk');

  const importPromise = (async () => {
    const client = await WebClient.createClient(MIDEN_RPC_URL);

    const accountId = Address.fromBech32(accountInBech32);

    let accountContract = await client.getAccount(accountId.accountId());

    if (!accountContract) {
      try {
        await client.importAccountById(accountId.accountId());
        accountContract = await client.getAccount(accountId.accountId());
        if (!accountContract) {
          throw new Error(`Account not found after import: ${accountId}`);
        }
      } catch (error) {
        throw error;
      }
    }
    return accountContract;
  })();

  return importPromise;
};

export const getAccounts = async () => {
  const { WebClient, AccountInterface, NetworkId } = await import(
    '@demox-labs/miden-sdk'
  );

  const client = await WebClient.createClient(MIDEN_RPC_URL);

  const accounts = await client.getAccounts();

  // for each account, we use getAccount, if fail, means we dont own the account
  const accountsWeOwn = await Promise.all(
    accounts.filter(async account => {
      try {
        const readAccount = await client.getAccount(account.id());
        if (!readAccount) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    })
  );

  return accountsWeOwn.map(account =>
    account.id().toBech32(NetworkId.Testnet, AccountInterface.BasicWallet)
  );
};

export const exportAccounts = async () => {
  try {
    const { WebClient } = await import('@demox-labs/miden-sdk');

    const client = await WebClient.createClient(MIDEN_RPC_URL);

    const store = await client.exportStore();
    return store;
  } catch (error) {
    console.error('Failed to export account:', error);
    throw new Error('Failed to export account');
  }
};

export const importAccount = async (store: string) => {
  const { WebClient } = await import('@demox-labs/miden-sdk');

  const client = await WebClient.createClient(MIDEN_RPC_URL);
  await client.forceImportStore(store);
};
