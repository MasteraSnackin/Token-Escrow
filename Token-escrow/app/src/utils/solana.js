import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from './idl.json';  // Assume this contains your program IDL

const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
const opts = {
  preflightCommitment: "processed"
};

export const createVault = async (
  walletPubkey,
  fromPubkey,
  toPubkey,
  tokenAPubkey,
  tokenBPubkey,
  amountA,
  amountB,
  fee,
  expiry,
  sendTransaction
) => {
  const provider = new AnchorProvider(new web3.Connection(network, opts.preflightCommitment), walletPubkey, opts.preflightCommitment);
  const program = new Program(idl, programID, provider);

  const [vaultPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), fromPubkey.toBuffer(), toPubkey.toBuffer()],
    programID
  );

  const tx = await program.methods.createVault(
    new web3.BN(amountA),
    new web3.BN(amountB),
    new web3.BN(fee),
    new web3.BN(expiry)
  )
    .accounts({
      vault: vaultPDA,
      from: fromPubkey,
      to: toPubkey,
      tokenA: tokenAPubkey,
      tokenB: tokenBPubkey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();

  console.log("Transaction signature", tx);
};

export const depositTokens = async (
  walletPubkey,
  amount,
  sendTransaction
) => {
  const provider = new AnchorProvider(new web3.Connection(network, opts.preflightCommitment), walletPubkey, opts.preflightCommitment);
  const program = new Program(idl, programID, provider);

  const tx = await program.methods.deposit(new web3.BN(amount)).rpc();
  console.log("Transaction signature", tx);
};

export const swapTokens = async (
  walletPubkey,
  sendTransaction
) => {
  const provider = new AnchorProvider(new web3.Connection(network, opts.preflightCommitment), walletPubkey, opts.preflightCommitment);
  const program = new Program(idl, programID, provider);

  const tx = await program.methods.swap().rpc();
  console.log("Transaction signature", tx);
};
