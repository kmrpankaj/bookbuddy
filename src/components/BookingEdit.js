import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom
import Sidedash from './Sidedash';

const BookingEdit = () => {
  const { id } = useParams();
  const history = useNavigate(); 
  const [booking, setBooking] = useState(null);
  const host = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`${host}/bookings/api/singlebookings/${id}`);
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSeatDetailChange = (e, index) => {
    const { name, value } = e.target;
    const newSeatDetails = [...booking.seatDetails];
    newSeatDetails[index][name] = value;
    setBooking({ ...booking, seatDetails: newSeatDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/bookings/api/edit/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });
      if (response.ok) {
        history('/bookings');
      } else {
        console.error('Error updating booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <Sidedash />
          <div className="col-md-10 pt-3">
            <div className="row">
              <div className="col-md-12">
                <div className='container'>
                  <h3>Edit Booking</h3>
                  <form onSubmit={handleSubmit}>
                  <div className='mb-3 row'>
                    <div className="mb-3">
                      <label className="form-label">Booked By</label>
                      <input type="text" className="form-control" name="bookedBy" value={booking.bookedBy} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Booking Date</label>
                      <input type="date" className="form-control" name="bookingDate" value={booking.bookingDate} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client Txn ID</label>
                      <input type="text" className="form-control" name="clientTxnId" value={booking.clientTxnId} onChange={handleInputChange} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input type="number" className="form-control" name="amount" value={booking.amount} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Discount Coupon</label>
                      <input type="text" className="form-control" name="discountCoupon" value={booking.discountCoupon} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Discount Value</label>
                      <input type="number" className="form-control" name="discountValue" value={booking.discountValue} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Price</label>
                      <input type="number" className="form-control" name="totalPrice" value={booking.totalPrice} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Mode</label>
                      <input type="text" className="form-control" name="paymentMode" value={booking.paymentMode} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order Status</label>
                      <input type="checkbox" className="form-check-input" name="orderStatus" checked={booking.orderStatus} onChange={(e) => setBooking({ ...booking, orderStatus: e.target.checked })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Cash</label>
                      <input type="number" className="form-control" name="pCash" value={booking.pCash} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Online</label>
                      <input type="number" className="form-control" name="pOnline" value={booking.pOnline} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Info</label>
                      <input type="text" className="form-control" name="pInfo" value={booking.pInfo} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Customer Name</label>
                      <input type="text" className="form-control" name="customerName" value={booking.customerName} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Customer Email</label>
                      <input type="email" className="form-control" name="customerEmail" value={booking.customerEmail} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Customer Mobile</label>
                      <input type="text" className="form-control" name="customerMobile" value={booking.customerMobile} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount Paid</label>
                      <input type="text" className="form-control" name="udf1" value={booking.udf1} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Due</label>
                      <input type="text" className="form-control" name="udf2" value={booking.udf2} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                      <input type="text" className="form-control" name="udf3" value={booking.udf3} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Status</label>
                      <input type="text" className="form-control" name="paymentStatus" value={booking.paymentStatus} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Seat Details</label>
                      {booking.seatDetails.map((seat, index) => (
                        <div key={index} className="mb-3">
                          <input type="text" className="form-control mb-1" name="seatNumber" placeholder="Seat Number" value={seat.seatNumber} onChange={(e) => handleSeatDetailChange(e, index)} />
                          <input type="text" className="form-control mb-1" name="slot" placeholder="Slot" value={seat.slot} onChange={(e) => handleSeatDetailChange(e, index)} />
                          <input type="date" className="form-control mb-1" name="seatValidTill" placeholder="Valid Till" value={formatDateForInput(seat.seatValidTill)} onChange={(e) => handleSeatDetailChange(e, index)} />
                          <input type="text" className="form-control mb-1" name="type" placeholder="Type" value={seat.type} onChange={(e) => handleSeatDetailChange(e, index)} />
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="btn btn-primary">Update Booking</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingEdit;
