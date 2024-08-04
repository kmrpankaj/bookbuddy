import React, { useState, useEffect, useCallback, useContext } from 'react';
import Sidedash from './Sidedash';
import debounce from 'lodash.debounce';
import LoadingContext from '../context/LoadingContext'
import AlertContext from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {

    const host = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [shouldSearch, setShouldSearch] = useState(true);
    const [noSearchResult, setNoSearchResult] = useState(false);
    const { showAlert } = useContext(AlertContext)
    const [orderResponse, setOrderResponse] = useState(null);
    const [paymentType, setPaymentType] = useState('Full');
    const [paymentMode, setPaymentMode] = useState('Online');
    const [paybalAmount, setPaybalAmount] = useState('')
    const formatDateToIST = () => {
        const now = new Date();
        // Convert to milliseconds and adjust for IST (UTC +5:30)
        const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istTime = new Date(now.getTime() + offset);
        return istTime.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    };

    const currentDate = formatDateToIST(Date.now());

    const calculateNextMonthDate = () => {
        const now = new Date();
        // now.setMonth(now.getMonth() + 1);
        return now.toISOString().split('T')[0];
    };


    const [booking, setBooking] = useState({
        bookedBy: '',
        seatDetails: [{ seatNumber: '', slot: '', seatValidTill: calculateNextMonthDate(), type: 'new' }],
        bookingDate: currentDate,
        endDate: '',
        transactionNum: '',
        discountCoupon: '',
        discountValue: '',
        totalPrice: '',
        clientTxnId: '',
        amount: '',
        pInfo: '',
        validityInfo: [],
        locker:false,
        securityDeposit: false,
        customerName: '',
        customerEmail: '',
        customerMobile: '',
        redirectUrl: '',
        udf1: '',
        udf2: '',
        udf3: '',
        paymentMode: 'Online',
        pCash: '',
        pOnline: '',
        paymentStatus: 'paid',
        paymentUrl: '',
        upiIdHash: '',
        upiTxnId: '',
        statusRemark: '',
        txnAt: '',
        merchantName: '',
        merchantUpiId: '',
    });

    const fetchStudents = useCallback(

        debounce(async (query) => {
            if (!query) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`${host}/bookings/search-students?query=${query}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data) && data.length === 0) {
                    setNoSearchResult(true);
                }
                setSearchResults(data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }, 2000), [host]);

    useEffect(() => {
        if (searchQuery && shouldSearch) {
            setIsLoading(true);
            fetchStudents(searchQuery);
            return () => {
                fetchStudents.cancel();
            };
        } else {
            setSearchResults([]);
            setIsLoading(false);

        }
    }, [searchQuery, fetchStudents]);

    const handlePaymentTypeChange = (event) => {
        const newPaymentType = event.target.value;
        setPaymentType(newPaymentType);

        if (newPaymentType === 'Full') {
            setBooking({ ...booking, udf1: '', udf2: '', paymentStatus: 'paid' });
            setPaybalAmount(booking.amount);
        } else if (newPaymentType === 'Partial') {
            setBooking({ ...booking, paymentStatus: 'pending' });
            setPaybalAmount(booking.udf1 || 0);
        }
    };

    const handlePaymentModeChange = (event) => {
        const newPaymentMode = event.target.value;
        setPaymentMode(newPaymentMode);
        if (newPaymentMode === 'Online') {
            setBooking((prevBooking) => ({
                ...prevBooking,
                paymentMode: newPaymentMode,
                pCash: '',
                pOnline: paybalAmount
            }));
        } else if (newPaymentMode === 'Cash') {
            setBooking((prevBooking) => ({
                ...prevBooking,
                paymentMode: newPaymentMode,
                pCash: paybalAmount,
                pOnline: ''
            }));
        } else {
            setBooking((prevBooking) => ({
                ...prevBooking,
                paymentMode: newPaymentMode
            }));
        }
    };

    const handleStudentSelect = (student) => {
        const seatDetails = student.seatAssigned.map(seat => ({
            seatNumber: seat.seatNumber,
            slot: seat.slot,
            seatValidTill: seat.validityDate.split('T')[0], // Converting to yyyy-mm-dd format
            type: 'renewal',
        }));

        setBooking((prevBooking) => ({
            ...prevBooking,
            bookedBy: student.uid,
            customerName: student.name,
            customerEmail: student.email,
            customerMobile: student.phone,
            seatDetails: seatDetails.length > 0 ? seatDetails : [{ seatNumber: '', slot: '', seatValidTill: calculateNextMonthDate(), type: 'new' }],
            pOnline: paybalAmount
        }));
        setSearchQuery(student.uid);  // Set the selected student's name in the search box
        setSearchResults([]);  // Clear the search results
        setShouldSearch(false);
    };

    const handleInputChange = (e, index) => {
        setNoSearchResult(false)
        const { name, value } = e.target;
        if (value === '') {
            setBooking((prevBooking) => ({
                ...prevBooking,
                bookedBy: '',
                customerName: '',
                customerEmail: '',
                customerMobile: '',
                seatDetails: [{ seatNumber: '', slot: '', seatValidTill: calculateNextMonthDate(), type: 'new' }],
            }));
        }
        if (name === 'studentSearch') {
            setShouldSearch(true);
            setSearchQuery(value);
            const query = e.target.value;
            fetchStudents(query);

        } else {
            const list = [...booking.seatDetails];
            list[index][name] = value;
            setBooking({ ...booking, seatDetails: list });
        }
    };

    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;

        // Define fields that should be treated as numbers
        const numericFields = ['udf1', 'pOnline', 'amount', 'udf2', 'pCash'];

        // Convert value to a number if the field is in numericFields, otherwise use the value as is
        const numericValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;

        setBooking((prevBooking) => {
            let newPaybalAmount = paybalAmount;
            let newUdf2 = prevBooking.udf2;
            let newPCash = prevBooking.pCash;
            // Calculate udf2 and pCash based on the input
            if (name === 'udf1') {
                newPaybalAmount = numericValue;
                newUdf2 = prevBooking.amount - numericValue;
            } else if (name === 'pOnline') {
                newPCash = newPaybalAmount - numericValue;
            }
            return {
                ...prevBooking,
                [name]: numericValue,
                udf2: newUdf2,
                pCash: newPCash
            };
        });

        if (name === 'udf1') {
            setPaybalAmount(numericValue);
        }
    };



    const handleRemoveClick = (index) => {
        const list = [...booking.seatDetails];
        list.splice(index, 1);
        setBooking({ ...booking, seatDetails: list });
    };

    const handleAddClick = () => {
        setBooking({
            ...booking,
            seatDetails: [...booking.seatDetails, { seatNumber: '', slot: '', seatValidTill: calculateNextMonthDate(), type: 'new' }],
        });
    };


    const handleDateChange = (e) => {
        setBooking({ ...booking, bookingDate: e.target.value });
    };

    // const handleDiscountChange = (e) => {
    //     const { name, value } = e.target;
    //     setBooking({ ...booking, [name]: value }, calculateTotal);
    // };

    const validateCoupon = async (couponCode, e) => {
        e.preventDefault()
        if (!couponCode || !couponCode.trim() || booking.couponApplied) {
            showAlert("Please enter a coupon code or remove the existing coupon first.", "danger")
            return;
        }
        if (booking.seatDetails.length === 0) {
            showAlert("Select a seat to book in order to apply a coupon", "danger")
            return;
        }

        try {
            const seatSlots = booking.seatDetails.map(seat => seat.slot);
            const response = await fetch(`${host}/coupons/check-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode,
                    productCount: booking.seatDetails.length,
                    productTypes: seatSlots
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            if (response.ok) {
                console.log('Coupon data received:', data);
                applyDiscount(data);
                setBooking({ ...booking, discountValue: data.discountValue, couponApplied: true })
                console.log(booking)
            }

            //console.log(data)
            showAlert("Coupon applied successfully!", "success")
        } catch (error) {
            showAlert(`Error applying coupon: ${error.message}`, "danger")
        }
    };

    const applyDiscount = (coupon) => {
        setBooking((prevBooking) => {
            console.log('Previous booking state:', prevBooking);
            let discountValue = 0;
            const totalPrice = prevBooking.seatDetails.length * 400; // Calculate subTotal based on seat details

            if (coupon.discountType === 'amount') {
                discountValue = coupon.discountValue;
            } else if (coupon.discountType === 'percentage') {
                discountValue = (totalPrice * coupon.discountValue) / 100;
            }

            console.log('Calculated discount value:', discountValue);
            const amount = totalPrice - discountValue;

            return {
                ...prevBooking,
                discountCoupon: coupon.code,
                discountValue: coupon.discountValue,
                couponApplied: true,
                totalPrice: totalPrice,
                amount: amount
            };

        });
    };

    const calculateTotal = () => {
        setBooking((prevBooking) => {
            const seatCost = 400;
            const lockerCost = prevBooking.locker ? 100 : 0;
            const securityDeposit = prevBooking.securityDeposit ? 100 : 0; // Add 100 if security deposit is selected
            const totalPrice = (prevBooking.seatDetails.length * seatCost) + lockerCost + securityDeposit;
            const discountValue = prevBooking.discountValue || 0;
            const amount = totalPrice - discountValue;
            return {
                ...prevBooking,
                totalPrice,
                amount,
                discountValue,
                couponApplied: prevBooking.couponApplied
            };
        });
    };

    const removeCoupon = () => {
        const totalPrice = booking.totalPrice
        setBooking({ ...booking, discountCoupon: '', discountValue: 0, couponApplied: false, amount: totalPrice });
        showAlert("Coupon removed!!", "success")
    };

    const generateTransactionId = async () => {
        try {
            const txnResponse = await fetch(`${host}/bookings/generate-txn-id`);
            const txnData = await txnResponse.json();

            if (!txnResponse.ok) {
                throw new Error('Failed to generate a unique transaction ID: ' + txnData.message);
            }

            const clientTxnIdAsString = String(txnData.clientTxnId);
            return clientTxnIdAsString;
        } catch (error) {
            console.error('Error during transaction ID generation:', error.message);
            throw error; // Rethrow to handle it in the caller
        }
    };

    const createOrder = async (updatedBooking) => {
        try {
            const response = await fetch(`${host}/bookings/create/direct-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify(updatedBooking),
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to create order: ' + responseData.message);
            }

            setOrderResponse(responseData);
            console.log(responseData, 'responsedata');

            await callDirectWebhook(updatedBooking.clientTxnId);

            // Handle webhook data if needed
        } catch (error) {
            console.error('Error during order creation:', error.message);
            showAlert(`Something went wrong: ${error.message}`, 'danger')
        }
    };



    const callDirectWebhook = async (clientTxnId) => {
        try {
            const response = await fetch(`${host}/bookings/api/direct-webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify({ clientTxnId }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to call direct webhook: ' + responseData.message);
            }

            console.log('Direct webhook called successfully');
            showAlert(responseData.message, 'success'); // Show alert with the response message
            setBooking({
                bookedBy: '',
                seatDetails: [{ seatNumber: '', slot: '', seatValidTill: calculateNextMonthDate(), type: 'new' }],
                bookingDate: currentDate,
                endDate: '',
                transactionNum: '',
                discountCoupon: '',
                discountValue: '',
                totalPrice: '',
                clientTxnId: '',
                amount: '',
                pInfo: '',
                validityInfo: [],
                locker:false,
                securityDeposit: false,
                customerName: '',
                customerEmail: '',
                customerMobile: '',
                redirectUrl: '',
                udf1: '',
                udf2: '',
                udf3: '',
                paymentMode: 'Online',
                pCash: '',
                pOnline: '',
                paymentStatus: 'paid',
                paymentUrl: '',
                upiIdHash: '',
                upiTxnId: '',
                statusRemark: '',
                txnAt: '',
                merchantName: '',
                merchantUpiId: '',
            })
            setSearchQuery('')
        } catch (error) {
            console.error('Error calling direct webhook:', error.message);
            showAlert(`Something went wrong: ${error.message}`, 'danger')
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const clientTxnIdAsString = await generateTransactionId();

            const updatedBooking = {
                ...booking,
                clientTxnId: clientTxnIdAsString,
            };

            // Update the state and proceed to create the order
            setBooking(updatedBooking);
            //console.log(updatedBooking, 'kya hai updated booking me')
            await createOrder(updatedBooking);

        } catch (error) {
            console.error('Error during transaction ID generation:', error.message);
            showAlert(`Something went wrong: ${error.message}`, 'danger')
        }
    };


    const extendValidity = (index) => {
        const newSeatDetails = [...booking.seatDetails];
        const currentDate = new Date(newSeatDetails[index].seatValidTill);

        // Add one month to the current date
        currentDate.setMonth(currentDate.getMonth() + 1);

        // If it's the first time extending, save the original date
        if (!newSeatDetails[index].originalSeatValidTill) {
            newSeatDetails[index].originalSeatValidTill = newSeatDetails[index].seatValidTill;
        }

        // Calculate the total extension by comparing the original validity with the current extended date
        const originalValidity = new Date(newSeatDetails[index].originalSeatValidTill);
        const totalExtension = Math.floor((currentDate - originalValidity) / (1000 * 60 * 60 * 24 * 30)); // Convert milliseconds to months

        // Update the date and track the extension
        newSeatDetails[index].seatValidTill = currentDate.toISOString().split('T')[0];
        newSeatDetails[index].totalExtension = totalExtension;

        // Update the booking state with the new seat details and save the total extension to pInfo array
        setBooking((prevBooking) => {
            const newPInfo = [...(prevBooking.validityInfo || [])];
            newPInfo[index] = totalExtension; // Update pInfo for this seat

            return {
                ...prevBooking,
                seatDetails: newSeatDetails,
                validityInfo: newPInfo, // Update the pInfo array
            };
        });
    };

    const handleValidityInputChange = (e, index) => {
        const { value } = e.target;
        const newSeatDetails = [...booking.seatDetails];

        // If the original date is not set, set it now
        if (!newSeatDetails[index].originalSeatValidTill) {
            newSeatDetails[index].originalSeatValidTill = newSeatDetails[index].seatValidTill;
        }

        // Update the specific field
        newSeatDetails[index].seatValidTill = value;

        // Calculate the total extension from the original date
        const originalValidity = new Date(newSeatDetails[index].originalSeatValidTill);
        const currentValidity = new Date(value);
        const totalExtension = Math.floor((currentValidity - originalValidity) / (1000 * 60 * 60 * 24 * 30)); // Convert milliseconds to months

        // Update the total extension
        newSeatDetails[index].totalExtension = totalExtension;

        // Update the booking state with the new seat details and save the total extension to pInfo array
        setBooking((prevBooking) => {
            const newPInfo = [...(prevBooking.validityInfo || [])];
            newPInfo[index] = totalExtension; // Update pInfo for this seat

            return {
                ...prevBooking,
                seatDetails: newSeatDetails,
                validityInfo: newPInfo, // Update the pInfo array
            };
        });
    };

    const handleLockerChange = (isLockerSelected) => {
        setBooking((prevBooking) => ({
            ...prevBooking,
            locker: isLockerSelected,
        }));

        // Recalculate total after locker selection change
        calculateTotal();
    };

    const handleSecurityDepositChange = (isSecurityDepositSelected) => {
        setBooking((prevBooking) => ({
            ...prevBooking,
            securityDeposit: isSecurityDepositSelected,
        }));

        // Recalculate total after security deposit selection change
        calculateTotal();
    };


    useEffect(() => {
        calculateTotal();
    }, [booking.seatDetails, booking.discountValue]);
    useEffect(() => {
        if (paymentType === 'Full') {
            setPaybalAmount(booking.amount);
        } else if (paymentType === 'Partial' && booking.udf1) {
            setPaybalAmount(booking.udf1);
        }
        console.log(booking, 'where is customer name?')
    }, [booking, paymentType]);

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    <div className="col-md-10 pt-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className='container'>
                                    <h3>Create Receipt</h3>
                                    <form onSubmit={handleSubmit} className="">

                                        <div className='mb-3 row'>
                                            <div className='col-md-5 position-relative'>
                                                <span className="mb-2 d-block">User Search</span>
                                                <div className="input-group col-md-5">
                                                    <input name="studentSearch" value={searchQuery} type="search" onChange={(e) => handleInputChange(e)} className="form-control rounded-start" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />

                                                    <button type="button" className="btn btn-outline-primary" data-mdb-ripple-init>
                                                        {isLoading ?
                                                            <>
                                                                <div className="spinner-grow spinner-grow-sm" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                                                            </>
                                                        }
                                                    </button>

                                                </div>
                                                <ul className="list-group position-absolute list-group-flush shadow-sm z-1 rounded border border-1 border-secondary-subtle" style={{ marginTop: '-16px', border: '1px solid #dee2e6' }}>
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((student) => (
                                                            <li key={student._id} className="list-group-item list-group-item-action" onClick={() => handleStudentSelect(student)}>{student.name} - {student.email} - {student.uid} - {student.phone}</li>
                                                        ))
                                                    ) : (
                                                        searchQuery && !isLoading && noSearchResult && <li className="list-group-item list-group-item-action text-danger">No student found.</li>
                                                    )
                                                    }
                                                </ul>
                                            </div>


                                            <div className="col-md-5">
                                                <label className="form-label">Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="bookingDate"
                                                    value={booking.bookingDate}
                                                    onChange={handleDateChange}
                                                />
                                            </div>



                                        </div>


                                        <div className="row mb-3">
                                            <div className="col">
                                                <label className="form-label">Customer Name</label>
                                                <input type="text" name='customerName' value={booking.customerName} className="form-control" placeholder="First name" aria-label="Name" onChange={handleBookingInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col">
                                                <label className="form-label">Customer Mobile</label>
                                                <input type="text" name='customerMobile' value={booking.customerMobile} className="form-control" placeholder="Phone" aria-label="Phone" onChange={handleBookingInputChange} />
                                            </div>
                                            <div className="col">
                                                <label className="form-label">Customer Email</label>
                                                <input type="text" name='customerEmail' value={booking.customerEmail} className="form-control" placeholder="Email" aria-label="Email" onChange={handleBookingInputChange} />
                                            </div>
                                        </div>


                                        {booking.seatDetails.map((x, i) => (
                                            <div key={i} className="mb-3 position-relative p-3 bg-body-secondary rounded border border-1 border-secondary-subtle">

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

                                                    <div className="form-group col-md-6 position-relative">
                                                        <label className="form-label me-2">Validity</label>
                                                        <button
                                                            type="button"
                                                            className="btn position-absolute btn-success btn-xs py-2"
                                                            onClick={() => extendValidity(i)}
                                                        >Extend 1 month</button>
                                                        <span className={`btn-xs btn py-2 px-2 start-50 position-absolute ${x.totalExtension > 2 ? 'bg-danger text-light' : x.totalExtension > 1 ? 'bg-warning' : x.totalExtension === 1 ? 'bg-success text-light' : 'bg-warning'
                                                            }`}>{x.totalExtension ? x.totalExtension : '0'} month{x.totalExtension > 1 ? 's' : ''} extended.</span>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="seatValidTill"
                                                            value={x.seatValidTill}
                                                            onChange={e => handleValidityInputChange(e, i)}
                                                        />

                                                    </div>
                                                </div>
                                                <div className='text-center position-absolute top-0 end-0'><span type="button" onClick={() => handleRemoveClick(i)} className="btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='#000' height="16" width="16"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg></span></div>

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

                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-check-inline">
                                                    <label className="form-label">Locker</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="locker" id="inlineRadio11" value={true} onChange={() => handleLockerChange(true)} checked={booking.locker === true} />
                                                    <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="locker" id="inlineRadio21" value={false} onChange={() => handleLockerChange(false)} checked={booking.locker === false} />
                                                    <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                                                </div>

                                                {/* Security Deposit Checkbox */}
                                                <div className="form-check form-check-inline ms-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="securityDeposit"
                                                        id="securityDeposit"
                                                        value="true"
                                                        onChange={(e) => handleSecurityDepositChange(e.target.checked)}
                                                        checked={booking.securityDeposit === true}
                                                    />
                                                    <label className="form-check-label" htmlFor="securityDeposit">Security Deposit (₹100)</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col position-relative">
                                                <label className="form-label">Enter a Coupon</label>
                                                <input type="text" name='discountCoupon' onChange={(e) => setBooking({ ...booking, discountCoupon: e.target.value })} value={booking.discountCoupon} className="form-control" placeholder="Coupon code" aria-label="DiscountCoupon" />
                                                <button className='btn coupongo btn-sm position-absolute bottom-0 p-0' style={{ right: "20px", top: '26px' }} onClick={(e) => validateCoupon(booking.discountCoupon, e)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                    </svg>
                                                </button>
                                                {booking.couponApplied && (
                                                    <span onClick={removeCoupon} className="position-absolute cursor-pointer translate-middle" style={{ right: "34px", top: "56%" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="bi bi-x-square-fill" viewBox="0 0 16 16">
                                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                                                        </svg>

                                                    </span>
                                                )}
                                            </div>
                                            <div className="col">
                                                <label className="form-label">Coupon Value</label>
                                                <input type="text" name='discountValue' value={booking.discountValue} className="form-control" placeholder="Discount amount" aria-label="DiscountValue" disabled />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col">
                                                <label className="form-label">Sub Total</label>
                                                <input type="text" name='totalPrice' value={booking.totalPrice} className="form-control" placeholder="Sub Total" aria-label="totalPrice" onChange={handleBookingInputChange} />
                                            </div>
                                            <div className="col">
                                                <label className="form-label">Total</label>
                                                <input type="text" name='amount' value={booking.amount} className="form-control" placeholder="Total" aria-label="amount" onChange={handleBookingInputChange} />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-check-inline">
                                                    <label className="form-label">Payment Type</label>
                                                </div>
                                                <div className="form-check  form-check-inline">
                                                    <input className="form-check-input" type="radio" name="Full" id="flexRadioDefault1" value="Full" checked={paymentType === 'Full'} onChange={handlePaymentTypeChange} />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        Full
                                                    </label>
                                                </div>
                                                <div className="form-check  form-check-inline">
                                                    <input className="form-check-input" type="radio" name="Partial" id="flexRadioDefault2" value="Partial" checked={paymentType === 'Partial'} onChange={handlePaymentTypeChange} />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Partial
                                                    </label>
                                                </div>
                                                <p>₹{booking.udf2 ? booking.udf2 : '0'} is due for the next payment, payment status will be {booking.paymentStatus}, amount payable is ₹{paybalAmount ? paybalAmount : booking.amount}</p>
                                            </div>
                                            {paymentType === 'Partial' && (
                                                <>
                                                    <div className="col">
                                                        <label className="form-label">Amount</label>
                                                        <input type="text" name='udf1' value={booking.udf1} className="form-control" placeholder="Amount to be paid now" aria-label="Amount paid now" onChange={handleBookingInputChange} />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Amount Due</label>
                                                        <input type="text" name='udf2' value={booking.amount - booking.udf1} className="form-control" placeholder={`Amount Due is ${booking.udf2}`} aria-label="Amount Due" onChange={handleBookingInputChange} />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-check-inline">
                                                    <label className="form-label">Payment Mode</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="paymentMode" id="inlineRadio1" value='Cash' onChange={handlePaymentModeChange} checked={paymentMode === 'Cash'} />
                                                    <label className="form-check-label" htmlFor="inlineRadio1">Cash</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="paymentMode" id="inlineRadio2" value='Online' onChange={handlePaymentModeChange} checked={paymentMode === 'Online'} />
                                                    <label className="form-check-label" htmlFor="inlineRadio2">Online</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="paymentMode" id="inlineRadio3" value='Mixed' onChange={handlePaymentModeChange} checked={paymentMode === 'Mixed'} />
                                                    <label className="form-check-label" htmlFor="inlineRadio3">Mixed</label>
                                                </div>
                                            </div>
                                        </div>

                                        {paymentMode === 'Mixed' && (
                                            <>
                                                <div className="row mb-3">
                                                    <div className="col">
                                                        <label className="form-label">Online Amount</label>
                                                        <input type="text" name='pOnline' value={booking.pOnline} className="form-control" placeholder="Amount paid online" aria-label="Online Amount" onChange={handleBookingInputChange} />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Cash Amount</label>
                                                        <input type="text" name='pCash' value={booking.pCash} className="form-control" placeholder="Amount paid in cash" aria-label="Cash Amount" onChange={handleBookingInputChange} />
                                                    </div>
                                                </div>
                                            </>
                                        )}


                                        <div className="row mb-3">
                                            <div className="col">
                                                <label className="form-label">Notes</label>
                                                <textarea type="textarea" name='udf3' value={booking.udf3} className="form-control" placeholder="Add a note if any." aria-label="Note" onChange={handleBookingInputChange} rows='3'></textarea>
                                            </div>
                                        </div>

                                        <button disabled={!searchQuery && !booking.customerName && !booking.customerEmail ? true : false} type="submit" className="btn btn-success">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingForm