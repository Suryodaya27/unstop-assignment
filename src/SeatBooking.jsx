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
  const [message, setMessage] = useState('');

  const bookSeats = () => {
    const newSeats = [...seats];
    let seatsToBook = numSeatsToBook;
    let newBookedSeats = [];

    for (let rowIndex = 0; rowIndex < newSeats.length; rowIndex++) {
      for (let seatIndex = 0; seatIndex < newSeats[rowIndex].length; seatIndex++) {
        if (seatsToBook === 0) break;
        if (newSeats[rowIndex][seatIndex] === 0) {
          newSeats[rowIndex][seatIndex] = 1;
          newBookedSeats.push(`Seat ${String.fromCharCode(65 + seatIndex)}${rowIndex + 1}`);
          seatsToBook--;
        }
      }
    }

    setSeats(newSeats);
    setAvailableSeats(newSeats.map(row => row.filter(seat => seat === 0).length));
    setBookedSeats(newBookedSeats);
    setSelectedSeats([]);

    if (seatsToBook > 0) {
      setMessage(`Only ${numSeatsToBook - seatsToBook} seats available. Can book ${numSeatsToBook - seatsToBook} seats.`);
    } else {
      setMessage('');
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setSeats(initialSeats);
    setAvailableSeats(initialSeats.map(row => row.length)); // Reset the available seats to the initial values
    setBookedSeats([]);
    setSelectedSeats([]);
    setMessage('');
  };

  useEffect(() => {
    localStorage.setItem('bookedSeats', JSON.stringify(seats));
    setAvailableSeats(seats.map(row => row.filter(seat => seat === 0).length)); // Update available seats when 'seats' state changes
  }, [seats]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
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
        {message && <p className="text-red-600 mb-4">{message}</p>}
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
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Seat Availability:</h2>
        <div className="flex flex-wrap justify-center">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="coach-container mx-4 mb-8">
              <h3 className="text-lg font-bold mb-2">Coach {rowIndex + 1}</h3>
              <div className="seats-grid grid grid-cols-7 gap-2">
                {row.map((seat, seatIndex) => (
                  <div
                    key={`${rowIndex}-${seatIndex}`}
                    className={`border rounded h-8 w-8 flex items-center justify-center cursor-pointer ${seat === 0 ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-400'} ${selectedSeats.includes(`${rowIndex}-${seatIndex}`) ? 'bg-blue-200' : ''}`}
                    onClick={() => {
                      if (seat === 0 && !selectedSeats.includes(`${rowIndex}-${seatIndex}`)) {
                        setSelectedSeats(prevSeats => [...prevSeats, `${rowIndex}-${seatIndex}`]);
                      }
                    }}
                  >
                    {seat === 1 ? String.fromCharCode(65 + seatIndex) + (rowIndex + 1) : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center">
          Total available seats: {availableSeats.reduce((acc, curr) => acc + curr, 0)}
        </p>
      </div>
    </div>
  );
};

export default SeatBooking;
