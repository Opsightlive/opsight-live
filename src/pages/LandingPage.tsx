
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  BarChart3,
  AlertTriangle,
  Users,
  Clock,
  DollarSign,
  Building,
  Star,
  Play,
  Zap,
  Target,
  Award
} from 'lucide-react';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';

const LandingPage = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(92);
  const [isLive, setIsLive] = useState(true);

  const metrics = [
    { label: 'Occupancy Rate', value: '94.2%', change: '+2.1%', trend: 'up' },
    { label: 'Monthly Revenue', value: '$847K', change: '+12.3%', trend: 'up' },
    { label: 'Maintenance Costs', value: '$23K', change: '-8.7%', trend: 'down' },
    { label: 'Avg. Response Time', value: '2.4 hrs', change: '-15%', trend: 'down' }
  ];

  const alerts = [
    { type: 'warning', message: 'Unit 204A - HVAC maintenance due', time: '2 min ago' },
    { type: 'success', message: 'Unit 156B - Lease renewed for 12 months', time: '15 min ago' },
    { type: 'info', message: 'Property inspection scheduled for Building C', time: '1 hr ago' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
      
      // Simulate live data updates
      if (Math.random() > 0.7) {
        setOccupancyRate(prev => {
          const change = (Math.random() - 0.5) * 2;
          return Math.max(85, Math.min(98, prev + change));
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Link to="/demo">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unlock the Future of Property Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              OPSIGHT provides real-time insights and predictive analytics to optimize your property portfolio.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/demo">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  Schedule Your Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dashboard Preview */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              Live Dashboard Preview
            </h2>
            <div className="flex items-center text-gray-600">
              <span className={`mr-2 w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isLive ? 'Real-Time Data' : 'Data Stale'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overview Card */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Property Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">
                  {occupancyRate.toFixed(1)}%
                </div>
                <p className="text-gray-600">Current Occupancy Rate</p>
              </CardContent>
            </Card>

            {/* Key Metrics Card */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="text-gray-600">{metrics[currentMetric].label}:</span>
                  <div className="text-2xl font-bold text-gray-900">{metrics[currentMetric].value}</div>
                  <Badge className={`text-xs ${metrics[currentMetric].trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {metrics[currentMetric].change}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security & Compliance Card */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  All systems operational
                </div>
                <p className="text-gray-600">
                  Regular security audits and compliance checks ensure your data is safe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Success Stories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how property managers and owners are transforming their operations with OPSIGHT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Success Story 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">95% Faster Reporting</h3>
                  <p className="text-gray-600">Metro Properties</p>
                </div>
              </div>
              <p className="text-gray-600">
                "OPSIGHT reduced our monthly reporting time from 40 hours to just 2 hours. The automated insights are incredible."
              </p>
              <div className="mt-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>

            {/* Success Story 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">$2M+ Cost Savings</h3>
                  <p className="text-gray-600">Urban Holdings</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Early warning alerts helped us prevent major maintenance issues, saving over $2 million in emergency repairs."
              </p>
              <div className="mt-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>

            {/* Success Story 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">98% Tenant Satisfaction</h3>
                  <p className="text-gray-600">Skyline Management</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Proactive maintenance scheduling and instant communication improved our tenant satisfaction scores dramatically."
              </p>
              <div className="mt-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-gray-900">
              Trusted by Leading Real Estate Professionals
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="bg-gray-100 h-12 w-32 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Company 1</span>
            </div>
            <div className="bg-gray-100 h-12 w-32 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Company 2</span>
            </div>
            <div className="bg-gray-100 h-12 w-32 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Company 3</span>
            </div>
            <div className="bg-gray-100 h-12 w-32 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Company 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the features that make OPSIGHT the leading property management solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real-Time Analytics */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Analytics</h3>
              <p className="text-gray-600">
                Get instant insights into your property performance with our real-time analytics dashboard.
              </p>
            </div>

            {/* Automated Alerts */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Alerts</h3>
              <p className="text-gray-600">
                Receive automated alerts for critical issues, ensuring you never miss a beat.
              </p>
            </div>

            {/* Tenant Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tenant Management</h3>
              <p className="text-gray-600">
                Streamline tenant communication and management with our integrated tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              The Problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional property management is complex, inefficient, and lacks transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inefficient Processes */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Inefficient Processes</h3>
              </div>
              <p className="text-gray-600">
                Manual tasks and outdated systems lead to wasted time and resources.
              </p>
            </div>

            {/* Lack of Transparency */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Lack of Transparency</h3>
              </div>
              <p className="text-gray-600">
                Owners are often left in the dark, with limited visibility into their property performance.
              </p>
            </div>

            {/* Financial Challenges */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Financial Challenges</h3>
              </div>
              <p className="text-gray-600">
                Unexpected expenses and poor financial management can impact profitability.
              </p>
            </div>

            {/* Communication Gaps */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Building className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Communication Gaps</h3>
              </div>
              <p className="text-gray-600">
                Poor communication between owners, managers, and tenants leads to frustration and delays.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Showcase */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              The Solution: OPSIGHT
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              OPSIGHT provides a comprehensive solution to streamline property management and maximize your ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real-Time Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Insights</h3>
              <p className="text-gray-600">
                Access real-time data and analytics to make informed decisions and optimize your property performance.
              </p>
            </div>

            {/* Automated Workflows */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Workflows</h3>
              <p className="text-gray-600">
                Automate routine tasks and streamline your workflows, saving time and reducing errors.
              </p>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Analytics</h3>
              <p className="text-gray-600">
                Leverage predictive analytics to anticipate future trends and proactively address potential issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Watch Our Demo
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            See OPSIGHT in action and discover how it can transform your property management operations.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-lg px-8 py-4">
            <Play className="mr-2 h-5 w-5" />
            Play Video
          </Button>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Key Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the benefits of using OPSIGHT for your property management needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Increased Efficiency */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Increased Efficiency</h3>
              <p className="text-gray-600">
                Streamline your operations and automate routine tasks, saving time and resources.
              </p>
            </div>

            {/* Improved Transparency */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Improved Transparency</h3>
              <p className="text-gray-600">
                Gain real-time visibility into your property performance and financial data.
              </p>
            </div>

            {/* Enhanced Profitability */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enhanced Profitability</h3>
              <p className="text-gray-600">
                Optimize your property management strategies and maximize your return on investment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join property owners and managers who are already using OPSIGHT to achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Schedule Your Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 border-white hover:bg-gray-100 hover:text-blue-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
