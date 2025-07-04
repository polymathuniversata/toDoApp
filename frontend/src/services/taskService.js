import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = `${API_URL}/api`;

// Debug logging
console.log('TaskService - API_URL:', API_URL);
console.log('TaskService - API_BASE:', API_BASE);

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${API_BASE}/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_BASE}/tasks/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
