# Quick Deployment Guide
## Deploy Frontend (Firebase) + Backend (AWS) in 15 Minutes

Follow these steps to deploy your NoReal Beauty application.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed
- [ ] **Firebase account** (free at [firebase.google.com](https://firebase.google.com))
- [ ] **AWS account** (free tier at [aws.amazon.com](https://aws.amazon.com))
- [ ] **Neon Database** connection string (from [neon.tech](https://neon.tech))
- [ ] **Resend API key** (optional, for emails - from [resend.com](https://resend.com))

---

## Part 1: Deploy Backend to AWS (10 minutes)

### Step 1: Install AWS EB CLI
```powershell
pip install awsebcli --upgrade --user
```

### Step 2: Run the Deployment Script
```powershell
.\deploy-aws.ps1
```

The script will:
1. Initialize AWS Elastic Beanstalk
2. Ask for your environment variables
3. Build the backend
4. Deploy to AWS
5. Give you the backend URL

**Save your backend URL!** You'll need it for Step 3.

Example: `http://norealbeauty-api-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com`

---

## Part 2: Update Frontend Configuration (2 minutes)

### Update `.env.production` with your AWS backend URL:

```powershell
# Edit .env.production
notepad .env.production
```

Replace the URL with your actual AWS backend URL:
```env
VITE_API_URL=http://norealbeauty-api-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com
NODE_ENV=production
```

---

## Part 3: Deploy Frontend to Firebase (3 minutes)

### Run the Firebase Deployment Script
```powershell
.\deploy-firebase.ps1
```

The script will:
1. Check Firebase login
2. Build the frontend
3. Deploy to Firebase Hosting
4. Give you the frontend URL

**Your app is now live!** 🎉

---

## Alternative: Manual Deployment

### Backend (AWS)

```powershell
# 1. Initialize EB
eb init

# 2. Create environment
eb create norealbeauty-api-env --single

# 3. Set environment variables
eb setenv `
  DATABASE_URL="your_neon_database_url" `
  SESSION_SECRET="your_session_secret" `
  NODE_ENV="production"

# 4. Build and deploy
npm run build
eb deploy

# 5. Get backend URL
eb status
```

### Frontend (Firebase)

```powershell
# 1. Login to Firebase
firebase login

# 2. Update .env.production with backend URL

# 3. Build frontend
npm run build

# 4. Deploy to Firebase
firebase deploy --only hosting
```

---

## Environment Variables Reference

### Required for Backend (AWS):
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `SESSION_SECRET` - Random string (min 32 characters)
- `NODE_ENV` - Set to "production"

### Optional for Backend:
- `RESEND_API_KEY` - For email functionality
- `FROM_EMAIL` - Email sender address
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `FRONTEND_URL` - Your Firebase hosting URL (for CORS)

### Required for Frontend:
- `VITE_API_URL` - Your AWS backend URL

---

## Post-Deployment Checklist

After deployment:

1. [ ] Test the frontend at your Firebase URL
2. [ ] Try creating an account
3. [ ] Test login functionality
4. [ ] Browse products
5. [ ] Add items to cart
6. [ ] Test admin panel (create owner first)

---

## Create Admin/Owner Account

To create an owner account, SSH into your AWS instance or use local terminal:

```powershell
# Set environment variable
$env:DATABASE_URL = "your_neon_database_url"

# Create owner account
npm run create-owner

# Or create admin account
npm run create-admin
```

---

## Useful Commands

### AWS Backend
```powershell
eb status          # Check deployment status
eb logs            # View application logs
eb open            # Open backend in browser
eb deploy          # Deploy updates
eb terminate       # Delete environment (cleanup)
```

### Firebase Frontend
```powershell
firebase deploy --only hosting    # Deploy frontend
firebase hosting:channel:list     # List channels
firebase projects:list            # List projects
```

---

## Monitoring & Debugging

### Check Backend Health
```powershell
# Test backend health endpoint
curl http://your-backend-url/_health
```

### View Backend Logs
```powershell
eb logs --all
```

### View Firebase Logs
Check Firebase Console → Hosting → Activity log

---

## Updating Your Deployment

### Update Backend
```powershell
# Make changes to code
# Then redeploy
npm run build
eb deploy
```

### Update Frontend
```powershell
# Make changes to code
# Then rebuild and redeploy
npm run build
firebase deploy --only hosting
```

---

## Cost Breakdown

### AWS (Backend)
- **Free Tier**: 750 hours/month of t2.micro for 12 months
- **After Free Tier**: ~$10-15/month for t2.micro
- **Storage**: 5GB free

### Firebase (Frontend)
- **Free Tier**: 10GB storage, 360MB/day transfer
- **Spark Plan**: $0/month for small apps
- **Blaze Plan**: Pay-as-you-go (only if you exceed free tier)

### Neon (Database)
- **Free Tier**: 0.5 GiB storage, 3 projects
- **Pro**: $19/month for more storage

**Total Estimated Cost**: $0/month (within free tiers)

---

## Troubleshooting

### Backend Issues

**Error: "Connection refused"**
- Check AWS security groups
- Verify port 5000 is exposed

**Error: "Database connection failed"**
- Verify DATABASE_URL is correct
- Check Neon database is active

**Error: "502 Bad Gateway"**
- Check application logs: `eb logs`
- Verify build was successful

### Frontend Issues

**Error: "CORS error"**
- Add FRONTEND_URL to backend env vars
- Update CORS configuration in server/app.ts

**Error: "404 Not Found"**
- Verify rewrites in firebase.json
- Check build output in dist/public

**Error: "Blank page"**
- Check browser console for errors
- Verify VITE_API_URL in .env.production

---

## Security Best Practices

1. **Never commit .env files** to git
2. **Use strong SESSION_SECRET** (min 32 random characters)
3. **Enable HTTPS** (automatic on Firebase, configure on AWS)
4. **Set up rate limiting** on backend
5. **Regular security updates** (`npm audit fix`)

---

## Next Steps

- [ ] Configure custom domain on Firebase
- [ ] Set up SSL certificate on AWS
- [ ] Configure email service (Resend)
- [ ] Set up Google OAuth
- [ ] Configure monitoring and alerts
- [ ] Set up automated backups
- [ ] Configure CI/CD with GitHub Actions

---

## Support

If you encounter issues:
1. Check the logs (`eb logs` for backend)
2. Review Firebase Console for frontend errors
3. Verify all environment variables are set
4. Check DEPLOYMENT_STEPS.md for detailed info

---

**Deployment Complete! Your app is live! 🚀**

Visit your Firebase URL to see it in action!
