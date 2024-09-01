import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EscrowApp from './App';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const wallets = [new PhantomWalletAdapter()];

ReactDOM.render(
  <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <EscrowApp />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>,
  document.getElementById('root')
);
