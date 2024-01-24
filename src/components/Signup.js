import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentContext from '../context/StudentContext'

const Signup = () => {
	const context = useContext(StudentContext)
	const { addStudent } = context;

	const [students, setstudents] = useState({name: "", email: "", password: "", gender: "", phone: NaN, parentsphone: NaN, photo: "", documentid: "" })
	const handleClick = (e) => {
		e.preventDefault();
		addStudent(students.name, students.email, students.password, students.gender, students.phone, students.parentsphone, students.photo, students.documentid)
	}
	const onChange = (e) => {
		setstudents({...students, [e.target.name]: e.target.value})
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
										<form>
											<div className="mb-3">
												<label className="form-label">Full name</label>
												<input className="form-control form-control-lg" type="text" name="name" placeholder="Enter your name" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Email</label>
												<input className="form-control form-control-lg" type="email" name="email" placeholder="Enter your email" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Password</label>
												<input className="form-control form-control-lg" type="password" name="password" placeholder="Enter password" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Gender</label>
												<input className="form-control form-control-lg" type="text" name="gender" placeholder="Enter your gender" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Phone</label>
												<input className="form-control form-control-lg" type="text" name="phone" placeholder="Your phone number" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Alternate No</label>
												<input className="form-control form-control-lg" type="text" name="parentsphone" placeholder="Guiardian or relative number" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Photo</label>
												<input className="form-control form-control-lg" type="text" name="photo" placeholder="Upload your photo" onChange={onChange}/>
											</div>
											<div className="mb-3">
												<label className="form-label">Document</label>
												<input className="form-control form-control-lg" type="text" name="documentid" placeholder="Upload your document" onChange={onChange}/>
											</div>
											<div className="d-grid gap-2 mt-3">
												<button onClick={handleClick} className="btn btn-lg btn-primary">Sign up</button>
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