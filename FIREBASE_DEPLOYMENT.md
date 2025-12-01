# Firebase Deployment Guide for NoReal Beauty

This guide will walk you through deploying your NoReal Beauty application to Firebase.

## Prerequisites

1. **Firebase Account**: Create a Firebase account at [firebase.google.com](https://firebase.google.com)
2. **Firebase CLI**: Already installed globally via npm
3. **Firebase Project**: Create a new project in the Firebase Console

## Project Structure

The deployment consists of two parts:
- **Firebase Hosting**: Serves the React frontend (from `dist/public`)
- **Firebase Functions**: Runs the Express backend API

## Step-by-Step Deployment

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project (e.g., "noreal-beauty")
4. Follow the setup wizard
5. Enable Blaze (Pay as you go) plan for Cloud Functions

### 2. Initialize Firebase in Your Project

Run the following command and follow the prompts:

```powershell
firebase login
```

This will open a browser window for authentication.

### 3. Link Your Local Project

Update the `.firebaserc` file with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4. Configure Environment Variables

#### For Firebase Functions:

Firebase Functions don't use `.env` files in production. Set environment variables using:

```powershell
# Set database URL
firebase functions:config:set database.url="your_neon_database_url"

# Set session secret
firebase functions:config:set session.secret="your_session_secret"

# Set Resend API key
firebase functions:config:set resend.api_key="your_resend_api_key"
firebase functions:config:set resend.from_email="noreply@yourdomain.com"

# Set Google OAuth (if using)
firebase functions:config:set google.client_id="your_client_id"
firebase functions:config:set google.client_secret="your_client_secret"
firebase functions:config:set google.callback_url="https://your-app.web.app/api/auth/google/callback"

# Set app URL
firebase functions:config:set app.url="https://your-app.web.app"
```

To view current config:
```powershell
firebase functions:config:get
```

#### Update Your Functions Code to Use Config:

The Firebase config is accessed via `functions.config()` instead of `process.env`.

### 5. Update Database Connection

Make sure your Neon database allows connections from Firebase's IP ranges. Neon typically allows all connections by default.

### 6. Build the Project

Run the build command:

```powershell
npm run build:firebase
```

This will:
1. Build the frontend (Vite)
2. Copy server files to functions directory
3. Install dependencies in functions directory
4. Build the TypeScript functions

### 7. Deploy to Firebase

Deploy both hosting and functions:

```powershell
npm run deploy:firebase
```

Or use Firebase CLI directly:

```powershell
firebase deploy
```

To deploy only specific parts:
```powershell
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

### 8. First-Time Setup After Deployment

After deployment:

1. **Create Owner Account**: You'll need to run migrations and create admin users. Since Firebase Functions are serverless, you'll need to:
   - Use Firebase Admin SDK to create initial users, or
   - Create a temporary endpoint to initialize data, or
   - Manage initial data through Firebase Console

2. **Database Migrations**: Run your database migrations locally:
   ```powershell
   npm run db:push
   npm run db:migrate-products
   ```

3. **Verify Deployment**: Visit your Firebase Hosting URL (will be shown after deployment)

## URLs After Deployment

- **Frontend**: `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`
- **Functions**: Automatically integrated via rewrites in `firebase.json`

## Monitoring and Logs

View function logs:
```powershell
firebase functions:log
```

Or view in Firebase Console:
- Go to Firebase Console > Functions > Logs

## Updating the Deployment

To deploy updates:

```powershell
# Make your changes
# Then rebuild and deploy
npm run deploy:firebase
```

## Important Notes

1. **Session Storage**: Firebase Functions are stateless. You're using `memorystore` which works but sessions won't persist across function instances. Consider using Firebase Realtime Database or Firestore for session storage in production.

2. **Cold Starts**: Cloud Functions have cold start times. First requests may be slower.

3. **Database Connection**: Neon serverless works well with Firebase Functions' serverless nature.

4. **File Uploads**: If you have file uploads, consider using Firebase Storage.

5. **CORS**: Make sure your API routes handle CORS properly for your Firebase domain.

## Troubleshooting

### Functions Not Working
- Check logs: `firebase functions:log`
- Verify environment variables are set
- Ensure billing is enabled (Blaze plan required)

### Hosting Shows 404
- Verify build output is in `dist/public`
- Check `firebase.json` rewrites configuration

### Database Connection Issues
- Verify DATABASE_URL is correct in Firebase config
- Check Neon dashboard for connection errors
- Ensure Neon allows external connections

## Cost Optimization

Firebase offers generous free tiers:
- **Hosting**: 10 GB storage, 360 MB/day transfer
- **Functions**: 2M invocations/month, 400K GB-seconds compute

Monitor usage in Firebase Console to stay within budget.

## Custom Domain (Optional)

To use a custom domain:
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Security

1. Set up Firebase Security Rules for any databases
2. Enable Firebase Authentication if not using custom auth
3. Review CORS settings
4. Set up rate limiting for API endpoints

## Next Steps

- Set up Firebase Performance Monitoring
- Configure Firebase Analytics
- Set up error tracking (Sentry integration)
- Configure CDN caching rules
- Set up CI/CD with GitHub Actions

---

For more information, visit [Firebase Documentation](https://firebase.google.com/docs)
