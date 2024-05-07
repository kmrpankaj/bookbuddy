import React, { useState, useContext, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, oneMonthValidity, convertSlotToTimings } from './Utilsfunc';
import Sidedash from './Sidedash';
import useStudentData from './Usestudentdata'
import StudentContext from '../context/StudentContext'
import AlertContext from '../context/AlertContext';


const BookingCart = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const { seatsToRenew = [], availableSlots = [] } = location.state || {};
  const [currentSeats, setCurrentSeats] = useState(seatsToRenew);
  const [additionalSlots, setAdditionalSlots] = useState(availableSlots);
  const context = useContext(StudentContext)
  const { getOneStudent } = context;
  const { studentData } = useStudentData(getOneStudent);
  const host = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState('');
  const [orderResponse, setOrderResponse] = useState(null);
  const [clientTxnId, setClientTxnId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [coupon, setCoupon] = useState({ code: '', amount: 0, applied: false });
  const [couponCode, setCouponCode] = useState('');
  const productPrice = 350;
  const { showAlert } = useContext(AlertContext)

   // Early return or redirection if no data is available
   useEffect(() => {
    if (currentSeats.length === 0 && additionalSlots.length === 0) {
      navigate("/profile"); // Redirects to the profile page or you can replace "/profile" with another appropriate route
    }
  }, [currentSeats, additionalSlots, navigate]);

  // Calculate total price based on selections
  useEffect(() => {
    const newTotalPrice = [...currentSeats, ...additionalSlots].reduce(
      (acc, seat) => acc + (seat.selected ? productPrice : 0),
      0
    );
    const discount = Math.min(coupon.amount, newTotalPrice)
    setTotalPrice(newTotalPrice - discount);
  }, [currentSeats, additionalSlots, coupon]);

  useEffect(() => {
    autoApplyCoupon();
  }, [currentSeats, additionalSlots]);

  // Auto apply coupons based on number of cart
  const autoApplyCoupon = () => {
    let discountAmount = 0;
    const totalItems = [...currentSeats, ...additionalSlots].filter(seat => seat.selected).length;
    if (totalItems === 3) {
      setCoupon({ code: 'TRIPLEDEAL', amount: 50, applied: true }); // Assuming the discount for 3 items
      setCouponCode('TRIPLEDEAL');
    } else if (totalItems === 4) {
      setCoupon({ code: 'FOURBUNDLE', amount: 100, applied: true }); // Assuming the discount for 4 items
      setCouponCode('FOURBUNDLE');
    } else {
      // Remove any auto-applied coupons if the conditions are no longer met
      if (coupon.code === 'TRIPLEDEAL' || coupon.code === 'FOURBUNDLE') {
        setCoupon({ code: '', amount: 0, applied: false });
        setCouponCode('')
      }
    }
  };

  if (!studentData) return <div>No student data found</div>;

  const toggleSeatSelection = (index, isCurrent = true) => {
    const updateFunction = isCurrent ? setCurrentSeats : setAdditionalSlots;
    updateFunction(prev => prev.map((item, idx) => idx === index ? { ...item, selected: !item.selected } : item));
  };


  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };



  const validateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || coupon.applied) {
      
      showAlert("Please enter a coupon code or remove the existing coupon first.", "danger")
      return;
    }
    if (totalItems===0) {
      showAlert("Select a seat to book in order to apply a coupon", "danger")
      return;
    }
    try {
      const productTypes = [...currentSeats, ...additionalSlots].filter(seat => seat.selected).map(seat => seat.slot);
      const totalItems = [...currentSeats, ...additionalSlots].filter(seat => seat.selected).length;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/coupons/check-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          productCount: totalItems,
          productTypes: productTypes
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCoupon({ code: couponCode, amount: calculateDiscount(data), applied: true });
      // console.log('Coupon applied successfully!');
      showAlert("Coupon applied successfully!", "success")
      setError("")
    } catch (error) {
      setError(error.message);
      //console.error('Error applying coupon:', error.message);
      showAlert(`${error.message}`, "danger")
    }
  };

  const calculateDiscount = (couponData) => {
    if (couponData.discountType === 'percentage') {
      return totalPrice * (couponData.discountValue / 100);
    } else if (couponData.discountType === 'amount') {
      return couponData.discountValue;
    }
    return 0;
  };

  const removeCoupon = () => {
    setCoupon({ code: '', amount: 0, applied: false });
    setCouponCode('');
  };
