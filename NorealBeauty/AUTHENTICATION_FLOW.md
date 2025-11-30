# Authentication Flow Diagram

## User Authentication Flow (Google OAuth)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ Click "Sign In"
       ▼
┌─────────────────┐
│  /login page    │
│                 │
│ ┌─────────────┐ │
│ │ Google OAuth│ │◄─── User clicks
│ └─────────────┘ │
└────────┬────────┘
         │
         │ User chooses Google
         ▼
┌────────────────────┐
│ /api/login/google  │
└────────┬───────────┘
         │
         │ Redirect to Google
         ▼
┌──────────────────────┐
│   Google OAuth       │
│   Login Screen       │
└──────────┬───────────┘
           │
           │ User authenticates
           ▼
┌──────────────────────────┐
│ /api/callback/google     │
│ - Create/update user     │
│ - authProvider: 'google' │
│ - Create session         │
└──────────┬───────────────┘
           │
           │ Success
           ▼
┌──────────────────┐
│   Home Page      │
│  (Authenticated) │
└──────────────────┘
```

## Admin Authentication Flow (Local)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ Navigate to /admin
       │ (not authenticated)
       ▼
┌─────────────────────┐
│  Check auth in      │
│  admin.tsx          │
└──────┬──────────────┘
       │
       │ Not authenticated
       │ Redirect
       ▼
┌─────────────────────┐
│  /admin-login       │
│                     │
│  ┌───────────────┐  │
│  │ Email         │  │
│  ├───────────────┤  │
│  │ Password      │  │
│  ├───────────────┤  │
│  │ [Sign In]     │  │
│  └───────────────┘  │
└──────┬──────────────┘
       │
       │ Submit form
       ▼
┌──────────────────────────┐
│ POST /api/login/admin    │
│ - Find user by email     │
│ - Check isAdmin: true    │
│ - Verify password hash   │
│ - Create session         │
└──────┬───────────────────┘
       │
       │ Success
       ▼
┌──────────────────┐
│  /admin page     │
│  (Dashboard)     │
└──────────────────┘
```

## Route Protection Flow

```
┌──────────────────┐
│ User tries to    │
│ access /account  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────┐
│ useAuth hook        │
│ queries /api/auth/  │
│        user         │
└────────┬────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│ Auth  │  │ Not Auth │
│  ✓    │  │    ✗     │
└───┬───┘  └────┬─────┘
    │           │
    │           │ Redirect
    │           ▼
    │      ┌─────────┐
    │      │ /login  │
    │      └─────────┘
    │
    │ Show page
    ▼
┌──────────────┐
│ /account     │
│ (Content)    │
└──────────────┘
```

## Authentication Strategies Comparison

| Feature          | Regular Users (OAuth) | Admin (Local)        |
|------------------|-----------------------|----------------------|
| **Method**       | Google OAuth          | Email + Password     |
| **Endpoint**     | `/api/login/google`   | `/api/login/admin`   |
| **UI**           | `/login` page         | `/admin-login` page  |
| **Storage**      | OAuth tokens          | Hashed password      |
| **Session**      | Database-backed       | Database-backed      |
| **Redirect URL** | Home (`/`)            | Admin (`/admin`)     |
| **isAdmin**      | `false` (default)     | `true` (required)    |
| **Can access**   | /account, /wishlist   | /admin (only)        |

## Session Management

```
┌─────────────────┐
│  User logs in   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Create session          │
│ - Store in database     │
│ - TTL: 7 days           │
│ - Contains user claims  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Set session cookie      │
│ - httpOnly: true        │
│ - secure: true          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Subsequent requests     │
│ - Cookie sent auto      │
│ - Session validated     │
│ - User data retrieved   │
└─────────────────────────┘
```

## Middleware Protection

```
Protected Route Request
        │
        ▼
┌──────────────────┐
│ isAuthenticated  │
│   middleware     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│ Valid │  │ Invalid  │
│Session│  │ Session  │
└───┬───┘  └────┬─────┘
    │           │
    │           │ Return 401
    │           ▼
    │      ┌─────────────┐
    │      │ {"message": │
    │      │"Unauthorized│
    │      │     "}      │
    │      └─────────────┘
    │
    │ Continue
    ▼
┌──────────────┐
│ Process      │
│ Request      │
└──────────────┘
```

## Admin Route Protection

```
Admin Route Request
        │
        ▼
┌──────────────────┐
│ isAuthenticated  │
│   middleware     │
└────────┬─────────┘
         │
         │ Session valid
         ▼
┌──────────────────┐
│    isAdmin       │
│   middleware     │
│                  │
│ - Get user from  │
│   database       │
│ - Check isAdmin  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│isAdmin│  │Not Admin │
│  true │  │  false   │
└───┬───┘  └────┬─────┘
    │           │
    │           │ Return 403
    │           ▼
    │      ┌─────────────┐
    │      │ {"message": │
    │      │   "Access   │
    │      │   denied"}  │
    │      └─────────────┘
    │
    │ Continue
    ▼
┌──────────────┐
│ Process      │
│ Admin Action │
└──────────────┘
```
