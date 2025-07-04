import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  AppShell,
  Text,
  Button,
  Container,
  Group,
  Menu,
  Avatar,
  Card,
  Title,
  List,
  Grid,
  Paper,
  TextInput,
  PasswordInput,
  Stack,
  Anchor,
  Divider,
  Center,
  Box
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconLogout,
  IconSettings,
  IconListCheck,
  IconCalendar,
  IconHome,
  IconBrandGoogle,
  IconInfoCircle
} from '@tabler/icons-react';
import './App.css';
import TaskList from './components/TaskList';
import CalendarConnect from './components/CalendarConnect';
import CalendarEvents from './components/CalendarEvents';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
const Home = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <TaskList /> : <Navigate to="/login" />;
};

const About = () => (
  <Container size="lg" py="xl">
    <Title order={1} mb="md">About TaskMaster</Title>
    <Text size="lg" c="dimmed" mb="xl">
      A powerful task management application with Google Calendar integration.
    </Text>

    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">Features</Title>
          <List spacing="sm">
            <List.Item>Task management with priorities</List.Item>
            <List.Item>Google Calendar integration</List.Item>
            <List.Item>Responsive design</List.Item>
            <List.Item>Real-time updates</List.Item>
          </List>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">Getting Started</Title>
          <List type="ordered" spacing="sm">
            <List.Item>Sign in with your Google account</List.Item>
            <List.Item>Connect your Google Calendar</List.Item>
            <List.Item>Start adding and managing your tasks</List.Item>
            <List.Item>Sync tasks with your calendar</List.Item>
          </List>
        </Card>
      </Grid.Col>
    </Grid>
  </Container>
);

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const oauthError = params.get('error');

    if (token) {
      login(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (oauthError === 'oauth_failed') {
      setError('Google sign-in failed. Please try again or use email/password.');
      // Remove error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        notifications.show({
          title: 'Success!',
          message: isSignUp ? 'Account created successfully!' : 'Logged in successfully!',
          color: 'green',
        });
      } else {
        setError(data.msg || data.errors?.[0]?.msg || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <Container size={420} my={40}>
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stack spacing="lg">
          <Center>
            <Stack spacing="xs" align="center">
              <Title order={2}>Welcome to TaskMaster</Title>
              <Text c="dimmed" size="sm" ta="center">
                {isSignUp ? 'Create your account to get started' : 'Sign in to continue your productivity journey'}
              </Text>
            </Stack>
          </Center>

          {error && (
            <Paper bg="red.0" p="md" radius="md">
              <Group spacing="xs">
                <IconInfoCircle size={16} color="red" />
                <Text size="sm" c="red">{error}</Text>
              </Group>
            </Paper>
          )}

          {/* OAuth Setup Notice */}
          <Paper bg="blue.0" p="md" radius="md">
            <Group spacing="xs">
              <IconInfoCircle size={16} color="blue" />
              <Text size="sm" c="blue">
                <strong>Note:</strong> Google Sign-in is fully configured and ready to use!
                You can also use email/password for quick access.
              </Text>
            </Group>
          </Paper>

          {/* Google Sign In */}
          <Button
            variant="outline"
            leftSection={<IconBrandGoogle size={16} />}
            onClick={handleGoogleLogin}
            loading={loading}
            size="md"
            fullWidth
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Divider label="or" labelPosition="center" />

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              {isSignUp && (
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={isSignUp}
                  size="md"
                />
              )}

              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                size="md"
                description={isSignUp ? "Password must be at least 6 characters long" : undefined}
              />

              <Button
                type="submit"
                loading={loading}
                size="md"
                fullWidth
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Center>
            <Anchor
              component="button"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </Anchor>
          </Center>

          <Text size="xs" c="dimmed" ta="center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Stack>
      </Card>
    </Container>
  );
};

const CalendarPage = () => {
  const { isAuthenticated } = useAuth();
  const [importedCount, setImportedCount] = useState(0);

  const handleEventsImported = (count) => {
    setImportedCount(count);
    notifications.show({
      title: 'Success!',
      message: `Successfully imported ${count} events as tasks!`,
      color: 'green',
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CalendarConnect />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <CalendarEvents onEventSelect={handleEventsImported} />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

const NavbarComponent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [serverStatus, setServerStatus] = useState('checking...');

  useEffect(() => {
    // Check if the backend server is running
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('unavailable'));
  }, []);

  return (
    <Container size="lg" h={60} style={{ display: 'flex', alignItems: 'center' }}>
      <Group justify="space-between" style={{ width: '100%' }}>
        <Group>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Group spacing="xs">
              <IconListCheck size={24} color="var(--mantine-color-blue-6)" />
              <Title order={3} c="blue">TaskMaster</Title>
            </Group>
          </Link>
        </Group>

        <Group spacing="md">
            {isAuthenticated && (
              <>
                <Button
                  component={Link}
                  to="/"
                  variant="subtle"
                  leftSection={<IconHome size={16} />}
                  size="sm"
                >
                  Tasks
                </Button>
                <Button
                  component={Link}
                  to="/calendar"
                  variant="subtle"
                  leftSection={<IconCalendar size={16} />}
                  size="sm"
                >
                  Calendar
                </Button>
              </>
            )}
            <Button
              component={Link}
              to="/about"
              variant="subtle"
              leftSection={<IconInfoCircle size={16} />}
              size="sm"
            >
              About
            </Button>

            <Group spacing="xs">
              <Text size="xs" c="dimmed">Server:</Text>
              <Text
                size="xs"
                c={serverStatus === 'ok' ? 'green' : 'red'}
                fw={500}
              >
                {serverStatus}
              </Text>
            </Group>

            {isAuthenticated ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="outline"
                    leftSection={<IconUser size={16} />}
                    size="sm"
                  >
                    Account
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to="/profile"
                    leftSection={<IconSettings size={14} />}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={logout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                component={Link}
                to="/login"
                leftSection={<IconUser size={16} />}
                size="sm"
              >
                Sign In
              </Button>
            )}
        </Group>
      </Group>
    </Container>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell
          header={{ height: 60 }}
          footer={{ height: 60 }}
          padding="md"
        >
          <AppShell.Header>
            <NavbarComponent />
          </AppShell.Header>

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell.Main>

          <AppShell.Footer p="md">
            <Container size="lg">
              <Text ta="center" c="dimmed" size="sm">
                © {new Date().getFullYear()} TaskMaster. All rights reserved.
              </Text>
            </Container>
          </AppShell.Footer>
        </AppShell>
      </AuthProvider>
    </Router>
  );
}

export default App;
