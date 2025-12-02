# AWS Deployment Guide - Console Method

Since the EB CLI is not in your PATH, let's use the AWS Console for deployment. This is actually easier!

## 🚀 Deploy Backend to AWS App Runner (Easiest Method)

### Step 1: Push Your Code to GitHub

Make sure your latest code is pushed to GitHub:

```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy via AWS App Runner

1. **Go to AWS App Runner Console**: https://console.aws.amazon.com/apprunner/

2. **Click "Create service"**

3. **Source and deployment**:
   - Repository type: **Source code repository**
   - Click **"Add new"** to connect GitHub
   - Authorize AWS to access your GitHub
   - Select repository: **NorealBeauty**
   - Branch: **main**
   - Click **Next**

4. **Build settings**:
   - Configuration: **Configure all settings here**
   - Runtime: **Docker**
   - Build command: Leave default (uses Dockerfile)
   - Start command: Leave default (uses Dockerfile CMD)
   - Port: **5000**
   - Click **Next**

5. **Service settings**:
   - Service name: **norealbeauty-api**
   - CPU: **1 vCPU** (free tier)
   - Memory: **2 GB** (free tier)
   - Environment variables - Click **Add environment variable** for each:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string from `.env`
     - `SESSION_SECRET`: Your session secret from `.env`
     - `NODE_ENV`: `production`
     - `GOOGLE_CLIENT_ID`: Your Google Client ID from `.env`
     - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret from `.env`
     - `FROM_EMAIL`: `noreply@norealbeauty.com`
   - Click **Next**

6. **Review and create**:
   - Review all settings
   - Click **Create & deploy**

7. **Wait for deployment** (5-10 minutes)

8. **Get your backend URL**:
   - Once deployed, you'll see a URL like: `https://xxxxxxxxxx.us-east-1.awsapprunner.com`
   - **Save this URL!** You'll need it for the frontend.

---

## 🎯 Alternative: AWS Elastic Beanstalk via Console

If you prefer Elastic Beanstalk:

1. **Go to Elastic Beanstalk Console**: https://console.aws.amazon.com/elasticbeanstalk/

2. **Click "Create application"**

3. **Application information**:
   - Application name: **norealbeauty-api**
   - Platform: **Docker**
   - Platform branch: **Docker running on Amazon Linux 2**
   - Application code: **Upload your code**
   
4. **Upload code**:
   - Create a zip file of your project (exclude node_modules, .git)
   - Upload the zip file

5. **Configure more options**:
   - Go to **Software** → Edit
   - Add environment variables (same as above)

6. **Click "Create application"**

---

## 📱 What to Do After Backend Deployment

Once you have your backend URL (e.g., `https://xxxxxxxxxx.us-east-1.awsapprunner.com`):

### Update `.env` file:

```powershell
notepad .env
```

Add these lines:
```
VITE_API_URL=https://your-actual-backend-url.awsapprunner.com
APP_URL=https://your-actual-backend-url.awsapprunner.com
```

---

## 🌐 Deploy Frontend to Firebase

Now deploy the frontend:

```powershell
# Build the frontend with the backend URL
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## ✅ Post-Deployment

After both are deployed:

1. **Test backend health**:
   ```powershell
   curl https://your-backend-url/_health
   ```

2. **Visit your frontend**: `https://norealbeauty.web.app`

3. **Create owner account**:
   ```powershell
   npm run create-owner
   ```

---

## 💡 Why AWS App Runner?

- ✅ **Easier** than Elastic Beanstalk (no CLI needed)
- ✅ **Auto-deploy** from GitHub on every push
- ✅ **Built-in HTTPS** and load balancing
- ✅ **Free tier**: 100 build minutes/month, compute hours included

---

## 🆘 Need Help?

If you encounter issues:
- Check AWS App Runner logs in the console
- Verify environment variables are set correctly
- Make sure your code is pushed to GitHub

**Ready to deploy? Start with Step 1: Push to GitHub!**
