const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { check, validationResult } = require('express-validator');

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priority: -1, dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Add a new task
// @access  Public
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('priority', 'Priority must be low, medium, or high').isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, dueDate, calendarEventId } = req.body;

    try {
      const newTask = new Task({
        title,
        description: description || '',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        calendarEventId: calendarEventId || null
      });

      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Public
router.put('/:id', async (req, res) => {
  const { title, description, priority, dueDate, completed } = req.body;

  // Build task object
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (priority) taskFields.priority = priority;
  if (dueDate) taskFields.dueDate = dueDate;
  if (typeof completed !== 'undefined') taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
