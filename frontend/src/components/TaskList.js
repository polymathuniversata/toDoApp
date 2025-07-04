import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  Grid,
  Badge,
  ActionIcon,
  Paper,
  Divider,
  Checkbox,
  Modal,
  Loader,
  Center,
  Alert,
  NumberInput,
  Progress,
  Tooltip,
  Menu,
  Switch,
  Flex,
  Box
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconTrash,
  IconEdit,
  IconAlertTriangle,
  IconCalendar,
  IconPlus,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
  IconChevronDown,
  IconTarget,
  IconClock,
  IconCheckbox
} from '@tabler/icons-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TaskList = () => {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    dueDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // Removed unused variable
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCompleted, setShowCompleted] = useState(true);

  // Fetch tasks from the backend
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { 'x-auth-token': token }
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        // setError('Failed to load tasks. Please try again.'); // Removed unused error state
        notifications.show({
          title: 'Error',
          message: 'Failed to load tasks',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, token]);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        newTask,
        { headers: { 'x-auth-token': token } }
      );

      setTasks([...tasks, response.data]);
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'medium',
        dueDate: ''
      });
      notifications.show({
        title: 'Success!',
        message: 'Task added successfully',
        color: 'green',
      });
    } catch (err) {
      console.error('Error adding task:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to add task',
        color: 'red',
      });
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  };

  // Save edited task
  const saveEdit = async (taskId) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        editTask,
        { headers: { 'x-auth-token': token } }
      );

      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setEditingId(null);
      notifications.show({
        title: 'Success!',
        message: 'Task updated successfully',
        color: 'green',
      });
    } catch (err) {
      console.error('Error updating task:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red',
      });
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await axios.patch(
        `${API_URL}/tasks/${taskId}`,
        { completed },
        { headers: { 'x-auth-token': token } }
      );

      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      
      const action = completed ? 'completed' : 'marked as incomplete';
      notifications.show({
        title: 'Success!',
        message: `Task ${action} successfully`,
        color: 'green',
      });
    } catch (err) {
      console.error('Error updating task:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red',
      });
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { 'x-auth-token': token }
      });
      
      setTasks(tasks.filter(task => task._id !== taskId));
      notifications.show({
        title: 'Success!',
        message: 'Task deleted successfully',
        color: 'green',
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete task',
        color: 'red',
      });
    }
  };

  // Toggle sort order for a given field
  const toggleSortOrder = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };



  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Check if a date is overdue
  const isOverdue = (dateString, completed) => {
    if (!dateString || completed) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Filter tasks based on completion status and priority
  const filteredTasks = tasks.filter(task => {
    // Skip completed tasks if not showing them
    if (!showCompleted && task.completed) return false;
    
    // Apply priority filter
    if (filter === 'high' && task.priority !== 'high') return false;
    if (filter === 'medium' && task.priority !== 'medium') return false;
    if (filter === 'low' && task.priority !== 'low') return false;
    
    // Apply completion filter
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'active' && task.completed) return false;
    
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortOrder === 'desc' 
        ? (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        : (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
    }
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortBy === 'date') {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  if (!isAuthenticated) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Alert color="blue" title="Authentication Required">
            Please sign in to view and manage your tasks.
          </Alert>
        </Center>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Stack align="center" spacing="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading your tasks...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Stack spacing="xl">
        {/* Header Section */}
        <Group justify="space-between" align="flex-start">
          <Stack spacing="xs">
            <Group spacing="sm">
              <IconTarget size={24} color="var(--mantine-color-blue-6)" />
              <Title order={2}>My Tasks</Title>
            </Group>
            <Text c="dimmed" size="sm">
              {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
              {filter !== 'all' && ` (${filter})`}
            </Text>
          </Stack>

          <Group spacing="sm">
            <Button
              variant={showCompleted ? "filled" : "outline"}
              size="sm"
              leftSection={showCompleted ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftSection={<IconX size={16} />}
              onClick={() => {
                setFilter('all');
                setSortBy('priority');
                setSortOrder('desc');
              }}
            >
              Reset
            </Button>
          </Group>
        </Group>

        {/* Add Task Form */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group spacing="sm">
              <IconPlus size={20} color="var(--mantine-color-blue-6)" />
              <Title order={4}>Add New Task</Title>
            </Group>

            <form onSubmit={handleAddTask}>
              <Stack spacing="md">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Task Title"
                      placeholder="What needs to be done?"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Priority"
                      value={newTask.priority}
                      onChange={(value) => setNewTask({...newTask, priority: value})}
                      data={[
                        { value: 'low', label: '🟢 Low' },
                        { value: 'medium', label: '🟡 Medium' },
                        { value: 'high', label: '🔴 High' }
                      ]}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <DateInput
                      label="Due Date"
                      placeholder="Select date"
                      value={newTask.dueDate ? new Date(newTask.dueDate) : null}
                      onChange={(date) => setNewTask({...newTask, dueDate: date ? date.toISOString().split('T')[0] : ''})}
                      size="md"
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 9 }}>
                    <TextInput
                      label="Description (Optional)"
                      placeholder="Add more details about this task..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }} style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                      type="submit"
                      leftSection={<IconPlus size={16} />}
                      fullWidth
                      size="md"
                    >
                      Add Task
                    </Button>
                  </Grid.Col>
                </Grid>
              </Stack>
            </form>
          </Stack>
        </Card>

        {/* Filters and Sorting */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group justify="space-between" wrap="wrap">
              <Stack spacing="xs">
                <Text size="sm" fw={500}>Filter Tasks</Text>
                <Button.Group>
                  <Button
                    variant={filter === 'all' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={<IconCheckbox size={16} />}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'active' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={<IconClock size={16} />}
                    onClick={() => setFilter('active')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === 'completed' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={<IconCheck size={16} />}
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </Button>
                </Button.Group>
              </Stack>

              <Stack spacing="xs">
                <Text size="sm" fw={500}>Priority Filter</Text>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      variant="outline"
                      size="sm"
                      leftSection={<IconFilter size={16} />}
                      rightSection={<IconChevronDown size={16} />}
                    >
                      {filter === 'all' ? 'All Priorities' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconCheckbox size={14} />}
                      onClick={() => setFilter('all')}
                    >
                      All Priorities
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconAlertTriangle size={14} color="red" />}
                      onClick={() => setFilter('high')}
                    >
                      High Priority
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconAlertTriangle size={14} color="orange" />}
                      onClick={() => setFilter('medium')}
                    >
                      Medium Priority
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconAlertTriangle size={14} color="blue" />}
                      onClick={() => setFilter('low')}
                    >
                      Low Priority
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Stack>

              <Stack spacing="xs">
                <Text size="sm" fw={500}>Sort By</Text>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      variant="outline"
                      size="sm"
                      leftSection={sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />}
                      rightSection={<IconChevronDown size={16} />}
                    >
                      {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconAlertTriangle size={14} />}
                      rightSection={sortBy === 'priority' && (sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
                      onClick={() => toggleSortOrder('priority')}
                    >
                      Priority
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTarget size={14} />}
                      rightSection={sortBy === 'title' && (sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
                      onClick={() => toggleSortOrder('title')}
                    >
                      Title
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconCalendar size={14} />}
                      rightSection={sortBy === 'date' && (sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
                      onClick={() => toggleSortOrder('date')}
                    >
                      Due Date
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Stack>
            </Group>
          </Stack>
        </Card>

        {/* Task List */}
        {sortedTasks.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Center>
              <Stack align="center" spacing="md">
                <IconTarget size={48} color="var(--mantine-color-gray-5)" />
                <Title order={4} c="dimmed">No tasks found</Title>
                <Text c="dimmed" ta="center">
                  {filter === 'all'
                    ? "Add your first task above to get started!"
                    : `No ${filter} tasks found. Try adjusting your filters.`
                  }
                </Text>
              </Stack>
            </Center>
          </Card>
        ) : (
          <Stack spacing="md">
            {sortedTasks.map((task) => (
              <Card
                key={task._id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  borderLeft: `4px solid ${
                    task.priority === 'high' ? 'var(--mantine-color-red-6)' :
                    task.priority === 'medium' ? 'var(--mantine-color-orange-6)' :
                    'var(--mantine-color-blue-6)'
                  }`,
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                {editingId === task._id ? (
                  <Stack spacing="md">
                    <TextInput
                      value={editTask.title}
                      onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                      placeholder="Task title"
                      size="sm"
                    />
                    <Textarea
                      value={editTask.description}
                      onChange={(e) => setEditTask({...editTask, description: e.target.value})}
                      placeholder="Description (optional)"
                      rows={2}
                      size="sm"
                    />
                    <Grid>
                      <Grid.Col span={6}>
                        <Select
                          value={editTask.priority}
                          onChange={(value) => setEditTask({...editTask, priority: value})}
                          data={[
                            { value: 'low', label: '🟢 Low' },
                            { value: 'medium', label: '🟡 Medium' },
                            { value: 'high', label: '🔴 High' }
                          ]}
                          size="sm"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <DateInput
                          value={editTask.dueDate ? new Date(editTask.dueDate) : null}
                          onChange={(date) => setEditTask({...editTask, dueDate: date ? date.toISOString().split('T')[0] : ''})}
                          placeholder="Due date"
                          size="sm"
                        />
                      </Grid.Col>
                    </Grid>
                    <Group justify="flex-end" spacing="sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(task._id)}
                      >
                        Save Changes
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Group align="flex-start" spacing="md">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task._id, !task.completed)}
                      size="md"
                      mt={4}
                    />

                    <Box style={{ flex: 1 }}>
                      <Group justify="space-between" align="flex-start" mb="xs">
                        <Group spacing="sm">
                          <Title
                            order={5}
                            style={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'var(--mantine-color-gray-6)' : 'inherit'
                            }}
                          >
                            {task.title}
                          </Title>
                          <Badge
                            color={
                              task.priority === 'high' ? 'red' :
                              task.priority === 'medium' ? 'orange' : 'blue'
                            }
                            variant="light"
                            size="sm"
                          >
                            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                          </Badge>
                        </Group>

                        <Group spacing="xs">
                          {task.dueDate && (
                            <Group spacing={4}>
                              <IconCalendar size={14} color="var(--mantine-color-gray-6)" />
                              <Text
                                size="sm"
                                c={isOverdue(task.dueDate, task.completed) ? 'red' : 'dimmed'}
                              >
                                {formatDate(task.dueDate)}
                              </Text>
                              {isOverdue(task.dueDate, task.completed) && (
                                <Badge color="red" size="xs">Overdue</Badge>
                              )}
                            </Group>
                          )}

                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => startEditing(task)}
                            size="sm"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>

                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                              modals.openConfirmModal({
                                title: 'Delete Task',
                                children: (
                                  <Text size="sm">
                                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                                  </Text>
                                ),
                                labels: { confirm: 'Delete', cancel: 'Cancel' },
                                confirmProps: { color: 'red' },
                                onConfirm: () => handleDeleteTask(task._id),
                              });
                            }}
                            size="sm"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      {task.description && (
                        <Text size="sm" c="dimmed" mt="xs">
                          {task.description}
                        </Text>
                      )}
                    </Box>
                  </Group>
                )}
              </Card>
            ))}
          </Stack>
        )}

        {/* Summary Footer */}
        {sortedTasks.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group spacing="md" justify="center">
                  <IconTarget size={32} color="var(--mantine-color-blue-6)" />
                  <Stack spacing={0} align="center">
                    <Title order={3}>{tasks.length}</Title>
                    <Text size="sm" c="dimmed">Total Tasks</Text>
                  </Stack>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group spacing="md" justify="center">
                  <IconCheck size={32} color="var(--mantine-color-green-6)" />
                  <Stack spacing={0} align="center">
                    <Title order={3}>{tasks.filter(t => t.completed).length}</Title>
                    <Text size="sm" c="dimmed">Completed</Text>
                  </Stack>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group spacing="md" justify="center">
                  <IconClock size={32} color="var(--mantine-color-orange-6)" />
                  <Stack spacing={0} align="center">
                    <Title order={3}>{tasks.filter(t => !t.completed).length}</Title>
                    <Text size="sm" c="dimmed">Pending</Text>
                  </Stack>
                </Group>
              </Grid.Col>
            </Grid>

            {/* Progress Bar */}
            <Box mt="md">
              <Text size="sm" mb="xs" c="dimmed">
                Progress: {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
              </Text>
              <Progress
                value={tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}
                size="lg"
                radius="md"
                color="blue"
              />
            </Box>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default TaskList;
