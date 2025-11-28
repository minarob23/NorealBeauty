# Complete Authentication Guide - NorealBeauty

## Overview

NorealBeauty has **three separate authentication systems** for different user types:

1. **👤 Users** - Customers who shop on the website
2. **🛡️ Admins** - Team members who manage the platform
3. **👑 Owners** - Website owners with highest privileges

Each has its own login page and capabilities.

---

## 🎯 Quick Reference

| User Type | Login URL | Access Level | Can Create Account? |
|-----------|-----------|--------------|---------------------|
| **User** | `/login` | Shop, orders, wishlist | ✅ Yes (self-signup) |
| **Admin** | `/admin-login` | Manage users, products | ❌ No (owner creates) |
| **Owner** | `/owner` | Full system control | ❌ No (CLI only) |

---

## 1️⃣ USER AUTHENTICATION

### For Regular Customers

#### 🔐 How to Create a User Account

**Option 1: Email & Password**

1. Go to: `http://localhost:5000/login`
2. Click "Sign Up" tab
3. Fill in details:
   - First Name
   - Last Name  
   - Email
   - Password (minimum 8 characters)
4. Click "Create Account"
5. **Check your email** for verification link
6. Click the verification link
7. Return to `/login` and sign in

**Example:**
```
Name: John Doe
Email: john@customer.com
Password: MyPassword123
```

**Option 2: Google OAuth**

1. Go to: `http://localhost:5000/login`
2. Click "Continue with Google"
3. Select your Google account
4. **Check your email** for verification link
5. Click the verification link
6. Return to `/login` and sign in with Google

#### 📧 Email Verification Required

- All new users must verify their email
- Verification email sent automatically
- Link expires in 24 hours
- Cannot log in until verified

#### 🔑 How to Sign In as User

1. Go to: `http://localhost:5000/login`
2. Enter your email and password
3. Click "Sign In"
4. Redirected to homepage

#### 🆘 Forgot Password?

1. Go to: `http://localhost:5000/login`
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link (expires in 1 hour)
5. Click link and set new password

#### ✨ What Users Can Do

- ✅ Browse and shop products
- ✅ Add items to cart and wishlist
- ✅ Place orders
- ✅ Manage account settings
- ✅ View order history
- ❌ Cannot access admin panel
- ❌ Cannot access owner dashboard

---

## 2️⃣ ADMIN AUTHENTICATION

### For Team Members

#### 🔐 How to Create Admin Accounts

**Admins CANNOT self-register.** Only Owners can create admin accounts.

**Command Line (Owner Only):**

```powershell
# Create Super Admin
npm run create-admin admin@team.com SecurePass123 super-admin "Sarah Chen"

# Create Regular Admin
npm run create-admin manager@team.com Pass456 admin "Mike Johnson"

# Create Moderator
npm run create-admin support@team.com Pass789 moderator "Lisa Wong"
```

**Syntax:**
```
npm run create-admin <email> <password> [role] [displayName]
```

**Roles:**
- `super-admin` - Can manage other admins
- `admin` - Can manage users and content (default)
- `moderator` - View-only access

#### 🔑 How to Sign In as Admin

1. Go to: `http://localhost:5000/admin-login`
2. Enter admin email and password
3. Click "Sign in as Admin"
4. Redirected to admin dashboard (`/admin`)

**Example Login:**
```
Email: admin@norealbeauty.com
Password: Admin@123
```

#### ⚠️ Important Notes

- Admin login is **separate** from user login
- Admins cannot use `/login` (user login page)
- Users cannot use `/admin-login`
- Every admin action is logged

#### ✨ What Admins Can Do

- ✅ View all users
- ✅ Edit user details
- ✅ Delete users
- ✅ View analytics
- ✅ Manage products (coming soon)
- ✅ Manage orders (coming soon)
- ✅ View activity logs
- ❌ Cannot create other admins (super-admin only)
- ❌ Cannot access owner dashboard

---

## 3️⃣ OWNER AUTHENTICATION

### For Website Owners

#### 🔐 How to Create Owner Accounts

**Owners can ONLY be created via command line** (highest security).

```powershell
npm run create-owner owner@norealbeauty.com SecureOwnerPass123 "Jane Smith"
```

**Syntax:**
```
npm run create-owner <email> <password> [ownerName]
```

