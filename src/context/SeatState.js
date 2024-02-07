import SeatContext from './SeatContext'
import React, { useState } from 'react'

const SeatState = (props) => {
  const host = "http://localhost:3001"
    const seatsdata = []
      const [seats, setSeats] = useState(seatsdata)
      const [loading, setLoading] = useState(false);

// Get all seats
const getAllSeats = async () => {
  try {
    const response = await fetch(`${host}/seats/fetchallseats/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
      },
    });
    const json = await response.json();
    // Sort the data by seatNumber
    const sortedSeats = json.sort((a, b) => a.seatNumber - b.seatNumber);
    setSeats(sortedSeats);
  } catch (error) {
    console.error("Error fetching all students:", error);
    // Handle the error, you might want to set an error state or display a message to the user
  }
}

const  updateSeatStatus = async (seatId, slotName, bookedBy) => {
  const seatStatusUpdate = {
      seatStatus: {
          [slotName]: { bookedBy }
      }
  };

  try {
      const response = await fetch(`${host}/seats/updateseatsdelete/${seatId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              "auth-token": localStorage.getItem('token'), // Authorization token
          },
          body: JSON.stringify(seatStatusUpdate),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response; // Return the fetch response for further processing

  } catch (error) {
      console.error('Failed to update seat status:', error);
      throw error; // Rethrow to handle in the calling function
  }
};


// Removes assgined seat
const removeAssignedSlot = async (seatId, slotName) => {
  setLoading(true);
  const seatStatusUpdate = {
    seatStatus: {
      [slotName]: { bookedBy: "" } // Set bookedBy to an empty string to indicate removal
    }
  };

  try {
    const response = await fetch(`${host}/seats/emptyseat/${seatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token'), // Authorization token
      },
      body: JSON.stringify(seatStatusUpdate),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Assuming the backend returns the updated seat object, refresh seat status in state
    const updatedSeat = await response.json();
    setSeats(prevSeats => prevSeats.map(seat => seat._id === seatId ? updatedSeat.seat : seat));
  } catch (error) {
    console.error('Failed to remove assigned slot:', error);
    // Optionally handle the error, e.g., by setting an error state or displaying a message
  } finally {
    setLoading(false);
  }
};




  return (
    <SeatContext.Provider value={{seats, setSeats, getAllSeats, updateSeatStatus, removeAssignedSlot}}>
        {props.children}
    </SeatContext.Provider>
  )
}

export default SeatState