const removeError = () => {
  setError("");
}


  // Calculate the total number of selected items
  const totalItems = [...currentSeats, ...additionalSlots].filter(seat => seat.selected).length;

  const handleCheckout = async (e) => {
    e.preventDefault();
    let initialData = {};  // Define this outside the try block to ensure it's accessible in the nested try block

    // First, try to fetch a unique transaction ID
    try {
      const txnResponse = await fetch(`${host}/bookings/generate-txn-id`);
      const txnData = await txnResponse.json();

      if (!txnResponse.ok) {
        throw new Error('Failed to generate a unique transaction ID: ' + txnData.message);
      }
      const clientTxnIdAsString = String(txnData.clientTxnId);
      const totalPriceAsString = String(totalPrice)
      // Prepare the initial data with the transaction ID
      initialData = {
        client_txn_id: clientTxnIdAsString,
        amount: totalPriceAsString,
        p_info: "Bookbuddy seat renewal",
        customer_name: studentData.name,
        customer_email: studentData.email,
        customer_mobile: studentData.phone,
        redirect_url: `https://members.bookbuddy.co.in/transaction/${txnData.clientTxnId}`,
        udf1: "user defined field 1 (max 25 char)",
        udf2: "user defined field 2 (max 25 char)",
        bookedBy: studentData.uid,
        discountCoupon: coupon.code,
        discountValue: coupon.amount,
        totalPrice: (coupon.code) ? totalPrice + coupon.amount : totalPrice,
        seatsToRenew: currentSeats.filter(seat => seat.selected).map(({ seatNumber, slot }) => {
          // Find the matching seat in studentData to get the current validity date
          const matchingSeat = studentData.seatAssigned.find(s => s.seatNumber === seatNumber && s.slot === slot);
          const newValidityDate = matchingSeat ? oneMonthValidity(matchingSeat.validityDate) : null;
          return { seatNumber, slot, validityDate: newValidityDate };
        }),

        newSlots: additionalSlots.filter(slot => slot.selected).map(({ slot }) => slot)
      };
      console.log(initialData)
    } catch (error) {
      console.error('Error during transaction ID generation:', error.message);
      setError('Transaction ID Generation Failed: ' + error.message);
      return;  // Stop further execution if this fails
    }

    // Next, try to create the order using the initialData
    try {
      const response = await fetch(`${host}/bookings/create/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData)
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('Failed to create order: ' + responseData.message);
      }

      // If everything went fine, set the order response
      setOrderResponse(responseData);

      navigate('/checkout', { state: { orderResponse: responseData } });

    } catch (error) {
      console.error('Error during order creation:', error.message);
      setError('Order Creation Failed: ' + error.message);
    }
  };



  return (

    <>
      <div className="container-fluid">
        <div className="row">
          <Sidedash />
          <div className="col-md-7 pt-3">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    Your Cart
                  </div>
                  <div className="card-body">
                  {studentData.seatAssigned && studentData.seatAssigned.length > 0 ? (
                    <p className="card-text">You can renew these seats.</p>
                  ):(
                    ""
                  )}
                    <ul className="list-group">
                      {currentSeats.map((seat, index) => (
                        <li key={`${seat.seatNumber}-${seat.slot}`} className="list-group-item">
                          <input
                            type="checkbox"
                            checked={seat.selected}
                            onChange={() => toggleSeatSelection(index, true)}
                            className="form-check-input me-2"
                          />
                          {`${seat.seatNumber} - ${convertSlotToTimings(seat.slot)} - Ends: ${seat.validityDate}`} {(new Date(seat.validityDate)) < (new Date().setHours(0, 0, 0, 0)) ? (<span className="badge bg-danger badge-danger">Expired</span>) : ""}
                        </li>
                      ))}
                    </ul>

                    {studentData.seatAssigned && studentData.seatAssigned.length > 0 ? (
                    <p className="card-text mt-3">You can also purchase a new one.</p>
                  ):(
                    <p className="card-text">Available slots to purchase.</p>
                  )}
                    

                    <ul className="list-group">
                      {additionalSlots.map((slot, index) => (
                        <li key={`new-${slot.slot}`} className="list-group-item">
                          <input
                            type="checkbox"
                            checked={slot.selected}
                            onChange={() => toggleSeatSelection(index, false)}
                            className="form-check-input me-2"
                          />
                          {`New - ${convertSlotToTimings(slot.slot)}`}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3">
                      <button disabled={(totalItems === 0) ? true : false} onClick={handleCheckout} className="btn btn-primary">Checkout</button>
                      <Link to="/profile" className="btn btn-secondary ms-2">Back to Profile</Link>
                    </div>


                  </div>
                  <div className="card-footer text-muted">

                    <span>Get a discount when you renew or purchase 3 or 4 slots at once.</span><br />
                    <span>For new bookings, seats will be assigned by library manager within 24 hours.</span>

                  </div>

                </div>
              </div>

            </div>
          </div>

          <div className="col-md-3 d-md-block bg-body-tertiary vh-100 order-md-2 mb-4">
            <div className="row">
              <div className="col-md-12 px-4">
                <div className="justify-content-between align-items-center mb-3">
                  <div className="card">
                    <span className="card-header">Your cart value <span style={{ "right": "13px", "top": "10px" }} className="badge badge-info badge-pill position-absolute">{totalItems}</span></span>

                  </div>
                </div>
                <ul className="list-group mb-3">
                  {[...currentSeats, ...additionalSlots].filter(seat => seat.selected).map((seat, index) => (
                    <li key={index} className="transition list-group-item d-flex justify-content-between lh-condensed">
                      <div>
                        <h6 className="my-0">{`${seat.seatNumber} - ${capitalizeFirstLetter(seat.slot)}`}</h6>
                        <small className="text-muted">Valid for next term</small>
                      </div>
                      <span className="text-muted">₹{productPrice}</span>
                    </li>
                  ))}
                  {coupon.applied && (
                    <li className="list-group-item d-flex justify-content-between bg-light">
                      <div className="text-success">
                        <h6 className="my-0">Promo code applied!!</h6>
                        <small>{coupon.code}</small>
                      </div>
                      <span className="text-success">- ₹{coupon.amount}</span>

                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total (₹)</span>
                    <strong>₹{totalPrice}</strong>
                  </li>
                </ul>
                {/* coupon */}
                <form className="card p-2">
                  <div className="input-group mb-0">
                    <input onChange={handleCouponChange} id="couponCode" value={couponCode} type="text" className="form-control" placeholder="Coupon code" />
                    {coupon.applied && (
                      <span onClick={removeCoupon} className="position-absolute cursor-pointer top-50 translate-middle pb-1" style={{ right: "66px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                        </svg>

                      </span>
                    )}
                    <span onClick={validateCoupon} className="cursor-pointer input-group-text" id="basic-addon2">Apply</span>
                  </div>
                </form>
                {error && <small className='text-danger px-1'>{error} 
                &nbsp;<svg className="cursor-pointer bi bi-x-square-fill" onClick={removeError} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                        </svg>
                </small>}
                {/* coupon */}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default BookingCart