# Startupathon

A platform for managing startup challenges, completers, and subscribers. Built with React, Node.js, and MongoDB.

## Project Overview

- **Frontend**: React-based admin dashboard and public website
- **Backend**: Node.js/Express server with MongoDB database
- **Features**:
  - Admin dashboard for managing challenges, completers, and subscribers
  - Public website showcasing startup completers and their achievements
  - User authentication and authorization
  - Image upload functionality
  - Responsive design for all devices

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd startupathon
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the server directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
   - Create a `.env` file in the client directory with:
     ```
     VITE_API_URL=http://localhost:5000
     ```

4. Start the development servers:
```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend development server (from client directory)
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin

## Project Structure

```
startupathon/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── config/       # Configuration files
│   │   └── App.jsx       # Main application component
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
└── README.md
```

## Features

- **Admin Dashboard**
  - Manage challenges, completers, and subscribers
  - Upload and manage images
  - View analytics and statistics

- **Public Website**
  - Browse startup completers
  - View detailed profiles
  - Subscribe to updates

- **Authentication**
  - Secure admin login
  - JWT-based authentication
  - Protected routes

## Technologies Used

- Frontend:
  - React
  - Tailwind CSS
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Multer (for file uploads) 