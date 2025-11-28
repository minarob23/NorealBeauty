# Email Verification & Password Reset Guide

This guide explains how to use the email verification and password reset features in the NorealBeauty application.

---

## 🔐 Features Implemented

### 1. Email Verification
✅ Token generation during registration  
✅ Verification link displayed in console  
✅ Email verification page (`/verify-email/:token`)  
✅ Mark email as verified in database  

### 2. Password Reset
✅ Forgot password page (`/forgot-password`)  
✅ Reset token generation (1-hour expiration)  
✅ Reset password page (`/reset-password/:token`)  
✅ Password update and token cleanup  

---

## 📧 Email Verification Flow

### How It Works

1. **User Registration**
   - User fills out registration form on `/login` page
   - Backend generates a unique verification token (UUID)
   - Token is stored in `users.verificationToken` field
   - Verification link is logged to server console

2. **Email Verification**
   - User receives verification link (currently in console)
   - User clicks link: `http://localhost:5000/verify-email/{token}`
   - Backend verifies token and marks email as verified
   - User sees success message and can login

### Testing Email Verification

1. **Register a New User**
```bash
# Go to http://localhost:5000/login
# Click "Create Account"
# Fill in the form and submit
```

2. **Check Server Console**
```
📧 Email Verification Token for user@example.com:
   Visit: http://localhost:5000/verify-email/abc-123-def-456
   Or use API: GET /api/verify-email/abc-123-def-456
```

3. **Click the Link**
- Copy the verification link from console
- Paste in browser
- See verification success page

4. **Verify in Admin Dashboard**
```bash
# Login as admin at http://localhost:5000/admin-login
# Go to Users tab
# Check user's "Verified" column shows green checkmark
```

### API Endpoint

```http
GET /api/verify-email/:token
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Response:**
```json
{
  "message": "Invalid or expired verification token"
}
```

---

## 🔑 Password Reset Flow

### How It Works

1. **Request Password Reset**
   - User clicks "Forgot password?" on login page
   - User enters email address
   - Backend generates reset token (valid 1 hour)
   - Reset link is logged to console

2. **Reset Password**
   - User receives reset link (currently in console)
   - User clicks link: `http://localhost:5000/reset-password/{token}`
   - User enters new password (min 8 characters)
   - Password is updated, token is cleared

### Testing Password Reset

1. **Request Reset**
```bash
# Go to http://localhost:5000/login
# Click "Forgot password?" link
# Enter your email address
# Click "Send Reset Link"
```

2. **Check Server Console**
```
Password reset token for user@example.com: abc-123-def-456
```

3. **Use Reset Link**
```bash
# Copy token from console
# Visit: http://localhost:5000/reset-password/abc-123-def-456
# Enter new password (must match confirmation)
# Click "Reset Password"
```

4. **Login with New Password**
```bash
# Go to http://localhost:5000/login
# Login with email and new password
```

### API Endpoints

#### Request Reset
```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (Always Success):**
```json
{
  "success": true,
  "message": "If an account exists, a reset link has been sent"
}
```

#### Reset Password
```http
POST /api/reset-password/:token
Content-Type: application/json

