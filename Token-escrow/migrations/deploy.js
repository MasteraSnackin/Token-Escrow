const anchor = require('@project-serum/anchor');

module.exports = async function (provider) {
    // Configure provider
    anchor.setProvider(provider);

    // Deploy the program
    const program = anchor.workspace.TokenEscrow;
    // Add deployment logic here
};