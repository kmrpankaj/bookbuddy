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


function App() {
  return (
    <div className="App">
      <StudentState>
        <AlertState>
          <SeatState>
          <BrowserRouter>
            <Navbar />
            <Alerts />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/allstudents" element={<Studentlist />} />
              <Route path="/allseats" element={<Seatsall />} />
            </Routes>

          </BrowserRouter>
          </SeatState>
        </AlertState>
      </StudentState>
    </div>
  );
}

export default App;
