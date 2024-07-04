import React, { useState } from 'react';
import Sidedash from './Sidedash';

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

    const handleRemoveClick = (index) => {
        const list = [...booking.seatDetails];
        list.splice(index, 1);
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
        <div>
            <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    <div className="col-md-10 pt-3">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>Create Receipt</h3>
                                <form onSubmit={handleSubmit} className="">

                                    <div className='mb-3'>
                                        <div className='col-md-5'>
                                            <span className="mb-2 d-block">User Search</span>
                                            <div className="input-group col-md-5">
                                                <input type="search" className="form-control rounded-start" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                                                <button type="button" className="btn btn-outline-primary" data-mdb-ripple-init>search</button>
                                            </div>
                                        </div>

                                        <div className='col-md-5 bg-body-tertiary'>
                                            <ul className="list-group list-group-flush shadow-sm ">
                                                <li className="list-group-item list-group-item-action">An item</li>
                                                <li className="list-group-item list-group-item-action">A second item</li>
                                                <li className="list-group-item list-group-item-action">A third item</li>
                                                <li className="list-group-item list-group-item-action">A fourth item</li>
                                                <li className="list-group-item list-group-item-action">And a fifth one</li>
                                            </ul>
                                        </div>
                                    </div>


                                    {booking.seatDetails.map((x, i) => (
                                        <div key={i} className="mb-3 p-3 bg-body-secondary rounded border border-1 border-secondary-subtle">

                                            <div className="mb-3 row g-3">
                                                <div className="form-group col-md-6">
                                                    <label className="form-label">Seat Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="seatNumber"
                                                        value={x.seatNumber}
                                                        onChange={e => handleInputChange(e, i)}
                                                    />
                                                </div>

                                                <div className="form-group col-md-6">
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
                                                </div>
                                            </div>

                                            <div className="mb-3 row g-3">
                                                <div className="form-group col-md-6">
                                                    <label className="form-label">Type</label>
                                                    <select
                                                        className="form-select"
                                                        name="type"
                                                        value={x.type}
                                                        onChange={e => handleInputChange(e, i)}
                                                    >
                                                        <option value="renewal">Renewal</option>
                                                        <option value="new">New</option>
                                                    </select>
                                                </div>

                                                <div className="form-group col-md-6">
                                                    <label className="form-label">Valid Till</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="seatValidTill"
                                                        value={x.seatValidTill}
                                                        onChange={e => handleInputChange(e, i)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='text-center'><button type="button" onClick={() => handleRemoveClick(i)} className="btn btn-danger mt-2">Remove</button></div>

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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingForm