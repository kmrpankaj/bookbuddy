import React, { useContext, useEffect, useState } from 'react'
import StudentContext from '../context/StudentContext'
import Sidedash from './Sidedash'
import useStudentData from './Usestudentdata'
import { Link } from 'react-router-dom'
import { capitalizeFirstLetter } from './Utilsfunc'
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const context = useContext(StudentContext)
  const { getOneStudent } = context;
  const [show, setShow] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({});
  const navigate = useNavigate();
  const { studentData, isLoading, error } = useStudentData(getOneStudent);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

    // if (isLoading) return <div>Loading...</div>; // for loading TODO
  if (error) return <div>Error: {error}</div>;
  if (!studentData) return <div>No student data found</div>;

  //gets random avatars
  const avatarFilename = studentData.avatar;
  const dateString = studentData.regisDate;
  const dateRegistered = new Date(dateString);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const handleCheckboxChange = (seatId) => {
    setSelectedSeats(prev => ({
      ...prev,
      [seatId]: !prev[seatId]  // Toggle the checked state
    }));
  };
const handleSubmit = () => {
  // Only pass seats that are selected to the cart page
  const seatsToRenew = studentData.seatAssigned.filter(seat => selectedSeats[`${seat.seatNumber}-${seat.slot}`]);
  navigate('/cart', { state: { seatsToRenew } });
  handleClose();
};
  return (
    <>
    <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    
                    <div className="col-md-9 pt-3"><div className="row">
      <section className="vh-100">
        <div className="h-100">
          <div className="row d-flex h-100">
            <div className="mb-4 mb-lg-0">
              <div className="card mb-3" style={{borderRadius: ".5rem"}}>
                <div className="row g-0">
                  <div className="col-md-4 gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}
                    >
                    <img  src={`/images/${avatarFilename}.jpg`}
                      alt="Avatar" className="img-fluid my-5 rounded-circle" style={{width: "130px"}} />
                    <h5>{(studentData.role === "Admin" || studentData.role === "Superadmin")? studentData.role:"User ID"}</h5>
                    <p>{studentData.uid}</p>
                    <i className="far fa-edit mb-5"></i>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body p-4">

                      <h6>{studentData.name}</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Email</h6>
                          <p className="text-muted">{studentData.email}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>UID</h6>
                          <p className="text-muted">{studentData.uid}</p>
                        </div>
                      </div>

                      <h6>Contact</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Phone</h6>
                          <p className="text-muted">{studentData.phone}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Alternate Number</h6>
                          <p className="text-muted">{studentData.parentsphone}</p>
                        </div>
                      </div>



                      <h6>Other Details</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Address</h6>
                          <p className="text-muted">{studentData.address}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Docuemnts</h6>
                          <p className="text-muted"><Link target="_blank" rel="noopener noreferrer" to={`${process.env.REACT_APP_BACKEND_URL}/${studentData.photo}`}>Photo</Link>, <Link target="_blank" rel="noopener noreferrer" to={`${process.env.REACT_APP_BACKEND_URL}/${studentData.documentid}`}>Document</Link></p>
                        </div>
                      </div>

                      <h6>Seat Details</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="mb-3">
                        <ul className="list-group">
                       { 
                       studentData.seatAssigned && studentData.seatAssigned.length > 0 ? (
                        studentData.seatAssigned.map((shift, index) => (
                          <li key={shift.slot} className="list-group-item"><span className='font-weight-bold'>Seat:</span> {shift.seatNumber} | <span className='font-weight-bold'>Slot:</span> {capitalizeFirstLetter(shift.slot)} | <span className='font-weight-bold'>Valid untill:</span> {shift.validityDate} {(new Date(shift.validityDate)) < (new Date().setHours(0, 0, 0, 0))?(<span className="badge bg-danger badge-danger">Expired</span>):""}</li>
                          ))
                          ) : (
                              <p>No booked shifts</p>
                          )
                        }
                          </ul>
                        </div>
                      </div>
                      <div className='d-flex justify-content-start'>
                      {studentData.seatAssigned && studentData.seatAssigned.length > 0 ? (
                          <button onClick={handleShow} className="btn btn-primary">Renew</button>
                        ) : (
                          <></>
                        )
                        }
                      </div>

                      {/* <!------------------ Modal -------------------> */}
                      <div className={show ? "modal fade show" : "modal fade"} style={{ display: show ? "block" : "none" }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Select Slots</h5>
                              <button type="button" className="close" onClick={handleClose}>
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                            <div className="row pt-1">
                              <div className="mb-3">
                                  <ul className="list-group">
                                  {studentData.seatAssigned.map((seat, index) => (
                                      <li key={`${seat.seatNumber}-${seat.slot}`} className="list-group-item">
                                          <input
                                              className="form-check-input me-2"
                                              type="checkbox"
                                              checked={!!selectedSeats[`${seat.seatNumber}-${seat.slot}`]}
                                              onChange={() => handleCheckboxChange(`${seat.seatNumber}-${seat.slot}`)}
                                  id={`custom-checkbox-${index}`}
                                          />
                                          <span className="font-weight-bold">Seat:</span> {seat.seatNumber} |
                                          <span className="font-weight-bold">Slot:</span> {capitalizeFirstLetter(seat.slot)} |
                                          <span className="font-weight-bold">Valid until:</span> {seat.validityDate}
                                          {new Date(seat.validityDate) < new Date().setHours(0, 0, 0, 0) && (
                                              <span className="badge bg-danger">Expired</span>
                                          )}
                                      </li>
                                  ))}
                                    </ul>
                              </div>
                            </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                              <button onClick={handleSubmit} type="button" className="btn btn-primary">Renew</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {show && <div className="modal-backdrop fade show"></div>}
                      {/* <!------------------ Modal -------------------> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      </div>
      </div>
      </div>
    </>
  )
}

export default Profile