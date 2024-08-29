import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createVault, depositTokens, swapTokens } from '../utils/solana';

const EscrowForm = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [vaultDetails, setVaultDetails] = useState({
    from: '',
    to: '',
    tokenA: '',
    tokenB: '',
    amountA: '',
    amountB: '',
    fee: '',
    expiry: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVaultDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateVault = async () => {
    if (!publicKey) return;
    const fromPubkey = new PublicKey(vaultDetails.from);
    const toPubkey = new PublicKey(vaultDetails.to);
    const tokenAPubkey = new PublicKey(vaultDetails.tokenA);
    const tokenBPubkey = new PublicKey(vaultDetails.tokenB);

    await createVault(
      publicKey,
      fromPubkey,
      toPubkey,
      tokenAPubkey,
      tokenBPubkey,
      vaultDetails.amountA,
      vaultDetails.amountB,
      vaultDetails.fee,
      vaultDetails.expiry,
      sendTransaction
    );
  };

  const handleDepositTokens = async () => {
    if (!publicKey) return;

    await depositTokens(
      publicKey,
      vaultDetails.amountA,
      sendTransaction
    );
  };

  const handleSwapTokens = async () => {
    if (!publicKey) return;

    await swapTokens(
      publicKey,
      sendTransaction
    );
  };

  return (
    <div>
      <h2>Create Vault</h2>
      <input
        type="text"
        name="from"
        placeholder="From PublicKey"
        value={vaultDetails.from}
        onChange={handleChange}
      />
      <input
        type="text"
        name="to"
        placeholder="To PublicKey"
        value={vaultDetails.to}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tokenA"
        placeholder="Token A PublicKey"
        value={vaultDetails.tokenA}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tokenB"
        placeholder="Token B PublicKey"
        value={vaultDetails.tokenB}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amountA"
        placeholder="Amount A"
        value={vaultDetails.amountA}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amountB"
        placeholder="Amount B"
        value={vaultDetails.amountB}
        onChange={handleChange}
      />
      <input
        type="number"
        name="fee"
        placeholder="Fee"
        value={vaultDetails.fee}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="expiry"
        placeholder="Expiry"
        value={vaultDetails.expiry}
        onChange={handleChange}
      />
      <button onClick={handleCreateVault}>Create Vault</button>
      
      <h2>Deposit Tokens</h2>
      <button onClick={handleDepositTokens}>Deposit</button>

      <h2>Swap Tokens</h2>
      <button onClick={handleSwapTokens}>Swap</button>
    </div>
  );
};

export default EscrowForm;
