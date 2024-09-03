import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from './components/uicomponents/Navbar';
import Account from './components/pages/Account';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/pages/Profile';
import Studentlist from './components/students/Studentlist';
import Seatsall from './components/seats/Seatsall';
import StudentState from './context/StudentState';
import AlertState from './context/AlertState';
import Alerts from './components/uicomponents/Alerts';
import SeatState from './context/SeatState';
import { EmailProvider } from './context/EmailContext';
import Forgotpassword from './components/auth/Forgotpassword';
import Passwordreset from './components/auth/Passwordreset';
import CreateCoupons from './components/coupons/CreateCoupons';
import Couponsall from './components/coupons/Couponsall';
import BookingForm from './components/booking/BookingForm';
import TransactionStatus from './components/transactions/TransactionStatus';
import PaymentResult from './components/booking/PaymentResult';
import BookingCart from './components/booking/BookingCart';
import CheckoutPage from './components/booking/CheckoutPage';
import TransactionReceipt from './components/transactions/TransactionReceipt';
import ActivityLog from './components/logs/ActivityLog';
import { LoadingProvider } from './context/LoadingContext';
import '@fontsource/jost';
import '@fontsource/jost/300.css'; // Light
import '@fontsource/jost/400.css'; // Regular
import '@fontsource/jost/500.css'; // Medium
import '@fontsource/jost/700.css'; // Bold
import BookingManager from './components/booking/BookingManager';
import BookingEdit from './components/booking/BookingEdit';
import BookingReceipt from './components/booking/BookingReceipt';
import Footer from './components/uicomponents/Footer';


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
                    <Route path="/editbookings/:id" element={<BookingEdit />} />
                    <Route path="/receipt" element={<BookingReceipt />} />

                  </Routes>
                  <Footer/>
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
