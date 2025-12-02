# AWS App Runner Deployment (Backend Only)

## Quick Setup - No CLI Needed!

### Step 1: Create Docker Image Source

Since AWS App Runner needs a container, we'll use GitHub Actions to build and push to ECR, OR use App Runner's auto-build from source.

### Option A: Deploy from Source (Easiest)

1. **Go to AWS App Runner:**
   - Visit: https://console.aws.amazon.com/apprunner/
   - Click "Create service"

2. **Source Configuration:**
   - **Repository type:** Source code repository
   - **Connect to GitHub** → Authorize AWS
   - **Repository:** NorealBeauty
   - **Branch:** main
   - **Deployment trigger:** Automatic

3. **Build Settings:**
   - **Runtime:** Node.js 18
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Port:** 5000

4. **Service Settings:**
   - **Service name:** norealbeauty-backend
   - **vCPU:** 1 vCPU
   - **Memory:** 2 GB
   - **Environment variables:**
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=<your_neon_url>
     SESSION_SECRET=<your_secret>
     GOOGLE_CLIENT_ID=<your_client_id>
     GOOGLE_CLIENT_SECRET=<your_client_secret>
     ```

5. **Auto Scaling:**
   - Min instances: 1
   - Max instances: 1 (free tier)

6. **Click "Create & Deploy"**

### Result:

Your backend will be at: `https://xxxxx.us-east-1.awsapprunner.com`

**Free Tier:**
- 2000 build minutes/month
- 100GB egress/month
- Pay only ~$5/month after free tier

---

## Your Final Setup:

- **Frontend:** https://norealbeauty.web.app (Firebase - Already deployed ✅)
- **Backend:** https://xxxxx.us-east-1.awsapprunner.com (AWS App Runner)
- **Database:** Neon PostgreSQL (Already configured ✅)

Once deployed, test with:
```
https://your-app-runner-url.awsapprunner.com/_health
https://your-app-runner-url.awsapprunner.com/api/blog-posts
```

Then your Firebase frontend will automatically fetch data from AWS backend!
