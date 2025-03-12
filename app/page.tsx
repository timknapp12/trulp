'use client';
import TrademarkChecker from './components/TrademarkChecker';
import {
  ConnectionProvider,
  WalletProvider,
  // useConnection,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';

const devnet = 'https://api.devnet.solana.com';

export default function Home() {
  const endpoint = devnet;

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className='flex flex-col min-h-screen p-4 gap-16 font-[family-name:var(--font-geist-sans)]'>
            <TrademarkChecker />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
