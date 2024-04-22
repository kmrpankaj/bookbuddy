import React, { useState } from 'react';

const BookingForm = () => {
    const [booking, setBooking] = useState({
        studentId: '',
        seatDetails: [{ seatNumber: '', slot: '', seatValidTill: '' }],
        bookingDate: '',
        endDate: '',
        transactionNum: '',
        discountCoupon: '',
        clientTxnId: '',
        amount: '',
        pInfo: '',
        customerName: '',
        customerEmail: '',
        customerMobile: '',
        redirectUrl: '',
        udf1: '',
        udf2: '',
        udf3: '',
        paymentUrl: '',
        upiIdHash: '',
        upiTxnId: '',
        statusRemark: '',
        txnAt: '',
        merchantName: '',
        merchantUpiId: '',
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...booking.seatDetails];
        list[index][name] = value;
        setBooking({ ...booking, seatDetails: list });
    };

    const handleAddClick = () => {
        setBooking({
            ...booking,
            seatDetails: [...booking.seatDetails, { seatNumber: '', slot: '', seatValidTill: '' }],
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(booking);
        // You would handle API submission here
    };
  return (
    <form onSubmit={handleSubmit} className="container mt-5">
            <h3>Create Booking Order</h3>
            {booking.seatDetails.map((x, i) => (
                <div key={i} className="mb-3">
                    <label className="form-label">Seat Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="seatNumber"
                        value={x.seatNumber}
                        onChange={e => handleInputChange(e, i)}
                    />
                    <label className="form-label">Slot</label>
                    <select
                        className="form-select"
                        name="slot"
                        value={x.slot}
                        onChange={e => handleInputChange(e, i)}
                    >
                        <option value="">Select a Slot</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                    </select>
                    <label className="form-label">Valid Till</label>
                    <input
                        type="date"
                        className="form-control"
                        name="seatValidTill"
                        value={x.seatValidTill}
                        onChange={e => handleInputChange(e, i)}
                    />
                    {booking.seatDetails.length - 1 === i && (
                        <button
                            type="button"
                            onClick={handleAddClick}
                            className="btn btn-primary mt-2"
                        >
                            Add Seat
                        </button>
                    )}
                </div>
            ))}
            {/* Other fields would go here */}
            <button type="submit" className="btn btn-success">Submit Booking</button>
        </form>
  )
}

export default BookingForm