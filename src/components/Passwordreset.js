import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Passwordreset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return; // Stop the form submission
    }

    // Post to your /reset-password endpoint
    const response = await fetch(`http://localhost:3001/students/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, token }),
    });
    const data = await response.json();

    if (data.success) {
      // Redirect or show success message
      alert('Password reset successfully.');
      navigate('/login');
    } else {
      // Handle error
      alert(data.error);
    }
  };
  return (
    <>
    <div className="container d-flex flex-column">
      <div className="row h-100">
        <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table pt-3 h-100">
          <div className="d-table-cell align-middle">

            <div className="text-center mt-4">
              <h1 className="h2">Welcome to Bookbuddy Members!</h1>
              <p className="lead">
                Create your new password
              </p>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="m-sm-3">
                  <div className="row">
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input id='password' className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter a new password" required/>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input id="confirmPassword" className="form-control form-control-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" name="cpassword" placeholder="Confirm your password"/>
                      </div>
                    <div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                      <button type="submit" className="btn btn-lg btn-primary">Reset Password</button>
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

export default Passwordreset