# Quick Start Checklist

Follow these steps to set up the new authentication system:

## ✅ Prerequisites
- [ ] Node.js installed
- [ ] PostgreSQL database created
- [ ] All npm packages installed (`npm install`)

## 🔧 Configuration Steps

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```

- [ ] Fill in required environment variables in `.env`:
  - [ ] `DATABASE_URL` - Your PostgreSQL connection string
  - [ ] `SESSION_SECRET` - A random string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
  - [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### 2. Google OAuth Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project or select existing
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials:
  - [ ] Application type: Web application
  - [ ] Authorized redirect URIs: 
    - For development: `http://localhost:5000/api/callback/google`
    - For production: `https://yourdomain.com/api/callback/google`
- [ ] Copy Client ID and Client Secret to `.env`

### 3. Database Migration
- [ ] Run schema migration:
  ```bash
  npm run db:push
  ```
- [ ] Verify new columns added:
  - `password` (varchar)
  - `authProvider` (varchar, default: 'google')

### 4. Create Admin User
- [ ] Create your first admin account:
  ```bash
  npm run create-admin admin@example.com YourSecurePassword123
  ```
- [ ] Note down the admin credentials (email and password)

### 5. Start Application
- [ ] Start the development server:
  ```bash
  npm run dev
  ```
- [ ] Application should be running on `http://localhost:5000`

## 🧪 Testing

### Test Regular User Login
- [ ] Navigate to `http://localhost:5000/login`
- [ ] Click "Continue with Google"
- [ ] Complete Google OAuth flow
- [ ] Should be redirected to home page, logged in
- [ ] Check that user icon appears in header
- [ ] Click user icon → "My Account" should work
- [ ] Logout should work

### Test Admin Login
- [ ] Navigate to `http://localhost:5000/admin-login`
- [ ] Enter admin email and password
- [ ] Click "Sign In"
- [ ] Should be redirected to `/admin` dashboard
- [ ] Verify you can see admin dashboard with stats
- [ ] Logout should work

### Test Protection
- [ ] Logout (if logged in)
- [ ] Try to access `/account` → Should redirect to `/login`
- [ ] Try to access `/admin` → Should redirect to `/admin-login`
- [ ] Login as regular user
- [ ] Try to access `/admin` → Should show "Access denied" and redirect to home

## 🔒 Security Checks
- [ ] Admin passwords are hashed (check database - should not see plain text)
- [ ] Non-admin users cannot access `/admin` routes
- [ ] Sessions persist across page refreshes
- [ ] Logout properly clears session
- [ ] HTTPS is enabled in production

## 📋 Common Issues & Solutions

### Issue: "Invalid email or password" for admin
**Solution:** 
- Verify admin user exists in database
- Check `isAdmin` is `true`
- Try creating a new admin with `npm run create-admin`

### Issue: Google OAuth not working
**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Check redirect URI in Google Console matches your app
- Ensure Google+ API is enabled

### Issue: Database connection error
**Solution:**
- Verify `DATABASE_URL` is correct
- Check database is running
- Test connection: `psql $DATABASE_URL`

### Issue: Session not persisting
**Solution:**
- Check `SESSION_SECRET` is set in `.env`
- Verify sessions table exists in database
- Clear browser cookies and try again

## 📚 Additional Resources

- **Full Setup Guide:** See `AUTHENTICATION_SETUP.md`
- **Flow Diagrams:** See `AUTHENTICATION_FLOW.md`
- **Update Summary:** See `AUTHENTICATION_UPDATE_SUMMARY.md`

## 🎉 Success Criteria

You're done when:
- ✅ Regular users can login with Google
- ✅ Admins can login with email/password
- ✅ Protected routes redirect to login
- ✅ Admin routes only accessible to admins
- ✅ Logout works for all user types
- ✅ No TypeScript errors
- ✅ No console errors in browser

---

Need help? Check the documentation files or review the code comments.
