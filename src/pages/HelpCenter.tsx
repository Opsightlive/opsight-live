import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Users, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Send,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    issueType: '',
    description: '',
    priority: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const popularTopics = [
    { icon: FileText, title: 'Getting Started Guide', desc: 'Learn the basics of OpSight', path: '/help/getting-started' },
    { icon: Users, title: 'User Management', desc: 'Managing team members and permissions', path: '/help/user-management' },
    { icon: Settings, title: 'Account Settings', desc: 'Configure your account preferences', path: '/help/account-settings' },
    { icon: AlertCircle, title: 'Red Flag Alerts', desc: 'Understanding and managing alerts', path: '/help/red-flag-alerts' },
    { icon: MessageCircle, title: 'AI Reader Setup', desc: 'Configuring automatic report processing', path: '/help/ai-reader' },
    { icon: CheckCircle, title: 'KPI Dashboard', desc: 'Customizing your performance metrics', path: '/help/kpi-dashboard' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    console.log('Searching for:', searchQuery);
    toast({
      title: "Search initiated",
      description: `Searching for "${searchQuery}"...`,
    });
    // In a real app, this would perform the actual search
  };

  const handleTopicClick = (topic: any) => {
    console.log('Topic clicked:', topic.title);
    if (topic.path === '/help/getting-started' || topic.path === '/help/user-management') {
      navigate(topic.path);
    } else {
      toast({
        title: "Help Article",
        description: `"${topic.title}" article is coming soon...`,
      });
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.issueType || !ticketForm.description || !ticketForm.priority) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Ticket submitted:', ticketForm);
      toast({
        title: "Ticket submitted successfully",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setTicketForm({
        subject: '',
        issueType: '',
        description: '',
        priority: ''
      });
    } catch (error) {
      toast({
        title: "Error submitting ticket",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartChat = () => {
    toast({
      title: "Starting live chat",
      description: "Connecting you to our support team...",
    });
    console.log('Starting live chat');
    // In a real app, this would open the chat widget
  };

  const handlePhoneCall = () => {
    window.open('tel:1-800-OPSIGHT', '_self');
  };

  const handleEmailSupport = () => {
    window.open('mailto:support@opsight.com', '_self');
  };

  const handleStatusPage = () => {
    toast({
      title: "System Status",
      description: "Opening system status page...",
    });
    console.log('Opening status page');
    // In a real app, this would navigate to status.opsight.com or similar
  };

  const handleScheduleTraining = () => {
    toast({
      title: "Training Scheduler",
      description: "Opening training scheduler...",
    });
    console.log('Opening training scheduler');
    // In a real app, this would open Calendly or similar booking system
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OpSight Help Center</h1>
          <p className="text-gray-600">Get help and support for your real estate asset performance platform</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg pr-20"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularTopics.map((topic, index) => {
                    const Icon = topic.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTopicClick(topic)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-gray-900">{topic.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{topic.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Submit a Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="issueType">Issue Type *</Label>
                      <Select value={ticketForm.issueType} onValueChange={(value) => setTicketForm({...ticketForm, issueType: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="training">Training Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority *</Label>
                      <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({...ticketForm, priority: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Available now</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Chat with our support team for immediate assistance
                  </p>
                  <Button className="w-full" variant="outline" onClick={handleStartChat}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={handlePhoneCall}
                >
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-sm text-blue-600 hover:underline">1-800-OPSIGHT</p>
                  </div>
                </div>
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={handleEmailSupport}
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-sm text-blue-600 hover:underline">support@opsight.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri 8AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Processing</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={handleStatusPage}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Status Page
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Training */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Training & Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Schedule a personalized training session with our experts
                </p>
                <Button className="w-full" onClick={handleScheduleTraining}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Training
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
