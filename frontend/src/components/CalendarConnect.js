import React, { useState, useEffect } from 'react';
import { FaGoogle, FaSync, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCalendarStatus, toggleCalendarSync } from '../services/calendarService';

const CalendarConnect = () => {
  const { token, isAuthenticated } = useAuth();
  const [status, setStatus] = useState({
    isConnected: false,
    calendarSyncEnabled: false,
    lastSynced: null,
    loading: true,
    error: null
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch calendar status on component mount and when token changes
  useEffect(() => {
    const fetchStatus = async () => {
      if (!isAuthenticated || !token) {
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setStatus(prev => ({ ...prev, loading: true, error: null }));
        const data = await getCalendarStatus(token);
        setStatus({
          ...data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching calendar status:', error);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch calendar status'
        }));
      }
    };

    fetchStatus();
  }, [isAuthenticated, token]);

  const handleConnect = () => {
    // Redirect to backend's Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const handleToggleSync = async () => {
    if (!token || isProcessing) return;
    
    try {
      setIsProcessing(true);
      const data = await toggleCalendarSync(token, !status.calendarSyncEnabled);
      setStatus(prev => ({
        ...prev,
        calendarSyncEnabled: data.calendarSyncEnabled,
        lastSynced: data.lastSynced || prev.lastSynced
      }));
    } catch (error) {
      console.error('Error toggling calendar sync:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Failed to update sync settings'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  if (status.loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaGoogle className="me-2 text-danger" />
          Google Calendar Integration
        </h5>
        {status.isConnected ? (
          <span className="badge bg-success">Connected</span>
        ) : (
          <span className="badge bg-secondary">Not Connected</span>
        )}
      </div>
      <div className="card-body">
        {status.error && (
          <div className="alert alert-danger" role="alert">
            {status.error}
          </div>
        )}

        {!status.isConnected ? (
          <div className="text-center py-3">
            <p>Connect your Google Calendar to sync tasks and events</p>
            <button 
              className="btn btn-danger"
              onClick={handleConnect}
              disabled={!isAuthenticated}
            >
              <FaGoogle className="me-2" />
              Connect with Google
            </button>
            {!isAuthenticated && (
              <p className="text-muted mt-2">Please sign in to connect your calendar</p>
            )}
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1">Calendar Sync</h6>
                <p className="text-muted small mb-0">
                  {status.calendarSyncEnabled 
                    ? 'Your tasks and calendar are syncing automatically'
                    : 'Calendar sync is currently disabled'}
                </p>
                {status.lastSynced && (
                  <small className="text-muted">
                    Last synced: {new Date(status.lastSynced).toLocaleString()}
                  </small>
                )}
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="calendarSyncToggle"
                  checked={status.calendarSyncEnabled}
                  onChange={handleToggleSync}
                  disabled={isProcessing}
                />
                <label className="form-check-label" htmlFor="calendarSyncToggle">
                  {status.calendarSyncEnabled ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            </div>

            <div className="alert alert-info mt-3 mb-0">
              <div className="d-flex align-items-center">
                <FaInfoCircle className="me-2" />
                <div>
                  <strong>How it works:</strong> When enabled, your tasks with due dates will appear in your Google Calendar,
                  and new events from your calendar can be imported as tasks.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarConnect;
