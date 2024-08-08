import React from 'react';

const DeleteConfirmationModal = ({ show, handleClose, handleConfirm, bookingDetails }) => {
    if (!show) return null;

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Deletion</h5>
                        <button type="button" className="btn-close" onClick={handleClose}>
                            <span aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className="modal-body">
                    <p>Are you sure you want to <span className='fw-bold text-danger'>delete</span> this booking with following details?:
                        <ul>
                        <li>Name:<span className='fw-bold'> {bookingDetails.customerName}</span></li>
                        <li>Txn ID:<span className='fw-bold'> {bookingDetails.clientTxnId}</span></li>
                        <li>Total Amount:<span className='fw-bold'> {bookingDetails.amount}</span></li>
                        </ul>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
