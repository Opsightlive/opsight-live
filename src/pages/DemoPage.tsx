import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Mail, Phone, Building2 } from 'lucide-react';
import CalendarBooking from '@/components/demo/CalendarBooking';
import { useIsMobile } from '@/hooks/use-mobile';

const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'calendar'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    properties: '',
    message: ''
  });
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    setCurrentStep('calendar');
  };

  const handleBookingComplete = (date: Date, time: string) => {
    console.log('Demo booked for:', date, time, 'Contact:', formData);
    // The email service now handles sending the data
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-2xl font-bold text-black">OPSIGHT</span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 'form' ? (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-12`}>
            {/* ... keep existing code (left column information) */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Schedule Your Personal Demo
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                See how OPSIGHT can transform your real estate portfolio management 
                in just 30 minutes.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personalized Walkthrough</h3>
                    <p className="text-gray-600">
                      We'll show you exactly how OPSIGHT works with your specific portfolio needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">30-Minute Session</h3>
                    <p className="text-gray-600">
                      Quick, focused demo that respects your time while covering all key features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expert Guidance</h3>
                    <p className="text-gray-600">
                      Get insights from our real estate technology experts and ask any questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Yourself</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... keep existing code (form fields) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="ABC Real Estate"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="properties">Number of Properties</Label>
                  <Input
                    id="properties"
                    name="properties"
                    type="number"
                    value={formData.properties}
                    onChange={handleChange}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Tell us about your portfolio (optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your portfolio, current challenges, or specific interests..."
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Continue to Schedule
                </Button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-4">
                Next, you'll select your preferred demo time.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Select Your Demo Time
              </h1>
              <p className="text-xl text-gray-600">
                Choose a convenient time for your 30-minute OPSIGHT demo
              </p>
            </div>
            
            <CalendarBooking 
              onBookingComplete={handleBookingComplete}
              contactData={formData}
            />
            
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('form')}
                className="mr-4"
              >
                ← Back to Form
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
