# Quick Firebase Deployment Steps

## 1. Login to Firebase
```powershell
firebase login
```

## 2. Create Firebase Project
- Go to https://console.firebase.google.com/
- Create a new project named "noreal-beauty" (or your preferred name)
- Enable Blaze (Pay as you go) plan for Cloud Functions
- Note your project ID

## 3. Update Project ID
Edit `.firebaserc` and replace `noreal-beauty` with your actual project ID.

## 4. Create .env file in functions directory
Copy your current `.env` file to the functions directory:
```powershell
Copy-Item .env functions\.env
```

## 5. Build the Project
```powershell
npm run build:firebase
```

## 6. Deploy to Firebase
```powershell
firebase deploy
```

That's it! Your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## Important Notes

1. **Environment Variables**: Copy your `.env` file to the `functions` directory before building
2. **Database**: Make sure your Neon database URL is correct in the functions `.env` file
3. **First Deploy**: May take 5-10 minutes
4. **Logs**: View with `firebase functions:log`

## Update Deployment
```powershell
npm run deploy:firebase
```

## Deploy Only Frontend
```powershell
firebase deploy --only hosting
```

## Deploy Only Backend
```powershell
firebase deploy --only functions
```
