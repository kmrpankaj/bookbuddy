import React, { useEffect, useState, useContext } from 'react';
import Sidedash from './Sidedash';
import { formatDate } from './Utilsfunc';
import AlertContext from '../context/AlertContext';
import { capitalizeFirstLetter } from './Utilsfunc';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const host = process.env.REACT_APP_BACKEND_URL;
    const { showAlert } = useContext(AlertContext)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${host}/bookings/api/bookings`); // Adjust the path if needed
            const data = await response.json();
            setBookings(data.reverse());
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    //=================================
    // Delete bookings
    const deleteBooking = async (bookingId) => {
        try {
            await fetch(`${host}/bookings/api/delete/booking/${bookingId}`, {
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
        console.log('Sending receipt for:', TxnId);
        setIsLoading(true);
        try {
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

                                    <div className="card rounded border">
                                        <div className='card-header text-center'>Bookings</div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead className='align-top bookings-table-head'>
                                                        <tr>
                                                            <th>Payment Status</th>
                                                            <th>Booking Date</th>
                                                            <th>Client Txn ID</th>
                                                            <th>Booked By</th>
                                                            <th>Customer Name</th>
                                                            <th>Seat Details</th>
                                                            <th>Amount</th>
                                                            <th>Created At</th>
                                                            <th>Discount Coupon</th>
                                                            <th>Discount Value</th>
                                                            <th>Total Price</th>
                                                            <th>Payment Mode</th>
                                                            <th>Order Status</th>
                                                            <th>Payment Cash</th>
                                                            <th>Payment Online</th>
                                                            <th>Payment Info</th>
                                                            <th>Customer Email</th>
                                                            <th>Customer Mobile</th>
                                                            <th>Partial Payment</th>
                                                            <th>Amount Due</th>
                                                            <th>Notes</th>
                                                            <th>Updated At</th>
                                                            <th>Receipt</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='bookings-table'>
                                                        {bookings.map((booking, index) => (
                                                            <tr key={index}>
                                                                <td><span className={`badge p-2 text-capitalize text-bg-${(booking.paymentStatus === 'paid') || (booking.paymentStatus === 'success') ? 'success' : 'warning'}`}>{booking.paymentStatus}</span></td>
                                                                <td>{formatDate(booking.bookingDate)}</td>
                                                                <td>{booking.clientTxnId}</td>
                                                                <td>{booking.bookedBy}</td>
                                                                <td>{booking.customerName}</td>
                                                                <td>
                                                                    <ul>
                                                                        {booking.seatDetails.map((seat, seatIndex) => (

                                                                            <li className="text-nowrap rounded border px-2" style={{'marginTop': '-1px'}} key={seatIndex}>
                                                                                <span className='fw-medium'>Seat Number: </span><span>{seat.seatNumber}</span> | <span className='fw-medium'>Slot: </span> <span className='text-capitalize'>{seat.slot}</span> |  <span className='fw-medium'>Valid Till:  </span><span>{seat.seatValidTill ? formatDate(seat.seatValidTill) : seat.seatValidTill}</span> |  <span className='fw-medium'>Type:</span> <span className={`px-1 text-capitalize text-bg-${seat.type==='new'?'warning':'success'}`}>{seat.type}</span>
                                                                            </li>

                                                                        ))}
                                                                    </ul>
                                                                </td>
                                                                <td>{booking.amount}</td>
                                                                <td>{formatDate(booking.createdAt)}</td>
                                                                <td>{booking.discountCoupon}</td>
                                                                <td>{booking.discountValue}</td>
                                                                <td>{booking.totalPrice}</td>
                                                                <td>{booking.paymentMode}</td>
                                                                <td>{booking.orderStatus ? 'True' : 'False'}</td>
                                                                <td>{booking.pCash}</td>
                                                                <td>{booking.pOnline}</td>
                                                                <td>{booking.pInfo}</td>
                                                                <td>{booking.customerEmail}</td>
                                                                <td>{booking.customerMobile}</td>
                                                                <td>{booking.udf1}</td>
                                                                <td><span className={`${booking.udf2?'badge text-bg-danger': ''}`}>{booking.udf2}</span></td>
                                                                <td>{booking.udf3}</td>
                                                                <td>{formatDate(booking.updatedAt)}</td>
                                                                <td><button onClick={() => handleSendReceipt(booking.clientTxnId)}>Send</button></td>
                                                                <td>
                                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteBooking(booking._id)}>Delete</button>
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
