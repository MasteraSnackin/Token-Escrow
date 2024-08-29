Token Escrow Program
This project implements a Token Escrow Program on Solana using the Anchor framework. The program allows two parties to exchange two types of tokens securely. The tokens are locked in a vault, and the transfer only occurs if predefined criteria are met, such as depositing the correct token amounts.

Program Overview
The Token Escrow Program allows two parties to exchange tokens securely. The flow includes three main actions:
Create Vault: Initialize the vault, define the parties, and set the token amounts.
Deposit: Each party deposits their respective tokens into the vault.
Withdraw: Once both parties have deposited the correct amounts, the tokens are transferred to the respective recipients.

Program Design

Vault:
Holds the tokens temporarily during the escrow process.
Attributes include:
from: The public key of the user sending Token A.
to: The public key of the user receiving Token A and sending Token B.
tokenA, tokenB: Public keys of the tokens being exchanged.
amountA, amountB: The amounts of Token A and Token B to be swapped.
Program:
Manages the logic for creating the vault, accepting deposits, and facilitating the swap.
Ensures both parties meet the criteria before executing the token exchange.
Takes a small fee for each successful transaction.

Key Features
Secure Token Exchange: Tokens are locked in a vault until both parties meet the criteria.
Small Transaction Fee: The program takes a small fee upon successful token transfer.
Automatic Closure: Vaults are automatically closed after the exchange, and rent is refunded to users.

Table of Contents
Installation
Usage
Smart Contract
Front-end
Testing
Contributing
License

Installation
To install and run the project, follow these steps:
Prerequisites
Install Anchor and its dependencies.
Install Rust and the Solana CLI.
Install Node.js and npm for the front-end.
Set up a local Solana cluster or connect to the devnet.
Clone the Repository
bash
Copy code
git clone https://github.com/your_username/token-escrow
cd token-escrow

Anchor Project Setup
Initialize the Anchor environment:
bash
Copy code
anchor init


Build the project:
bash
Copy code
anchor build


Deploy the project:
bash
Copy code
anchor deploy



Usage
Smart Contract Interaction
Create a Vault
This creates the vault and defines the parties involved and the token amounts to be exchanged.
rust
Copy code
pub fn create_vault(
    ctx: Context<CreateVault>,
    amount_a: u64,
    amount_b: u64,
    fee: u64,
    expiry: i64
) -> Result<()> {


Deposit Tokens
Both parties must deposit the tokens they are exchanging into the vault.
rust
Copy code
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {


Withdraw and Swap Tokens
Once both parties have deposited the correct amounts, the program executes the token swap and transfers the tokens to the respective addresses.
rust
Copy code
pub fn swap(ctx: Context<Swap>) -> Result<()> {


Front-end Interface
The front-end provides a user-friendly way for participants to interact with the escrow program. Users can:
Create vaults by inputting details such as amounts and token types.
Deposit tokens via their connected wallets.
Withdraw tokens once the conditions are met.
To start the front-end:
Navigate to the app directory:
bash
Copy code
cd app


Install dependencies:
bash
Copy code
npm install


Start the development server:
bash
Copy code
npm run start



Smart Contract
Escrow Program Functions
Create Vault
Initializes the escrow vault with the participants, token types, and amounts.
Deposit
Allows participants to deposit tokens into the vault after ensuring they have sufficient balances.
Swap
Exchanges the tokens between participants after both parties have deposited the correct amounts.
Error Handling
The program includes robust error handling to ensure the security and validity of each operation:
ExpiredContract: Raised if the contract expiration date has passed.
InvalidUser: Raised if a user not involved in the contract tries to deposit or withdraw.
InvalidDepositAmount: Raised if the deposited amount is incorrect.
InsufficientBalance: Raised if a user does not have enough tokens for the deposit.

Front-end
The front-end interacts with the Solana blockchain and the Anchor program via the Solana web wallet. It allows users to:
Connect their wallets using the Solana wallet adapter.
View and interact with their vaults and escrow statuses.
Deposit tokens and trigger the swap once conditions are met.
Dependencies
Solana Wallet Adapter
React.js
Anchor API
Running the Front-end
To run the front-end interface, simply navigate to the app/ directory and use the following commands:
bash
Copy code
cd app
npm install
npm run start


Testing
Unit Tests
Unit tests for the smart contract are located in the tests/ folder. You can run the tests using the following command:
bash
Copy code
anchor test

Integration Testing
For full integration tests between the front-end and the smart contract:
Deploy the program on a local Solana cluster.
Run the front-end locally and execute token exchanges.

Contributing
We welcome contributions! Please follow these steps:
Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For more information or questions, feel free to open an issue or reach out via email.

This README outlines the structure and setup of the Token Escrow program, helping users and developers alike understand how to set it up and contribute to it.
