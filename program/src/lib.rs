use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Token, Transfer};

declare_id!("YOUR_PROGRAM_ID");

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
        vault.from = *ctx.accounts.from.key;
        vault.to = *ctx.accounts.to.key;
        vault.token_a = *ctx.accounts.token_a.key;
        vault.token_b = *ctx.accounts.token_b.key;
        vault.amount_a = amount_a;
        vault.amount_b = amount_b;
        vault.fee = fee;
        vault.expiry = expiry;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let clock = Clock::get().unwrap();
        let vault = &ctx.accounts.vault;

        require!(clock.unix_timestamp <= vault.expiry, EscrowError::ExpiredContract);
        
        if ctx.accounts.depositor.key() == vault.from {
            require!(amount == vault.amount_a, EscrowError::InvalidDepositAmount);
        } else if ctx.accounts.depositor.key() == vault.to {
            require!(amount == vault.amount_b, EscrowError::InvalidDepositAmount);
        } else {
            return Err(EscrowError::InvalidUser.into());
        }

        let cpi_accounts = Transfer {
            from: ctx.accounts.depositor_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        Ok(())
    }

    pub fn swap(ctx: Context<Swap>) -> Result<()> {
        let clock = Clock::get().unwrap();
        let vault = &ctx.accounts.vault;

        require!(clock.unix_timestamp <= vault.expiry, EscrowError::ExpiredContract);

        let fee_a = vault.amount_a * vault.fee / 100;
        let fee_b = vault.amount_b * vault.fee / 100;

        let transfer_a = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.recipient_a_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };

        let transfer_b = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.recipient_b_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };

        token::transfer(CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_a), vault.amount_b - fee_b)?;
        token::transfer(CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_b), vault.amount_a - fee_a)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(init, payer = from, space = 8 + 8 * 2 + 32 * 4 + 8)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub token_a: Account<'info, TokenAccount>,
    pub token_b: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub vault: Account<'info, Vault>,
    pub depositor: Signer<'info>,
    #[account(mut)]
    pub depositor_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_a_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_b_token_account: Account<'info, TokenAccount>,
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
}

#[error_code]
pub enum EscrowError {
    #[msg("Contract has expired.")]
    ExpiredContract,
    #[msg("Invalid user.")]
    InvalidUser,
    #[msg("Invalid deposit amount.")]
    InvalidDepositAmount,
}
