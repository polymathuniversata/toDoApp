import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaSync, FaTrash, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCalendarEvents, createCalendarEvent } from '../services/calendarService';

const CalendarEvents = ({ onEventSelect }) => {
  const { token, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (timeRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(now.getDate() - now.getDay()); // Start of current week
        end.setDate(now.getDate() + (6 - now.getDay())); // End of current week
        break;
      case 'month':
        start.setDate(1); // Start of current month
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // Last day of current month
        break;
      default:
        break;
    }

    return { start: start.toISOString(), end: end.toISOString() };
  };

  // Fetch calendar events
  const fetchEvents = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      const { start, end } = getDateRange();
      const data = await getCalendarEvents(token, { start, end });
      setEvents(data);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when time range changes or when authenticated
  useEffect(() => {
    fetchEvents();
  }, [timeRange, isAuthenticated, token]);

  // Toggle event selection
  const toggleEventSelection = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Import selected events as tasks
  const importEventsAsTasks = async () => {
    if (selectedEvents.length === 0) return;

    try {
      setLoading(true);
      const eventsToImport = events.filter(event => 
        selectedEvents.includes(event.id)
      );

      // Create tasks for selected events
      await Promise.all(
        eventsToImport.map(event =>
          createCalendarEvent(token, {
            title: event.summary || 'New Task from Calendar',
            description: event.description || '',
            startDateTime: event.start.dateTime || event.start.date,
            endDateTime: event.end.dateTime || event.end.date,
            fromCalendar: true
          })
        )
      );

      // Clear selection and refresh events
      setSelectedEvents([]);
      await fetchEvents();
      
      // Notify parent component
      if (onEventSelect) {
        onEventSelect(eventsToImport.length);
      }
    } catch (err) {
      console.error('Error importing events as tasks:', err);
      setError('Failed to import events');
    } finally {
      setLoading(false);
    }
  };

  // Format event time
  const formatEventTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-info">
        Please sign in to view your calendar events.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaCalendarAlt className="me-2 text-primary" />
          Calendar Events
        </h5>
        <div className="btn-group">
          <button
            className={`btn btn-sm btn-outline-secondary ${timeRange === 'today' ? 'active' : ''}`}
            onClick={() => setTimeRange('today')}
          >
            Today
          </button>
          <button
            className={`btn btn-sm btn-outline-secondary ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button
            className={`btn btn-sm btn-outline-secondary ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading && events.length === 0 ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-3 text-muted">
            No events found in the selected time range.
          </div>
        ) : (
          <div className="list-group">
            {events.map((event) => (
              <div
                key={event.id}
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  selectedEvents.includes(event.id) ? 'active' : ''
                }`}
                onClick={() => toggleEventSelection(event.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">{event.summary || 'No Title'}</h6>
                    <small>
                      {formatEventTime(event.start.dateTime || event.start.date)}
                      {' - '}
                      {formatEventTime(event.end.dateTime || event.end.date)}
                    </small>
                  </div>
                  {event.description && (
                    <p className="mb-1 small text-muted">
                      {event.description.substring(0, 100)}
                      {event.description.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedEvents.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="badge bg-primary">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div>
              <button
                className="btn btn-primary btn-sm"
                onClick={importEventsAsTasks}
                disabled={loading}
              >
                <FaPlus className="me-1" />
                {loading ? 'Importing...' : 'Import as Tasks'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarEvents;
