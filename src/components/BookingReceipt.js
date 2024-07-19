import React from 'react'

const BookingReceipt = () => {
  return (
    <div>
        <div style={{backgroundColor:"#f6f9fc", fontFamily:'-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif'}}>
    <div className="container my-5">
        <div className="card">
            <div className="card-body">
                <div className="text-center">
                    <img src="https://bookbuddy.co.in/wp-content/uploads/2023/02/Background.png" alt="Stripe" width="170"/>
                </div>
                <div className="text-center my-4">
                    <h1>BookBuddy</h1>
                    <p className="text-secondary">Library &amp; Co - Study Zone</p>
                    <p className="text-muted">info@bookbuddy.co.in</p>
                    <p className="text-muted">www.bookbuddy.co.in</p>
                </div>
                <h2 className="text-center">Payment Receipt</h2>
                <hr/>
                <div className="row">
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Billed to:</p>
                        <p>Pankaj Kumar</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Email:</p>
                        <p>pankaj1018+student@gmail.com</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Mobile:</p>
                        <p>9630263125</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Receipt Number:</p>
                        <p>123456789</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Txn Date:</p>
                        <p>12-may-2024</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Status:</p>
                        <p>Pending</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <p>Table Number: New Booking</p>
                        <p>Slot: 06 am to 10 am</p>
                        <p>Valid through: Next term</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p>400</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <p>Product 2</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p>400</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <p>Subtotal</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p>750</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <p>Discount</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p>50</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <p className="font-weight-bold">Total</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p className="font-weight-bold">650</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Partial Payment:</p>
                        <p>Yes</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Amount Paid:</p>
                        <p>560</p>
                    </div>
                    <div className="col-md-4">
                        <p className="font-weight-bold mb-1">Due:</p>
                        <p>60</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <p className="font-weight-bold mb-1">Mode:</p>
                        <p>Online</p>
                    </div>
                    <div className="col-md-6 text-right">
                        <p className="font-weight-bold mb-1">Status:</p>
                        <p>Successful</p>
                    </div>
                </div>
                <hr/>
                <p className="text-muted">Terms &amp; Conditions apply*</p>
                <p className="text-muted">2nd &amp; 3rd Floor, Skyline Tower, Adarsh Nagar, Samastipur</p>
            </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default BookingReceipt