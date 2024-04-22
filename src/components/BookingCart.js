import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { capitalizeFirstLetter } from './Utilsfunc';
import Sidedash from './Sidedash';

const BookingCart = () => {
  const location = useLocation()
  const { seatsToRenew } = location.state;
  const [ selectedSeats, setSelectedSeats] = useState(
    seatsToRenew.reduce((acc, seat) => ({
      ...acc, [`${seat.seatNumber}-${seat.slot}`]: true
    }), {})
  );
  const [couponCode, setCouponCode] = useState('');

  const handleCheckboxChange = (seatId) => {
    setSelectedSeats(prev => ({
      ...prev,
      [seatId]: !prev[seatId]
    }));
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleCheckout = () => {
    // Here, implement the logic to proceed with the checkout or submission process
    console.log('Proceeding to checkout with:', selectedSeats, 'Coupon Code:', couponCode);
    // Navigate to a success page or process the checkout logic
  };

    function transactionNumberGen() {
        const min = 1000000000; // 10 digits
        const max = 9999999999; // 10 digits
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const initialData = {
        key: process.env.REACT_APP_UPIGATEWAY_KEY,
        amount: "100",
        p_info: "Bookbuddy Seat",
        customer_name: "Shashi Doe",
        customer_email: "ishshiknt@gmail.com",
        customer_mobile: "7000958825",
        redirect_url: "http://google.com",
        udf1: "user defined field 1 (max 25 char)",
        udf2: "user defined field 2 (max 25 char)",
        udf3: "user defined field 3 (max 25 char)"
    };

  return (
    <>
    <div className="container-fluid">
      <div className="row">
        <Sidedash />
        <div className="col-md-7 pt-3">
          <div className="row">
          <h1>Your Cart</h1>
          <ul className="list-group">
            {Object.keys(selectedSeats).map((key, index) => (
              <li key={key} className="list-group-item">
                <input
                  type="checkbox"
                  checked={selectedSeats[key]}
                  onChange={() => handleCheckboxChange(key)}
                  className="form-check-input me-2"
                />
                {key.split('-').map(part => capitalizeFirstLetter(part)).join(' | ')}
              </li>
            ))}
          </ul>
          <div className="my-3">
            <label htmlFor="couponCode" className="form-label">Coupon Code:</label>
            <input
              type="text"
              className="form-control"
              id="couponCode"
              value={couponCode}
              onChange={handleCouponChange}
            />
          </div>
          <button onClick={handleCheckout} className="btn btn-primary">Checkout</button>
          <Link to="/profile" className="btn btn-secondary ms-2">Back to Profile</Link>
          </div>
        </div>

        <div className="col-md-3 d-md-block bg-body-tertiary order-md-2 mb-4">
          <div className="row">
            <div className="col-md-12 px-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your cart</span>
            <span className="badge badge-secondary badge-pill">3</span>
          </h4>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Product name</h6>
                <small className="text-muted">Brief description</small>
              </div>
              <span className="text-muted">$12</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Second product</h6>
                <small className="text-muted">Brief description</small>
              </div>
              <span className="text-muted">$8</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Third item</h6>
                <small className="text-muted">Brief description</small>
              </div>
              <span className="text-muted">$5</span>
            </li>
            <li className="list-group-item d-flex justify-content-between bg-light">
              <div className="text-success">
                <h6 className="my-0">Promo code</h6>
                <small>EXAMPLECODE</small>
              </div>
              <span className="text-success">-$5</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>$20</strong>
            </li>
          </ul>

          <form className="card p-2">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Promo code"/>
              <div className="input-group-append">
                <button type="submit" className="btn btn-secondary">Redeem</button>
              </div>
            </div>
          </form>
          </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default BookingCart