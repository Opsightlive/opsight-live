import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // For now, just log the email data to console
      // In production, this would use Supabase Edge Functions or a service like SendGrid
      console.log('Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from || 'noreply@opsight.live'
      });
      
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    const subject = `Welcome to OPSIGHT, ${userName}! 🚀`;
    const html = `
      <h1>Welcome to OPSIGHT!</h1>
      <p>Hi ${userName},</p>
      <p>Thank you for joining OPSIGHT. We're excited to help you transform your portfolio performance.</p>
    `;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }

  static async sendVerificationEmail(userEmail: string, userName: string, verificationUrl: string): Promise<boolean> {
    const subject = 'Verify your OPSIGHT account';
    const html = `
      <h1>Verify Your Account</h1>
      <p>Hi ${userName},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }

  static async sendOnboardingReminder(userEmail: string, userName: string, companyName?: string): Promise<boolean> {
    const subject = `Complete your OPSIGHT setup, ${userName}`;
    const html = `
      <h1>Complete Your Setup</h1>
      <p>Hi ${userName},</p>
      <p>Don't forget to complete your OPSIGHT setup to get the most out of our platform.</p>
    `;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }

  static async sendPasswordResetEmail(userEmail: string, resetUrl: string): Promise<boolean> {
    const subject = 'Reset your OPSIGHT password';
    const html = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }
}
