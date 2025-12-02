# 🚀 NoReal Beauty - Complete Deployment Guide

## ✅ All Configuration Files Ready!

I've prepared everything you need for deployment. Here's what was done:

### Files Created:
1. ✅ **Configuration Files**
   - `.env.production` - Frontend environment config
   - `client/src/config.ts` - API URL helper
   - `.ebextensions/01_environment.config` - AWS configuration
   - `.ebignore` - AWS deployment exclusions

2. ✅ **Updated Files**
   - `client/src/lib/queryClient.ts` - Uses config for API calls
   - `server/app.ts` - Added CORS for Firebase frontend
   - `firebase.json` - Simplified for hosting-only

3. ✅ **Deployment Scripts**
   - `deploy-aws.ps1` - Automated AWS deployment
   - `deploy-firebase.ps1` - Automated Firebase deployment

4. ✅ **Documentation**
   - `DEPLOYMENT_STEPS.md` - Detailed guide
   - `QUICK_DEPLOY.md` - Quick start guide
   - `DEPLOYMENT_READY.md` - Summary

---

## 🎯 What You Need to Do Now

### STEP 1: Install AWS EB CLI

The AWS Elastic Beanstalk CLI is not yet installed. Install it:

```powershell
pip install awsebcli --upgrade --user
```

**If you don't have pip**, install Python from [python.org](https://www.python.org/downloads/)

After installation, verify:
```powershell
eb --version
```

---

### STEP 2: Deploy Backend to AWS

Run the automated deployment script:

```powershell
.\deploy-aws.ps1
```

The script will:
1. Initialize AWS Elastic Beanstalk
2. Ask for your credentials and environment variables
3. Build and deploy your backend
4. Give you the backend URL

**Important**: Save the backend URL! You'll need it for the frontend.

Example URL: `http://norealbeauty-api-env.eba-XXXXXXXX.us-east-1.elasticbeanstalk.com`

---

### STEP 3: Update Frontend Configuration

Edit `.env.production` with your AWS backend URL:

```powershell
notepad .env.production
```

Update this line with your actual AWS URL:
```
VITE_API_URL=http://your-actual-backend-url.elasticbeanstalk.com
```

---

### STEP 4: Deploy Frontend to Firebase

Run the automated deployment script:

```powershell
.\deploy-firebase.ps1
```

The script will:
1. Build the optimized frontend
2. Deploy to Firebase Hosting
3. Give you the live URL

**Your app is now live!** 🎉

---

## 📝 Environment Variables You'll Need

### For AWS Backend (Step 2):
- **DATABASE_URL**: Your Neon PostgreSQL connection string
- **SESSION_SECRET**: Random string (32+ characters)
- **NODE_ENV**: production (auto-set)
- **RESEND_API_KEY**: Optional, for emails
- **FROM_EMAIL**: Optional, sender email
- **GOOGLE_CLIENT_ID**: Optional, for Google OAuth
- **GOOGLE_CLIENT_SECRET**: Optional, for Google OAuth

### For Firebase Frontend (Step 3):
- **VITE_API_URL**: Your AWS backend URL from Step 2

---

## 🔧 Alternative: Deploy Backend to AWS via Console

If you prefer not to use the CLI, you can deploy via AWS Console:

### Option A: AWS App Runner (Easier, Recommended)

1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click "Create service"
3. Choose "Source code repository"
4. Connect your GitHub account and select this repository
5. Configure:
   - **Build settings**: Docker
   - **Port**: 5000
   - **Environment variables**: Add all required vars
6. Click "Create & Deploy"

### Option B: AWS Elastic Beanstalk (More Control)

1. Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click "Create Application"
3. **Application name**: norealbeauty-api
4. **Platform**: Docker
5. **Application code**: Upload your code (zip this directory)
6. Configure environment variables
7. Click "Create application"

---

## 📦 What's in Each Deployment

