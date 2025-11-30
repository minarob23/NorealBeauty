# Advanced Authentication Features

This document describes the advanced authentication features added to the NorealBeauty application.

## Features Overview

The application now includes 4 advanced features:
1. **User Management Dashboard** - Admin panel for managing users
2. **Email Verification** - Verify user email addresses
3. **Password Reset** - Allow users to reset forgotten passwords
4. **Analytics Dashboard** - User statistics and insights

---

## 1. User Management Dashboard

### Location
- **Frontend**: `/client/src/pages/admin-users.tsx`
- **Backend API**: `/api/admin/users`

### Features
- View all registered users in a table
- Search users by email or name
- Edit user details (name, email verification, admin status)
- Delete users
- View user login statistics

### API Endpoints

#### GET `/api/admin/users`
Get all users (admin only)

**Response:**
```json
[
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isAdmin": false,
    "emailVerified": true,
    "authProvider": "local",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "loginCount": 5
  }
]
```

#### PATCH `/api/admin/users/:id`
Update user information (admin only)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "isAdmin": false,
  "emailVerified": true
}
```

#### DELETE `/api/admin/users/:id`
Delete a user (admin only)

**Note:** Cannot delete your own account

---

## 2. Email Verification

### Location
- **Backend Route**: `/api/verify-email/:token`
- **Database Fields**: `emailVerified`, `verificationToken`

### How It Works

1. When a user registers, a verification token is generated
2. The token is stored in the `verificationToken` field
3. A verification email should be sent with a link: `https://yoursite.com/verify-email/:token`
4. When the user clicks the link, their email is marked as verified

### API Endpoint

#### GET `/api/verify-email/:token`
Verify user email with token

**Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Response (Error):**
```json
{
  "message": "Invalid or expired verification token"
}
```

### Database Schema
```typescript
emailVerified: boolean().default(false),
verificationToken: varchar('verification_token'),
```

### TODO: Email Integration
Currently, the verification token is stored but emails are not sent. To complete this feature:
1. Install an email service (Nodemailer, SendGrid, etc.)
2. Generate verification token on registration
3. Send email with verification link
4. Update user registration to set verificationToken

---

## 3. Password Reset

### Location
- **Frontend Pages**: 
  - `/client/src/pages/forgot-password.tsx`
  - `/client/src/pages/reset-password.tsx`
- **Backend Routes**: 
  - `/api/forgot-password`
  - `/api/reset-password/:token`

### How It Works

1. User clicks "Forgot Password" on login page
2. User enters their email address
3. System generates a reset token (valid for 1 hour)
4. Reset link is logged to console (in production, send via email)
5. User clicks link and enters new password
6. Password is updated and reset token cleared

### API Endpoints

#### POST `/api/forgot-password`
Request password reset

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account exists, a reset link has been sent"
}
```

**Note:** Always returns success to prevent email enumeration

#### POST `/api/reset-password/:token`
Reset password with token

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Error):**
```json
{
  "message": "Invalid or expired reset token"
}
```

### Database Schema
```typescript
resetPasswordToken: varchar('reset_password_token'),
resetPasswordExpires: timestamp('reset_password_expires'),
```

### Token Expiration
Reset tokens expire after 1 hour for security.

### TODO: Email Integration
Currently, the reset token is logged to console. To complete this feature:
1. Install an email service
2. Send email with reset link instead of logging
3. Email template should include: `https://yoursite.com/reset-password/:token`

---

## 4. Analytics Dashboard

### Location
- **Frontend**: `/client/src/pages/admin-analytics.tsx`
- **Backend API**: `/api/admin/analytics`

### Features
- Total registered users
- Verified vs unverified users
- Admin count
- Recent signups (last 7 days)
- Distribution by authentication provider
- Verification rate percentage

### API Endpoint

#### GET `/api/admin/analytics`
Get user statistics (admin only)

**Response:**
```json
{
  "total": 150,
  "verified": 120,
  "admins": 3,
  "byProvider": {
    "google": 80,
    "local": 70
  },
  "recentSignups": 15
}
```

