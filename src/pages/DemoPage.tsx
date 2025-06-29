
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalendarBooking from '@/components/demo/CalendarBooking';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'calendar' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    properties: '',
    message: ''
  });
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('calendar');
  };

  const handleBookingComplete = (date: Date, time: string) => {
    setBookingDetails({ date, time });
    setCurrentStep('confirmation');
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="bg-transparent border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                  alt="OPSIGHT" 
                  className="h-8 w-8 mr-3"
                />
                <span className="text-2xl font-bold text-white">OPSIGHT</span>
              </Link>
              <Link to="/" className="text-blue-200 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Demo Scheduled!</h3>
              <p className="text-gray-600 mb-4">
                Your demo is scheduled for {bookingDetails?.date.toLocaleDateString()} at {bookingDetails?.time}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                We'll send you a calendar invite and join link shortly.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/signup">Try Free Version</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-transparent border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-2xl font-bold text-white">OPSIGHT</span>
            </Link>
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {currentStep === 'form' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Schedule Your Demo</h1>
                <p className="text-xl text-blue-200">
                  See how OPSIGHT can transform your property management operations
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Tell us about your portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company/Organization *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="properties">Number of Properties</Label>
                      <Select onValueChange={(value) => setFormData({...formData, properties: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of properties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 properties</SelectItem>
                          <SelectItem value="6-20">6-20 properties</SelectItem>
                          <SelectItem value="21-50">21-50 properties</SelectItem>
                          <SelectItem value="51-100">51-100 properties</SelectItem>
                          <SelectItem value="100+">100+ properties</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Tell us about your biggest operational challenges</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="What keeps you up at night? What manual processes would you love to automate?"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Calendar className="h-5 w-5 mr-2" />
                      Continue to Schedule
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'calendar' && (
            <div>
              <div className="text-center mb-8">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('form')}
                  className="text-white hover:text-blue-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Form
                </Button>
                <h1 className="text-4xl font-bold text-white mb-4">Pick Your Time</h1>
                <p className="text-xl text-blue-200">
                  Choose a convenient time for your personalized demo
                </p>
              </div>

              <CalendarBooking
                contactData={formData}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
