import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  AlertTriangle, 
  Bot, 
  Shield, 
  TrendingUp, 
  Users,
  Building2,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  Award,
  Play,
  Check,
  DollarSign
} from 'lucide-react';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">OPSIGHT</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="#solutions" className="text-gray-600 hover:text-gray-900">Solutions</Link>
              <Link to="#features" className="text-gray-600 hover:text-gray-900">Platform</Link>
              <Link to="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link to="#customers" className="text-gray-600 hover:text-gray-900">Customers</Link>
              <Link to="/company" className="text-gray-600 hover:text-gray-900">Company</Link>
              <Link to="#resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Get Demo</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Try Free
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="#solutions" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Solutions</Link>
                <Link to="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Platform</Link>
                <Link to="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</Link>
                <Link to="#customers" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Customers</Link>
                <Link to="/company" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Company</Link>
                <Link to="#resources" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Resources</Link>
                <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-blue-600 hover:text-blue-700 font-medium">Get Demo</a>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Sign In</Link>
                <Link to="/signup" className="block px-3 py-2 text-blue-600 hover:text-blue-700 font-medium">Try Free</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Portfolio Performance
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              OPSIGHT is the AI-powered platform that gives property owners real-time insights, 
              predictive analytics, and automated risk management to maximize returns and minimize losses.
            </p>
            
            {/* Quote */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8 max-w-2xl mx-auto">
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "You own the property, but they control the data. OPSIGHT puts ownership back in the driver's seat.
                Property management software manages units. OPSIGHT manages outcomes."
              </blockquote>
              <p className="text-blue-600 font-semibold">- Built for ownership, not operations</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                  Get Your Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solutions That Drive Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From predictive analytics to automated risk management, OPSIGHT provides the tools 
              you need to make data-driven decisions and maximize your portfolio performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Predictive Analytics */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600 mb-6">
                AI-powered insights that predict market trends, tenant behavior, and property performance 
                to help you make proactive decisions.
              </p>
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </a>
            </div>

            {/* Risk Management */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-lg">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Real-time monitoring and automated alerts for potential risks, from tenant issues 
                to market volatility, keeping you ahead of problems.
              </p>
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </a>
            </div>

            {/* Portfolio Optimization */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Optimization</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive portfolio analysis and optimization recommendations to maximize 
                returns and minimize risk across your entire property portfolio.
              </p>
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your portfolio effectively, from real-time dashboards 
              to automated workflows and comprehensive reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">Advanced machine learning algorithms provide actionable insights</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Alerts</h3>
              <p className="text-gray-600">Instant notifications for critical issues and opportunities</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Seamless communication and task management for your team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Workflows</h3>
              <p className="text-gray-600">Streamline operations with intelligent automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your portfolio size and needs. All plans include 
              our core features with no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Up to 50 properties
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Email support
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-blue-600 text-white border-2 border-blue-600 rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$299</span>
                <span className="opacity-80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  Up to 200 properties
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  Custom integrations
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Unlimited properties
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Custom AI models
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  White-label options
                </li>
              </ul>
              <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gray-900 hover:bg-gray-800">
                  Contact Sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section id="customers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Property Owners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how property owners across the country are using OPSIGHT to transform 
              their portfolio performance and maximize returns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "OPSIGHT has completely transformed how we manage our portfolio. The predictive 
                analytics have helped us avoid costly mistakes and identify opportunities we 
                would have missed."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">JS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-gray-600">Portfolio Manager, 150+ properties</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The risk intelligence features are game-changing. We get alerts before 
                problems become crises, and the automated workflows save us hours every week."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">MJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Johnson</p>
                  <p className="text-gray-600">Property Owner, 75+ units</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Since implementing OPSIGHT, our portfolio performance has improved by 23%. 
                The insights are actionable and the platform is incredibly user-friendly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">DW</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">David Wilson</p>
                  <p className="text-gray-600">Real Estate Investor, 200+ properties</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Resources & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead of the curve with our latest insights, guides, and industry analysis 
              to help you make informed decisions about your portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Webinars</h3>
              <p className="text-gray-600 mb-4">
                Join our monthly webinars to learn about the latest trends and best practices.
              </p>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
                View upcoming webinars →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Case Studies</h3>
              <p className="text-gray-600 mb-4">
                See how other property owners are achieving success with OPSIGHT.
              </p>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
                Read case studies →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Reports</h3>
              <p className="text-gray-600 mb-4">
                Access our quarterly market analysis and investment insights.
              </p>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
                Download reports →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Portfolio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of property owners who are already using OPSIGHT to maximize 
            their returns and minimize their risks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/opsightlive" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 border-white hover:bg-gray-100 hover:text-blue-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">OPSIGHT</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered portfolio management for property owners who demand results.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Portfolio Management</a></li>
                <li><a href="#" className="hover:text-white">Risk Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Performance Analytics</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#features" className="hover:text-white">Features</Link></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OPSIGHT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
