
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, TrendingUp, Users, Building, BarChart3, Shield, Brain } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-gray-900">OPSIGHT</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Dashboard Preview */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Trusted by Leading Real Estate Professionals</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your <br />
                <span className="text-blue-600">Portfolio</span><br />
                <span className="text-blue-600">Performance</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Property management software wasn't built for owners. OPSIGHT 
                flips the power to you - Real-time red flags, KPI enforcement, 
                and full operational visibility.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                <p className="text-gray-700 italic">
                  "You own the property, but they control the data. OPSIGHT puts 
                  ownership back in the driver's seat. Legacy tools manage units. 
                  OPSIGHT manages outcomes."
                </p>
                <p className="text-blue-600 font-medium mt-2">- Built for ownership, not operations</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8">
                    Get Your Demo →
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-300">
                  Start Free Trial
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Side - Live Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Portfolio Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">LIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Building className="h-5 w-5 text-gray-600" />
                      <span className="text-xs text-green-600 font-medium">+23</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Properties Monitored</p>
                    <p className="text-xl font-bold text-gray-900">2,856</p>
                  </Card>

                  <Card className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="h-5 w-5 text-gray-600" />
                      <span className="text-xs text-orange-600 font-medium">+12</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Issues Predicted</p>
                    <p className="text-xl font-bold text-gray-900">160</p>
                  </Card>

                  <Card className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <span className="text-xs text-green-600 font-medium">+$45K</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Cost Savings</p>
                    <p className="text-xl font-bold text-gray-900">$1.4M</p>
                  </Card>

                  <Card className="p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">+8</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Active Users</p>
                    <p className="text-xl font-bold text-blue-600">1,213</p>
                  </Card>
                </div>

                {/* Alert Cards */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800">3 Predictive Alerts</p>
                        <p className="text-xs text-red-600">Immediate attention required</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">Review</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">NOI Up 18%</p>
                        <p className="text-xs text-green-600">This quarter vs last</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 text-xs">View Report</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">AI Recommendations</p>
                        <p className="text-xs text-blue-600">5 new insights available</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">See All</Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">● Live updates every 2.5 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Solutions Built for Real Estate Excellence
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            From portfolio management to predictive analytics, OPSIGHT delivers the intelligence
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">KPI Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Real-time performance metrics and financial tracking for all your properties
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-10 w-10 text-red-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Red Flag Alerts</h3>
              <p className="text-gray-600 text-sm">
                Automated monitoring and instant notifications for critical issues
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Brain className="h-10 w-10 text-purple-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Intelligence</h3>
              <p className="text-gray-600 text-sm">
                Smart document processing and predictive analytics for better decisions
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 text-green-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600 text-sm">
                Role-based access control and collaboration tools for your team
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of property professionals who trust OPSIGHT to manage their portfolios
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
              Get Started Today →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">OPSIGHT</span>
            </div>
            <p className="text-gray-400">
              © 2024 OPSIGHT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
