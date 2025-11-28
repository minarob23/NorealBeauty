# Email Configuration Guide

This guide will help you set up email sending for user verification and password reset functionality.

## Quick Start

The application now sends emails instead of just displaying verification links. You need to configure your email credentials in the `.env` file.

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2-Step Verification

### Step 2: Create an App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Select **Mail** for the app
4. Select **Other (Custom name)** for the device
5. Enter a name like "Noreal Beauty App"
6. Click **Generate**
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Open your `.env` file and update these lines:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
BASE_URL=http://localhost:5000
```

**Important:** 
- Use your full Gmail address for `EMAIL_USER`
- Use the 16-character App Password (remove spaces) for `EMAIL_PASSWORD`
- Never commit your `.env` file to version control

## Testing Email Sending

1. **Restart your server** after updating the `.env` file:
   ```powershell
   Stop-Process -Name node -Force
   npm run dev
   ```

2. **Test registration**:
   - Create a new account with your email address
   - Check your inbox for the verification email
   - Click the verification link

3. **Test password reset**:
   - Go to Forgot Password page
   - Enter your email
   - Check inbox for reset email
   - Click the reset link

## Email Templates

The application sends two types of emails:

### 1. Verification Email
- Subject: "Verify Your Email - Noreal Beauty"
- Contains a verification link valid for 24 hours
- Sent when:
  - User registers with email/password
  - User signs up with Google OAuth

### 2. Password Reset Email
- Subject: "Reset Your Password - Noreal Beauty"
- Contains a reset link valid for 1 hour
- Sent when user requests password reset

## Production Email Services

For production, consider using professional email services instead of Gmail:

### SendGrid
- Free tier: 100 emails/day
- Website: https://sendgrid.com/
- Update `server/email.ts` to use SendGrid API

### Mailgun
- Free tier: 5,000 emails/month for 3 months
- Website: https://www.mailgun.com/
- Update `server/email.ts` to use Mailgun API

### AWS SES
- Pay as you go: $0.10 per 1,000 emails
- Website: https://aws.amazon.com/ses/
- Update `server/email.ts` to use AWS SES

## Troubleshooting

### Emails not sending?

1. **Check your .env file**:
   - Make sure EMAIL_USER and EMAIL_PASSWORD are set correctly
   - Verify there are no extra spaces

2. **Check server console**:
   - Look for error messages like "Failed to send verification email"
   - Common errors:
     - "Invalid login" → Wrong email or password
     - "Connection refused" → Gmail blocking access

3. **Gmail security**:
   - Make sure 2-Step Verification is enabled
   - Use App Password, not your regular password
   - Check if Google blocked the sign-in attempt

4. **Test with a simple script**:
   ```javascript
   // test-email.ts
   import "dotenv/config";
   import { sendVerificationEmail } from "./server/email";
   
   sendVerificationEmail("test@example.com", "test-token-123")
     .then(() => console.log("✅ Email sent!"))
     .catch((err) => console.error("❌ Error:", err));
   ```

### Emails going to spam?

1. Check your spam/junk folder
2. Mark emails from your app as "Not Spam"
3. For production, set up SPF, DKIM, and DMARC records

## Security Best Practices

✅ **DO:**
- Use App Passwords for Gmail
- Keep `.env` file in `.gitignore`
- Use environment variables for sensitive data
- Use professional email service in production
- Set up proper email authentication (SPF, DKIM, DMARC)

❌ **DON'T:**
- Commit email credentials to Git
- Use your personal Gmail password
- Send emails without rate limiting in production
- Expose email credentials in client-side code

## Email Workflow

### Registration Flow (Email/Password)
1. User fills registration form
2. Server creates user account (emailVerified: false)
3. Server generates verification token
4. **Email sent** with verification link
5. User clicks link in email
6. Email marked as verified
7. User can now log in

### Registration Flow (Google OAuth)
1. User clicks "Continue with Google"
2. Google authenticates user
3. Server creates account (emailVerified: false)
4. Server generates verification token
5. **Email sent** with verification link
6. User redirected to login page
7. User clicks link in email
8. Email marked as verified
9. User can now log in

### Password Reset Flow
1. User clicks "Forgot Password"
2. User enters email
3. Server generates reset token (1 hour expiry)
4. **Email sent** with reset link
5. User clicks link in email
6. User enters new password
7. Password updated, reset token cleared

## Next Steps

1. Configure your Gmail App Password in `.env`
2. Restart the server
3. Test the email flows
4. For production, migrate to a professional email service
5. Consider adding email templates customization
6. Monitor email delivery rates and bounce rates

## Support

If you encounter issues:
1. Check the server console logs
2. Verify your `.env` configuration
3. Test with a different email provider
4. Check Gmail's App Password documentation
