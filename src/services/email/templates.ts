export const emailTemplates = {
  welcome: (userName: string, companyName?: string) => ({
    subject: `Welcome to OPSIGHT, ${userName}! 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to OPSIGHT</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
          .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Welcome to OPSIGHT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Operational Insight Platform</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a8a; margin-top: 0;">Welcome aboard, ${userName}! 🎉</h2>
            
            <p>Thank you for choosing OPSIGHT. You're now part of a community of professionals who are transforming their operational insights and driving better business outcomes.</p>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #1e3a8a;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Complete your profile setup</li>
                <li>Connect your data sources</li>
                <li>Schedule your onboarding call</li>
                <li>Explore the platform features</li>
              </ul>
            </div>
            
            <p><strong>Your account is now active and ready to use!</strong></p>
            
            <div style="text-align: center;">
              <a href="https://opsight.live/dashboard" class="button">Access Your Dashboard</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Need help getting started?</strong><br>
              Our team is here to support you every step of the way. 
              <a href="https://calendly.com/opsightlive" style="color: #3b82f6;">Schedule a call</a> or reach out to us at support@opsight.live
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 OPSIGHT. All rights reserved.</p>
            <p>This email was sent to you because you created an account with OPSIGHT.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  emailVerification: (userName: string, verificationUrl: string) => ({
    subject: 'Verify your OPSIGHT account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your OPSIGHT Account</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
          .warning { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Verify Your Account</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">OPSIGHT Security Verification</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a8a; margin-top: 0;">Hi ${userName},</h2>
            
            <p>Thank you for creating your OPSIGHT account! To complete your registration and access your dashboard, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <p style="margin: 0;"><strong>Security Notice:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 OPSIGHT. All rights reserved.</p>
            <p>This email was sent to verify your OPSIGHT account registration.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  onboardingReminder: (userName: string, companyName?: string) => ({
    subject: `Complete your OPSIGHT setup, ${userName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your OPSIGHT Setup</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
          .step { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Complete Your Setup</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Get the most out of OPSIGHT</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a8a; margin-top: 0;">Hi ${userName},</h2>
            
            <p>Great to see you've joined OPSIGHT! To unlock the full potential of our platform, let's complete your setup process.</p>
            
            <div class="step">
              <h3 style="margin: 0; color: #1e3a8a;">Step 1: Complete Your Profile</h3>
              <p style="margin: 5px 0 0 0;">Add your company information and preferences</p>
            </div>
            
            <div class="step">
              <h3 style="margin: 0; color: #1e3a8a;">Step 2: Connect Data Sources</h3>
              <p style="margin: 5px 0 0 0;">Integrate your existing systems and data</p>
            </div>
            
            <div class="step">
              <h3 style="margin: 0; color: #1e3a8a;">Step 3: Schedule Onboarding</h3>
              <p style="margin: 5px 0 0 0;">Get personalized training from our experts</p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://opsight.live/dashboard" class="button">Complete Setup</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Need assistance?</strong> Our team is ready to help you get started.<br>
              <a href="https://calendly.com/opsightlive" style="color: #3b82f6;">Schedule your onboarding call</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 OPSIGHT. All rights reserved.</p>
            <p>This email was sent to help you complete your OPSIGHT setup.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};
