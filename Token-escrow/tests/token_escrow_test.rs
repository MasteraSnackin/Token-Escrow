use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use anchor_lang::solana_program::program_pack::Pack;
use solana_program_test::*;
use solana_sdk::{account::Account, signature::Keypair, transport};
use spl_token::{instruction::initialize_account, state::AccountState};

#[tokio::test]
async fn test_create_vault() -> transport::Result<()> {
    // Initialize the Solana Program Test environment
    let mut context = ProgramTest::new(
        "token_escrow",
        id(),
        processor!(Processor::process_instruction),
    );

    let vault = Keypair::new();
    let from = Keypair::new();
    let to = Keypair::new();
    let token_a = Keypair::new();
    let token_b = Keypair::new();

    // Create the vault
    let (vault_pubkey, _) = Pubkey::find_program_address(
        &[vault.key.as_ref()],
        &token_escrow::id(),
    );

    // Your logic here

    Ok(())
}
