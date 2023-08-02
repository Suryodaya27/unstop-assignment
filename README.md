hosted: https://suryodaya-unstop-assignment.vercel.app/

Overview of the Train Seat Booking Project:

This project is a React-based web application that allows users to book seats in a train coach. The application has a graphical user interface where users can input the number of seats they want to book, and the system will automatically assign available seats to the user. The application is designed to prioritize booking seats in the same row and, if not possible, book nearby seats to accommodate the requested number of seats.

Functionalities:
1. Seat Reservation: Users can input the number of seats they want to book and click the "Book Seats" button. The application will then assign the requested number of seats based on availability.
2. Seat Display: The train coach layout is represented graphically, with each seat displayed as a small box. Available seats are shown in green, while booked seats are displayed in red.
3. Booking Logic: The application uses a greedy algorithm to prioritize booking seats in one row and then nearby seats if needed.
4. Reset: Users can reset the entire booking system, clearing all booked seats and starting afresh.

Algorithms Used:
The main algorithm used in this project is the greedy algorithm. When a user requests to book a certain number of seats, the system tries to book them in the same row first. If there are not enough available seats in the requested row, it proceeds to book nearby seats in other rows until the requested number of seats is fulfilled. The greedy algorithm ensures that the available seats are filled efficiently and can handle multiple coaches with varying numbers of rows and seats.

Technologies Used:
- React: The project is built using the React JavaScript library for the frontend user interface.
- HTML/CSS: HTML is used to structure the page, while CSS (with Tailwind CSS framework) is used for styling and layout.
- LocalStorage: To store the booked seats data locally on the user's browser, LocalStorage is used, allowing the user to retain the booked seats even after refreshing the page.

Installation and Usage:
To use the application, follow these steps:
1. Clone the project repository.
2. Navigate to the project directory and install dependencies using npm or yarn.
3. Run the application using npm start or yarn start.
4. The application will be accessible at https://suryodaya-unstop-assignment.vercel.app/
5. Enter the number of seats you want to book and click "Book Seats" to see the seat booking in action.
6. The application also displays the list of booked seats and the total available seats.

