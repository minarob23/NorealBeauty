# AWS Elastic Beanstalk Deployment Guide

## Prerequisites

1. **AWS Account** - Sign up at https://aws.amazon.com (Free tier includes 750 hours/month)
2. **EB CLI** - We'll install this

## Step 1: Install EB CLI

```powershell
# Install using pip
pip install awsebcli --upgrade --user
```

Or download installer from: https://github.com/aws/aws-elastic-beanstalk-cli-setup

## Step 2: Configure AWS Credentials

1. **Get AWS Access Keys:**
   - Go to https://console.aws.amazon.com/iam/
   - Click "Users" → Your username → "Security credentials"
   - Click "Create access key"
   - Download the credentials

2. **Configure EB CLI:**
```powershell
eb init
```

Follow prompts:
- Region: `us-east-1` (or your preferred region)
- Application name: `norealbeauty`
- Platform: `Node.js`
- Version: `18`
- Set up SSH: `No`

## Step 3: Create Environment and Deploy

```powershell
# Create environment and deploy
eb create norealbeauty-env --single

# This will:
# - Create EC2 instance (t2.micro - free tier)
# - Deploy your application
# - Set up load balancer
# - Configure health checks
```

## Step 4: Set Environment Variables

```powershell
eb setenv DATABASE_URL="your_neon_database_url" `
  SESSION_SECRET="your_session_secret" `
  GOOGLE_CLIENT_ID="your_google_client_id" `
  GOOGLE_CLIENT_SECRET="your_google_client_secret" `
  NODE_ENV="production"
```

## Step 5: Open Your Application

```powershell
eb open
```

Your backend will be live at: `http://norealbeauty-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com`

## Alternative: Use AWS Amplify (Easier, No CLI needed)

### Deploy via AWS Console:

1. **Go to AWS Amplify:**
   - Visit: https://console.aws.amazon.com/amplify/
   - Click "Get Started" under "Amplify Hosting"

2. **Connect Repository:**
   - Choose "GitHub"
   - Authorize AWS
   - Select `NorealBeauty` repository
   - Branch: `main`

3. **Configure Build Settings:**
   ```yaml
   version: 1
   backend:
     phases:
       build:
         commands:
           - npm ci
           - npm run build
   artifacts:
     baseDirectory: dist
     files:
       - '**/*'
   ```

4. **Add Environment Variables:**
   - DATABASE_URL
   - SESSION_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NODE_ENV=production

5. **Deploy!**

## Update Frontend to Use AWS Backend

Once deployed, update your Firebase hosting to point to AWS:

Your backend URL will be:
- EB: `http://norealbeauty-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com`
- Amplify: `https://main.xxxxxx.amplifyapp.com`

## Cost: 100% FREE

AWS Free Tier includes:
- ✅ 750 hours/month of t2.micro EC2 instance (12 months)
- ✅ 5GB of storage
- ✅ 15GB data transfer out
- ✅ Load balancer included

## Recommended: AWS Amplify

Simplest option - no CLI needed, deploy directly from GitHub in 5 minutes!

1. Visit: https://console.aws.amazon.com/amplify/
2. Connect GitHub
3. Select NorealBeauty repo
4. Add environment variables
5. Deploy!

---

**Next Steps:** Choose either EB CLI or AWS Amplify. I recommend Amplify for simplicity.
