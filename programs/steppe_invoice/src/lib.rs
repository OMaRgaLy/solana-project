use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("7ze4Utjmn73v42terYZMTFVGCt2ygVu9u85US89uNGJm");

pub const MAX_TITLE_LEN: usize = 64;
pub const BPS_DENOMINATOR: u64 = 10_000;
pub const ASSET_SOL: u8 = 0;

#[program]
pub mod steppe_invoice {
    use super::*;

    pub fn initialize_invoice(
        ctx: Context<InitializeInvoice>,
        invoice_id: u64,
        amount: u64,
        title: String,
        vault_recipient: Pubkey,
        vault_basis_points: u16,
        collaborator_recipient: Option<Pubkey>,
        collaborator_basis_points: u16,
    ) -> Result<()> {
        require!(amount > 0, InvoiceError::InvalidAmount);
        require!(title.len() <= MAX_TITLE_LEN, InvoiceError::TitleTooLong);
        let total_bps = (vault_basis_points as u32)
            .checked_add(collaborator_basis_points as u32)
            .ok_or(InvoiceError::MathOverflow)?;
        require!(total_bps <= BPS_DENOMINATOR as u32, InvoiceError::SplitExceeds100);
        require!(
            collaborator_basis_points == 0 || collaborator_recipient.is_some(),
            InvoiceError::CollaboratorRequired
        );

        let invoice = &mut ctx.accounts.invoice;
        invoice.creator = ctx.accounts.creator.key();
        invoice.invoice_id = invoice_id;
        invoice.amount = amount;
        invoice.asset_type = ASSET_SOL;
        invoice.vault_recipient = vault_recipient;
        invoice.vault_basis_points = vault_basis_points;
        invoice.collaborator_recipient = collaborator_recipient;
        invoice.collaborator_basis_points = collaborator_basis_points;
        invoice.payer = None;
        invoice.is_paid = false;
        invoice.created_at = Clock::get()?.unix_timestamp;
        invoice.paid_at = None;
        invoice.title = title;
        invoice.bump = ctx.bumps.invoice;
        Ok(())
    }

    pub fn pay_invoice(ctx: Context<PayInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(!invoice.is_paid, InvoiceError::AlreadyPaid);

        let amount = invoice.amount;
        let vault_amount = share(amount, invoice.vault_basis_points)?;
        let collab_amount = share(amount, invoice.collaborator_basis_points)?;
        // Creator receives the remainder, so rounding dust never leaves the split.
        let creator_amount = amount
            .checked_sub(vault_amount)
            .and_then(|v| v.checked_sub(collab_amount))
            .ok_or(InvoiceError::MathOverflow)?;

        let sys = ctx.accounts.system_program.key();
        let payer = ctx.accounts.payer.to_account_info();

        if vault_amount > 0 {
            transfer(
                CpiContext::new(sys, Transfer { from: payer.clone(), to: ctx.accounts.vault.to_account_info() }),
                vault_amount,
            )?;
        }
        if collab_amount > 0 {
            let collab = ctx.accounts.collaborator.as_ref().ok_or(InvoiceError::CollaboratorRequired)?;
            require_keys_eq!(
                collab.key(),
                invoice.collaborator_recipient.ok_or(InvoiceError::CollaboratorRequired)?,
                InvoiceError::WrongRecipient
            );
            transfer(
                CpiContext::new(sys, Transfer { from: payer.clone(), to: collab.to_account_info() }),
                collab_amount,
            )?;
        }
        if creator_amount > 0 {
            transfer(
                CpiContext::new(sys, Transfer { from: payer, to: ctx.accounts.creator.to_account_info() }),
                creator_amount,
            )?;
        }

        let now = Clock::get()?.unix_timestamp;
        invoice.is_paid = true;
        invoice.paid_at = Some(now);
        invoice.payer = Some(ctx.accounts.payer.key());

        emit!(InvoicePaidEvent {
            invoice_id: invoice.invoice_id,
            creator: invoice.creator,
            payer: ctx.accounts.payer.key(),
            amount,
            timestamp: now,
        });
        Ok(())
    }

    pub fn cancel_invoice(_ctx: Context<CancelInvoice>) -> Result<()> {
        Ok(())
    }
}

fn share(amount: u64, bps: u16) -> Result<u64> {
    amount
        .checked_mul(bps as u64)
        .and_then(|v| v.checked_div(BPS_DENOMINATOR))
        .ok_or_else(|| error!(InvoiceError::MathOverflow))
}

#[derive(Accounts)]
#[instruction(invoice_id: u64)]
pub struct InitializeInvoice<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Invoice::INIT_SPACE,
        seeds = [b"invoice", creator.key().as_ref(), &invoice_id.to_le_bytes()],
        bump
    )]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(
        mut,
        seeds = [b"invoice", invoice.creator.as_ref(), &invoice.invoice_id.to_le_bytes()],
        bump = invoice.bump
    )]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: constrained to the invoice creator
    #[account(mut, address = invoice.creator @ InvoiceError::WrongRecipient)]
    pub creator: UncheckedAccount<'info>,
    /// CHECK: constrained to the invoice vault recipient
    #[account(mut, address = invoice.vault_recipient @ InvoiceError::WrongRecipient)]
    pub vault: UncheckedAccount<'info>,
    /// CHECK: optional; key is verified against invoice.collaborator_recipient when used
    #[account(mut)]
    pub collaborator: Option<UncheckedAccount<'info>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelInvoice<'info> {
    #[account(
        mut,
        close = creator,
        has_one = creator,
        constraint = !invoice.is_paid @ InvoiceError::AlreadyPaid,
        seeds = [b"invoice", creator.key().as_ref(), &invoice.invoice_id.to_le_bytes()],
        bump = invoice.bump
    )]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub creator: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Invoice {
    pub creator: Pubkey,
    pub invoice_id: u64,
    pub amount: u64,
    pub asset_type: u8,
    pub vault_recipient: Pubkey,
    pub vault_basis_points: u16,
    pub collaborator_recipient: Option<Pubkey>,
    pub collaborator_basis_points: u16,
    pub payer: Option<Pubkey>,
    pub is_paid: bool,
    pub created_at: i64,
    pub paid_at: Option<i64>,
    #[max_len(64)]
    pub title: String,
    pub bump: u8,
}

#[event]
pub struct InvoicePaidEvent {
    pub invoice_id: u64,
    pub creator: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum InvoiceError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Title is longer than 64 characters")]
    TitleTooLong,
    #[msg("Vault + collaborator share exceeds 100%")]
    SplitExceeds100,
    #[msg("Collaborator share requires a collaborator wallet")]
    CollaboratorRequired,
    #[msg("Invoice is already paid")]
    AlreadyPaid,
    #[msg("Recipient account does not match the invoice")]
    WrongRecipient,
    #[msg("Math overflow")]
    MathOverflow,
}
