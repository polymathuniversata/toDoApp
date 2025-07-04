# Google OAuth Setup Guide for TaskMaster Todo App

## 🚀 Quick Setup Instructions

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Enable "Google+ API" 
   - Enable "Google Calendar API"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "TaskMaster Web Client"
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`
     - `https://your-app-name.onrender.com/api/auth/google/callback`

### Step 2: Update Environment Variables

Replace the placeholder values in `backend/.env`:

```env
# Replace these with your actual credentials:
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-client-secret-here
```

### Step 3: Test the Setup

1. **Restart the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test Google OAuth**:
   - Go to http://localhost:3000/login
   - Click "Continue with Google"
   - Should redirect to Google sign-in

### Step 4: For Production (Render Deployment)

Update the redirect URI in Google Cloud Console:
- Add: `https://your-app-name.onrender.com/api/auth/google/callback`
- Update `GOOGLE_CALLBACK_URL` in production environment variables

## 🔧 Current Status

✅ **Email/Password Authentication** - Working  
✅ **OAuth Endpoints** - Configured  
✅ **Fallback System** - Implemented  
⏳ **Google OAuth** - Needs credentials  

## 🧪 Testing

**Without OAuth credentials:**
- Use email/password signup/login
- Google button shows helpful error message

**With OAuth credentials:**
- Both Google and email/password work
- Seamless user experience

## 🚀 Ready for Deployment

Your app is fully functional with email/password auth and ready for Render deployment!
