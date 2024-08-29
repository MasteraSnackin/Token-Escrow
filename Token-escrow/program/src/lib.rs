use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("YourProgramIDHere");

#[program]
pub mod token_escrow {
    use super::*;

    pub fn create_vault(
        ctx: Context<CreateVault>,
        amount_a: u64,
        amount_b: u64,
        fee: u64,
        expiry: i64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.from = ctx.accounts.from.key();
        vault.to = ctx.accounts.to.key();
        vault.token_a = ctx.accounts.token_a.key();
        vault.token_b = ctx.accounts.token_b.key();
        vault.amount_a = amount_a;
        vault.amount_b = amount_b;
        vault.fee = fee;
        vault.expiry = expiry;
        vault.amount_a_deposited = 0;
        vault.amount_b_deposited = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        if ctx.accounts.from.key() == vault.from {
            // Handle deposit for token A
            vault.amount_a_deposited = amount;
        } else if ctx.accounts.from.key() == vault.to {
            // Handle deposit for token B
            vault.amount_b_deposited = amount;
        } else {
            return Err(ErrorCode::InvalidUser.into());
        }

        if vault.amount_a_deposited != vault.amount_a || vault.amount_b_deposited != vault.amount_b {
            return Err(ErrorCode::InvalidDepositAmount.into());
        }

        Ok(())
    }

    pub fn swap(ctx: Context<Swap>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // Ensure both deposits are made and not expired
        if vault.amount_a_deposited == vault.amount_a && vault.amount_b_deposited == vault.amount_b && vault.expiry > Clock::get()?.unix_timestamp {
            // Perform the swap
            let seeds = &[
                b"vault".as_ref(),
                vault.to_bytes().as_ref(),
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts_a = Transfer {
                from: ctx.accounts.vault_token_a.to_account_info(),
                to: ctx.accounts.to_token_b.to_account_info(),
                authority: ctx.accounts.vault_signer.to_account_info(),
            };
            let cpi_context_a = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_a, signer);
            token::transfer(cpi_context_a, vault.amount_a - vault.fee)?;

            let cpi_accounts_b = Transfer {
                from: ctx.accounts.vault_token_b.to_account_info(),
                to: ctx.accounts.from_token_a.to_account_info(),
                authority: ctx.accounts.vault_signer.to_account_info(),
            };
            let cpi_context_b = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_b, signer);
            token::transfer(cpi_context_b, vault.amount_b - vault.fee)?;

            Ok(())
        } else {
            return Err(ErrorCode::ConditionsNotMet.into());
        }
    }
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(init, payer = from, space = 8 + Vault::LEN)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub to: AccountInfo<'info>,
    pub token_a: AccountInfo<'info>,
    pub token_b: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    #[account(mut)]
    pub vault_signer: AccountInfo<'info>,
    #[account(mut)]
    pub vault_token_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_b: Account<'info, TokenAccount>,
    #[account(mut)]
    pub from_token_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_token_b: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Vault {
    pub from: Pubkey,
    pub to: Pubkey,
    pub token_a: Pubkey,
    pub token_b: Pubkey,
    pub amount_a: u64,
    pub amount_b: u64,
    pub fee: u64,
    pub expiry: i64,
    pub amount_a_deposited: u64,
    pub amount_b_deposited: u64,
}

impl Vault {
    const LEN: usize = 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("The contract has expired.")]
    ExpiredContract,
    #[msg("Invalid user.")]
    InvalidUser,
    #[msg("Invalid deposit amount.")]
    InvalidDepositAmount,
    #[msg("Conditions not met.")]
    ConditionsNotMet,
}
