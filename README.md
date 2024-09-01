# Token Escrow Program

This repository contains a token escrow program implemented using the Anchor framework on Solana, along with a simple React-based front-end DApp. The escrow program allows two parties to exchange tokens securely based on predefined criteria such as deposit amounts, a swap deadline, and a small transaction fee. The DApp enables users to interact with the smart contract by creating vaults, depositing tokens, and swapping them once conditions are met.

## Program Overview

The Token Escrow Program allows two parties to exchange tokens securely. The flow includes three main actions:

1. **Create Vault**: Initialize the vault, define the parties, and set the token amounts.
2. **Deposit**: Each party deposits their respective tokens into the vault.
3. **Expiry Date**: The contract sets an expiry date for the transaction, after which the contract is invalid.
4. **Transaction Fee**: A small fee is charged upon the successful execution of the token swap.
5. **Withdraw**: Once both parties have deposited the correct amounts, the tokens are transferred to the respective recipients.


### Smart Contract (Anchor Framework)

Logic

Create Vault--> Deposit Tokens--> Swap Tokens

Anchor Code Snippets
The smart contract is structured with the following key methods:

create_vault: Initializes a vault with parameters such as token amounts, fee, and expiry.
deposit: Ensures both users deposit the correct token amounts into the vault.
swap: Swaps the tokens once both deposits are made, and deducts a small fee.


### Front-End DApp

Attributes include:
- **Connect Wallets**: Users connect their Solana wallets to interact with the contract.
- **Create Vault**: Users specify the tokens and amounts to exchange, along with a deadline for the swap.
- **Deposit Tokens**: After vault creation, both parties can deposit their respective tokens.
- **Swap TokensB**: Once the deposits are complete, users can initiate the token swap.


## Prerequisites
- **Solana CLI**: Install the Solana command line tools by following this guide.
- **Anchor CLI**: Install the Anchor framework by following the instructions here.
- **Node.js**: Install the latest version of Node.js from here.

## Installation

To install and run the project, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your_username/token-escrow
cd token-escrow
```

### 2. Install dependencies for the React DApp:
Initialize the Anchor environment:
```bash
cd front-end
npm install
```


### 3. Start the React DApp:

```bash
npm start
```

### 4. Connect your Solana wallet and interact with the contract through the UI.

## 1. Setting up the Program Locally
Install Anchor:
```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

## 2. Build the smart contract:
```bash
cd programs/token-escrow
anchor build
```

## 3. Deploy the smart contract to Solana's Devnet:
```bash
anchor deploy --provider.cluster devnet
```

## 4. Copy the deployed program ID into the React app to replace YOUR_PROGRAM in the code.


### Testing the Smart Contract
```bash
anchor test
```

###  License
This project is licensed under the MIT License. See the LICENSE file for details.
