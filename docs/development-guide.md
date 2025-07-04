# Development Guide

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later) or Yarn
- Git

### Setting Up the Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-root
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

## Development Workflow

### Running the Application

#### Backend
```bash
cd backend
npm run dev
```
This will start the backend server with nodemon for automatic reloading.

#### Frontend
```bash
cd frontend
npm start
```
This will start the React development server.

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Git Workflow
1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Stage your changes
   ```bash
   git add .
   ```
4. Commit your changes with a descriptive message
   ```bash
   git commit -m "Add your commit message here"
   ```
5. Push your changes
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request

## Testing

### Running Tests

#### Frontend Tests
```bash
cd frontend
npm test
```

#### Backend Tests
```bash
cd backend
npm test
```

## Debugging

### Frontend
- Use React Developer Tools
- Check browser console for errors
- Use `console.log()` for debugging (remove before committing)

### Backend
- Check server logs
- Use `console.log()` for debugging
- Use Postman or curl to test API endpoints

## Environment Variables

### Backend (`.env`)
```
PORT=5000
NODE_ENV=development
# Add other environment variables here
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000
# Add other environment variables here
```

## Dependencies

### Adding Dependencies
- Frontend: `cd frontend && npm install package-name`
- Backend: `cd backend && npm install package-name`

### Updating Dependencies
```bash
# In both frontend and backend directories
npm outdated
npm update
```

## Deployment

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
npm install --production
```

### Environment Setup
Make sure to set the following environment variables in production:
- `NODE_ENV=production`
- `PORT` (if not using default)
- Any other required environment variables

## Troubleshooting

### Common Issues

#### Backend server not starting
- Check if the port is already in use
- Check if all environment variables are set
- Check the error logs

#### Frontend not connecting to backend
- Make sure the backend server is running
- Check the API URL in the frontend configuration
- Check CORS settings in the backend

#### Dependencies not installing
- Delete `node_modules` and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

## Additional Resources
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