**Output:**
```
✅ Owner account created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: owner@norealbeauty.com
👤 Name: Jane Smith
🆔 ID: abc-123-def-456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Login URL: http://localhost:5000/owner
⚠️  Keep credentials secure - Owner has highest privileges!
```

#### 🔑 How to Sign In as Owner

1. **Directly navigate to**: `http://localhost:5000/owner`
   - ⚠️ Not linked from homepage (hidden for security)
   - Bookmark this URL
2. Enter owner email and password
3. Click "Sign in as Owner"
4. Redirected to owner dashboard (`/owner/dashboard`)

**Example Login:**
```
Email: owner@norealbeauty.com
Password: SecureOwnerPass123
```

#### 🔒 Security Features

- **Hidden URL** - Not accessible from navigation
- **No self-signup** - CLI creation only
- **Auto-verified** - Email verified on creation
- **Activity logged** - All actions tracked
- **Separate from admins** - Different access level

#### ✨ What Owners Can Do

- ✅ **Everything admins can do**
- ✅ Create admin accounts
- ✅ Edit admin roles
- ✅ Delete admin accounts
- ✅ View all activity logs (admins + owners)
- ✅ Access owner dashboard
- ✅ Access admin panel
- ✅ System configuration
- ✅ Full database access

---

## 📊 Complete Workflow Examples

### Example 1: New Customer Shopping

```
1. Customer visits website
2. Browses products
3. Clicks "Sign In" → Goes to /login
4. Clicks "Sign Up"
5. Enters: john@email.com, password
6. Receives verification email
7. Clicks verification link
8. Returns to /login
9. Signs in with email/password
10. Shops and places order ✅
```

### Example 2: Admin Managing Users

```
1. Owner creates admin:
   npm run create-admin admin@team.com pass123 admin "Admin Name"

2. Admin opens browser
3. Goes to /admin-login
4. Enters credentials
5. Redirected to /admin dashboard
6. Clicks "Users" tab
7. Edits user details
8. Action logged in activity logs ✅
```

### Example 3: Owner Creating New Admin

```
1. Owner navigates to /owner (bookmarked)
2. Signs in
3. Goes to owner dashboard
4. Opens terminal
5. Runs: npm run create-admin newadmin@team.com pass456 admin "New Admin"
6. Admin account created
7. Sends credentials to new admin (securely)
8. New admin can now log in at /admin-login ✅
```

### Example 4: Multi-Owner Scenario

```
# Create first owner
npm run create-owner owner1@company.com pass1 "Owner One"

# Create second owner
npm run create-owner owner2@company.com pass2 "Owner Two"

# Both can:
- Log in at /owner
- Access /owner/dashboard
- Create admins
- Manage entire system
- See each other's actions in logs ✅
```

---

## 🔄 Login Page Navigation

### From User Login (/login)

You can navigate to:
- ✅ Admin Login (link at bottom)
- ✅ Forgot Password
- ✅ Create Account (switch tabs)

### From Admin Login (/admin-login)

You can navigate to:
- ✅ User Login (link at bottom)
- ✅ Back to Home

### From Owner Login (/owner)

You can navigate to:
- ✅ User Login (link in card)
- ✅ Admin Login (link in card)
- ✅ Back to Home

---

## 🛡️ Security Best Practices

### For Users
- ✅ Use strong passwords (8+ characters)
- ✅ Verify email before shopping
- ✅ Use Google OAuth for easier login
- ✅ Don't share account credentials

### For Admins
- ✅ Each team member gets own account
- ✅ Use descriptive admin names
- ✅ Log out when done
- ✅ Report suspicious activity
- ❌ Never share admin credentials

### For Owners
- ✅ Keep owner credentials VERY secure
- ✅ Bookmark `/owner` URL
- ✅ Create owners only when needed
- ✅ Review activity logs regularly
- ✅ Give admins appropriate roles
- ❌ Never share owner access

---

## 📋 Troubleshooting

### "Email already exists"
- Email is already registered
- Try forgot password
- Or use different email

### "Please verify your email"
- Check inbox and spam folder
- Resend verification (create account again)
- Verification link expires in 24 hours

### "Invalid credentials"
- Check email spelling
- Check password (case-sensitive)
- Ensure using correct login page:
  - Users: `/login`
  - Admins: `/admin-login`
  - Owners: `/owner`

### "Access denied"
- User trying to access `/admin-login`
  - Use `/login` instead
- Admin trying to access `/owner`
  - Only owners can access
- Not verified yet
  - Check email for verification link

