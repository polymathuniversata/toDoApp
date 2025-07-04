import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = `${API_URL}/api`;

// Get calendar sync status
export const getCalendarStatus = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/calendar/sync-status`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting calendar status:', error);
    throw error;
  }
};

// Toggle calendar sync
export const toggleCalendarSync = async (token, enable) => {
  try {
    const response = await axios.post(
      `${API_BASE}/calendar/toggle-sync`,
      { enable },
      { headers: { 'x-auth-token': token } }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling calendar sync:', error);
    throw error;
  }
};

// Get calendar events
export const getCalendarEvents = async (token, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/calendar/events`, {
      headers: { 'x-auth-token': token },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error getting calendar events:', error);
    throw error;
  }
};

// Create calendar event
export const createCalendarEvent = async (token, eventData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/calendar/events`,
      eventData,
      { headers: { 'x-auth-token': token } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Update calendar event
export const updateCalendarEvent = async (token, eventId, eventData) => {
  try {
    const response = await axios.put(
      `${API_BASE}/calendar/events/${eventId}`,
      eventData,
      { headers: { 'x-auth-token': token } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

// Delete calendar event
export const deleteCalendarEvent = async (token, eventId) => {
  try {
    await axios.delete(`${API_BASE}/calendar/events/${eventId}`, {
      headers: { 'x-auth-token': token }
    });
    return true;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};