### Firebase Frontend:
- React application (built with Vite)
- All static assets (images, CSS, JS)
- Optimized and minified
- Served via CDN

### AWS Backend:
- Express.js API server
- Database connection (Neon PostgreSQL)
- Authentication system
- Admin panel APIs
- Product management APIs

---

## 🎬 Demo & Testing

After deployment:

1. **Visit your Firebase URL**
2. **Create an account** (sign up)
3. **Browse products**
4. **Add to cart**
5. **Test checkout flow**

To create admin/owner:
```powershell
# After AWS deployment, run on your local machine:
$env:DATABASE_URL = "your_neon_database_url"
npm run create-owner
```

---

## 💡 Useful Commands

### AWS Backend
```powershell
eb status          # Check status
eb logs            # View logs
eb open            # Open in browser
eb deploy          # Deploy updates
eb ssh             # SSH into instance
```

### Firebase Frontend
```powershell
firebase deploy --only hosting    # Deploy
firebase hosting:channel:list     # List channels
firebase serve                    # Test locally
```

### Local Development
```powershell
npm run dev        # Run locally
npm run build      # Build for production
npm run db:push    # Push DB schema
```

---

## 🐛 Troubleshooting

### Backend Issues

**"eb command not found"**
- Install: `pip install awsebcli --upgrade --user`
- Add to PATH if needed

**"Access Denied" on AWS**
- Create IAM user with proper permissions
- Get access keys from IAM console

**"Database connection failed"**
- Verify DATABASE_URL is correct
- Check Neon database is active

### Frontend Issues

**"CORS error in browser"**
- Make sure you updated FRONTEND_URL on AWS
- Check CORS config in server/app.ts

**"Can't connect to API"**
- Verify VITE_API_URL in .env.production
- Check AWS backend is running: `eb status`

---

## 💰 Costs

All services have generous free tiers:

- **Firebase**: 10GB storage, 360MB/day transfer - **FREE**
- **AWS EB**: 750 hours/month t2.micro (12 months) - **FREE**
- **Neon DB**: 0.5GB storage, 3 projects - **FREE**

**Estimated total**: **$0/month** within free tiers! 🎉

---

## 🔒 Security Checklist

- [ ] Use strong SESSION_SECRET (32+ random characters)
- [ ] Never commit .env files
- [ ] Enable HTTPS (auto on Firebase, configure on AWS)
- [ ] Set up CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates: `npm audit fix`

---

## 📚 Documentation Reference

- **Quick Start**: See `QUICK_DEPLOY.md`
- **Detailed Steps**: See `DEPLOYMENT_STEPS.md`
- **Status**: See `DEPLOYMENT_READY.md`

---

## 🎯 Next Steps - Choose Your Path

### Path 1: Full CLI Deployment (Automated)
1. Install AWS EB CLI: `pip install awsebcli --upgrade --user`
2. Run: `.\deploy-aws.ps1`
3. Update `.env.production`
4. Run: `.\deploy-firebase.ps1`

### Path 2: AWS Console + Firebase CLI
1. Deploy backend via AWS Console (App Runner or EB)
2. Update `.env.production` with backend URL
3. Run: `.\deploy-firebase.ps1`

### Path 3: Manual Everything
Follow step-by-step in `DEPLOYMENT_STEPS.md`

---

## ✨ Summary

**What's Ready:**
- ✅ Firebase project configured
- ✅ All deployment files created
- ✅ CORS configured for cross-origin requests
- ✅ Environment config set up
- ✅ Automated scripts ready

**What You Need:**
- Install AWS EB CLI (or use AWS Console)
- Your environment variables ready
- 15 minutes of time

**Result:**
- Frontend live on Firebase
- Backend live on AWS
- Full-stack app deployed! 🚀

---

## 🚀 START HERE

**Recommended first step:**

```powershell
# Install AWS EB CLI
pip install awsebcli --upgrade --user

# Then deploy backend
.\deploy-aws.ps1
```

Good luck with your deployment! 🎉
