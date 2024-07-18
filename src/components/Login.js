import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AlertContext from '../context/AlertContext'

const Login = () => {
  const [credentials, setCredentials] = useState({email: "", password: ""})
  const {showAlert} = useContext(AlertContext)
  const [rememberMe, setRememberMe] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const host = process.env.REACT_APP_BACKEND_URL;

  const history = useNavigate()
  const handleLoginSubmit = async (e) => {

    e.preventDefault()
    const response = await fetch(`${host}/students/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password})
    })
    const json = await response.json()
    // console.log(json, "Whats inside json at login")
    if(json.success){
      showAlert("Login successful!", "success");
// Set session if remember me is checked
      if (rememberMe) {
        // Set expiry time to 1 hour (3600000 milliseconds) for 30 days (30 * 24 * 60 * 60 * 1000)
        const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('rememberMe', true);
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('password', credentials.password);
        localStorage.setItem('expiryTime', expiryTime);
      }
      //save the authtoken and redirect
      localStorage.setItem('token', json.authToken)
      localStorage.setItem('role', json.therole)
      if (json.therole === "Admin" || json.therole === "Superadmin") {
        history("/allstudents");
      }else{
        history("/profile"); // Redirect to allstudents page for admin
      }
    } else {
      // Handle errors
        if (json.errors) { // Check for existence of errors array
            const errorMessage = json.errors.join(', '); // Join error messages
            showAlert(`Error: ${errorMessage}`, "danger");
        } else {
            // Handle unexpected errors if no errors array is present
            showAlert("An unexpected error occurred. Please try again.", "danger");
        }
    }

  }
  const onChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  }
  useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const rememberMe = localStorage.getItem('rememberMe');
  const storedExpiryTime = localStorage.getItem('expiryTime');
  //const host = "http://localhost:3001";

  // checking if already logged in
  const checkAuthentication = async () => {
    // Check if token exists and has not expired
    if (storedToken && new Date().getTime() < parseInt(storedExpiryTime, 10)) {
      setIsAuthenticated(true);
      showAlert("You are already logged in.", "info");
      console.log('loggedin hai')
      history('/profile'); // Redirect to home if already logged in
    }
    // Function to check if the token is still valid
		const isTokenValid = () => {
			return Boolean(localStorage.getItem('token'));
		  };
		// Check if the token exists and is valid
		if (isTokenValid()) {
			setIsAuthenticated(true);
			history('/profile'); // Redirect to home if already logged in
		  }
  };

  checkAuthentication();

     // Declare the response variable outside the try block.
    let response;
  
    const fetchData = async () => {
      try {
        if (storedToken && rememberMe && parseInt(storedExpiryTime, 10) > new Date().getTime()) {
          // Get stored credentials from localStorage
          const storedEmail = localStorage.getItem('email');
          const storedPassword = localStorage.getItem('password');
          setStoredCredentials({ email: storedEmail, password: storedPassword });
  
          const response = await fetch(`${host}/students/login/`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            method: "POST",
            body: JSON.stringify({ email: storedEmail, password: storedPassword }),
          });
  
          const data = await response.json();
  
          setIsAuthenticated(true);
          setUserData(data);
  
          if (data.role === 'Admin') {
            history('/allstudents');
          } else {
            history('/profile');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Handle error scenarios, such as clearing stored token and flag
      }
    };
  
    fetchData(); // Call the fetchData function
  
    // Cleanup function
    return () => {
      // If any ongoing fetch happens in this effect, cancel it here
      // Note: The response variable is already declared inside the try block
      if (response) {
        response.abort();
      }
    };
  }, [history, showAlert]); // Empty dependency array means this effect runs once on mount
  return (
    <>
      <div className="container d-flex flex-column">
        <div className="row h-100">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table pt-3 h-100">
            <div className="d-table-cell align-middle">

              <div className="text-center mt-4">
                <h1 className="h2">Welcome to Bookbuddy Members!</h1>
                <p className="lead">
                  Sign in to your account to continue
                </p>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="m-sm-3">
                    <div className="row">
                    </div>
                    <form onSubmit={handleLoginSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input className="form-control form-control-lg" value={credentials.email} type="email" name="email" placeholder="Enter your email" onChange={onChange}/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input className="form-control form-control-lg" value={credentials.password} type="password" name="password" placeholder="Enter your password" onChange={onChange}/>
                          <small>
                            <Link className='pt-2 d-block px-2' to="/forgotpassword">Forgot password?</Link>
                          </small>
                      </div>
                      <div>
                        <div className="form-check align-items-center">
                          <input id="customControlInline" type="checkbox" className="form-check-input" value="remember-me" name="remember-me" onChange={handleRememberMeChange} checked={rememberMe} />
                            <label className="form-check-label text-small" htmlFor="customControlInline">Remember me</label>
                        </div>
                      </div>
                      <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-lg btn-primary">Sign in</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="text-center mb-3 my-2">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login