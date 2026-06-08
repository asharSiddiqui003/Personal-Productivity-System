# Personal Productivity System

A full-stack productivity application featuring a task manager, habit tracker, calendar integration, and Pomodoro focus timer. Built with a React frontend, Node.js/Express backend, and PostgreSQL database.

## Features

**Task Management**: Create, edit, and filter tasks with priorities, status tracking, and due dates.

**Habit Tracker**: Track custom habits with check-ins, completion logging, and streak tracking.

**Pomodoro Timer**: Integrated focus sessions with custom durations and session logging directly to the database.

**Calendar Integration**: A unified calendar view to track upcoming tasks and habit schedules.

**Secure Authentication**: JWT-based sign-up and login system featuring access/refresh token rotation, bcrypt password hashing, and Google OAuth support.

**User Profile Management**: Bio customization, username saving, and profile photo uploads (via Multer).

**Responsive Interface**: Styled using Tailwind CSS v4 and animated using Framer Motion.

---

## Tech Stack

### Frontend
**Framework**: React 19 (Vite)  
**Styling**: Tailwind CSS v4  
**Animations**: Framer Motion  
**Routing**: React Router DOM  
**Utility**: date-fns, React Icons  

### Backend & Database
**Runtime**: Node.js & Express  
**Database**: PostgreSQL (`pg` driver)  
**Authentication**: JSON Web Tokens (JWT) & Bcrypt  
**File Uploads**: Multer  
**Environment Management**: Dotenv  

---

## Database Schema

The PostgreSQL database (initialized in `backend/init.sql`) contains the following tables:

`tasks`: Store task details, due dates, priorities, and statuses.  
`habit`: Track individual habits, counts, and completion statuses.  
`profile`: User credentials (hashed passwords), bio details, and avatar paths.  
`pomodoro`: Focus session history and duration.  
`refreshTokens`: Store JWT refresh tokens for session persistence.  

---

## Getting Started

### Prerequisites
Node.js (v18 or higher)  
PostgreSQL database instance  

### Database Setup
1. Create a PostgreSQL database named `task_manager` (or your preferred name).
2. Run the initialization script in `backend/init.sql` to set up the schema and tables.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your details:
   ```env
   PORT=5000
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=task_manager
   ACCESS_TOKEN_SECRET=your_jwt_access_secret
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   ```
4. Start the backend services:
   - Main server: `npm run start` or `node server.js`
   - Auth server: `npm run auth` or `node authServer.js`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/task-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set the API endpoints:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_AUTH_API_URL=http://localhost:4000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## License
This project is open-source and licensed under the MIT License.
