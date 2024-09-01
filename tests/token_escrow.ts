import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenEscrow } from "../target/types/token_escrow"; // Add your program type

describe("token-escrow", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TokenEscrow as Program<TokenEscrow>;

  it("Creates a vault", async () => {
    const [vault] = await PublicKey.findProgramAddress([Buffer.from("vault")], program.programId);

    await program.rpc.createVault(
      new anchor.BN(1000), 
      new anchor.BN(1000), 
      new anchor.BN(5), 
      new anchor.BN(1633046400), 
      {
        accounts: {
          vault: vault,
          from: provider.wallet.publicKey,
          to: new PublicKey("RECEIVER_PUBLIC_KEY"),
          tokenA: new PublicKey("TOKEN_A_ACCOUNT"),
          tokenB: new PublicKey("TOKEN_B_ACCOUNT"),
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      }
    );

    const vaultAccount = await program.account.vault.fetch(vault);
    assert.ok(vaultAccount.from.equals(provider.wallet.publicKey));
    console.log("Vault created successfully:", vaultAccount);
  });
});
