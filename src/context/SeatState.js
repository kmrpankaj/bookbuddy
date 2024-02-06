import SeatContext from './SeatContext'
import React, { useState } from 'react'

const SeatState = (props) => {
  const host = "http://localhost:3001"
    const seatsdata = []

      const [seats, setSeats] = useState(seatsdata)

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


  return (
    <SeatContext.Provider value={{seats, getAllSeats}}>
        {props.children}
    </SeatContext.Provider>
  )
}

export default SeatState



