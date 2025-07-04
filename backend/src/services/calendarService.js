const { google } = require('googleapis');
const { OAuth2 } = google.auth;

class CalendarService {
  constructor(accessToken, refreshToken) {
    this.oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  // Get events from Google Calendar
  async getEvents(timeMin, timeMax, maxResults = 10) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  // Create a new event in Google Calendar
  async createEvent(eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startDateTime || new Date().toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventData.endDateTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
          timeZone: 'UTC',
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Update an existing event in Google Calendar
  async updateEvent(eventId, eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startDateTime || new Date().toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventData.endDateTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  // Delete an event from Google Calendar
  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }
}

module.exports = CalendarService;
