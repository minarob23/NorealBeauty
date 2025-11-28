# Multi-Admin Tracking System

## Overview

This system allows multiple administrators to manage the platform while maintaining **complete accountability** and **audit trails**. Each admin has their own account with specific roles and permissions.

## Key Features

✅ **Individual Admin Accounts** - Each team member has their own credentials  
✅ **Role-Based Access** - Three admin levels: Super Admin, Admin, Moderator  
✅ **Activity Logging** - Track every admin action with timestamps  
✅ **Audit Trail** - See who did what, when, and from where  
✅ **Active Admin Tracking** - Monitor who's currently managing the site  

---

## Admin Roles

### 1. Super Admin
- **Full Access** - Can do everything
- **Manage Admins** - Create, edit, delete other admin accounts
- **View All Logs** - Access complete activity history
- **System Configuration** - Modify critical settings

### 2. Admin
- **User Management** - Edit and delete users
- **Content Management** - Manage products, orders
- **View Logs** - See activity logs
- **Cannot** create other admins

### 3. Moderator
- **Limited Access** - View-only permissions
- **User Support** - Help users with issues
- **Cannot** edit or delete
- **Cannot** access sensitive data

---

## Creating Admin Accounts

### Method 1: Using Command Line (Recommended)

```powershell
# Create a Super Admin
npm run create-admin admin@example.com SecurePassword123 super-admin "John Doe"

# Create a Regular Admin
npm run create-admin support@example.com Password456 admin "Jane Smith"

# Create a Moderator
npm run create-admin moderator@example.com Pass789 moderator "Bob Wilson"
```

**Syntax:**
```
npm run create-admin <email> <password> [role] [displayName]
```

**Parameters:**
- `email` - Admin's email address (required)
- `password` - Strong password (required, min 8 characters)
- `role` - `super-admin`, `admin`, or `moderator` (default: `admin`)
- `displayName` - Name shown in logs (optional, defaults to email prefix)

### Method 2: Via Super Admin Dashboard (Future Feature)

Super admins will be able to create other admins through the admin panel interface.

---

## Activity Tracking

### What Gets Logged

Every admin action is automatically tracked with:

| Field | Description | Example |
|-------|-------------|---------|
| **Admin** | Who performed the action | "John Doe (super-admin)" |
| **Action** | What was done | `admin_login`, `user_update`, `user_delete` |
| **Target** | What was affected | User ID, Product ID, etc. |
| **Details** | Additional context | Changed fields, old/new values |
| **Timestamp** | When it happened | "2 hours ago" |
| **IP Address** | Where from | `192.168.1.100` |
| **User Agent** | Browser/device | `Chrome 120 on Windows` |

### Tracked Actions

- ✅ **admin_login** - Admin signed in
- ✅ **user_update** - Modified user details
- ✅ **user_delete** - Deleted a user
- ✅ **admin_create** - Created new admin (coming soon)
- ✅ **product_create** - Added new product (coming soon)
- ✅ **product_update** - Modified product (coming soon)
- ✅ **order_update** - Changed order status (coming soon)

### Viewing Activity Logs

1. **Login as Admin**: Go to `/admin-login`
2. **Open Dashboard**: Navigate to `/admin`
3. **Click "View Activity Logs"** button
4. **Browse Activities**: See all recent admin actions

**Features:**
- Real-time updates
- Color-coded action types
- Searchable and filterable
- Shows last 100 activities (configurable)
- Relative timestamps ("2 hours ago")

---

## Security Features

### 1. Separation of Concerns
- Admin login separate from user login
- Admins cannot use regular login page
- Regular users cannot access admin panel

### 2. Session Tracking
- Each admin session is tracked
- Last admin action timestamp updated
- Can see who's currently active

### 3. Password Requirements
- Minimum 8 characters
- Bcrypt hashing with 10 salt rounds
- Unique passwords for each admin

### 4. Audit Compliance
- Immutable activity logs
- Cannot delete or modify logs
- Complete history preserved

---

## Best Practices

### ✅ DO:

1. **Create Individual Accounts**
   ```powershell
   # Create separate accounts for each team member
   npm run create-admin john@team.com pass123 admin "John"
   npm run create-admin jane@team.com pass456 admin "Jane"
   ```

2. **Use Descriptive Names**
   ```powershell
   # Good - Easy to identify in logs
   npm run create-admin j.doe@company.com pass admin "John Doe - Marketing"
   
   # Bad - Hard to track
   npm run create-admin admin@company.com pass admin "Admin"
   ```

3. **Assign Appropriate Roles**
   - Give lowest necessary permissions
   - Super admin for founders/tech leads only
   - Regular admin for managers
   - Moderator for support staff

4. **Review Logs Regularly**
   - Check activity logs weekly
   - Look for unusual patterns
   - Verify admin actions

5. **Remove Inactive Admins**
   - Delete accounts when staff leave
   - Rotate passwords periodically

### ❌ DON'T:

1. **Share Admin Accounts**
   ```
   ❌ Multiple people using admin@company.com
   ✅ Each person has their own account
   ```

2. **Use Weak Passwords**
   ```
   ❌ "password123", "admin", "123456"
   ✅ "MyS3cure!P@ssw0rd2024"
   ```

3. **Give Everyone Super Admin**
   ```
   ❌ All team members as super-admins
   ✅ One super admin, others as regular admins
   ```

4. **Ignore Activity Logs**
   - Always review logs after major changes
   - Investigate suspicious activities

