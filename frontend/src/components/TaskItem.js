import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const priorityColors = {
  high: 'danger',
  medium: 'warning',
  low: 'info'
};

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState(task.priority);

  const handleSave = () => {
    onUpdate(task._id, {
      title: editedTitle,
      priority: editedPriority
    });
    setIsEditing(false);
  };

  return (
    <div className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''} fade-in`}>
      {isEditing ? (
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control flex-grow-1"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
          />
          <select
            className="form-select"
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleSave}
              title="Save changes"
            >
              <FaCheck />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
              title="Cancel editing"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center flex-grow-1">
            <input
              className="task-checkbox form-check-input"
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task._id, !task.completed)}
            />
            <div className="flex-grow-1">
              <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </span>
              <div className="d-flex align-items-center gap-3 mt-1">
                {task.dueDate && (
                  <small className="text-muted d-flex align-items-center">
                    <FaCalendarAlt className="me-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                )}
                <span className={`badge bg-${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          <div className="task-actions">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setIsEditing(true)}
              title="Edit task"
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(task._id)}
              title="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