### Metrics Tracked
- **Total Users**: All registered accounts
- **Verified Users**: Users with verified emails
- **Administrators**: Users with admin privileges
- **Recent Signups**: Users registered in last 7 days
- **By Provider**: Count of users per authentication method (Google, local, etc.)

---

## Login Tracking

### Features
Every time a user logs in (via email/password or Google OAuth), the system tracks:
- `lastLoginAt`: Timestamp of most recent login
- `loginCount`: Total number of successful logins

### Database Schema
```typescript
lastLoginAt: timestamp('last_login_at'),
loginCount: integer('login_count').default(0),
```

### Implementation
The `storage.updateLoginStats(userId)` method is called in both authentication strategies:
- Local user authentication
- Admin authentication

---

## Access Control

### Admin Routes
All admin features require authentication with `isAdmin` middleware:
- `/api/admin/users` - User management
- `/api/admin/analytics` - Analytics dashboard
- `/api/admin/users/:id` - Update/delete users

### Middleware
```typescript
export const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = user.claims.sub;
  const dbUser = await storage.getUser(userId);
  
  if (!dbUser?.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
```

---

## Database Migrations

After adding these features, run the database migration:

```bash
npm run db:push
```

This will apply the following schema changes:
- Add `emailVerified` (boolean, default false)
- Add `verificationToken` (varchar)
- Add `resetPasswordToken` (varchar)
- Add `resetPasswordExpires` (timestamp)
- Add `lastLoginAt` (timestamp)
- Add `loginCount` (integer, default 0)

---

## Admin Panel Navigation

The admin dashboard now has 4 tabs:
1. **Products** - Manage products (existing)
2. **Orders** - View orders (existing)
3. **Users** - User management (NEW)
4. **Analytics** - User statistics (NEW)

Access at: `http://localhost:5000/admin`

---

## Security Considerations

### Password Reset
- Tokens expire after 1 hour
- Always returns success message to prevent email enumeration
- Tokens are single-use (cleared after successful reset)

### Email Verification
- Tokens are unique per user
- Cleared after successful verification
- Prevents reuse of verification links

### User Deletion
- Admins cannot delete their own account
- Requires admin authentication
- Permanently removes user and associated data

---

## Next Steps

### Email Integration
To fully enable email verification and password reset:

1. **Install Email Service**
```bash
npm install nodemailer
# or
npm install @sendgrid/mail
```

2. **Configure Environment Variables**
Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@norealbeauty.com
```

3. **Create Email Service**
Create `server/email.ts`:
```typescript
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `${process.env.APP_URL}/verify-email/${token}`;
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `Click <a href="${verifyUrl}">here</a> to verify your email.`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: `Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.`,
  });
}
```

4. **Update Registration to Send Verification Email**
In `server/auth.ts`, after user registration:
```typescript
import { sendVerificationEmail } from './email';

// Generate verification token
const verificationToken = randomUUID();

await storage.upsertUser({
  // ... other fields
  verificationToken,
});

// Send verification email
await sendVerificationEmail(email, verificationToken);
```

5. **Update Password Reset to Send Email**
In `server/auth.ts`, in the forgot-password route:
```typescript
import { sendPasswordResetEmail } from './email';

// After generating reset token
await sendPasswordResetEmail(email, resetToken);
```

---

## Testing

### Test User Management
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Users" tab
4. Search for users
5. Edit user details
6. Verify changes are saved

### Test Password Reset
1. Go to login page
2. Click "Forgot password?"
3. Enter email address
4. Check console for reset token (or email in production)
5. Go to `/reset-password/:token`
6. Enter new password
7. Verify login works with new password

### Test Analytics
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Analytics" tab
4. Verify statistics are displayed correctly

---

## Summary

All 4 advanced features are now implemented:
✅ User Management Dashboard
✅ Email Verification (backend ready, needs email service)
✅ Password Reset (backend ready, needs email service)
✅ Analytics Dashboard

The application is ready to use with Neon PostgreSQL database!
