import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Forgotpassword = () => {

    const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    try {
      const response = await fetch('http://localhost:3001/students/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success scenario
        alert(data.message); // Notify the user
        navigate('/login'); // Optionally redirect the user to login page
      } else {
        // Handle failure scenario
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to send reset link. Please try again later.');
    }
}
  return (
    <>
      <div className="container d-flex flex-column">
        <div className="row h-100">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table pt-3 h-100">
            <div className="d-table-cell align-middle">

              <div className="text-center mt-4">
                <h1 className="h2">Welcome to Bookbuddy Members!</h1>
                <p className="lead">
                  Forgot your password? Reset here!
                </p>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="m-sm-3">
                    <div className="row">
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input className="form-control form-control-lg" value={email} type="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
                      </div>
                      <div>
                      </div>
                      <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-lg btn-primary">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="text-center my-2">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Forgotpassword