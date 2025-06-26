
interface DemoRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  properties: string;
  message: string;
  selectedDate: Date;
  selectedTime: string;
}

interface EmailServiceConfig {
  webhookUrl?: string;
  emailjsConfig?: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
}

export class EmailService {
  private config: EmailServiceConfig;

  constructor(config: EmailServiceConfig = {}) {
    this.config = config;
  }

  async sendDemoRequest(data: DemoRequestData): Promise<boolean> {
    console.log('Demo request data:', data);
    
    // Method 1: Try webhook first (for future automation)
    if (this.config.webhookUrl) {
      try {
        const response = await fetch(this.config.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'demo_request',
            timestamp: new Date().toISOString(),
            data: {
              ...data,
              selectedDate: data.selectedDate.toISOString(),
            }
          }),
        });
        
        if (response.ok) {
          console.log('Demo request sent via webhook');
          return true;
        }
      } catch (error) {
        console.error('Webhook failed:', error);
      }
    }

    // Method 2: EmailJS (if configured)
    if (this.config.emailjsConfig && window.emailjs) {
      try {
        await window.emailjs.send(
          this.config.emailjsConfig.serviceId,
          this.config.emailjsConfig.templateId,
          {
            to_email: 'your-email@company.com', // Replace with your email
            from_name: `${data.firstName} ${data.lastName}`,
            from_email: data.email,
            company: data.company,
            phone: data.phone,
            properties: data.properties,
            message: data.message,
            demo_date: data.selectedDate.toLocaleDateString(),
            demo_time: data.selectedTime,
          },
          this.config.emailjsConfig.publicKey
        );
        
        console.log('Demo request sent via EmailJS');
        return true;
      } catch (error) {
        console.error('EmailJS failed:', error);
      }
    }

    // Method 3: Fallback - store in localStorage for now
    const demoRequests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
    demoRequests.push({
      ...data,
      selectedDate: data.selectedDate.toISOString(),
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('demoRequests', JSON.stringify(demoRequests));
    
    console.log('Demo request stored locally (fallback)');
    return true;
  }

  // Method to retrieve stored demo requests (for testing/debugging)
  getDemoRequests(): any[] {
    return JSON.parse(localStorage.getItem('demoRequests') || '[]');
  }
}

// Default instance
export const emailService = new EmailService();

// Global type for EmailJS
declare global {
  interface Window {
    emailjs?: any;
  }
}
