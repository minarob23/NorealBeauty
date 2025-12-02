# Complete Deployment Guide
## Frontend on Firebase Hosting | Backend on AWS

This guide provides step-by-step instructions to deploy your NoReal Beauty application with the frontend on Firebase Hosting and the backend on AWS.

---

## 🎯 Deployment Architecture

- **Frontend**: Firebase Hosting (React/Vite SPA)
- **Backend**: AWS Elastic Beanstalk or AWS App Runner (Express API)
- **Database**: Neon PostgreSQL (serverless)

---

## Part 1: Deploy Backend to AWS

### Option A: AWS Elastic Beanstalk (Recommended)

#### Prerequisites
1. **Install AWS EB CLI**
   ```powershell
   pip install awsebcli --upgrade --user
   ```

2. **Get AWS Credentials**
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Create access key
   - Save Access Key ID and Secret Access Key

#### Step 1: Initialize EB
```powershell
eb init

# Follow prompts:
# - Region: us-east-1 (or your preference)
# - Application name: norealbeauty-api
# - Platform: Docker
# - Version: latest
# - SSH: No
```

#### Step 2: Create Environment
```powershell
eb create norealbeauty-api-env --single
```

This creates a t2.micro instance (free tier eligible).

#### Step 3: Set Environment Variables
```powershell
eb setenv `
  DATABASE_URL="your_neon_database_url" `
  SESSION_SECRET="your_session_secret_here_min_32_chars" `
  RESEND_API_KEY="your_resend_api_key" `
  FROM_EMAIL="noreply@yourdomain.com" `
  NODE_ENV="production" `
  GOOGLE_CLIENT_ID="your_google_client_id" `
  GOOGLE_CLIENT_SECRET="your_google_client_secret" `
  GOOGLE_CALLBACK_URL="https://your-backend-url.elasticbeanstalk.com/api/auth/google/callback"
```

#### Step 4: Deploy
```powershell
eb deploy
```

#### Step 5: Get Backend URL
```powershell
eb status
```

Your backend URL: `http://norealbeauty-api-env.eba-XXXXXXXX.us-east-1.elasticbeanstalk.com`

---

### Option B: AWS App Runner (Alternative - Easier)

#### Via AWS Console:
1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click "Create service"
3. Source: "Container registry" → "Amazon ECR Public" or connect GitHub
4. If using GitHub:
   - Connect your repository
   - Select branch: `main`
   - Build settings: Auto-detected (Dockerfile)
5. Configure service:
   - Port: 5000
   - Environment variables (add all from above)
6. Create & Deploy

---

## Part 2: Deploy Frontend to Firebase

### Step 1: Login to Firebase
```powershell
firebase login
```

### Step 2: Update Firebase Project ID
Make sure `.firebaserc` has your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### Step 3: Update Firebase Config for AWS Backend

Create a `.env.production` file for the frontend build:
```env
VITE_API_URL=https://your-backend-url.elasticbeanstalk.com
```

### Step 4: Update `firebase.json` to Proxy API Calls

The current firebase.json is configured to use Firebase Functions. We need to update it to proxy to AWS:

```json
{
  "hosting": {
    "public": "dist/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": {
          "url": "https://your-backend-url.elasticbeanstalk.com/api",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Note**: Firebase Hosting doesn't support external proxy rewrites directly. We have two options:

#### Option 1: Use Firebase Cloud Functions as Proxy (Recommended)
Create a simple proxy function that forwards requests to AWS.

#### Option 2: Update Frontend to Use Full Backend URL
Update the API calls to use environment variable for backend URL.

### Step 5: Build the Frontend
```powershell
npm run build
```

### Step 6: Deploy to Firebase
```powershell
firebase deploy --only hosting
```

Your frontend will be live at: `https://your-project-id.web.app`

---

## Part 3: Connect Frontend to Backend

Since Firebase Hosting doesn't natively proxy to external services, we'll update the frontend to use the AWS backend URL directly.

### Create Environment Configuration

1. **Create `client/src/config.ts`**:
```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '',
};
```

2. **Update `queryClient.ts`** to use the API URL prefix

3. **Create `.env.production`**:
```env
VITE_API_URL=https://your-backend-url.elasticbeanstalk.com
```

---

## Part 4: Final Configuration

### Update CORS on Backend

Make sure your backend allows requests from your Firebase domain:

```typescript
// In server/app.ts or similar
app.use(cors({
  origin: [
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com',
    'http://localhost:5173' // for local dev
  ],
  credentials: true
}));
```

### Update Google OAuth Callback

If using Google OAuth, update the callback URL in Google Console:
- Authorized redirect URIs: 
  - `https://your-backend-url.elasticbeanstalk.com/api/auth/google/callback`

---

## Testing the Deployment

1. **Test Backend Health**:
   ```powershell
   curl https://your-backend-url.elasticbeanstalk.com/_health
   ```

2. **Test Frontend**:
   - Visit `https://your-project-id.web.app`
   - Try login/signup
   - Test product browsing

---

## Monitoring & Logs

### AWS Elastic Beanstalk
```powershell
# View logs
eb logs

# Check health
eb health

# SSH into instance (if enabled)
eb ssh
```

### Firebase Hosting
```powershell
# View hosting activity
firebase hosting:channel:list
```

---

## Updating After Deployment

### Update Backend
```powershell
# Make changes to code
# Then deploy
eb deploy
```

### Update Frontend
```powershell
# Make changes to code
npm run build
firebase deploy --only hosting
```

---

## Cost Estimate

### AWS Free Tier (12 months)
- ✅ 750 hours/month t2.micro EC2 instance
- ✅ 5GB storage
- ✅ 15GB data transfer
- **Estimated cost**: $0/month (within free tier)

### Firebase Free Tier (Forever)
- ✅ 10GB storage
- ✅ 360MB/day transfer
- **Estimated cost**: $0/month (for small to medium traffic)

### Neon Database
- ✅ Free tier: 0.5 GiB storage, 3 projects
- **Estimated cost**: $0/month

**Total**: $0/month (assuming free tier usage)

---

## Troubleshooting

### Backend Issues
- **Connection refused**: Check security groups in AWS console
- **Database connection**: Verify DATABASE_URL is correct
- **502 errors**: Check application logs with `eb logs`

### Frontend Issues
- **API calls failing**: Check CORS configuration on backend
- **404 errors**: Verify rewrites in firebase.json
- **Blank page**: Check browser console for errors

---

## Next Steps

1. ✅ Set up custom domain on Firebase Hosting
2. ✅ Configure SSL certificate on AWS (automatic with EB)
3. ✅ Set up monitoring and alerts
4. ✅ Configure CDN caching rules
5. ✅ Set up CI/CD pipeline with GitHub Actions

---

**Deployment Complete! 🎉**
