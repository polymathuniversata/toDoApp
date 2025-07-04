const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const CalendarService = require('../services/calendarService');

// @route   GET api/calendar/events
// @desc    Get calendar events
// @access  Private
router.get('/events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ msg: 'User not authenticated with Google' });
    }

    const calendarService = new CalendarService(
      user.googleAccessToken,
      user.googleRefreshToken
    );

    const { startDate, endDate, maxResults } = req.query;
    const events = await calendarService.getEvents(startDate, endDate, maxResults);
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calendar/events
// @desc    Create a calendar event
// @access  Private
router.post('/events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ msg: 'User not authenticated with Google' });
    }

    const calendarService = new CalendarService(
      user.googleAccessToken,
      user.googleRefreshToken
    );

    const event = await calendarService.createEvent(req.body);
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/calendar/events/:eventId
// @desc    Update a calendar event
// @access  Private
router.put('/events/:eventId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ msg: 'User not authenticated with Google' });
    }

    const calendarService = new CalendarService(
      user.googleAccessToken,
      user.googleRefreshToken
    );

    const event = await calendarService.updateEvent(req.params.eventId, req.body);
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/calendar/events/:eventId
// @desc    Delete a calendar event
// @access  Private
router.delete('/events/:eventId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ msg: 'User not authenticated with Google' });
    }

    const calendarService = new CalendarService(
      user.googleAccessToken,
      user.googleRefreshToken
    );

    await calendarService.deleteEvent(req.params.eventId);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendar/sync-status
// @desc    Get calendar sync status
// @access  Private
router.get('/sync-status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    res.json({
      isConnected: !!user.googleAccessToken,
      calendarSyncEnabled: user.calendarSyncEnabled,
      lastSynced: user.lastSynced
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calendar/toggle-sync
// @desc    Toggle calendar sync
// @access  Private
router.post('/toggle-sync', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleAccessToken) {
      return res.status(400).json({ msg: 'User not authenticated with Google' });
    }

    user.calendarSyncEnabled = !user.calendarSyncEnabled;
    if (user.calendarSyncEnabled) {
      user.lastSynced = new Date();
    }
    
    await user.save();
    
    res.json({
      calendarSyncEnabled: user.calendarSyncEnabled,
      lastSynced: user.lastSynced
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
