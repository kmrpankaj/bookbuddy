import './App.css';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import Account from './components/Account';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Studentlist from './components/Studentlist';
import Seatsall from './components/Seatsall';
import StudentState from './context/StudentState';
import AlertState from './context/AlertState';
import Alerts from './components/Alerts';
import SeatState from './context/SeatState';
import { EmailProvider } from './context/EmailContext';
import Forgotpassword from './components/Forgotpassword';
import Passwordreset from './components/Passwordreset';
import CreateCoupons from './components/CreateCoupons';
import Couponsall from './components/Couponsall';
import BookingForm from './components/BookingForm';
import TransactionStatus from './components/TransactionStatus';
import PaymentResult from './components/PaymentResult';
import BookingCart from './components/BookingCart';
import CheckoutPage from './components/CheckoutPage';
import TransactionReceipt from './components/TransactionReceipt';
import ActivityLog from './components/ActivityLog';
import { LoadingProvider } from './context/LoadingContext';
import '@fontsource/jost';
import '@fontsource/jost/300.css'; // Light
import '@fontsource/jost/400.css'; // Regular
import '@fontsource/jost/500.css'; // Medium
import '@fontsource/jost/700.css'; // Bold
import BookingManager from './components/BookingManager';


function App() {
  return (
    <div className="App">
      <LoadingProvider>
        <StudentState>
          <AlertState>
            <SeatState>
              <BrowserRouter>
                <EmailProvider>
                  <Alerts />
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home url="https://members.bookbuddy.co.in/login" />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/allstudents" element={<Studentlist />} />
                    <Route path="/allseats" element={<Seatsall />} />
                    <Route path="/forgotpassword" element={<Forgotpassword />} />
                    <Route path="/resetpassword" element={<Passwordreset />} />
                    <Route path="/createcoupon" element={<CreateCoupons />} />
                    <Route path="/viewcoupons" element={<Couponsall />} />
                    <Route path="/createbooking" element={<BookingForm />} />
                    <Route path="/transaction-status/:clientTxnId" element={<TransactionStatus />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route path="/cart" element={<BookingCart />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/transaction/:id" element={<TransactionReceipt />} />
                    <Route path="/log" element={<ActivityLog />} />
                    <Route path="/bookings" element={<BookingManager />} />

                  </Routes>
                </EmailProvider>
              </BrowserRouter>
            </SeatState>
          </AlertState>
        </StudentState>
      </LoadingProvider>
    </div>
  );
}

export default App;
