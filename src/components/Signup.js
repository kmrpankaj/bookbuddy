import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentContext from '../context/StudentContext'
import generateStrongPassword from './Strongpassword'
import { copyToClipboard } from './Utilsfunc'
import AlertContext from '../context/AlertContext'
import { useEmail } from '../context/EmailContext'

const Signup = () => {
	const history = useNavigate()
	const host = process.env.REACT_APP_BACKEND_URL
	const context = useContext(StudentContext)
	const { showAlert } = useContext(AlertContext)
	const { addStudent } = context;
	const [students, setstudents] = useState({ name: "", email: "", gender: "", password: "", address: "", phone: "", parentsphone: "", photo: "", documentid: "", role: "Student" })
	const { sendEmail } = useEmail();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showSpinner, setShowSpinner] = useState(false);
	const [isPhoneAvailable, setIsPhoneAvailable] = useState(true); // State for phone number availability
	const [isEmailAvailable, setIsEmailAvailable] = useState(true); // State for email availability
	const debounceDelay = 1000; // Debounce delay in milliseconds
	const [isCheckingEmailAvailability, setIsCheckingEmailAvailability] = useState(false);
	const [isCheckingPhoneAvailability, setIsCheckingPhoneAvailability] = useState(false);

	useEffect(() => {
		const checkAuthentication = async () => {
			const storedToken = localStorage.getItem('token');
			const expiryTime = localStorage.getItem('expiryTime');

			// Check if token exists and has not expired
			if (storedToken && new Date().getTime() < parseInt(expiryTime, 10)) {
				setIsAuthenticated(true);
				showAlert("You are already logged in.", "info");
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
	}, [history, showAlert]);


	const handleClick = async (e) => {
		e.preventDefault();
		setShowSpinner(true)
		// Destructure the students state to pass individual values to addStudent
		const { name, email, gender, password, address, phone, parentsphone, photo, documentid, role } = students;

		try {
			// Call addStudent from your context with all necessary parameters
			const response = await addStudent(name, email, gender, password, address, phone, parentsphone, photo, documentid, role);

			if (response.ok) {
				setShowSpinner(false)
				// Assuming response contains the JSON data directly if successful
				showAlert("Signup successful!", "success");

				// Attempt to send the welcome email
				try {
					await sendEmail({
						to: students.email, // Use the email provided by the student
						subject: 'Welcome to Bookbuddy!',
						html: `<h1>Welcome, ${students.name}!</h1><p>Thank you for signing up. We're thrilled to have you onboard.</p>`,
					});
					// console.log('Welcome email sent successfully.');
				} catch (emailError) {
					console.error('Failed to send welcome email:', emailError);
					// Optionally handle email sending errors, e.g., by logging them or showing an alert
				}
				// Reset the students state after handling the response
				setstudents({
					name: "",
					email: "",
					gender: "",
					password: "",
					address: "",
					phone: "",
					parentsphone: "",
					photo: "",
					documentid: "",
					role: "Student"
				});
				// Optionally update any state or perform redirection
				history("/login"); // Redirect to login page or dashboard as needed
			} else {
				// Directly handle the response error
				showAlert(response.message || 'Signup failed due to an unknown error', "danger");

			}
		} catch (error) {
			console.error("Error adding student:", error);
			showAlert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`, "danger");
		}

	}

	const onChange = (e) => {
		if (e.target.type === 'file') {
			// Handle file inputs separately
			setstudents({ ...students, [e.target.name]: e.target.files[0] });
		} else if (e.target.name === 'gender') {
			// Handle gender separately
			setstudents({ ...students, gender: e.target.value, role: "Student" });
		} else {
			// Handle other inputs (text, email, etc.)
			setstudents({ ...students, [e.target.name]: e.target.value });
		}

		// phone input
		if (e.target.name === 'phone') {
			handlePhoneChange(e.target.value); // Debounced phone validation
		} else if (e.target.name === 'email') {
			handleEmailChange(e.target.value); // Debounced email validation
		}
	};


	// Debounced phone number check function =====================================
	const [checkPhoneAvailability, setCheckPhoneAvailability] = useState(null);
	useEffect(() => {
		const timeout = setTimeout(async () => {
			if (checkPhoneAvailability && checkPhoneAvailability.length === 10) {
				const response = await fetch(`${host}/students/check-phone`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ phone: checkPhoneAvailability }),
				});
				const data = await response.json();
				setIsPhoneAvailable(data.available);
				setIsCheckingPhoneAvailability(false);

			}
		}, debounceDelay);

		return () => clearTimeout(timeout);
	}, [checkPhoneAvailability, debounceDelay]);

	const handlePhoneChange = (phone) => {
		const phoneRegex = /^\d{10}$/; // phone regex
		if (!phoneRegex.test(phone)) {
			setPhoneError('Please enter a valid phone number.');
			setIsCheckingPhoneAvailability(false)
			return; // Exit the function if validation fails
		}
		setIsCheckingPhoneAvailability(true);
		setCheckPhoneAvailability(phone); // Trigger debounced check
		setPhoneError('');
	};

	// Debounced email check function
	const [checkEmailAvailability, setCheckEmailAvailability] = useState(null);
	useEffect(() => {
		const timeout = setTimeout(async () => {
			if (checkEmailAvailability) {
				const response = await fetch(`${host}/students/check-email`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: checkEmailAvailability }),
				});
				const data = await response.json();
				setIsEmailAvailable(data.available);
				setIsCheckingEmailAvailability(false);
			}
		}, debounceDelay);

		return () => clearTimeout(timeout);
	}, [checkEmailAvailability, debounceDelay]);

	const [emailError, setEmailError] = useState("")
	const handleEmailChange = (email) => {
		const emailRegex = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/; // email regex
		if (!emailRegex.test(email)) {
			setEmailError('Please enter a valid email address.'); // Set error state directly
			setIsCheckingEmailAvailability(false)
			return; // Exit the function if validation fails
		}
		setIsCheckingEmailAvailability(true);
		setCheckEmailAvailability(email); // Trigger debounced check
		setEmailError("")
	};


	const generatePassword = (inputId) => {
		const generatedPassword = generateStrongPassword();
		document.getElementById(inputId).value = generatedPassword;
		setstudents({ ...students, password: generatedPassword });
		copyToClipboard("passwordInput")
		showAlert('Strong password generated and copied to clipboard!', "success")

	}
	function togglePasswordVisibility(inputId) {
		const passwordInput = document.getElementById(inputId);
		const isPasswordVisible = passwordInput.type === "text";

		if (isPasswordVisible) {
			// Hide password
			passwordInput.type = "password";
		} else {
			// Show password
			passwordInput.type = "text";
		}
	}

	// phone validation
	const [phone, setPhone] = useState(students.phone || ''); // Initialize phone state with existing value or empty string
	const [phoneError, setPhoneError] = useState(''); // State for validation error message



	// // phone validation
	const [parentPhone, setParentPhone] = useState(students.parentsphone || ''); // Initialize phone state with existing value or empty string
	const [parentPhoneError, setParentPhoneError] = useState(''); // State for validation error message

	const handleParentPhoneChange = (event) => {
		setParentPhone(event.target.value);
		const phoneRegex = /^\d{10}$/; // Replace with your preferred phone number regex
		if (!phoneRegex.test(event.target.value)) {
			setParentPhoneError('Please enter a valid phone number.');
		} else {
			setParentPhoneError('');
		}
		// Call the existing onChange function if needed (pass event for consistency)
		onChange && onChange(event); // Assuming onChange is a function
	};



	return (

		<>
			<div className="container d-flex flex-column">
				<div className="row h-100">
					<div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto pt-3 d-table h-100">
						<div className="d-table-cell align-middle">

							<div className="text-center mt-4">
								<h1 className="h2">Get started</h1>
								<p className="lead">
									Sign up to book a seat.
								</p>
							</div>

							<div className="card">
								<div className="card-body">
									<div className="m-sm-3">
										<form encType="multipart/form-data" onSubmit={handleClick} className="needs-validation" noValidate>
											<div className="mb-3">
												<label className="form-label">Full name</label>
												<input className="form-control form-control-lg" value={students.name} type="text" name="name" placeholder="Enter your name" onChange={onChange} required />
											</div>
											<div className="mb-3">
												<label className="form-label">Email</label>
												<input className={`form-control form-control-lg ${(emailError ? "is-invalid" : "")} ${(isEmailAvailable ? "" : "is-invalid")}`} value={students.email} type="email" name="email" placeholder="Enter your email" onChange={onChange} required />
												{isCheckingEmailAvailability && <span className='spinner-wrap'><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>}
												{emailError && <div id="email-error" class="invalid-feedback">{emailError}</div>}
												{!isCheckingEmailAvailability && !emailError && checkEmailAvailability && <div id="email-error" class={`${(isEmailAvailable ? "valid-feedback" : "invalid-feedback")}`}>{isEmailAvailable ? "Available" : "Email already exists, try a different one."}</div>}
											</div>
											<div className="mb-3">
												<label className="form-label">Create a password</label>
												<div className="position-relative">
													<input className="form-control form-control-lg" id="passwordInput" value={students.password} type="password" name="password" placeholder="Enter a new password" onChange={onChange} required />
													<svg onClick={() => { generatePassword("passwordInput") }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{ cursor: "pointer" }} className="bi bi-file-earmark-lock2-fill position-absolute top-50 end-0 translate-middle" viewBox="0 0 16 16"><path d="M7 7a1 1 0 0 1 2 0v1H7z" /><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0" /></svg>
													<svg onClick={() => { togglePasswordVisibility("passwordInput") }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{ cursor: "pointer" }} className="bi bi-eye-fill position-absolute top-50 end-0 translate-middle mx-4" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" /><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" /></svg>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label">Gender</label>
												<div className="form-check form-check-inline mx-2">
													<input className="form-check-input" value="Male" type="radio" name="gender" id="flexRadioDefault1" checked={students.gender === 'Male'} onChange={onChange} required />
													<label className="form-check-label" htmlFor="Male">
														Male
													</label>
												</div>
												<div className="form-check form-check-inline">
													<input className="form-check-input" value="Female" type="radio" name="gender" id="flexRadioDefault2" checked={students.gender === 'Female'} onChange={onChange} required />
													<label className="form-check-label" htmlFor="Female">
														Female
													</label>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label">Address</label>
												<input className="form-control form-control-lg" value={students.address} type="text" name="address" placeholder="Enter your address" onChange={onChange} required />
											</div>
											<div className="mb-3">
												<label className="form-label">Phone No.</label>
												<input id="phone" className={`form-control form-control-lg ${phoneError || !isPhoneAvailable ? 'is-invalid' : ''}`} value={students.phone} onChange={onChange} type="text" name="phone" placeholder="Your phone number" required />
												{isCheckingPhoneAvailability && <span className='spinner-wrap'><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>}
												<div id="phone-error" class="invalid-feedback">{phoneError}</div>
												{!isCheckingPhoneAvailability && !phoneError && checkPhoneAvailability && <div id="phone-error" class={`${(isPhoneAvailable ? "valid-feedback" : "invalid-feedback")}`}>{isPhoneAvailable ? "Available" : "Phone number already exists, try a different one."}</div>}
											</div>
											<div className="mb-3">
												<label className="form-label">Parent's Phone No.</label>
												<input className={`form-control form-control-lg ${parentPhoneError ? "is-invalid" : ""}`} value={students.parentsphone} type="text" name="parentsphone" placeholder="Guardian or relative number" onChange={handleParentPhoneChange} required />
												<div id="parentphone-error" class="invalid-feedback">{parentPhoneError}</div>
											</div>
											<div className="mb-3">
												<label className="form-label">Photo</label>
												<input className="form-control form-control-lg" type="file" name="photo" placeholder="Upload your photo" onChange={onChange} required />
												<small className='px-1 bg-light'>Valid file types: jpg, jpeg, png, pdf, heic | Size: smaller than 5MB </small>
											</div>
											<div className="mb-3">
												<label className="form-label">Document</label>
												<input className="form-control form-control-lg" type="file" name="documentid" placeholder="Upload your document" onChange={onChange} required />
												<small className='px-1 bg-light'>Valid file types: jpg, jpeg, png, pdf, heic | Size: smaller than 5MB </small>
											</div>

											<div className="d-grid gap-2 mt-3">
												<button type="submit" className="btn btn-lg btn-primary" disabled={students.password.length < 4 || students.phone.length < 10 || students.email.length < 6 || students.name.length < 3 || students.photo.length === 0 || students.documentid.length === 0 || isPhoneAvailable === false || isEmailAvailable === false}>{showSpinner ? <div class="spinner-border" role="status"></div> : "Sign up"}</button>
											</div>
										</form>
									</div>
								</div>
							</div>
							<div className="text-center mb-3">
								Already have account? <Link to="/login">Log In</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Signup