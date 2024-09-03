import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Sidedash from '../uicomponents/Sidedash';
import { formatDate } from '../utils/Utilsfunc';
import { capitalizeFirstLetter } from '../utils/Utilsfunc';
import { convertSlotToTimings } from '../utils/Utilsfunc';


const CheckoutPage = () => {
    const location = useLocation()
    const { orderResponse } = location.state || {};
    console.log(orderResponse)

    if (!orderResponse) {
        return <div>No order details available.</div>;
    }

    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    <div className="col-md-7 pt-3">
                        <div className="row">
                            <div className="col-md-12">

                                {/* Order confirmation */}
                                {(!orderResponse) ? "No order found!!" :
                                    <>
                                        <div className="card border-top border-bottom border" style={{ borderColor: "#f37a27 !important" }}>
                                            <div className="card-body p-5">

                                                <p className="lead fw-bold mb-5" style={{ color: "#f37a27" }}>Order Confirmation</p>

                                                <div className="row">
                                                    <div className="col mb-3">
                                                        <p className="small text-muted mb-1">Date</p>
                                                        <p>{formatDate(orderResponse.order.createdAt)}</p>
                                                    </div>
                                                    <div className="col mb-3">
                                                        <p className="small text-muted mb-1">Order No.</p>
                                                        <p>{orderResponse.order.clientTxnId}</p>
                                                    </div>
                                                </div>

                                                <div className="mx-n5 px-5 py-4" style={{ borderTop: "1px solid #f37a27", borderBottom: "1px solid #f37a27" }}>
                                                    {orderResponse.order.seatDetails.map(seat => (
                                                        <>
                                                            <div className="row">

                                                                <div className="col-md-8 col-lg-9">
                                                                    <p>Seat: {seat.seatNumber} - {convertSlotToTimings(seat.slot)} - <span className='badge text-bg-success'>{capitalizeFirstLetter(seat.type)}</span></p>
                                                                </div>
                                                                <div className="col-md-4 col-lg-3">
                                                                    <p>₹350</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))}
                                                    <div className="row" style={{ borderTop: "1px solid #f37a27" }}>
                                                        <div className="col-md-8 col-lg-9 mt-2">
                                                            <p className="mt-2 mb-0">Sub Total</p>
                                                        </div>
                                                        <div className="col-md-4 col-lg-3 mt-2">
                                                            <p className="mt-2 mb-0">₹{orderResponse.order.totalPrice}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8 col-lg-9">
                                                            <p className="text-success mt-1 mb-0">Discount</p>
                                                        </div>
                                                        <div className="col-md-4 col-lg-3">
                                                            <p className="mb-0 mt-1 text-success">{(orderResponse.order.discountValue) ? "-" : ""}₹{orderResponse.order.discountValue}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mx-n5 px-5 py-4">
                                                    <div className="row">
                                                        <div className="col-md-8 col-lg-9">
                                                            <p className="lead fw-bold mb-0" style={{ color: "#f37a27" }}>Total</p>
                                                        </div>
                                                        <div className="col-md-4 col-lg-3">
                                                            <p className="lead fw-bold mb-0" style={{ color: "#f37a27" }}>₹{orderResponse.order.amount}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <p className="lead fw-bold mb-4 pb-2" style={{color: "#f37a27"}}>Tracking Order</p> */}

                                                <div className="row">
                                                    <div className="col-lg-12">

                                                        <div className="horizontal-timeline">

                                                            {/* Payment Links */}
                                                            <div className="payment-links mb-4">
                                                                <p className="lead fw-bold" style={{ color: "#f37a27" }}>Click a UPI method to continue</p>
                                                                <div className="icon-container d-flex justify-content-around">
                                                                    {/* {orderResponse.order.upi_intent.bhim_link && (
                                                                        <a href={orderResponse.order.upi_intent.bhim_link} className="payment-icon">
                                                                            <img class="bhim" src="/images/bhim-upi-icon.png" width="60" />
                                                                            <span class="d-block">BHIM</span>
                                                                        </a>
                                                                    )}
                                                                    {orderResponse.order.upi_intent.phonepe_link && (
                                                                        <a href={orderResponse.order.upi_intent.phonepe_link} className="payment-icon">
                                                                            <img src="/images/phonepe-icon.png" width="60" />
                                                                            <span class="d-block">PhonePe</span>
                                                                        </a>
                                                                    )}
                                                                    {orderResponse.order.upi_intent.paytm_link && (
                                                                        <a href={orderResponse.order.upi_intent.paytm_link} className="payment-icon">
                                                                            <img src="/images/paytm-icon.png" width="60" />
                                                                            <span class="d-block">Paytm</span>
                                                                        </a>
                                                                    )}
                                                                    {orderResponse.order.upi_intent.gpay_link && (
                                                                        <a href={orderResponse.order.upi_intent.gpay_link} className="payment-icon">
                                                                            <img class="gpay" src="/images/google-pay-icon.png" width="60" />
                                                                            <span class="d-block">GPay</span>
                                                                        </a>
                                                                    )} */}
                                                                    {orderResponse.order.paymentUrl && (
                                                                        <a href={orderResponse.order.paymentUrl} className="payment-icon">
                                                                            <img class="showqr" src="/images/show-qr-icon.png" width="60" />
                                                                            <span class="d-block">Show QR</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Payment Links */}

                                                            <ul className="list-inline items d-flex justify-content-around">
                                                                <li className="list-inline-item items-list">
                                                                    <p className="py-1 px-2 rounded text-white" style={{ backgroundColor: "#f37a27" }}><Link className='d-inline-block py-0 px-2 text-white text-decoration-none' to="/profile">Cancel</Link></p>
                                                                </li>
                                                                

                                                            </ul>

                                                        </div>

                                                    </div>
                                                </div>
                                                <p><small className="mt-4 pt-2 mb-0 text-muted">Next, a UPI QR code will be displayed. If you are using a mobile device, please capture a screenshot of the QR code. Then, open your UPI app, tap the gallery icon within the QR scanner section, and select the screenshot to proceed with the payment.</small></p>
                                                <p className="mt-4 pt-2 mb-0">Want any help? <a className='text-decoration-none' href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bookbuddy.co.in&su=Need help with purchase/renewal&body=Hi there!" style={{ color: "#f37a27" }}>Please contact us!</a></p>

                                            </div>
                                        </div>
                                    </>}
                                {/* Order confirmation */}


                            </div>
                        </div></div></div>
            </div>
        </>
    )
}

export default CheckoutPage