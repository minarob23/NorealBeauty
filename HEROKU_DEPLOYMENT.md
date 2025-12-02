# Noréal Beauty - Heroku Deployment Guide

## 🚀 Deploy Backend to Heroku

### Prerequisites
1. Heroku account (free tier available at https://heroku.com)
2. Heroku CLI installed
3. Git repository pushed to GitHub

### Quick Deployment Steps

#### 1. Install Heroku CLI (if not installed)
```powershell
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku
```

#### 2. Login to Heroku
```powershell
heroku login
```

#### 3. Create Heroku App
```powershell
heroku create norealbeauty-api
# Or let Heroku generate a name:
# heroku create
```

#### 4. Set Environment Variables
```powershell
heroku config:set DATABASE_URL="postgresql://neondb_owner:npg_dejhM58OInuA@ep-still-pond-adjhabl8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

heroku config:set SESSION_SECRET="3b342e7c584fec9699563aa0304aaa757a139abd5818974c28273418663b507d"

heroku config:set GOOGLE_CLIENT_ID="your_google_client_id_here"

heroku config:set GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

heroku config:set NODE_ENV="production"
```

#### 5. Deploy to Heroku
```powershell
git push heroku main
```

#### 6. Open Your App
```powershell
heroku open
```

### 🔧 Configuration Files

The following files are already configured:

- **Procfile** - Tells Heroku how to run the app
- **package.json** - Build scripts configured
- **Runtime** - Node.js 18+ (specified in package.json engines)

### 📊 Monitoring & Logs

**View Logs:**
```powershell
heroku logs --tail
```

**Check App Status:**
```powershell
heroku ps
```

**Restart App:**
```powershell
heroku restart
```

### 🔐 Post-Deployment Tasks

#### 1. Test Backend Endpoints
```powershell
# Health check
curl https://your-app-name.herokuapp.com/_health

# Blog posts API
curl https://your-app-name.herokuapp.com/api/blog-posts
```

#### 2. Update Google OAuth Callback URL
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add authorized redirect URI:
   ```
   https://your-app-name.herokuapp.com/api/auth/google/callback
   ```

#### 3. Connect Frontend to Backend
Update your frontend Firebase hosting to point API calls to Heroku:

In `firebase.json`, update the rewrite:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "https://your-app-name.herokuapp.com/api/**"
      }
    ]
  }
}
```

Or use environment variable in frontend to set API base URL.

### 🎯 Heroku Free Tier Limits

- **Dyno Hours:** 550 hours/month (free)
- **Sleep After 30 min:** Dynos sleep after inactivity
- **Wake Up Time:** ~10 seconds on first request
- **No Credit Card Required**

### 💳 Upgrade to Hobby Dyno (Optional - $7/month)

For better performance:
```powershell
heroku dyno:scale web=1:hobby
```

Benefits:
- No sleeping
- Better performance
- Custom domains
- SSL included

### 🔄 Continuous Deployment (Optional)

#### Connect to GitHub for Auto-Deploy:
1. Go to Heroku Dashboard
2. Select your app
3. Click "Deploy" tab
4. Connect to GitHub repository
5. Enable "Automatic deploys" from main branch

Now every push to GitHub automatically deploys!

### 🛠️ Troubleshooting

**Build Fails:**
```powershell
# Check build logs
heroku logs --tail

# Ensure dependencies are installed
heroku run npm install
```

**App Crashes:**
```powershell
# Check error logs
heroku logs --tail

# Verify environment variables
heroku config

# Restart the app
heroku restart
```

**Database Connection Issues:**
```powershell
# Test database connection
heroku run node -e "console.log(process.env.DATABASE_URL)"
```

**Port Issues:**
Heroku automatically sets PORT environment variable. The app already uses:
```javascript
const port = parseInt(process.env.PORT || "5000", 10);
```

### 🔗 Useful Commands

```powershell
# Add buildpack (if needed)
heroku buildpacks:add heroku/nodejs

# Scale dynos
heroku ps:scale web=1

# Open Heroku dashboard
heroku open

# Run database migrations
heroku run npm run db:push

# Create owner account
heroku run npm run create-owner noreen@norealbeauty.com NorealOwner2024! "Noreen Nageh"
```

### 📱 Expected Results

After successful deployment:

✅ Backend API: `https://your-app-name.herokuapp.com`
✅ Health endpoint: `https://your-app-name.herokuapp.com/_health`
✅ Blog API: `https://your-app-name.herokuapp.com/api/blog-posts`
✅ Admin API: `https://your-app-name.herokuapp.com/api/admin/*`

### 🌐 Frontend Integration

Update your frontend to use Heroku backend:

**Option 1: Update Firebase Rewrites**
Already configured in `firebase.json`

**Option 2: Direct API Calls**
Set `VITE_API_URL=https://your-app-name.herokuapp.com` in frontend

### 📞 Support Resources

- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Heroku CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)
- [Heroku Logs](https://devcenter.heroku.com/articles/logging)

---

**🎉 Your Backend Will Be Live At:**
`https://your-app-name.herokuapp.com`

**Admin Panel (via frontend):**
`https://norealbeauty.web.app/admin`
