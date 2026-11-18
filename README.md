# Library Management System

A full-stack web application for managing books, library users, availability, stock and borrowing transactions.

## Project Overview

The Library Management System provides a centralized interface for managing library resources. It allows administrators to manage books and users, monitor book availability, record borrowing transactions, add stock and view transaction history.

The system uses a React frontend, an Express.js backend and PostgreSQL for persistent data storage.

## Features

- User login using membership ID
- Protected application routes
- Dashboard with library statistics
- Book management
  - Add books
  - View books
  - Update books
  - Delete books
- User management
  - Add users
  - View users
  - Update users
  - Delete users
- Transaction management
  - Borrow books
  - Add stock
  - Track available quantities
  - Prevent borrowing more copies than available
  - Maintain transaction history
- Low-stock identification for books with fewer than 2 copies
- Responsive green cyberpunk-inspired interface

## Technologies Used

### Frontend

- React
- JavaScript
- JSX
- React Hooks
- React Router
- Fetch API
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- `pg`
- CORS
- dotenv

## System Architecture

```text
React Frontend
      |
      | Fetch API
      v
Express REST API
      |
      | pg
      v
PostgreSQL Database
```

## Database

The application uses PostgreSQL with three main tables:

### Users

Stores library users and their membership information.

Fields include:

- ID
- Name
- Membership ID
- Role

### Books

Stores library book information.

Fields include:

- ID
- Title
- Author
- Genre
- ISBN
- Quantity

### Transactions

Stores stock and borrowing activity.

Fields include:

- ID
- Book ID
- User ID
- Transaction type
- Quantity
- Transaction date

## API Endpoints

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get one book |
| POST | `/books` | Add a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get one user |
| POST | `/users` | Add a user |
| POST | `/users/login` | Login |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Get transaction history |
| POST | `/transactions` | Borrow a book or add stock |

## Installation

### Backend

Open a terminal in the backend directory:

```bash
npm install
```

Create a `.env` file:

```text
DB_USER=postgres
DB_HOST=localhost
DB_NAME=library_management
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432
```

Start the backend:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal in the frontend directory:

npm install

Start the development server:

npm run dev

The frontend will normally run on:

http://localhost:5173

## Login

The system uses the membership ID stored in the users table.

Example accounts:

L001
L002

## Stock and Transactions

When a book is borrowed, the system checks whether enough copies are available.

If sufficient stock exists:

1. The book quantity is reduced.
2. A transaction is recorded.
3. The new quantity is returned to the frontend.

When stock is added:

1. The book quantity is increased.
2. An `ADD_STOCK` transaction is recorded.

The transaction operation uses a PostgreSQL database transaction so that the stock update and transaction record are handled together.

## React Concepts Demonstrated

The project demonstrates:

- `useState` for component state
- `useEffect` for loading backend data
- Controlled forms
- Form validation
- Reusable React components
- React Router
- Protected routes
- Fetch API communication
- Conditional rendering

## Project Structure

library-management-system/
├── backend/
│   ├── routes/
│   │   ├── books.js
│   │   ├── users.js
│   │   └── transactions.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
└── README.md

## Author

Rethabile Abram Tsotetsi

Library Management System — Web Application Development