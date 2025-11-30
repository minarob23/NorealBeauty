# Authentication Setup Guide

This application supports two authentication methods:

## User Authentication (Regular Users)
- **Google OAuth**: Users sign in with their Google account

## Admin Authentication
- **Local Authentication**: Admins sign in using email and password

## Setup Instructions

### 1. Database Schema Update

First, push the updated schema to your database:

```bash
npm run db:push
```

This will add the new `password` and `authProvider` fields to the users table.

### 2. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the following variables:

#### Required for All:
- `DATABASE_URL`: Your PostgreSQL database connection string
- `SESSION_SECRET`: A random secret for session encryption

#### For Google OAuth (Required for user login):
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:5000/api/callback/google` (adjust for your domain)
6. Copy the Client ID and Client Secret to your `.env`:
   - `GOOGLE_CLIENT_ID=your_client_id`
   - `GOOGLE_CLIENT_SECRET=your_client_secret`

### 3. Create Admin User

To create an admin account, run:

```bash
npm run create-admin admin@example.com YourSecurePassword123
```

Replace `admin@example.com` and `YourSecurePassword123` with your desired admin credentials.

### 4. Start the Application

```bash
npm run dev
```

## Login Flows

### For Regular Users:
1. Navigate to `/login` or click "Sign In" in the header
2. Click **Continue with Google**
3. Authenticate with your Google account
4. You'll be redirected back and signed in

### For Admins:
1. Navigate to `/admin-login` or:
   - Go to `/login` → Click "Admin Sign In" button
2. Enter your email and password
3. Upon successful login, you'll be redirected to `/admin`

## Security Notes

- Admin passwords are hashed using bcrypt with 10 salt rounds
- Sessions are stored in the database with a 1-week TTL
- Only users with `isAdmin: true` can access admin routes
- Admin authentication does NOT use OAuth - it's local only
- Regular users use Google OAuth for authentication

## API Routes

### User Authentication:
- `GET /api/login/google` - Initiate Google OAuth
- `GET /api/callback/google` - Google OAuth callback

### Admin Authentication:
- `POST /api/login/admin` - Admin login (email + password)
  - Body: `{ "email": "admin@example.com", "password": "password" }`

### Common:
- `GET /api/logout` - Logout (works for all auth types)
- `GET /api/auth/user` - Get current user info

## Troubleshooting

### "Invalid email or password" error
- Verify the admin account exists in the database
- Check that `isAdmin` is set to `true` for the user
- Verify the password is correct

### Google OAuth not working
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Verify the redirect URI in Google Console matches your app's callback URL
- Ensure Google+ API is enabled in Google Cloud Console

## Migration from Old System

If you have existing users from the old authentication system:
1. Run `npm run db:push` to add the new fields
2. Existing users will need to sign in again with Google OAuth
3. Their data will be preserved if they use the same email address
