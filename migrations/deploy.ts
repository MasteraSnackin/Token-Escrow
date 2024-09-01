import * as anchor from '@project-serum/anchor';

const provider = anchor.Provider.local();
anchor.setProvider(provider);

async function main() {
  const program = anchor.workspace.TokenEscrow;
  const tx = await program.rpc.initialize();
  console.log("Transaction signature", tx);
}

console.log('Deploying the contract...');
main().then(() => console.log('Deployment completed.'));
