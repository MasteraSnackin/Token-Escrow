import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';

const connection = new Connection("https://api.devnet.solana.com");

function App() {
  const { publicKey, signTransaction, wallet } = useWallet();
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);
  const [fee, setFee] = useState(0);
  const [expiry, setExpiry] = useState(0);

  const vaultProgramId = new PublicKey('YOUR_PROGRAM_ID');
  const vaultSeed = "vault";
  
  // Anchor Provider setup
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
  const program = new Program(idl, vaultProgramId, provider);  // Add your program IDL here

  const createVault = async () => {
    try {
      const vault = await PublicKey.createWithSeed(
        publicKey, // Owner's public key
        vaultSeed,
        vaultProgramId
      );
      
      const tx = await program.rpc.createVault(
        new web3.BN(amountA),
        new web3.BN(amountB),
        new web3.BN(fee),
        new web3.BN(expiry),
        {
          accounts: {
            vault: vault,
            from: publicKey,
            to: new PublicKey("RECEIVER_PUBLIC_KEY"), // Replace with actual receiver public key
            tokenA: new PublicKey("TOKEN_A_ACCOUNT"),
            tokenB: new PublicKey("TOKEN_B_ACCOUNT"),
            systemProgram: SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          }
        }
      );
      console.log("Vault created with transaction signature:", tx);
    } catch (err) {
      console.error("Error creating vault:", err);
    }
  };

  const depositToken = async (amount) => {
    try {
      const tx = await program.rpc.deposit(
        new web3.BN(amount),
        {
          accounts: {
            vault: vault, // You need to pass the vault account here
            depositor: publicKey,
            depositorTokenAccount: new PublicKey("DEPOSITOR_TOKEN_ACCOUNT"),
            vaultTokenAccount: new PublicKey("VAULT_TOKEN_ACCOUNT"),
            tokenProgram: new PublicKey("TOKEN_PROGRAM_ID"), // SPL Token program ID
          }
        }
      );
      console.log("Tokens deposited with transaction signature:", tx);
    } catch (err) {
      console.error("Error depositing tokens:", err);
    }
  };

  const swapTokens = async () => {
    try {
      const tx = await program.rpc.swap({
        accounts: {
          vault: vault, // Pass the vault account
          vaultTokenAccount: new PublicKey("VAULT_TOKEN_ACCOUNT"),
          recipientATokenAccount: new PublicKey("RECIPIENT_A_TOKEN_ACCOUNT"),
          recipientBTokenAccount: new PublicKey("RECIPIENT_B_TOKEN_ACCOUNT"),
          tokenProgram: new PublicKey("TOKEN_PROGRAM_ID"),
        }
      });
      console.log("Tokens swapped with transaction signature:", tx);
    } catch (err) {
      console.error("Error swapping tokens:", err);
    }
  };

  return (
    <div>
      <h1>Token Escrow DApp</h1>
      <input
        type="number"
        placeholder="Amount A"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount B"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
      />
      <input
        type="number"
        placeholder="Fee"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />
      <input
        type="number"
        placeholder="Expiry Timestamp"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />
      <button onClick={createVault}>Create Vault</button>
      <button onClick={() => depositToken(amountA)}>Deposit Tokens</button>
      <button onClick={swapTokens}>Swap Tokens</button>
    </div>
  );
}

export default App;
