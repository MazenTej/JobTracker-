# Job Application Tracker

## Overview
The **Job Application Tracker** is a web application designed to help users manage their job applications efficiently. Users can add, edit, and track the status of their applications. The app features a **React.js** frontend and a **Flask** backend, with **SQLite** for the backend database. It is deployed using **Heroku** (backend) and **Netlify/Vercel** (frontend).

## Features

### User Features:
- **Registration**: Sign up using email and password.
- **Login**: Log in with email and password.
- **Dashboard**: View a list of job applications with details such as:
  - Company name
  - Job title
  - Status (Applied, Interviewing, etc.)
- **Add Application**: Add a new job application by providing details like job title, company, and status.
- **Edit Application**: Edit existing job applications.
- **Status Tracking**: Track the progress of job applications through various stages:
  - Applied, Interviewing, Offered, Rejected.
- **Set Reminders**: Set reminders for follow-ups, interviews, and other key dates.
- **Logout**: Securely log out of the account.

## Tech Stack

### Frontend:
- **React.js**: JavaScript library for building user interfaces.
- **Material UI**: Component library for styling and UI elements.
- **React Router**: For handling routing and navigation.
- **Netlify/Vercel**: Deployment platforms for the frontend.

### Backend:
- **Flask**: Python framework for handling API requests and server-side logic.
- **SQLite**: Lightweight SQL database used to store user and application data.
- **Flask-CORS**: Handles cross-origin requests between frontend and backend.
- **Heroku**: Deployment platform for the backend API.

## Deployment

- **Frontend URL**: [https://jobs-app-tracker.netlify.app](https://jobs-app-tracker.netlify.app)
