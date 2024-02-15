import React, { useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AlertContext from '../context/AlertContext'

const Navbar = () => {
  const { showAlert } = useContext(AlertContext)
  const history = useNavigate()
  let location = useLocation();
  const userLoggedIn = localStorage.getItem('token');
  const adminLoggedIn = localStorage.getItem('role')
  const handleLogout = (e) => {
    e.preventDefault();
    // props.showAlert("Logged out successfully", "success bg-green-100");
    // Clear stored credentials and token from localStorage
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiryTime')
    showAlert("Logout successful!", "info");
    history('/login')

  }
  useEffect(() => {

  }, [location]);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">BookBuddy Members</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {userLoggedIn?
          <>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/account" ? "active" : ""}`} to="/account">Account</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Profile</Link>
            </li>
            </>:"" }
            {(adminLoggedIn === "Admin" || adminLoggedIn === "Superadmin") ?
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/allstudents" ? "active" : ""}`} to="/allstudents">Students</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/allseats" ? "active" : ""}`} to="/allseats">Seats</Link>
                </li>
              </>
              : ""}
          </ul>
          {!userLoggedIn ? <>
            <button type="button" className="btn btn-info"><Link className={`link-light ${location.pathname === "/login" ? "active" : ""} text-decoration-none`} to="/login">Login</Link></button>
            <button type="button" className="btn btn-primary mx-2"><Link className={`link-light ${location.pathname === "/signup" ? "active" : ""} text-decoration-none`} to="/signup">Sign Up</Link></button></> :
            <button type="button" className="btn btn-primary"><Link className="link-light text-decoration-none" onClick={handleLogout} to="/login">Logout</Link></button>
            }
        </div>
      </div>
    </nav>

  )
}

export default Navbar