# Koyeb Deployment (100% Free, No Card!)

## Deploy Backend to Koyeb

1. **Go to Koyeb:** https://app.koyeb.com/

2. **Sign up with GitHub** (no card required)

3. **Click "Create App"**

4. **Select GitHub:**
   - Repository: **NorealBeauty**
   - Branch: **main**

5. **Builder:** Docker (it will auto-detect Dockerfile)

6. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=(your Neon URL)
   SESSION_SECRET=(your secret)
   GOOGLE_CLIENT_ID=(your client ID)
   GOOGLE_CLIENT_SECRET=(your client secret)
   ```

7. **Instance:**
   - Type: **Nano** (free tier)
   - Regions: Choose closest to you

8. **Ports:**
   - Port: **8000** (Koyeb requires 8000)

9. **Click "Deploy"**

## Free Tier:
- ✅ 100% FREE forever
- ✅ No credit card required
- ✅ Auto-deploy on push
- ✅ 512MB RAM
- ✅ Global CDN

Your backend will be at: `https://your-app-name-org.koyeb.app`

**Total deployment time: 3-5 minutes**