### Can't access `/owner`
- Owner login is **not linked** from homepage
- Type URL directly: `http://localhost:5000/owner`
- Bookmark it for easy access

---

## 🎨 Visual Guide

### User Login Page
```
🏠 Home > Login

┌─────────────────────────────────┐
│   Sign In    |   Sign Up        │  ← Tabs
├─────────────────────────────────┤
│                                 │
│  📧 Email                       │
│  🔒 Password                    │
│  ❓ Forgot password?            │
│                                 │
│  [Sign In Button]               │
│                                 │
│  ──────── OR ────────           │
│                                 │
│  [🔵 Continue with Google]      │
│                                 │
│  💼 Admin Sign In →             │
└─────────────────────────────────┘
```

### Admin Login Page
```
🏠 Home > Admin Login

┌─────────────────────────────────┐
│  🛡️  Admin Access               │
│  For administrators only        │
├─────────────────────────────────┤
│                                 │
│  📧 Email                       │
│  🔒 Password                    │
│                                 │
│  [Sign in as Admin]             │
│                                 │
│  ──────────────────             │
│  👤 User Sign In →              │
│  🏠 Back to Home                │
└─────────────────────────────────┘
```

### Owner Login Page
```
🏠 Home > Owner Login

┌─────────────────────────────────┐
│  👑  Owner Access               │
│  For website owners only        │
├─────────────────────────────────┤
│                                 │
│  📧 Email                       │
│  🔒 Password                    │
│                                 │
│  [👑 Sign in as Owner]          │
│                                 │
│  Other sign-in options:         │
│  [User Login]                   │
│  [Admin Login]                  │
└─────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### Create Your First Owner
```powershell
npm run create-owner owner@yourstore.com YourSecurePass123 "Your Name"
```

### Create Your First Admin
```powershell
npm run create-admin admin@yourstore.com AdminPass456 super-admin "Admin Name"
```

### Test All Logins

**Test User Signup:**
1. Go to `http://localhost:5000/login`
2. Sign up with test email
3. Verify email
4. Log in ✅

**Test Admin Login:**
1. Create admin (see above)
2. Go to `http://localhost:5000/admin-login`
3. Enter admin credentials
4. Access dashboard ✅

**Test Owner Login:**
1. Create owner (see above)
2. Go to `http://localhost:5000/owner`
3. Enter owner credentials
4. Access owner dashboard ✅

---

## 📊 Summary Table

| Feature | Users | Admins | Owners |
|---------|-------|--------|--------|
| **Create Account** | Self-signup | Owner creates | CLI only |
| **Login URL** | `/login` | `/admin-login` | `/owner` |
| **Email Verification** | Required | Auto-verified | Auto-verified |
| **Password Reset** | ✅ Available | ❌ Contact owner | ❌ Contact developer |
| **Google OAuth** | ✅ Supported | ❌ Not available | ❌ Not available |
| **Can Shop** | ✅ Yes | ❌ No | ✅ Yes |
| **Manage Users** | ❌ No | ✅ Yes | ✅ Yes |
| **Create Admins** | ❌ No | Super-admin only | ✅ Yes |
| **View Logs** | ❌ No | ✅ Yes | ✅ Yes |
| **System Access** | Limited | Moderate | Full |

---

## 🎓 Best Practices

### Setting Up Your Team

1. **Create Owner First**
   ```powershell
   npm run create-owner owner@company.com pass1 "CEO Name"
   ```

2. **Create Super Admin**
   ```powershell
   npm run create-admin superadmin@company.com pass2 super-admin "Manager Name"
   ```

3. **Create Regular Admins**
   ```powershell
   npm run create-admin admin1@company.com pass3 admin "Team Member 1"
   npm run create-admin admin2@company.com pass4 admin "Team Member 2"
   ```

4. **Create Moderators**
   ```powershell
   npm run create-admin support@company.com pass5 moderator "Support Team"
   ```

5. **Test Each Account**
   - Owner logs in at `/owner`
   - Admins log in at `/admin-login`
   - Check activity logs to verify

---

## 🎉 You're All Set!

You now have three complete authentication systems:

1. ✅ **Users** can self-register and shop
2. ✅ **Admins** can manage the platform
3. ✅ **Owners** have full control

Each system is separate, secure, and fully tracked!

**Need Help?**
- Check `ADMIN_TRACKING.md` for admin tracking details
- Check `EMAIL_SETUP.md` for email configuration
- Review this guide for authentication flows
