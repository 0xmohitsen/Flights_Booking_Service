# GetSetFly - Microservices-based Flight Booking System

GetSetFly is a backend project developed for managing flight bookings and notifications using a microservices architecture. It consists of several services built with Node.js, Express.js, and MySQL's Sequelize ORM. The project follows best practices for backend development, including role-based authorization, rate-limiting, and message queuing for efficient communication between services.

## Services

### 1. [API Gateway](https://github.com/Mohitsen11/API_Gateway_For_Flights)

- Entry point for accessing all other services
- Implements authentication and role-based authorization
- Uses Proxy for redirecting requests/API calls to the appropriate service
- Implements rate-limiting to prevent server overload

### 2. [Flight Service](https://github.com/Mohitsen11/Flights_Project)

- Provides information about flights, airplanes, cities, and airports
- Supports CRUD operations for flights
- Implements associations for tables related to flights, airplanes, cities, and airports
- Allows users to filter flights based on various criteria including price, available seats, departure and arrival airports.
- Leverages the power of SQL queries to efficiently filter flight data based on the provided criteria. It utilizes Sequelize ORM's query-building capabilities to construct dynamic queries and retrieve relevant 
  flight information from the database. 

### 3. [Flight Booking Service](https://github.com/Mohitsen11/Flights_Booking_Service)

- Allows authenticated users, admins, and flight companies to book tickets
- Publishes events to the Message Queue after successful booking
- Prevents multiple payments from the same user using transactional queries and RabbitMQ's Pub/Sub architecture

### 4. [Flight Notification Service](https://github.com/Mohitsen11/flight_Notification_Service)

- Sends email notifications to customers after successful ticket bookings
- Acts as a Subscriber to the events published by the Booking Service via message queues

## Features

- **Microservices Architecture**: Scalable and maintainable architecture with separate services for different functionalities.
- **Authentication and Authorization**: Role-based access control for securing resources.
- **Rate Limiting**: Prevents server overload by restricting the number of requests per IP address.
- **Message Queues**: Efficient communication between services using RabbitMQ's Pub/Sub architecture.
- **Transactional Queries**: Prevents concurrency issues during ticket booking by using transactional queries provided by MySQL.
- **Association**: Utilizes associations in the database schema to represent relationships between entities.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Mohitsen11/API_Gateway_For_Flights.git`
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start each service: `npm start`

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