{
  "password": "newPassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Response:**
```json
{
  "message": "Invalid or expired reset token"
}
```

---

## 🗄️ Database Schema

### Users Table Fields

```typescript
emailVerified: boolean().default(false)
// Whether the user's email has been verified

verificationToken: varchar('verification_token')
// Unique token for email verification (cleared after use)

resetPasswordToken: varchar('reset_password_token')
// Unique token for password reset (cleared after use)

resetPasswordExpires: timestamp('reset_password_expires')
// Expiration time for reset token (1 hour from generation)
```

---

## 🚀 Current Implementation

### What's Working Now

✅ **Email Verification**
- Token generated on registration
- Link displayed in console
- Verification page functional
- Database updated on verification

✅ **Password Reset**
- Forgot password page
- Token generation with 1-hour expiry
- Reset password page
- Secure token validation
- Password update

### What's Missing (Optional)

⚠️ **Email Sending**
- Currently links are logged to console
- For production, integrate email service

---

## 📝 Routes Added

### Frontend Routes
```typescript
/verify-email/:token    - Email verification page
/forgot-password        - Request password reset
/reset-password/:token  - Set new password
```

### Backend Routes
```typescript
GET  /api/verify-email/:token      - Verify email
POST /api/forgot-password          - Request reset
POST /api/reset-password/:token    - Reset password
```

---

## 🔒 Security Features

### Email Verification
- ✅ Unique UUID tokens
- ✅ Single-use tokens (cleared after verification)
- ✅ Prevents unauthorized verification

### Password Reset
- ✅ 1-hour token expiration
- ✅ Prevents email enumeration (always returns success)
- ✅ Single-use tokens (cleared after reset)
- ✅ Secure password hashing (bcrypt, 10 rounds)
- ✅ Minimum 8 character password requirement

---

## 🎨 User Experience

### Registration Flow
1. User fills registration form
2. Account created automatically
3. User logged in immediately
4. Toast notification: "Account created! Please check console for verification link"
5. User can verify email later

### Password Reset Flow
1. User clicks "Forgot password?" on login
2. Enters email address
3. Sees success message (even if email doesn't exist)
4. Checks console for reset link
5. Sets new password
6. Redirected to login

### Email Verification Flow
1. User clicks verification link from console
2. Sees loading spinner
3. Email verified automatically
4. Success message with login button
5. Can login with full access

---

## 🛠️ Admin Features

### User Management Dashboard
Admins can see:
- ✅ Email verification status (green/red icon)
- ✅ Login count for each user
- ✅ Last login timestamp
- ✅ Manually verify emails (toggle switch)

### Access Admin Panel
```bash
1. Login as admin at /admin-login
2. Click "Users" tab
3. View all users with verification status
4. Toggle verification manually if needed
```

---

## 📧 Adding Email Service (Optional)

To send actual emails instead of console logs:

### 1. Install Email Package
```bash
npm install nodemailer
```

### 2. Add to .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_URL=http://localhost:5000
FROM_EMAIL=noreply@norealbeauty.com
```

### 3. Create Email Service
Create `server/email.ts`:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.APP_URL}/verify-email/${token}`;
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: '✨ Verify Your NoReal Beauty Account',
    html: `
      <h2>Welcome to NoReal Beauty!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: '🔑 Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}
```

### 4. Update Registration
In `server/auth.ts`:
```typescript
import { sendVerificationEmail } from './email';

// After creating user
await sendVerificationEmail(email, verificationToken);
```

### 5. Update Password Reset
In `server/auth.ts`:
```typescript
import { sendPasswordResetEmail } from './email';

// After generating reset token
await sendPasswordResetEmail(email, resetToken);
```

---

## ✅ Testing Checklist

### Email Verification
- [ ] Register new user
- [ ] Check console for verification link
- [ ] Click verification link
- [ ] See success message
- [ ] Check admin panel (verified icon)
- [ ] Try same link again (should fail)

### Password Reset
- [ ] Click "Forgot password?" on login
- [ ] Enter email
- [ ] Check console for reset link
- [ ] Click reset link
- [ ] Enter new password
- [ ] Confirm password matches
- [ ] Submit and redirect to login
- [ ] Login with new password
- [ ] Try same reset link again (should fail)

### Admin Panel
- [ ] Login as admin
- [ ] View Users tab
- [ ] See verification status
- [ ] Manually toggle verification
- [ ] View Analytics tab
- [ ] Check verified users count

---

## 🎯 Summary

**Email Verification:**
- ✅ Automatic token generation
- ✅ Console link output (production: email)
- ✅ Verification page
- ✅ Database update

**Password Reset:**
- ✅ Forgot password link on login
- ✅ Token with 1-hour expiry
- ✅ Reset password page
- ✅ Secure implementation

**Ready to Use:**
All features are functional and ready for testing!

**Next Steps:**
- Test features thoroughly
- (Optional) Add email service for production
- Run `npm run db:push` to apply schema changes
