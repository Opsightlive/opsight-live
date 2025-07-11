import { supabase } from '@/integrations/supabase/client';
import { emailTemplates } from './templates';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Use Supabase Edge Functions for email sending
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          from: emailData.from || 'noreply@opsight.live'
        }
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    const template = emailTemplates.welcome(userName, companyName);
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendVerificationEmail(userEmail: string, userName: string, verificationUrl: string): Promise<boolean> {
    const template = emailTemplates.emailVerification(userName, verificationUrl);
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendOnboardingReminder(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    const template = emailTemplates.onboardingReminder(userName, companyName);
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendPasswordResetEmail(userEmail: string, resetUrl: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Reset your OPSIGHT password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
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
              <h1 style="margin: 0; font-size: 32px;">Reset Your Password</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">OPSIGHT Security</p>
            </div>
            
            <div class="content">
              <h2 style="color: #1e3a8a; margin-top: 0;">Password Reset Request</h2>
              
              <p>We received a request to reset your OPSIGHT account password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="warning">
                <p style="margin: 0;"><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 OPSIGHT. All rights reserved.</p>
              <p>This email was sent in response to a password reset request.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  }
}
