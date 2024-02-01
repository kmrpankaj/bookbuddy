import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentContext from '../context/StudentContext'
import generateStrongPassword from './Strongpassword'

const Signup = () => {
	const context = useContext(StudentContext)
	const { addStudent } = context;
	const [students, setstudents] = useState({name: "", email: "",  gender: "", password: "", address: "", phone: "", parentsphone: "", photo: "", documentid: "", role: "Student" })
	
	const handleClick = async (e) => {
		e.preventDefault();
		try {
			const response = await addStudent(students.name, students.email, students.gender, students.password, students.address, students.phone, students.parentsphone, students.photo, students.documentid, students.role);
		
			if (response.status === 201) {
			  // Handle success
			  console.log('Student added successfully!');
			} else if (response.status === 400) {
			  // Handle specific error for duplicate email
			  const errorData = await response.json();
			  if (errorData.error === "Sorry, a user with this email already exists.") {
				// Display an error message to the user
				console.error('Error:', errorData.error);
				// You can set an error state or display a message to the user
			  } else {
				// Handle other 400 status codes or unknown errors
				console.error('Failed to add student. Status code:', response.status);
			  }
			} else {
			  // Handle other status codes
			  console.error('Failed to add student. Status code:', response.status);
			}
		  } catch (error) {
			// Handle errors that occurred during the request
			console.error('Error adding student:', error);
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
			role: "",
		  });
	}
	const onChange = (e) => {
		if (e.target.name === 'gender') {
			// Handle gender separately
			setstudents({ ...students, gender: e.target.value, role: "Student" });
		  } else {
		setstudents({...students, [e.target.name]: e.target.value})
		  }
	}
	const generatePassword = (inputId) => {
		const generatedPassword = generateStrongPassword();
		document.getElementById(inputId).value = generatedPassword;
		setstudents({ ...students, password: generatedPassword });
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
  return (

    <>
      <div className="container d-flex flex-column">
				<div className="row h-100">
					<div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
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
										<form onSubmit={handleClick} className="needs-validation" noValidate>
											<div className="mb-3">
												<label className="form-label">Full name</label>
												<input className="form-control form-control-lg" value={students.name} type="text" name="name" placeholder="Enter your name" onChange={onChange} required/>
												
											</div>
											<div className="mb-3">
												<label className="form-label">Email</label>
												<input className="form-control form-control-lg" value={students.email} type="email" name="email" placeholder="Enter your email" onChange={onChange} required/>
											</div>
											<div className="mb-3">
												<label className="form-label">Password</label>
												<div className="position-relative">
													<input className="form-control form-control-lg" id="passwordInput" value={students.password} type="password" name="password" placeholder="Enter password" onChange={onChange} required/>
													<svg onClick={() => {generatePassword("passwordInput")}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{cursor: "pointer"}} className="bi bi-file-earmark-lock2-fill position-absolute top-50 end-0 translate-middle" viewBox="0 0 16 16"><path d="M7 7a1 1 0 0 1 2 0v1H7z"/><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0"/></svg>
													<svg onClick={() => {togglePasswordVisibility("passwordInput")}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{cursor: "pointer"}} className="bi bi-eye-fill position-absolute top-50 end-0 translate-middle mx-4" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label">Gender</label>
												<div className="form-check form-check-inline mx-2">
												<input className="form-check-input" value="Male" type="radio" name="gender" id="flexRadioDefault1" checked={students.gender === 'Male'} onChange={onChange} required/>
												<label className="form-check-label" htmlFor="Male">
													Male
												</label>
												</div>
												<div className="form-check form-check-inline">
												<input className="form-check-input" value="Female" type="radio" name="gender" id="flexRadioDefault2" checked={students.gender === 'Female'}  onChange={onChange} required/>
												<label className="form-check-label" htmlFor="Female">
													Female
												</label>
												</div>
											</div>
											<div className="mb-3">
												<label className="form-label">Address</label>
												<input className="form-control form-control-lg" value={students.address} type="text" name="address" placeholder="Enter your address" onChange={onChange} required/>
											</div>
											<div className="mb-3">
												<label className="form-label">Phone</label>
												<input className="form-control form-control-lg" value={students.phone} type="text" name="phone" placeholder="Your phone number" onChange={onChange} required/>
											</div>
											<div className="mb-3">
												<label className="form-label">Alternate No</label>
												<input className="form-control form-control-lg" value={students.parentsphone} type="text" name="parentsphone" placeholder="Guardian or relative number" onChange={onChange} required/>
											</div>
											<div className="mb-3">
												<label className="form-label">Photo</label>
												<input className="form-control form-control-lg" value={students.photo} type="text" name="photo" placeholder="Upload your photo" onChange={onChange} required/>
											</div>
											<div className="mb-3">
												<label className="form-label">Document</label>
												<input className="form-control form-control-lg" value={students.documentid} type="text" name="documentid" placeholder="Upload your document" onChange={onChange} required/>
											</div>

											<div className="d-grid gap-2 mt-3">
												<button type="submit" className="btn btn-lg btn-primary">Sign up</button>
												{/* disabled={students.password.length<4 || students.phone.length<10||students.email.length<6||students.name.length<2 } */}
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