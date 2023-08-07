import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const SeatBooking = () => {
  const totalSeats = 80; // Total of 80 seats
  const seatsPerRow = 7;
  const numRows = Math.ceil(totalSeats / seatsPerRow);
  const lastRowSeats = totalSeats % seatsPerRow; // Number of seats in the last row
  const [seats, setSeats] = useState(
    JSON.parse(localStorage.getItem('bookedSeats')) || Array(totalSeats).fill(0)
  );
  const [availableSeats, setAvailableSeats] = useState(totalSeats);
  const [numSeatsToBook, setNumSeatsToBook] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState('');

  const getSeatLabel = (seatIndex) => {
    const row = Math.floor(seatIndex / seatsPerRow) + 1;
    const seatLetter = String.fromCharCode(65 + (seatIndex % seatsPerRow));
    return `${seatLetter}${row}`;
  };

  const bookSeats = () => {
    if (numSeatsToBook > 7) {
      setMessage('You can only book up to 7 seats at a time.');
      return;
    }

    const newSeats = [...seats];
    let seatsToBook = numSeatsToBook;
    let newBookedSeats = [];

    for (let seatIndex = 0; seatIndex < newSeats.length; seatIndex++) {
      if (seatsToBook === 0) break;
      if (newSeats[seatIndex] === 0) {
        newSeats[seatIndex] = 1;
        newBookedSeats.push(getSeatLabel(seatIndex));
        seatsToBook--;
      }
    }

    setSeats(newSeats);
    setAvailableSeats(newSeats.filter(seat => seat === 0).length);
    setBookedSeats(newBookedSeats);
    setSelectedSeats([]);
    setMessage('');
  };

  const handleReset = () => {
    localStorage.clear();
    setSeats(Array(totalSeats).fill(0));
    setAvailableSeats(totalSeats);
    setBookedSeats([]);
    setSelectedSeats([]);
    setMessage('');
  };

  useEffect(() => {
    localStorage.setItem('bookedSeats', JSON.stringify(seats));
    setAvailableSeats(seats.filter(seat => seat === 0).length);
  }, [seats]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/2 p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Train Seat Booking</h1>
        <div className="mb-4">
          <label htmlFor="numSeats" className="block mb-2">Enter the number of seats to book:</label>
          <input
            type="number"
            id="numSeats"
            min="1"
            max="7"
            className="border rounded p-2 w-full"
            value={numSeatsToBook}
            onChange={(e) => setNumSeatsToBook(parseInt(e.target.value))}
          />
          <button
            onClick={bookSeats}
            className="bg-blue-500 text-white rounded px-4 py-2 mt-2 hover:bg-blue-600"
          >
            Book Seats
          </button>
        </div>
        {message && <p className="text-red-600 mb-4">{message}</p>}
        {bookedSeats.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Booked Seats:</h2>
            <ul className="list-disc pl-6">
              {bookedSeats.map((seat, index) => (
                <li key={index} className="mb-1">{seat}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={handleReset}
          className="bg-red-500 text-white rounded px-4 py-2 mt-4 hover:bg-red-600"
        >
          Reset
        </button>
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mb-4">Seat Availability:</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: numRows }, (_, rowIndex) => (
            Array.from({ length: rowIndex === numRows - 1 ? lastRowSeats : seatsPerRow }, (_, seatIndex) => {
              const seatNumber = rowIndex * seatsPerRow + seatIndex;
              return (
                <div
                  key={seatNumber}
                  className={`border rounded h-12 w-12 flex items-center justify-center cursor-pointer ${seats[seatNumber] === 0 ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-400'} ${selectedSeats.includes(seatNumber) ? 'bg-blue-200' : ''}`}
                  onClick={() => {
                    if (seats[seatNumber] === 0 && !selectedSeats.includes(seatNumber)) {
                      setSelectedSeats(prevSeats => [...prevSeats, seatNumber]);
                    }
                  }}
                >
                  {seats[seatNumber] === 1 ? getSeatLabel(seatNumber) : ''}
                </div>
              );
            })
          ))}
        </div>
        <p className="mt-4 text-center">
          Total available seats: {availableSeats}
        </p>
      </div>
    </div>
  );
};

export default SeatBooking;
