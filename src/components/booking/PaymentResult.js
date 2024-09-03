import React from 'react';
import { useLocation } from 'react-router-dom';

function PaymentResult() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status'); // e.g., 'success' or 'failure'
    const message = queryParams.get('message'); // Optional message from gateway

    return (
        <div>
            <h1>Payment Result</h1>
            <p>Status: {status}</p>
            <p>Message: {message || 'No message provided.'}</p>
        </div>
    );
}

export default PaymentResult;