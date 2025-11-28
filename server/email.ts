import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.BASE_URL || "http://localhost:5000"}/verify-email/${verificationToken}`;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Noreal Beauty" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email - Noreal Beauty',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Inter:wght@300;400;500&display=swap');
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background-color: #fafaf9;
              -webkit-font-smoothing: antialiased;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              padding: 48px 32px 32px;
              text-align: center;
              border-bottom: 1px solid #f5f5f4;
            }
            .logo {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 32px;
              font-weight: 300;
              letter-spacing: 2px;
              color: #1c1917;
              margin: 0;
              text-transform: uppercase;
            }
            .content {
              padding: 48px 32px;
            }
            .greeting {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 24px;
              font-weight: 300;
              color: #1c1917;
              margin: 0 0 24px 0;
              line-height: 1.4;
            }
            .text {
              font-size: 15px;
              line-height: 1.6;
              color: #57534e;
              margin: 0 0 24px 0;
            }
            .button-wrapper {
              text-align: center;
              margin: 40px 0;
            }
            .button {
              display: inline-block;
              padding: 16px 48px;
              background-color: #1c1917;
              color: #ffffff !important;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              letter-spacing: 1px;
              text-transform: uppercase;
              border-radius: 2px;
              transition: background-color 0.2s;
            }
            .button:hover {
              background-color: #292524;
              color: #ffffff !important;
            }
            .divider {
              margin: 32px 0;
              text-align: center;
              color: #a8a29e;
              font-size: 13px;
              font-weight: 300;
            }
            .link {
              font-size: 13px;
              color: #57534e;
              word-break: break-all;
              text-decoration: none;
              border: 1px solid #e7e5e4;
              padding: 16px;
              display: block;
              border-radius: 2px;
              background-color: #fafaf9;
            }
            .footer {
              padding: 32px;
              border-top: 1px solid #f5f5f4;
              text-align: center;
            }
            .footer-text {
              font-size: 12px;
              color: #a8a29e;
              line-height: 1.6;
              margin: 8px 0;
            }
            .social-links {
              margin: 24px 0 16px;
            }
            .social-link {
              display: inline-block;
              margin: 0 8px;
              color: #78716c;
              text-decoration: none;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .expiry-note {
              background-color: #fef3c7;
              border-left: 3px solid #fbbf24;
              padding: 16px;
              margin: 24px 0;
              font-size: 13px;
              color: #78350f;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1 class="logo">NORÉAL</h1>
            </div>
            
            <div class="content">
              <h2 class="greeting">Welcome to Noréal Beauty</h2>
              
              <p class="text">
                Thank you for joining our community of beauty enthusiasts. We're delighted to have you here.
              </p>
              
              <p class="text">
                To complete your registration and start exploring our curated collection of luxury skincare, 
                please verify your email address by clicking the button below:
              </p>
              
              <div class="button-wrapper">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <div class="divider">— OR —</div>
              
              <a href="${verificationUrl}" class="link">${verificationUrl}</a>
              
              <div class="expiry-note">
                <strong>⏱ Security Notice:</strong> This verification link will expire in 24 hours. 
                If you didn't create an account with Noréal, please disregard this email.
              </div>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#" class="social-link">Instagram</a>
                <span style="color: #d6d3d1;">•</span>
                <a href="#" class="social-link">Pinterest</a>
                <span style="color: #d6d3d1;">•</span>
                <a href="#" class="social-link">Support</a>
              </div>
              
              <p class="footer-text">
                NORÉAL Beauty<br>
                Clean formulas • Sustainable • Dermatologist-tested
              </p>
              
              <p class="footer-text">
                &copy; ${new Date().getFullYear()} Noréal. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', to);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.BASE_URL || "http://localhost:5000"}/reset-password/${resetToken}`;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Noreal Beauty" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password - Noreal Beauty',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Inter:wght@300;400;500&display=swap');
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background-color: #fafaf9;
              -webkit-font-smoothing: antialiased;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              padding: 48px 32px 32px;
              text-align: center;
              border-bottom: 1px solid #f5f5f4;
            }
            .logo {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 32px;
              font-weight: 300;
              letter-spacing: 2px;
              color: #1c1917;
              margin: 0;
              text-transform: uppercase;
            }
            .content {
              padding: 48px 32px;
            }
            .greeting {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 24px;
              font-weight: 300;
              color: #1c1917;
              margin: 0 0 24px 0;
              line-height: 1.4;
            }
            .text {
              font-size: 15px;
              line-height: 1.6;
              color: #57534e;
              margin: 0 0 24px 0;
            }
            .button-wrapper {
              text-align: center;
              margin: 40px 0;
            }
            .button {
              display: inline-block;
              padding: 16px 48px;
              background-color: #1c1917;
              color: #ffffff !important;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              letter-spacing: 1px;
              text-transform: uppercase;
              border-radius: 2px;
              transition: background-color 0.2s;
            }
            .button:hover {
              background-color: #292524;
              color: #ffffff !important;
            }
            .divider {
              margin: 32px 0;
              text-align: center;
              color: #a8a29e;
              font-size: 13px;
              font-weight: 300;
            }
            .link {
              font-size: 13px;
              color: #57534e;
              word-break: break-all;
              text-decoration: none;
              border: 1px solid #e7e5e4;
              padding: 16px;
              display: block;
              border-radius: 2px;
              background-color: #fafaf9;
            }
            .footer {
              padding: 32px;
              border-top: 1px solid #f5f5f4;
              text-align: center;
            }
            .footer-text {
              font-size: 12px;
              color: #a8a29e;
              line-height: 1.6;
              margin: 8px 0;
            }
            .social-links {
              margin: 24px 0 16px;
            }
            .social-link {
              display: inline-block;
              margin: 0 8px;
              color: #78716c;
              text-decoration: none;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .security-warning {
              background-color: #fef3c7;
              border-left: 3px solid #fbbf24;
              padding: 16px;
              margin: 24px 0;
              font-size: 13px;
              color: #78350f;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1 class="logo">NORÉAL</h1>
            </div>
            
            <div class="content">
              <h2 class="greeting">Password Reset Request</h2>
              
              <p class="text">
                We received a request to reset the password for your Noréal Beauty account.
              </p>
              
              <p class="text">
                If you made this request, click the button below to create a new password. 
                This link is valid for 1 hour only.
              </p>
              
              <div class="button-wrapper">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="divider">— OR —</div>
              
              <a href="${resetUrl}" class="link">${resetUrl}</a>
              
              <div class="security-warning">
                <strong>🔒 Security Notice:</strong> This password reset link will expire in 1 hour. 
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </div>
              
              <p class="text" style="margin-top: 32px;">
                For your security, never share this link with anyone. If you have concerns about your account security, 
                please contact our support team immediately.
              </p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#" class="social-link">Instagram</a>
                <span style="color: #d6d3d1;">•</span>
                <a href="#" class="social-link">Pinterest</a>
                <span style="color: #d6d3d1;">•</span>
                <a href="#" class="social-link">Support</a>
              </div>
              
              <p class="footer-text">
                NORÉAL Beauty<br>
                Clean formulas • Sustainable • Dermatologist-tested
              </p>
              
              <p class="footer-text">
                &copy; ${new Date().getFullYear()} Noréal. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', to);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
