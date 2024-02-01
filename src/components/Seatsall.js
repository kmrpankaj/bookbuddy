import React, { useContext, useEffect } from 'react'
import SeatContext from '../context/SeatContext'
import { useNavigate } from 'react-router-dom'
import AlertContext from '../context/AlertContext'
import Sidedash from './Sidedash'

const Seatsall = (props) => {
    const context = useContext(SeatContext)
    const { seats, getAllSeats } = context;
    const history = useNavigate()
    const { showAlert } = useContext(AlertContext)

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('role') === 'Admin') {
            getAllSeats()
        } else if (localStorage.getItem('role') === 'Student') {
            showAlert("You aren't allowed to be here", "danger")
            history("/account");
        } else {
            showAlert("Please login to continue", "warning")
            history("/login");
        }

    }, [])
    return (
        <>
            <div className="container-fluid mt-5 pt-2 seatsall">
                <div className="row">
                    <Sidedash />

                    <div className="col-md-9"><div className="row">
                        {seats.length === 0 && "No user found lol! WTF!!!"}
                        {seats.map((seat) => {
                            return <div className='col-md-3 col-xl-3'>

                                
                                <div className="card">
                                    <div className="content">
                                        <div className="back">
                                            <div className="back-content">
                                                <svg stroke="#ffffff" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" height="50px" width="50px" fill="#ffffff">
                                                    {/* SVG content */}
                                                </svg>
                                                <strong>{seat.seatNumber}</strong>
                                                <strong>{seat.seatLocation}</strong>
                                                
                                            </div>
                                        </div>
                                        <div className="front">
                                            <div className="img">
                                                <div className="circle"></div>
                                                <div className="circle" id="right"></div>
                                                <div className="circle" id="bottom"></div>
                                            </div>
                                            <div className="front-content">
                                                <small className="badge">Pasta</small>
                                                <div className="description">
                                                    <div className="title">
                                                        <p className="title">
                                                            <strong>Spaguetti Bolognese</strong>
                                                        </p>
                                                        <svg fillRule="nonzero" height="15px" width="15px" viewBox="0,0,256,256" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                                                            <g style={{ mixBlendMode: 'normal' }} textAnchor="none" fontSize="none" fontWeight="none" fontFamily="none" strokeDashoffset="0" strokeDasharray="" strokeMiterlimit="10" strokeLinejoin="miter" strokeLinecap="butt" strokeWidth="1" stroke="none" fillRule="nonzero" fill="#20c997">
                                                                <g transform="scale(8,8)">
                                                                    <path d="M25,27l-9,-6.75l-9,6.75v-23h18z"></path>
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <p className="card-footer">
                                                        30 Mins &nbsp; | &nbsp; 1 Serving
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <svg data-toggle="tooltip" data-placement="top" title={seat.seatStatus.morning.status ? "Booked" : "Available"} className='chair-svg' width="16" height="16" fill={seat.seatStatus.morning.status ? "currentColor" : "#20c997"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /></svg>
                                <svg data-toggle="tooltip" data-placement="top" title={seat.seatStatus.afternoon.status ? "Booked" : "Available"} className='chair-svg' width="16" height="16" fill={seat.seatStatus.afternoon.status ? "currentColor" : "#20c997"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /></svg>
                                <svg data-toggle="tooltip" data-placement="top" title={seat.seatStatus.evening.status ? "Booked" : "Available"} className='chair-svg' width="16" height="16" fill={seat.seatStatus.evening.status ? "currentColor" : "#20c997"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /></svg>
                                <svg data-toggle="tooltip" data-placement="top" title={seat.seatStatus.night.status ? "Booked" : "Available"} className='chair-svg' width="16" height="16" fill={seat.seatStatus.night.status ? "currentColor" : "#20c997"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /></svg>
                            </div>
                        })
                        }
                    </div></div></div></div>
        </>
    )
}

export default Seatsall