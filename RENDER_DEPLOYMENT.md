# Render Deployment Guide

## Quick Deployment Steps

### 1. Push Your Code to GitHub

```powershell
git add .
git commit -m "Add Render configuration"
git push origin main
```

### 2. Deploy on Render

1. **Go to Render:** https://render.com

2. **Sign Up/Login:**
   - Click "Get Started for Free"
   - Sign in with GitHub

3. **Create New Web Service:**
   - Click "New +" button (top right)
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Find and select your **NorealBeauty** repository

4. **Configure Service:**
   - **Name:** `norealbeauty-api` (or any name you prefer)
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** (leave blank)
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" for each:
   
   ```
   NODE_ENV = production
   DATABASE_URL = <your_neon_database_url_from_.env>
   SESSION_SECRET = <your_session_secret_from_.env>
   GOOGLE_CLIENT_ID = <your_google_client_id_from_.env>
   GOOGLE_CLIENT_SECRET = <your_google_client_secret_from_.env>
   ```
   
   **Copy these values from your `.env` file**

6. **Click "Create Web Service"**

### 3. Wait for Deployment (3-5 minutes)

Render will:
- ✓ Clone your repository
- ✓ Install dependencies
- ✓ Build your project
- ✓ Start your server

### 4. Get Your API URL

Once deployed, you'll get a URL like:
`https://norealbeauty-api.onrender.com`

### 5. Test Your Backend

```powershell
# Test the health endpoint
curl https://your-app-name.onrender.com/_health

# Or open in browser
Start-Process https://your-app-name.onrender.com/_health
```

## Important Notes

### Free Tier Limitations
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month of runtime
- Perfect for development and low-traffic apps

### Keep Backend Active (Optional)
If you want to avoid cold starts, you can:
1. Upgrade to paid plan ($7/month - always on)
2. Use a cron service to ping your backend every 10 minutes
3. Accept the cold start delay (most cost-effective)

## After Deployment

### Update Google OAuth Redirect
If using Google OAuth, update the callback URL in Google Cloud Console:
```
https://your-app-name.onrender.com/api/auth/google/callback
```

### Monitor Your App
- **Logs:** https://dashboard.render.com
- **Metrics:** CPU, memory usage shown in dashboard
- **Auto-redeploy:** Pushes to main branch auto-deploy

## Alternative: Deploy via Render Dashboard

If you prefer not to use GitHub:

1. **Create render.yaml** (already created)
2. **Blueprint:** Render will detect the render.yaml file
3. **One-click deploy** from the blueprint

## Your URLs After Deployment

- **Frontend:** https://norealbeauty.web.app
- **Backend:** https://norealbeauty-api.onrender.com (or your chosen name)
- **Admin:** https://norealbeauty.web.app/admin-login

## Next Steps

Once backend is deployed:
1. Backend will auto-seed blog posts on first run
2. Create admin account (if needed)
3. Your frontend will automatically work with the backend

---

**Estimated deployment time:** 5 minutes
**Cost:** $0 (Free tier)
