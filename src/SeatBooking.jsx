import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const SeatBooking = () => {
  // Initialize the 2D array for seats (11 rows with 7 seats each, and a 12th row with 3 seats)
  const initialSeats = Array(11)
    .fill(Array(7).fill(0))
    .concat([Array(3).fill(0)]);
  const [seats, setSeats] = useState(
    JSON.parse(localStorage.getItem('bookedSeats')) || initialSeats
  );
  
  // Initialize state variable to keep track of available seats in each row
  const initialAvailableSeats = seats.map(row => row.filter(seat => seat === 0).length);
  const [availableSeats, setAvailableSeats] = useState(initialAvailableSeats);
  
  // Initialize state variable to keep track of booked seats
  const [bookedSeats, setBookedSeats] = useState([]);

  // Function to book seats using the correct logic
  const bookSeats = (numSeats) => {
    const newSeats = [...seats];
    let seatsToBook = numSeats;
    let newBookedSeats = [];
    
    // Check if there is a row with enough available seats to book
    const rowIndex = availableSeats.findIndex(row => row >= numSeats);
    if (rowIndex !== -1) {
      // Book the seats in this row
      let booked = 0;
      for (let seat = 0; seat < newSeats[rowIndex].length; seat++) {
        if (booked === numSeats) break; // Seats already booked
        if (newSeats[rowIndex][seat] === 0) {
          newSeats[rowIndex][seat] = 1;
          newBookedSeats.push(`Seat ${rowIndex + 1}${String.fromCharCode(65 + seat)}`);
          booked++;
        }
      }
      seatsToBook = 0; // All seats booked
    }

    // If all seats could not be booked in a single row, book them in nearby seats
    if (seatsToBook > 0) {
      for (let row = 0; row < newSeats.length; row++) {
        for (let seat = 0; seat < newSeats[row].length; seat++) {
          if (seatsToBook === 0) break; // Seats already booked
          if (newSeats[row][seat] === 0) {
            newSeats[row][seat] = 1;
            newBookedSeats.push(`Seat ${rowIndex + 1}${String.fromCharCode(65 + seat)}`);
            seatsToBook--;
          }
        }
      }
    }

    setSeats(newSeats);
    
    // Update available seats state variable
    setAvailableSeats(newSeats.map(row => row.filter(seat => seat === 0).length));
    
    // Update booked seats state variable
    setBookedSeats(newBookedSeats);
  };
  
  // Function to clear local storage and reset state variables
  const handleReset = () => {
    localStorage.clear();
    setSeats(initialSeats);
    setAvailableSeats(initialAvailableSeats);
    setBookedSeats([]);
  }

  // Update localStorage whenever 'seats' state changes
  useEffect(() => {
    localStorage.setItem('bookedSeats', JSON.stringify(seats));
  }, [seats]);

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4">Train Seat Booking</h1>
        
        {/* Input field and button to book seats */}
        <div className="mb-4">
          <label htmlFor="numSeats" className="block mb-2">Enter the number of seats to book:</label>
          <input type="number" id="numSeats" min="1" max="80" className="border rounded p-2 w-full" />
          <button onClick={() => bookSeats(parseInt(document.getElementById('numSeats').value))} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
            Book Seats
          </button>
        </div>
        
        {/* Display the booked seats */}
        {bookedSeats.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Booked Seats:</h2>
            <ul>
              {bookedSeats.map((seat, index) => (
                <li key={index}>{seat}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Button to reset local storage and state variables */}
        <button onClick={handleReset} className="bg-red-500 text-white rounded px-4 py-2 mt-4">
          Reset
        </button>
      </div>
      
      {/* Display the seats and their availability status */}
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Seat Availability:</h2>
        <div className="seats-grid grid grid-cols-7 gap-2">
          {seats.map((row, rowIndex) => (
            row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`seat w-8 h-8 rounded-full ${seat === 1 ? 'bg-red-500' : 'bg-green-500'}`}
              />
            ))
          ))}
        </div>
        
        {/* Display the total number of available seats */}
        <p className="mt-4">
          Total available seats: {availableSeats.reduce((acc, curr) => acc + curr, 0)}
        </p>
      </div>
    </div>
  );
};

export default SeatBooking;
