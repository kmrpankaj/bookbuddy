import React, { useEffect, useState, useContext, useRef } from 'react';
import Sidedash from './Sidedash';
import { Link } from 'react-router-dom';
import { formatDate } from './Utilsfunc';
import AlertContext from '../context/AlertContext';
import ClearDuesModal from './ClearDuesModal';


const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const host = process.env.REACT_APP_BACKEND_URL;
    const { showAlert } = useContext(AlertContext)
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const tableRef = useRef(null);

    // Table scroll horizontally
    const scrollTable = (direction) => {
        if (tableRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            tableRef.current.scrollTo({
                left: tableRef.current.scrollLeft + scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleOpenModal = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${host}/bookings/api/bookings`, {
                headers: {
                    "auth-token": localStorage.getItem('token'),
                },
            }); // Adjust the path if needed
            const data = await response.json();
            setBookings(data.reverse());
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };


    //=================================
    // Handle clear dues
    const handleClearDues = async (bookingId, pCashValue, pOnlineValue) => {
        try {
            const response = await fetch(`${host}/bookings/api/clear-dues/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    updatePCash: pCashValue > 0,
                    updatePOnline: pOnlineValue > 0,
                    pCashValue,
                    pOnlineValue,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to clear dues:', errorData.message);
                return;
            }

            const data = await response.json();
            console.log('Dues cleared successfully:', data);
            // Update your state or UI as needed
            await fetchBookings();
        } catch (error) {
            console.error('Error clearing dues:', error);
        }
    };

    //=================================
    // Delete bookings
    const deleteBooking = async (bookingId) => {
        try {
            await fetch(`${host}/bookings/api/delete/booking/${bookingId}`, {
                headers: {
                    "auth-token": localStorage.getItem('token'),
                },
                method: 'DELETE',
            });
            setBookings(bookings.filter((booking) => booking._id !== bookingId));
            showAlert('Booking Deleted', 'success')
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    //=================================
    // Send Receipts
    const sendReceipt = async (TxnId) => {
        //console.log('Sending receipt for:', TxnId);
        setIsLoading(true);
        const spinnerId = `loading-${TxnId}`;
        const spinnerElement = document.getElementById(spinnerId);

        try {
            if (spinnerElement) {
                spinnerElement.style.display = 'block'; // Hide spinner after state change
            } else {
                console.warn(`Spinner element with ID 'loading-${TxnId}' not found.`); // Handle missing element
            }
            const response = await fetch(`${host}/bookings/send-receipt/${TxnId}`, {
                method: 'POST',
                // Optionally add headers and body for the request
            });

            if (!response.ok) {

                const errorResponse = await response.json(); // Parse the error response
                throw new Error(errorResponse.message || `Error sending receipt: ${response.statusText}`);
            }
            showAlert('Email Sent!', 'success')
            // Handle successful response
            console.log('Receipt sent successfully!');
        } catch (error) {
            console.error('Error sending receipt:', error);
            showAlert(error.message, 'danger')
        } finally {
            setIsLoading(false);
            if (spinnerElement) {
                spinnerElement.style.display = 'none'; // Hide spinner after state change
            } else {
                console.warn(`Spinner element with ID 'loading-${TxnId}' not found.`); // Handle missing element
            }
        }
    };

    const handleSendReceipt = (txnId) => {
        sendReceipt(txnId);
    };


    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    <div className="col-md-10 pt-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className='container'>

                                    <div className='scrollbtn position-relative'>
                                        <button
                                            className='bg-dark px-3 bg-opacity-50'
                                            onClick={() => scrollTable('left')}
                                            style={{
                                                position: 'fixed',
                                                top: '12%',
                                                right: "45px",
                                                transform: 'translateY(-50%)',
                                                zIndex: 1000,
                                            }}>&#8249; {/* Left arrow */}</button>
                                        <button
                                            className='bg-dark px-3 bg-opacity-50'
                                            onClick={() => scrollTable('right')}
                                            style={{
                                                position: 'fixed',
                                                top: '12%',
                                                right: "5px",
                                                transform: 'translateY(-50%)',
                                                zIndex: 1000,
                                            }}>&#8250; {/* Right arrow */}</button>
                                    </div>

                                    <div className="card rounded border">
                                        <div className='card-header text-center'>Bookings</div>
                                        <div className="card-body">
                                            <div className="table-responsive" ref={tableRef}>
                                                <table className="table">
                                                    <thead className='align-top bookings-table-head'>
                                                        <tr>
                                                            <th>Payment Status</th>
                                                            <th>Booking Date</th>
                                                            <th>Client Txn ID</th>
                                                            <th>UHID</th>
                                                            <th>Customer Name</th>
                                                            <th>Amount</th>
                                                            <th>Payment Mode</th>
                                                            <th>Partial Payment</th>
                                                            <th>Amount Due</th>
                                                            <th>Seat Details</th>
                                                            <th>Receipt</th>
                                                            {/* <th>Created At</th> */}
                                                            <th>Total Price</th>
                                                            <th>Discount Coupon</th>
                                                            <th>Discount Value</th>
                                                            {/* <th>Order Status</th> */}
                                                            <th>Payment Cash</th>
                                                            <th>Payment Online</th>
                                                            {/* <th>Payment Info</th> */}
                                                            <th>Customer Email</th>
                                                            <th>Customer Mobile</th>
                                                            <th>Notes</th>
                                                            <th>Updated At</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='bookings-table'>
                                                        {bookings.map((booking, index) => (
                                                            <tr key={index}>
                                                                <td className={`border-dark-subtle border-start border-end text-capitalize ${(booking.paymentStatus === 'paid') || (booking.paymentStatus === 'success') ? 'bg-success-subtle' : 'bg-warning-subtle'}`}>
                                                                    <span>{booking.paymentStatus}</span>
                                                                    {booking.udf2 && booking.udf2 !== '0' && (
                                                                        <>
                                                                            <span><button onClick={() => handleOpenModal(booking)} className='badge p-2 text-capitalize mt-1'>Clear Dues</button></span>
                                                                            {selectedBooking && (
                                                                                <ClearDuesModal
                                                                                    bookingId={selectedBooking._id}
                                                                                    amountDue={selectedBooking.udf2}
                                                                                    show={showModal}
                                                                                    handleClose={handleCloseModal}
                                                                                    handleClearDues={handleClearDues}
                                                                                    udf2Value={selectedBooking.udf2} // Pass the udf2 value from the booking data
                                                                                    cashOld={selectedBooking.pCash}
                                                                                    onlineOld={selectedBooking.pOnline}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td>{formatDate(booking.bookingDate)}</td>
                                                                <td>{booking.clientTxnId}</td>
                                                                <td>{booking.bookedBy}</td>
                                                                <td>{booking.customerName}</td>
                                                                <td>{booking.amount}</td>
                                                                <td>{booking.paymentMode}</td>
                                                                <td className={`${(parseFloat(booking.udf1) === booking.amount) ? "bg-success-subtle border-dark-subtle border-start border-end" :
                                                                    (parseFloat(booking.udf1) < booking.amount ? 'bg-warning-subtle border-dark-subtle border-start border-end' :
                                                                        (parseFloat(booking.udf1) === "" ? '' : ''))
                                                                    }`}>{booking.udf1} </td> {/* partial Payment */}
                                                                <td className={`${booking.udf2 && booking.udf2 !== '0' ? 'bg-warning-subtle text-danger fw-bold border-dark-subtle border-start border-end' : 'bg-success-subtle border-dark-subtle border-start border-end'}`}>{booking.udf2 ? booking.udf2 : "No Dues"}</td> {/* Amount due */}
                                                                <td>
                                                                    <ul className='list-unstyled'>
                                                                        {booking.seatDetails.map((seat, seatIndex) => (

                                                                            <li className="text-nowrap rounded border py-1 px-2 mb-1 d-flex align-items-center justify-content-between" style={{ 'marginTop': '-1px' }} key={seatIndex}>
                                                                                <span className='fw-medium'>Seat: </span><span>{seat.seatNumber ? seat.seatNumber : "?"}</span> | <span className='fw-medium'>Slot: </span> <span className='text-capitalize'>{seat.slot}</span> |  <span className='fw-medium'>Type:</span> <span className={`px-1 ms-1 text-capitalize text-bg-${seat.type === 'new' ? 'warning' : 'success'}`}>{seat.type}</span>
                                                                                {/* <span className='fw-medium'>Seat Number: </span><span>{seat.seatNumber}</span> | <span className='fw-medium'>Slot: </span> <span className='text-capitalize'>{seat.slot}</span> |  <span className='fw-medium'>Valid Till:  </span><span>{seat.seatValidTill ? formatDate(seat.seatValidTill) : seat.seatValidTill}</span> |  <span className='fw-medium'>Type:</span> <span className={`px-1 text-capitalize rounded text-bg-${seat.type === 'new' ? 'warning' : 'success'}`}>{seat.type}</span> */}
                                                                            </li>

                                                                        ))}
                                                                    </ul>
                                                                </td>
                                                                <td><button className='send-email btn-sm' onClick={() => handleSendReceipt(booking.clientTxnId)}><span id={`loading-${booking.clientTxnId}`} style={{ display: 'none' }} class="spinner-border spinner-border-sm" aria-hidden="true"></span>Send</button></td>
                                                                {/* <td>{formatDate(booking.createdAt)}</td> */}
                                                                <td>{booking.totalPrice}</td>
                                                                <td>{booking.discountCoupon ? booking.discountCoupon : "No"}</td>
                                                                <td>{booking.discountValue}</td>
                                                                {/* <td>{booking.orderStatus ? 'True' : 'False'}</td> */}
                                                                <td>{booking.pCash}</td>
                                                                <td>{booking.pOnline}</td>
                                                                {/* <td>{booking.pInfo}</td> */}
                                                                <td>{booking.customerEmail}</td>
                                                                <td>{booking.customerMobile}</td>
                                                                <td>{booking.udf3 ? booking.udf3 : "No notes"}</td> {/* Notes */}
                                                                <td>{formatDate(booking.updatedAt)}</td>
                                                                <td>
                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                        <span><button className="btn btn-danger btn-sm mb-0 me-2" onClick={() => deleteBooking(booking._id)}>Delete</button></span>
                                                                        <span><Link to={`/editbookings/${booking._id}`} className="btn btn-primary btn-sm">Edit</Link></span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManager;