---

## Example Use Cases

### Scenario 1: E-commerce Team

```powershell
# CEO - Full control
npm run create-admin ceo@store.com pass123 super-admin "Sarah Chen - CEO"

# Store Manager - Product & order management
npm run create-admin manager@store.com pass456 admin "Mike Johnson - Manager"

# Customer Support - View only
npm run create-admin support@store.com pass789 moderator "Lisa Wong - Support"
```

**Activity Log Example:**
```
2 hours ago  | Sarah Chen - CEO    | user_update  | Updated user verification
3 hours ago  | Mike Johnson        | product_create | Added "Hydra Serum"
5 hours ago  | Lisa Wong - Support | admin_login  | Logged in from support desk
```

### Scenario 2: Agency Managing Multiple Clients

```powershell
# Agency Owner - Full access
npm run create-admin owner@agency.com pass1 super-admin "Agency Owner"

# Client A's Manager - Limited to their products
npm run create-admin clienta@agency.com pass2 admin "Client A Manager"

# Developer - Technical access
npm run create-admin dev@agency.com pass3 admin "Dev Team"
```

### Scenario 3: Tracking User Data Changes

When Mike updates a user's email verification:

**Activity Log Entry:**
```json
{
  "admin": "Mike Johnson - Manager",
  "action": "user_update",
  "target": "user_123abc",
  "details": {
    "updates": ["emailVerified"],
    "targetEmail": "customer@email.com"
  },
  "timestamp": "2024-11-27T10:30:00Z",
  "ipAddress": "192.168.1.50"
}
```

You can see:
- **Who**: Mike Johnson
- **What**: Updated email verification
- **When**: Nov 27, 10:30 AM
- **Where**: IP 192.168.1.50
- **Target**: customer@email.com

---

## Technical Architecture

### Database Schema

**users table** (extended):
```typescript
{
  id: string
  email: string
  isAdmin: boolean
  adminRole: 'super-admin' | 'admin' | 'moderator' | null
  adminName: string | null  // Display name for logs
  lastAdminAction: timestamp | null
  // ... other fields
}
```

**admin_activity_logs table**:
```typescript
{
  id: string
  adminId: string  // References users.id
  adminEmail: string
  adminName: string
  action: string
  targetType: string | null  // 'user', 'product', etc.
  targetId: string | null
  details: json | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: timestamp
}
```

### Middleware

**logAdminActivity()**
```typescript
// Automatically logs admin actions
await logAdminActivity(
  adminId,
  adminEmail,
  adminName,
  "user_update",
  "user",
  userId,
  { updates: { emailVerified: true } },
  req
);
```

**requireAdmin()**
```typescript
// Protects routes - requires admin role
app.get("/api/admin/users", requireAdmin, handler);
```

**requireSuperAdmin()**
```typescript
// Protects super admin routes
app.post("/api/admin/create", requireSuperAdmin, handler);
```

---

## API Endpoints

### Get Activity Logs
```
GET /api/admin/activity-logs?limit=100
```

**Response:**
```json
[
  {
    "id": "log_123",
    "adminEmail": "john@admin.com",
    "adminName": "John Doe - Super Admin",
    "action": "user_delete",
    "targetType": "user",
    "targetId": "user_456",
    "details": "{\"deletedEmail\":\"spam@test.com\"}",
    "createdAt": "2024-11-27T10:00:00Z",
    "ipAddress": "192.168.1.1"
  }
]
```

---

## Troubleshooting

### Issue: Can't create admin

**Error:** `Admin user creation failed`

**Solution:**
1. Check database connection
2. Ensure .env has DATABASE_URL
3. Run migrations: `npx drizzle-kit push`

### Issue: Activity logs not showing

**Error:** Logs page empty

**Solution:**
1. Check if admin has performed any actions
2. Verify admin is logged in
3. Check browser console for errors

### Issue: Wrong admin role

**Error:** Permission denied

**Solution:**
```powershell
# Update admin role in database
# Or delete and recreate with correct role
npm run create-admin admin@example.com newpass super-admin "Name"
```

---

## Future Enhancements

### Planned Features:

1. **Admin Management UI**
   - Create admins from dashboard
   - Edit admin roles
   - Deactivate accounts

2. **Advanced Filtering**
   - Filter logs by date range
   - Filter by admin
   - Filter by action type

3. **Email Notifications**
   - Alert on suspicious activity
   - Daily activity summary
   - Admin creation notifications

4. **Export Logs**
   - Download as CSV
   - PDF reports
   - API access

5. **Real-time Monitoring**
   - Live activity feed
   - Active admin dashboard
   - Real-time alerts

---

## Summary

### Why Individual Admin Accounts?

| Shared Account ❌ | Individual Accounts ✅ |
|-------------------|------------------------|
| Can't track who did what | Full accountability |
| Single point of failure | Revoke individual access |
| Security risk if leaked | Isolated security |
| No audit trail | Complete audit history |
| Can't monitor activity | Track every action |

### Quick Start

```powershell
# 1. Create your first admin
npm run create-admin admin@yourstore.com SecurePass123 super-admin "Your Name"

# 2. Login
# Visit http://localhost:5000/admin-login

# 3. View activity logs
# Click "View Activity Logs" button in dashboard

# 4. Create more admins
npm run create-admin team@yourstore.com Pass456 admin "Team Member"
```

That's it! You now have a fully tracked multi-admin system. 🎉
