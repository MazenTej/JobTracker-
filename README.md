Job Application Tracker
Overview
This is a Job Application Tracker web application that helps users manage their job applications. The app allows users to add, edit, and track the status of their job applications. It features both a React.js frontend and a Flask backend. The app uses SQLite for the backend database and is deployed using Heroku for the backend and Netlify/Vercel for the frontend.

Features
User Features:
Registration: Users can sign up with their email and password.
Login: Users can log in with their email and password.
Dashboard: Users can view their list of job applications with details like company name, job title, status, and more.
Add Application: Users can add a new job application by providing relevant details (job title, company, status, etc.).
Edit Application: Users can edit existing job applications.
Status Tracking: Users can track the progress of their applications through various stages (e.g., Applied, Interviewing, Offered, Rejected).
Set Reminders: Users canset reminders for specific applications such as follow ups and interviews 
Logout: Users can securely log out of their account.
Tech Stack
Frontend:
React.js: Frontend library for building the user interface.
Material UI: Component library for styling and UI components.
React Router: Handles routing and navigation.
Netlify/Vercel: Deployment platform for the frontend.
Backend:
Flask: Backend framework for handling API requests and server-side logic.
SQLite: Lightweight SQL database used to store user and application data.
Flask-CORS: For handling cross-origin requests between the frontend and backend.
Heroku: Deployment platform for the backend API.
URL:
https://jobs-app-tracker.netlify.app/
