
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
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="mb-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Trusted by Leading Real Estate Professionals
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transform Your{' '}
                <span className="text-blue-600">Portfolio</span>{' '}
                <span className="text-blue-600">Performance</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Property management software wasn't built for owners. OPSIGHT flips the power to you - Real-time red flags, KPI enforcement, and full operational visibility.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <blockquote className="text-gray-700 italic mb-2">
                  "You own the property, but they control the data. OPSIGHT puts ownership back in the driver's seat. Legacy tools manage units. OPSIGHT manages outcomes."
                </blockquote>
                <p className="text-blue-600 font-medium">- Built for ownership, not operations</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/demo">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                    Get Your Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Setup in minutes
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Right Side - Live Dashboard */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Live Portfolio Dashboard</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    LIVE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Building className="h-5 w-5 text-gray-600" />
                      <span className="text-green-600 text-sm font-medium">+23</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Properties Monitored</div>
                    <div className="text-2xl font-bold text-gray-900">2,856</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="h-5 w-5 text-gray-600" />
                      <span className="text-green-600 text-sm font-medium">+12</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Issues Predicted</div>
                    <div className="text-2xl font-bold text-gray-900">160</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-green-600 text-sm font-medium">+$45K</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Cost Savings</div>
                    <div className="text-2xl font-bold text-gray-900">$1.4M</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="text-green-600 text-sm font-medium">+8</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Active Users</div>
                    <div className="text-2xl font-bold text-purple-600">1,213</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-red-800">3 Predictive Alerts</div>
                        <div className="text-xs text-red-600">Immediate attention required</div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Review
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-green-800">NOI Up 18%</div>
                        <div className="text-xs text-green-600">This quarter vs last</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      View Report
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">AI Recommendations</div>
                        <div className="text-xs text-blue-600">5 new insights available</div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      See All
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Live updates every 2.5 seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solutions Built for Real Estate Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            From portfolio management to predictive analytics, OPSIGHT delivers the intelligence
          </p>
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
