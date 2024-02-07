import React, { useContext, useEffect, useState, useRef } from 'react'
import SeatContext from '../context/SeatContext'
import { useNavigate } from 'react-router-dom'
import AlertContext from '../context/AlertContext'
import Sidedash from './Sidedash'
import Editslot from './Editslot'

const Seatsall = (props) => {
    const context = useContext(SeatContext)
    const { seats, setSeats, getAllSeats, updateSeatStatus, removeAssignedSlot } = context;
    const history = useNavigate()
    const slotModalRef = useRef(null);
    const { showAlert } = useContext(AlertContext)
    const [slot, setSlot] = useState({})
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
    const handleCloseModal = () => {
        const modalElement = document.getElementById('staticBackdrop');
        modalElement.classList.remove('show'); // Adjust classes as needed for your Bootstrap version
        modalElement.removeAttribute('aria-modal'); // Optional step for accessibility
      };
    const handleSlotClick = (e, currentSeat) => {
        // console.log(e.currentTarget); // Debug to see if this is the expected element
        // console.log(e.currentTarget.dataset.slot); 
        // Trigger modal or UI element that allows editing
                if (slotModalRef.current) {
                    slotModalRef.current.click();
                }
                //console.log(slotModalRef.current)

        const slotName = e.currentTarget.dataset.slot;
        // Pre-fill the slot state with the current seat information and the slot to be edited
        if (currentSeat.seatStatus && currentSeat.seatStatus[slotName]) {
        setSlot({
            ...slot,
            seatId: currentSeat._id,
            slotName: slotName,
            bookedBy: currentSeat.seatStatus[slotName].bookedBy // This will be the old value
        })
        } else {
             // Handle cases where slot data is missing, perhaps initializing with default values or showing an error/alert
        //console.log(`Slot data for '${slotName}' is missing in the current seat.`);
        }

    }
    const onChangeEdit = (e) => {
        setSlot({...slot, [e.target.name]: e.target.value});
    }

    const slotUpdate = async () => {
        if (slot.seatId && slot.slotName && slot.bookedBy) {
          try {
            const response = await updateSeatStatus(slot.seatId, slot.slotName, slot.bookedBy);
            if(response.ok) {
              const { seat: updatedSeatData } = await response.json(); // Destructuring to get the updated seat directly
              // Assuming `seats` is the state you're using to render your seats
              setSeats(currentSeats => currentSeats.map(seat => {
                if (seat._id === updatedSeatData._id) { // Match the seat by ID and update
                  return updatedSeatData; // Use the updated seat data directly
                }
                return seat; // Return unmodified for other seats
              }));
      
              handleCloseModal(); // Close the modal
              setSlot({}); // Reset slot state
              showAlert("Seat updated successfully", "success");
            } else {
              throw new Error('Failed to update the seat.');
            }
          } catch (error) {
            console.error('Failed to update seat status:', error);
            showAlert("Update failed", "danger");
          }
        }
      };
     
    const makeSeatAvailable = async () => {
        const slotName = slot.slotName;
        const seatID = slot.seatId;
        try {
            await removeAssignedSlot(seatID, slotName);
            showAlert("Seat removed successfully", "success");
          } catch (error) {
            showAlert("Failed to remove the seat", "error");
          }
    }

    

    return (
        <>
            <div className="container-fluid mt-5 pt-2 seatsall">
                <div className="row">
                    <Sidedash />

                    <div className="col-md-9"><div className="row">
                        {seats.length === 0 && "No user found lol! WTF!!!"}
                        {seats.map((seat) => {
                            return <div className="col-lg-6 col-xl-3 mb-4">
                                <div className="card text-white h-100" style={{backgroundColor: "#25617ee3"}}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="me-3">
                                                <div className="text-white-75 small">Edit</div>
                                                <div className="text-lg fw-bold">{seat.seatLocation}</div>
                                            </div>
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#37adff" className="bi bi-laptop" viewBox="0 0 16 16"><path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/><text x="50%" y="50%" font-size="8" text-anchor="middle" dy=".3em" fill="#c2e6ff">{seat.seatNumber}</text></svg> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffffff5e" className="bi bi-shield" viewBox="0 0 16 16"><path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/><text x="50%" y="50%" font-size="7" text-anchor="middle" dy=".3em" fill="#c2e6ff">{seat.seatNumber}</text></svg>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex align-items-center justify-content-between small">
                                        <span role="button" data-slot="morning" onClick={(e)=>handleSlotClick(e, seat)}><svg className='chair-svg' width="30" height="30" fill={seat.seatStatus && seat.seatStatus.morning.status ? "#1b4256" : "#c4d8f3"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /><title>Morning slot {seat.seatStatus.morning.status ? "unavailable" : "available"}</title></svg></span>
                                        <span role="button" data-slot="afternoon" onClick={(e)=>handleSlotClick(e, seat)}><svg className='chair-svg' width="30" height="30" fill={seat.seatStatus && seat.seatStatus.afternoon.status ? "#1b4256" : "#c4d8f3"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /><title>Afternoon slot {seat.seatStatus.afternoon.status ? "unavailable" : "available"}</title></svg></span>
                                        <span role="button" data-slot="evening" onClick={(e)=>handleSlotClick(e, seat)}><svg className='chair-svg' width="30" height="30" fill={seat.seatStatus && seat.seatStatus.evening.status ? "#1b4256" : "#c4d8f3"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /><title>Evening slot {seat.seatStatus.evening.status ? "unavailable" : "available"}</title></svg></span>
                                        <span role="button" data-slot="night" onClick={(e)=>handleSlotClick(e, seat)}><svg className='chair-svg' width="30" height="30" fill={seat.seatStatus && seat.seatStatus.night.status ? "#1b4256" : "#c4d8f3"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 160C64 89.3 121.3 32 192 32H448c70.7 0 128 57.3 128 128v33.6c-36.5 7.4-64 39.7-64 78.4v48H128V272c0-38.7-27.5-71-64-78.4V160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48V448c0 17.7-14.3 32-32 32H576c-17.7 0-32-14.3-32-32H96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3v48 32h32H512h32V320 272z" /><title>Night slot {seat.seatStatus.night.status ? "unavailable" : "available"}</title></svg></span>     
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div></div></div></div>
                    <Editslot ref={slotModalRef} slot={slot} onChangeEdit={onChangeEdit} slotUpdate={slotUpdate} makeSeatAvailable={makeSeatAvailable} />


        </>
    )
}

export default Seatsall

