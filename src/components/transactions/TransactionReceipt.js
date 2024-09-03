// TransactionReceipt.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidedash from '../uicomponents/Sidedash';
import { formatDate } from '../utils/Utilsfunc';
import useStudentData from '../students/Usestudentdata'
import StudentContext from '../../context/StudentContext'
import { capitalizeFirstLetter } from '../utils/Utilsfunc';
import { convertSlotToTimings } from '../utils/Utilsfunc';

const TransactionReceipt = () => {
    const { id } = useParams();
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const host = process.env.REACT_APP_BACKEND_URL;
    const context = useContext(StudentContext)
    const { getOneStudent } = context;
    const { studentData } = useStudentData(getOneStudent);



    const handlePrint = () => {
        window.print();
    };


    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const response = await fetch(`${host}/bookings/api/transaction/${id}`);
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();
                setTransactionDetails(data);
            } catch (err) {
                setError('Failed to load transaction details: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <><div className="container-fluid">
            <div className="row">
                <Sidedash />
                <div className="col-md-10 pt-3">
                    <div className="row">
                        <div className="col-md-12">
                        
                            {/* Bootstrap template */}
                            {transactionDetails ? (
                                <>
                                    <div className="container-fluid mt-3 mb-5 print-container no-responsive">
                                        <div className="printcontainer-row row d-flex">
                                        
                                            <div className="col-md-8">
                                                <div className="card">
                                                    <div className="card-header position-relative text-left logo p-2 px-5 pt-3" style={{ backgroundColor: "#1a092d" }}>
                                                    <div className="print-pdf position-absolute mt-2 mx-2 z-1 end-0 top-0">
                                                        <svg onClick={handlePrint} className='mx-1 mt-2 cursor-pointer'  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill='#fff' viewBox="0 0 512 512"><path d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                        <a href={`${host}/bookings/generate-receipt/${transactionDetails.clientTxnId}`}><svg className='mx-1 mt-2 cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill='#fff' viewBox="0 0 512 512"><path d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" /></svg></a>
                                                    </div>
                                                        <div className='d-inline-block'>
                                                            <img src="/images/bblogo.webp" width="150" />
                                                        </div>
                                                        
                                                        <div className='d-inline-block align-middle'>
                                                            <h1 className='text-light mx-3'>BookBuddy</h1>
                                                            <span className='text-light mx-3 px-1'>Library & Co-Study Zone</span>
                                                        </div>
                                                    </div>
                                                    <div className="invoice p-5 pt-4">
                                                        <h3 className='text-center'>Payment Reciept</h3>
                                                        <span className="font-weight-bold d-block mt-4"><span className='text-muted'>Name: </span>{transactionDetails.customerName}</span>
                                                        <span className='d-block'><span className='text-muted'>Email: </span>{transactionDetails.customerEmail}</span>
                                                        <span><span className='text-muted'>Mobile: </span>{transactionDetails.customerMobile}</span>
                                                        <div className="payment border-top mt-3 mb-3 border-bottom table-responsive">
                                                            <table className="table table-borderless" style={{ width: '100%' }}>
                                                                <tbody>

                                                                    <tr>
                                                                        <td>
                                                                            <div className="py-2">
                                                                                <span className="d-block text-muted">Receipt Date</span>
                                                                                <span>{formatDate(transactionDetails.createdAt)}</span>
                                                                            </div>
                                                                        </td>

                                                                        <td>
                                                                            <div className="py-2">
                                                                                <span className="d-block text-muted">Receipt No</span>
                                                                                <span>{transactionDetails.clientTxnId}</span>
                                                                            </div>
                                                                        </td>

                                                                        <td>
                                                                            <div className="py-2">
                                                                                <span className="d-block text-muted">Payment</span>
                                                                                <span>Online</span>
                                                                            </div>
                                                                        </td>

                                                                        <td>
                                                                            <div className="py-2">
                                                                                <span className="d-block text-muted">Address</span>
                                                                                <span>{studentData ? studentData.address : 'Address not available'}</span>
                                                                            </div>
                                                                        </td>

                                                                    </tr>

                                                                </tbody>

                                                            </table>
                                                        </div>
                                                        <div className="product border-bottom table-responsive">
                                                            <table className="table table-borderless" style={{ width: '100%' }}>
                                                                <tbody>
                                                                    {transactionDetails.seatDetails.map(seat => (
                                                                        <>
                                                                            <tr>
                                                                                <td width="20%">
                                                                                    <svg style={{ opacity: ".2" }} width="90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z"/></svg>
                                                                                </td>

                                                                                <td key={seat._id} width="60%">
                                                                                    <span className="font-weight-bold"><span className='text-muted'>Table Number: </span>{(!seat.seatNumber) ? "New Booking" : seat.seatNumber}</span>
                                                                                    <div className="product-qty">
                                                                                        <span className="d-block"><span className='text-muted'>Slot: </span>{convertSlotToTimings(seat.slot)}</span>
                                                                                        <span><span className='text-muted'>Valid through: </span>{(!seat.seatValidTill) ? "Next term" : formatDate(seat.seatValidTill)}</span>

                                                                                    </div>
                                                                                </td>



                                                                                <td width="20%">
                                                                                    <div className="text-right">
                                                                                        <span className="font-weight-bold">₹350</span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>

                                                                        </>
                                                                    ))}


                                                                </tbody>

                                                            </table>



                                                        </div>



                                                        <div className="row d-flex justify-content-end">

                                                            <div className="col-md-5">

                                                                <table className="table table-borderless">

                                                                    <tbody className="totals">

                                                                        <tr>
                                                                            <td>
                                                                                <div className="text-left">

                                                                                    <span className="text-muted">Subtotal</span>

                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="text-right">
                                                                                    <span>₹{transactionDetails.totalPrice}</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>


                                                                        <tr>
                                                                            <td>
                                                                                <div className="text-left">

                                                                                    <span className="text-muted">Discount</span>

                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="text-right">
                                                                                    <span className="text-success">₹{transactionDetails.discountValue}</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>


                                                                        <tr className="border-top border-bottom">
                                                                            <td>
                                                                                <div className="text-left">

                                                                                    <span className="font-weight-bold">Total</span>

                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="text-right">
                                                                                    <span className="font-weight-bold">₹{transactionDetails.amount}</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        <tr className="border-top">
                                                                            <td>
                                                                                <div className="text-left">

                                                                                    <small className="font-weight-bold">Payment Status</small>

                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="text-right">
                                                                                    <span className={`font-weight-bold ${(transactionDetails.paymentStatus === "success")?"text-success":"text-danger"}`}>{capitalizeFirstLetter(transactionDetails.paymentStatus)}</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                    </tbody>

                                                                </table>

                                                            </div>



                                                        </div>


                                                        <p>For new seat bookings seat number will be assigned shortly by administrator and informed on email!</p>
                                                        <p className="font-weight-bold mb-0">Thank You!</p>
                                                        <span className='fw-bold'>BookBuddy Library</span>
                                                        <span className='text-muted d-block'>2nd & 3rd Floor, Skyline Tower,</span>
                                                        <span className='text-muted d-block'>Adarsh Nagar, Samastipur</span>
                                                        <span className='text-muted d-block'>Email: info@bookbuddy.co.in</span>
                                                        <span className='text-muted d-block'>Phone: +917042912701</span>





                                                    </div>


                                                    <div className="d-flex justify-content-between footer p-3 card-footer">

                                                        <small className='d-block'>Terms & Conditions Applied*</small>
                                                        <small className='text-muted d-block'>Enjoy your continued focus time!!</small>
                                                        <small>{formatDate(transactionDetails.txnAt)}</small>

                                                    </div>





                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </>
                            ) : (
                                <p>No transaction details available.</p>
                            )}
                            {/* Bootstrap template */}
                        </div></div></div></div></div>

        </>
    );
};

export default TransactionReceipt;
