import axios from "axios";

const API_URL = "http://localhost:5000"; // Replace with your actual backend URL

// Register new user
const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

// Login user
const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// Get applications with pagination and filtering
const getApplications = (user_id, params) => {
  return axios.get(`${API_URL}/applications/${user_id}`, { params });
};

// Get a specific application by ID
const getApplicationById = (applicationId) => {
  return axios.get(`${API_URL}/application/${applicationId}`); // Correct endpoint to get a single application
};

// Add a new job application
const addApplication = (data) => {
  return axios.post(`${API_URL}/applications`, data);
};

// Update an existing application by ID
const updateApplication = (applicationId, updatedData) => {
  return axios.put(`${API_URL}/applications/${applicationId}`, updatedData); // Update the application by ID
};

// Delete a job application by ID
const deleteApplication = (applicationId) => {
  return axios.delete(`${API_URL}/applications/${applicationId}`);
};

// Function to add a reminder to a specific application
const addReminderToApplication = (applicationId, reminderData) => {
  return axios.post(
    `${API_URL}/applications/${applicationId}/reminders`,
    reminderData
  );
};

const deleteReminder = (reminderId) => {
  return axios.delete(`${API_URL}/reminders/${reminderId}`);
};

// Export all services
const AuthService = {
  register,
  login,
  getApplications,
  getApplicationById, // Add this function for fetching a single application
  addApplication,
  updateApplication, // Add this function for updating an application
  deleteApplication,
  addReminderToApplication,
  deleteReminder,
};

export default AuthService;
