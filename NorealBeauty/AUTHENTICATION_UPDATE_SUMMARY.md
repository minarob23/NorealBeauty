# Authentication System Update - Summary

## Changes Made

### 1. **Database Schema Updates**
- Added `password` field to users table (for admin local authentication)
- Added `authProvider` field to users table (values: 'google' or 'local')

### 2. **New Authentication System** (`server/auth.ts`)
Created a new authentication module that supports:

#### For Regular Users:
- **Google OAuth**: Full OAuth 2.0 flow with Google

#### For Admins:
- **Local Authentication**: Username (email) and password-based login
- Passwords are securely hashed using bcrypt
- Admin-only access control

### 3. **New Pages Created**

#### `/login` - User Login Page
- Displays "Continue with Google" button → `/api/login/google`
- Also shows "Admin Sign In" button → `/admin-login`

#### `/admin-login` - Admin Login Page
- Traditional email/password login form
- Only for users with `isAdmin: true`
- Posts to `/api/login/admin`

### 4. **Updated Files**

#### Client-Side:
- `client/src/App.tsx` - Added routes for `/login` and `/admin-login`
- `client/src/pages/account.tsx` - Redirects to `/login` instead of `/api/login`
- `client/src/pages/admin.tsx` - Redirects to `/admin-login` instead of `/api/login`
- `client/src/components/header.tsx` - Login button now links to `/login` page

#### Server-Side:
- `server/routes.ts` - Updated to use new auth system from `server/auth.ts`
- `server/storage.ts` - Added `getUserByEmail()` method for admin login
- `shared/schema.ts` - Updated users table schema

### 5. **New API Routes**

#### User Authentication:
```
GET  /api/login/google       - Initiate Google OAuth
GET  /api/callback/google    - Google OAuth callback
```

#### Admin Authentication:
```
POST /api/login/admin        - Admin login with email/password
     Body: { email: string, password: string }
```

#### Common:
```
GET  /api/logout             - Logout (all auth types)
GET  /api/auth/user          - Get current authenticated user
```

### 6. **Utilities Created**

#### `server/createAdmin.ts`
Script to create admin users:
```bash
npm run create-admin <email> <password>
```

### 7. **Documentation**

#### `AUTHENTICATION_SETUP.md`
Complete setup guide including:
- How to configure Google OAuth
- How to create admin users
- Environment variables needed
- Troubleshooting tips

#### `.env.example`
Template for environment variables

## Setup Instructions for Users

### Step 1: Install Dependencies
```bash
npm install
```
(Already includes new packages: passport-google-oauth20, bcryptjs)

### Step 2: Configure Environment Variables
Create a `.env` file with:
```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

For Google OAuth setup, see `AUTHENTICATION_SETUP.md`

### Step 3: Update Database Schema
```bash
npm run db:push
```

### Step 4: Create Admin User
```bash
npm run create-admin admin@example.com SecurePassword123
```

### Step 5: Start the Application
```bash
npm run dev
```

## User Flows

### Regular Users (Customers):
1. Click "Sign In" in header → redirected to `/login`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Redirected back to home page, now authenticated
5. Can access `/account` to view orders, addresses, etc.

### Admin Users:
1. Navigate to `/login`
2. Click "Admin Sign In" button
3. Enter email and password
4. Submit form → POST to `/api/login/admin`
5. If valid, redirected to `/admin` dashboard
6. Can manage products, orders, etc.

## Security Features

✅ Passwords hashed with bcrypt (10 salt rounds)
✅ Admin-only routes protected with `isAdmin` middleware
✅ Sessions stored in database (not in memory)
✅ OAuth tokens properly validated and refreshed
✅ Separate authentication flows for users and admins
✅ CSRF protection via session management

## Migration Path

Existing users will need to sign in again with Google OAuth. If they use the same email address, their account data will be preserved.

## Testing Checklist

- [ ] Google OAuth login flow works
- [ ] Admin login with email/password works
- [ ] Non-admin users cannot access `/admin`
- [ ] Logout works for all auth types
- [ ] Session persistence across page refreshes
- [ ] Redirect to login when accessing protected routes
- [ ] Password reset/change functionality (future enhancement)

## Future Enhancements

Possible additions:
- Password reset for admins
- Email verification
- Two-factor authentication
- Social login with more providers (Facebook, Apple, etc.)
