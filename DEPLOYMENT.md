# Noréal Beauty - Deployment Guide

## 🚀 Deploy to Railway

### Prerequisites
1. GitHub account with this repository
2. Railway account (https://railway.app)
3. Neon database already set up

### Deployment Steps

#### 1. Create New Project on Railway
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `NorealBeauty` repository
5. Click "Deploy Now"

#### 2. Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
DATABASE_URL=postgresql://neondb_owner:npg_dejhM58OInuA@ep-still-pond-adjhabl8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SESSION_SECRET=3b342e7c584fec9699563aa0304aaa757a139abd5818974c28273418663b507d
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NODE_ENV=production
PORT=3000
```

#### 3. Set Up Domain (Optional)
1. In Railway dashboard, go to Settings
2. Click "Generate Domain" for a free Railway domain
3. Or add your custom domain

#### 4. Verify Deployment
1. Wait for build to complete (3-5 minutes)
2. Click on the generated domain
3. Website should be live!

#### 5. Create Owner Account
After deployment, run this command in Railway terminal or locally:

```bash
npm run create-owner noreen@norealbeauty.com NorealOwner2024! "Noreen Nageh"
```

### 🔧 Post-Deployment

#### Database Migration (Automatic)
The build process automatically:
- Pushes database schema (`db:push`)
- Seeds products (`db:migrate-products`)

If you need to run manually:
```bash
npm run db:push
npm run db:migrate-products
```

#### Update Environment Variables
If you need to update variables later:
1. Go to Railway dashboard
2. Click on your project
3. Go to Variables tab
4. Update values
5. Deployment will automatically restart

### 📱 Features Included

✅ E-commerce product catalog (12 products)
✅ User authentication (Google OAuth + Local)
✅ Shopping cart with subscriptions
✅ WhatsApp checkout integration
✅ Admin dashboard with analytics
✅ Order management system
✅ Blog management
✅ User management
✅ Product management (CRUD)
✅ Real-time analytics dashboard

### 🔐 Admin Access

**Owner Account:**
- Email: noreen@norealbeauty.com
- Password: NorealOwner2024!
- Access: Full admin + owner privileges

**Admin Dashboard URL:**
`https://your-domain.railway.app/admin`

### 📊 Analytics Dashboard URL
`https://your-domain.railway.app/admin/products-analytics`

### 🛠️ Troubleshooting

**Build Fails:**
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Ensure all environment variables are set

**Database Connection Issues:**
- Verify Neon database is active
- Check DATABASE_URL format
- Ensure SSL mode is enabled

**Products Not Showing:**
```bash
npm run db:migrate-products
```

**Orders Not Saving:**
- Check database connection
- Verify orders table exists
- Run `npm run db:push`

### 🔄 Updates

To update the live site:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update message"
   git push
   ```
3. Railway automatically rebuilds and deploys

### 📞 Support

For issues:
1. Check Railway build logs
2. Check browser console for errors
3. Verify all environment variables
4. Check Neon database status

---

**Production URL:** Will be provided after deployment
**Admin Panel:** `/admin`
**Analytics:** `/admin/products-analytics`
