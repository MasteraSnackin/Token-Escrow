import React, { useState } from 'react';
import { createVault, depositTokens, swapTokens } from '../utils/solana';

function EscrowForm() {
    const [amountA, setAmountA] = useState(0);
    const [amountB, setAmountB] = useState(0);

    const handleCreateVault = async () => {
        // Call createVault function
        await createVault(amountA, amountB);
    };

    const handleDeposit = async () => {
        // Call depositTokens function
        await depositTokens(amountA);
    };

    const handleSwap = async () => {
        // Call swapTokens function
        await swapTokens();
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Amount A"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount B"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
            />
            <button onClick={handleCreateVault}>Create Vault</button>
            <button onClick={handleDeposit}>Deposit Tokens</button>
            <button onClick={handleSwap}>Swap Tokens</button>
        </div>
    );
}

export default EscrowForm;