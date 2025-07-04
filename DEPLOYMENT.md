# Todo App Deployment Guide - Render

This guide will help you deploy the Todo App to Render platform.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a cloud MongoDB database (free tier available)

## Step 1: Prepare MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/todoapp`)
5. Whitelist all IP addresses (0.0.0.0/0) for Render deployment

## Step 2: Update Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Update your OAuth 2.0 Client IDs:
   - **Authorized JavaScript origins**: Add your Render domain (e.g., `https://your-app-name.onrender.com`)
   - **Authorized redirect URIs**: Add `https://your-app-name.onrender.com/api/auth/google/callback`

## Step 3: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Connect GitHub Repository**:
   - Log in to Render
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your Todo App

2. **Configure Build Settings**:
   - **Name**: `todo-app` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret-key
   SESSION_SECRET=your-secure-session-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-app-name.onrender.com
   ```

4. **Deploy**: Click "Create Web Service"

### Option B: Using render.yaml (Alternative)

If you prefer Infrastructure as Code, the `render.yaml` file is already configured. Just:
1. Push your code to GitHub
2. Connect the repository to Render
3. Render will automatically use the `render.yaml` configuration

## Step 4: Post-Deployment Configuration

1. **Update Google OAuth Callback URL**:
   - Replace `GOOGLE_CALLBACK_URL` with your Render domain:
   - `https://your-app-name.onrender.com/api/auth/google/callback`

2. **Test the Application**:
   - Visit your Render URL
   - Test user registration/login
   - Test Google OAuth
   - Test task creation and management
   - Test calendar integration

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render uses 10000) | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/todoapp` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secure-jwt-secret-key` |
| `SESSION_SECRET` | Secret for sessions | `your-super-secure-session-secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-abcdefghijklmnop` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app-name.onrender.com` |

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are properly listed in package.json files
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **Google OAuth**: Ensure redirect URIs are correctly configured
4. **CORS Errors**: Verify FRONTEND_URL environment variable matches your Render domain

### Logs:
- Check Render logs in the dashboard for detailed error messages
- Use `console.log` statements for debugging (visible in Render logs)

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Regularly rotate your secrets
- Keep Google OAuth credentials secure

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificate (automatic with Render)
3. Set up monitoring and alerts
4. Consider upgrading to paid plan for better performance

Your Todo App should now be live and accessible at your Render URL!
