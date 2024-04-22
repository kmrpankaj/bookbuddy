import React, { useEffect, useState } from 'react';

function TransactionStatus({ match }) {
    const host = process.env.REACT_APP_BACKEND_URL;
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${host}/api/transaction/${match.params.clientTxnId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch transaction data');
                }
            })
            .then(data => setTransaction(data))
            .catch(error => setError(error.message));
    }, [match.params.clientTxnId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!transaction) {
        return <div>Loading transaction data...</div>;
    }

    return (
        <div>
            <h1>Transaction Status</h1>
            <p><strong>Status:</strong> {transaction.paymentStatus}</p>
            <p><strong>Transaction Number:</strong> {transaction.transactionNum}</p>
            <p><strong>Amount:</strong> {transaction.amount}</p>
            {/* Add more fields as needed */}
        </div>
    );
}

export default TransactionStatus;
