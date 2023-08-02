import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const SeatBooking = () => {
  const initialSeats = Array(11)
    .fill(Array(7).fill(0))
    .concat([Array(3).fill(0)]);
  const [seats, setSeats] = useState(
    JSON.parse(localStorage.getItem('bookedSeats')) || initialSeats
  );
  const [availableSeats, setAvailableSeats] = useState([]);
  const [numSeatsToBook, setNumSeatsToBook] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const bookSeats = () => {
    const newSeats = [...seats];
    let seatsToBook = numSeatsToBook;
    let newBookedSeats = [];

    const rowIndex = availableSeats.findIndex(row => row >= numSeatsToBook);
    if (rowIndex !== -1) {
      let booked = 0;
      for (let seat = 0; seat < newSeats[rowIndex].length; seat++) {
        if (booked === numSeatsToBook) break;
        if (newSeats[rowIndex][seat] === 0) {
          newSeats[rowIndex][seat] = 1;
          newBookedSeats.push(`Seat ${rowIndex + 1}${String.fromCharCode(65 + seat)}`);
          booked++;
        }
      }
      seatsToBook -= booked;
    }

    if (seatsToBook > 0) {
      for (let row = 0; row < newSeats.length; row++) {
        if (seatsToBook === 0) break;
        if (row === rowIndex) continue;
        for (let seat = 0; seat < newSeats[row].length; seat++) {
          if (seatsToBook === 0) break;
          if (newSeats[row][seat] === 0) {
            newSeats[row][seat] = 1;
            newBookedSeats.push(`Seat ${row + 1}${String.fromCharCode(65 + seat)}`);
            seatsToBook--;
          }
        }
      }
    }

    setSeats(newSeats);
    setAvailableSeats(newSeats.map(row => row.filter(seat => seat === 0).length));
    setBookedSeats(newBookedSeats);
    setSelectedSeats([]);
  };

  const handleReset = () => {
    localStorage.clear();
    setSeats(initialSeats);
    setAvailableSeats([]);
    setBookedSeats([]);
    setSelectedSeats([]);
  };

  useEffect(() => {
    localStorage.setItem('bookedSeats', JSON.stringify(seats));
  }, [seats]);

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4">Train Seat Booking</h1>
        <div className="mb-4">
          <label htmlFor="numSeats" className="block mb-2">Enter the number of seats to book:</label>
          <input
            type="number"
            id="numSeats"
            min="1"
            max="80"
            className="border rounded p-2 w-full"
            value={numSeatsToBook}
            onChange={(e) => setNumSeatsToBook(parseInt(e.target.value))}
          />
          <button
            onClick={bookSeats}
            className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
          >
            Book Seats
          </button>
        </div>
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
        <button
          onClick={handleReset}
          className="bg-red-500 text-white rounded px-4 py-2 mt-4"
        >
          Reset
        </button>
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Seat Availability:</h2>
        <div className="seats-grid grid grid-cols-7 gap-2">
          {seats.map((row, rowIndex) => (
            row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`border rounded h-8 w-8 flex items-center justify-center cursor-pointer ${seat === 0 ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-400'} ${selectedSeats.includes(`${rowIndex}-${seatIndex}`) ? 'bg-blue-200' : ''}`}
                onClick={() => {
                  if (seat === 0 && !selectedSeats.includes(`${rowIndex}-${seatIndex}`)) {
                    setSelectedSeats(prevSeats => [...prevSeats, `${rowIndex}-${seatIndex}`]);
                  }
                }}
              />
            ))
          ))}
        </div>
        <p className="mt-4">
          Total available seats: {availableSeats.reduce((acc, curr) => acc + curr, 0)}
        </p>
      </div>
    </div>
  );
};

export default SeatBooking;
