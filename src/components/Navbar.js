import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  let location = useLocation();
  useEffect(() => {

  }, [location]);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">BookBuddy Members</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/account" ? "active" : ""}`} to="/account">Account</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Profile</Link>
            </li>
          </ul>
          <button type="button" className="btn btn-info"><Link className={`link-light ${location.pathname === "/login" ? "active" : ""} text-decoration-none`} to="/login">Login</Link></button>
          <button type="button" className="btn btn-primary mx-2"><Link className={`link-light ${location.pathname === "/signup" ? "active" : ""} text-decoration-none`} to="/signup">Register</Link></button>
          <button type="button" className="btn btn-primary"><Link className="link-light text-decoration-none" to="/logout">Logout</Link></button>
        </div>
      </div>
    </nav>

  )
}

export default Navbar