# 🔔 Notification System Documentation

## Overview
The NorealBeauty notification system provides both **in-app notifications** and **browser push notifications** to keep users informed about important events.

## Features

### ✨ In-App Notifications
- **Bell icon** in the header with unread count badge
- **Dropdown panel** showing recent notifications
- **Real-time updates** - polls every 30 seconds
- **Mark as read** - individual or all at once
- **Delete notifications** - remove unwanted notifications
- **Time stamps** - shows how long ago each notification was sent
- **Color-coded types** - different colors for different notification types

### 📱 Browser Push Notifications
- **Permission request** on first load
- **Desktop notifications** for new events
- **Auto-dismiss** after 5 seconds
- **Click to navigate** to related page
- **Icon and badge** with Noreal Beauty branding

## Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `order` | 🛍️ | Blue | Order confirmations, shipping updates, delivery |
| `account` | 👤 | Green | Welcome messages, profile updates, security |
| `product` | ✨ | Purple | Product back in stock, price drops |
| `system` | ⚙️ | Orange | Maintenance, updates, announcements |
| `admin` | 🔒 | Red | Admin actions, important alerts |

## Current Triggers

### 1. Welcome Notification
**When:** User registers (Google OAuth or Email/Password)
```typescript
{
  type: 'account',
  title: 'Welcome to Noreal Beauty! ✨',
  message: 'Thank you for joining us! Discover our premium skincare products and exclusive offers.',
  link: '/shop'
}
```

### 2. Order Confirmation
**When:** Customer completes checkout
```typescript
{
  type: 'order',
  title: 'Order Confirmed! 🎉',
  message: 'Your order #XXXXXXXX has been confirmed. Total: $XX.XX',
  link: '/account'
}
```

### 3. Order Status Updates
**When:** Admin changes order status

#### Shipped
```typescript
{
  type: 'order',
  title: 'Order Shipped! 📦',
  message: 'Your order #XXXXXXXX has been shipped (Tracking: XXXXX).',
  link: '/account'
}
```

#### Delivered
```typescript
{
  type: 'order',
  title: 'Order Delivered! ✅',
  message: 'Your order #XXXXXXXX has been delivered. Enjoy your products!',
  link: '/account'
}
```

#### Cancelled
```typescript
{
  type: 'order',
  title: 'Order Cancelled',
  message: 'Your order #XXXXXXXX has been cancelled.',
  link: '/account'
}
```

## Database Schema

```sql
CREATE TABLE notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

## API Endpoints

### GET `/api/notifications`
Get all notifications for the authenticated user (last 50)
- **Auth:** Required
- **Returns:** Array of notifications

### PATCH `/api/notifications/:id/read`
Mark a specific notification as read
- **Auth:** Required
- **Params:** `id` - notification ID
- **Returns:** Success status

### PATCH `/api/notifications/mark-all-read`
Mark all notifications as read for the authenticated user
- **Auth:** Required
- **Returns:** Success status

### DELETE `/api/notifications/:id`
Delete a specific notification
- **Auth:** Required
- **Params:** `id` - notification ID
- **Returns:** Success status

## Usage

### Creating a Notification (Server-side)

```typescript
await storage.createNotification({
  userId: 'user-id-here',
  type: 'order', // 'order' | 'account' | 'product' | 'system' | 'admin'
  title: 'Notification Title',
  message: 'Detailed message content',
  link: '/optional-link', // Optional - where to navigate when clicked
});
```

### Using Browser Notifications (Client-side)

```typescript
import { useNotifications } from '@/lib/notifications';

const { isSupported, permission, requestPermission, showNotification } = useNotifications();

// Request permission
await requestPermission();

// Show notification
await showNotification(
  'order',
  'Order Shipped!',
  'Your order has been shipped.',
  '/account'
);
```

## Components

### NotificationBell
Located in `client/src/components/notification-bell.tsx`
- Automatically integrated in the header for authenticated users
- Handles fetching, displaying, and managing notifications
- Triggers browser notifications for new unread notifications

## Future Enhancements

### Potential Additions:
1. **Email Notifications** - Send emails for important events
2. **SMS Notifications** - Text messages for urgent updates
3. **Notification Preferences** - Let users customize what they receive
4. **Product Alerts** - Notify when wishlist items are back in stock
5. **Review Reminders** - Remind users to review purchased products
6. **Abandoned Cart** - Remind users about items left in cart
7. **Price Drop Alerts** - Notify when wishlist items go on sale
8. **Blog Updates** - Notify subscribers of new blog posts

## Testing

### Test the notification system:

1. **Register a new account** - Should receive welcome notification
2. **Place an order** - Should receive order confirmation
3. **Admin updates order status** - Should receive status update notification
4. **Check browser notifications** - Allow permissions when prompted
5. **Mark notifications as read** - Test individual and bulk marking
6. **Delete notifications** - Test deletion functionality

## Migration

To set up the notifications table:
```bash
npx tsx server/migrations/add-notifications-table.ts
```

## Files Modified/Created

### Database
- ✅ `shared/schema.ts` - Added notifications table schema
- ✅ `server/migrations/add-notifications-table.ts` - Migration script

### Backend
- ✅ `server/storage.ts` - Notification CRUD operations
- ✅ `server/routes.ts` - Notification API endpoints + triggers
- ✅ `server/auth.ts` - Welcome notification on signup

### Frontend
- ✅ `client/src/components/notification-bell.tsx` - Main notification component
- ✅ `client/src/components/header.tsx` - Integrated notification bell
- ✅ `client/src/lib/notifications.ts` - Browser notification manager

---

**Status:** ✅ Fully Implemented and Ready to Use!
