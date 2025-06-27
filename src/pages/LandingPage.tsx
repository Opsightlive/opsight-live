
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
  CreditCard,
  FileText,
  User,
  Briefcase,
  Mic,
  Zap,
  Target,
  Eye,
  Clock,
  DollarSign
} from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [liveStats, setLiveStats] = useState({
    properties: 2847,
    issues: 156,
    savings: 1200000,
    users: 1203
  });

  // Live metrics animation
  const liveMetrics = [
    { label: 'Properties Monitored', value: liveStats.properties.toLocaleString(), change: '+23', icon: Building2, color: 'text-blue-600' },
    { label: 'Issues Predicted', value: liveStats.issues.toString(), change: '+12', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Cost Savings', value: `$${(liveStats.savings / 1000000).toFixed(1)}M`, change: '+$45K', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Users', value: liveStats.users.toLocaleString(), change: '+8', icon: Users, color: 'text-purple-600' }
  ];

  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % liveMetrics.length);
      
      // Simulate live updates
      setLiveStats(prev => ({
        properties: prev.properties + Math.floor(Math.random() * 3),
        issues: prev.issues + Math.floor(Math.random() * 2),
        savings: prev.savings + Math.floor(Math.random() * 50000),
        users: prev.users + Math.floor(Math.random() * 2)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-2xl font-bold text-black">OPSIGHT</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solutions" className="text-gray-600 hover:text-gray-900">Solutions</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Platform</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#customers" className="text-gray-600 hover:text-gray-900">Customers</a>
              <Link to="/company" className="text-gray-600 hover:text-gray-900">Company</Link>
              <a href="#resources" className="text-gray-600 hover:text-gray-900">Resources</a>
              <Link to="/demo" className="text-blue-600 hover:text-blue-700 font-medium">Get Demo</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 animate-pulse">Try Free</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#solutions" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Solutions</a>
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Platform</a>
                <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#customers" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Customers</a>
                <Link to="/company" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Company</Link>
                <a href="#resources" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Resources</a>
                <Link to="/demo" className="block px-3 py-2 text-blue-600 hover:text-blue-700 font-medium">Get Demo</Link>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Sign In</Link>
                <div className="px-3 py-2">
                  <Link to="/signup">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Try Free</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Award className="h-6 w-6 text-blue-600 mr-2 animate-bounce" />
                <span className="text-blue-600 font-semibold animate-pulse">🔥 DISRUPTING PROPERTY MANAGEMENT 🔥</span>
              </div>
              
              {/* Powerful Quote Section - Made More Prominent */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 rounded-2xl shadow-2xl mb-8 border-4 border-yellow-400 animate-pulse">
                <div className="bg-black/20 p-6 rounded-xl">
                  <blockquote className="text-2xl text-white font-bold mb-4 leading-tight">
                    "You own the property, but they control the data. OPSIGHT puts ownership back in the driver's seat. 
                    Legacy tools manage units. OPSIGHT manages outcomes - We don't just show you data, we enforce results."
                  </blockquote>
                  <p className="text-yellow-200 font-semibold">- The OPSIGHT Revolution</p>
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                🚀 TRANSFORM Your 
                <span className="text-blue-600 block animate-bounce">Portfolio Performance</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Property management software wasn't built for owners. OPSIGHT flips the power to you - 
                Real-time red flags, KPI enforcement, and full operational visibility. Built for ownership, not operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/demo">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 animate-pulse shadow-lg">
                    🎯 GET YOUR DEMO NOW
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white animate-bounce">
                    ⚡ START FREE TRIAL
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center animate-pulse">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  💳 No credit card required
                </div>
                <div className="flex items-center animate-pulse">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ⚡ Setup in minutes
                </div>
                <div className="flex items-center animate-pulse">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  🛡️ Cancel anytime
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Live Metrics Dashboard with More Energy */}
              <div className="bg-white rounded-lg shadow-2xl p-6 border-4 border-blue-200 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2 animate-bounce" />
                    🔴 LIVE Portfolio Dashboard
                  </h3>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Animated Live Metrics with More Energy */}
                <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        {React.createElement(liveMetrics[currentMetric].icon, { 
                          className: `h-6 w-6 ${liveMetrics[currentMetric].color} mr-2 animate-spin`
                        })}
                        <p className="text-sm font-bold text-blue-800">🔥 LIVE UPDATES</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-900 animate-bounce">
                        {liveMetrics[currentMetric].value}
                      </p>
                      <p className="text-xs text-blue-600">{liveMetrics[currentMetric].label}</p>
                    </div>
                    <div className="text-green-600 font-bold text-lg animate-pulse">
                      {liveMetrics[currentMetric].change}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg animate-pulse border-2 border-red-200">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 animate-bounce" />
                      <span className="text-sm font-medium">🚨 3 Predictive Alerts</span>
                    </div>
                    <Button size="sm" variant="outline" className="animate-pulse">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg animate-pulse border-2 border-green-200">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2 animate-bounce" />
                      <span className="text-sm font-medium">📈 NOI Up 18%</span>
                    </div>
                    <Button size="sm" variant="outline" className="animate-pulse">View Report</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg animate-pulse border-2 border-blue-200">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                      <span className="text-sm font-medium">🤖 AI Recommendations</span>
                    </div>
                    <Button size="sm" variant="outline" className="animate-pulse">See All</Button>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Live Activity Feed
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center text-green-600 animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                      New property added to monitoring
                    </div>
                    <div className="flex items-center text-blue-600 animate-pulse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"></div>
                      KPI threshold updated automatically
                    </div>
                    <div className="flex items-center text-orange-600 animate-pulse">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-ping"></div>
                      Predictive alert triggered
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div id="solutions" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Solutions Built for Real Estate Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From portfolio management to predictive analytics, OPSIGHT delivers 
              the intelligence you need to stay ahead of the market.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Real-time KPI tracking, automated reporting, and performance optimization 
                across your entire portfolio.
              </p>
              <Link to="/demo" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Predictive Risk Management</h3>
              <p className="text-gray-600 mb-6">
                Advanced AI algorithms identify potential issues before they impact 
                your bottom line, keeping you ahead of problems.
              </p>
              <Link to="/demo" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Operations</h3>
              <p className="text-gray-600 mb-6">
                Intelligent automation and insights that transform how you manage 
                properties and engage with property managers.
              </p>
              <Link to="/demo" className="text-blue-600 font-medium hover:text-blue-700">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Platform Section */}
      <div id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Complete Real Estate Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize performance, minimize risk, and maximize returns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "KPI Command Center",
                description: "Real-time dashboard tracking all critical metrics with automated reporting and trend analysis."
              },
              {
                icon: AlertTriangle,
                title: "Predictive Alerts",
                description: "AI-powered early warning system that identifies potential issues before they become problems."
              },
              {
                icon: Bot,
                title: "AI Intelligence",
                description: "Advanced machine learning insights and recommendations to optimize property performance."
              },
              {
                icon: Users,
                title: "PM Engagement",
                description: "Track and improve property manager performance with automated scoring and feedback systems."
              },
              {
                icon: Building2,
                title: "Portfolio Overview",
                description: "Complete visibility across your entire portfolio with drill-down capabilities to individual properties."
              },
              {
                icon: Shield,
                title: "Automated Compliance",
                description: "Stay compliant with automated reporting and documentation management systems."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Starting at just $3 per door per month. No hidden fees, no setup costs. 
              Scale with your portfolio and pay only for what you use.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">$3</span>
                  <span className="text-gray-500 ml-2">/door/month</span>
                </div>
                <p className="text-gray-600 mt-2">Essential monitoring</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Basic KPI tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Standard alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Monthly reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              
              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Start Basic Plan
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">$4</span>
                  <span className="text-gray-500 ml-2">/door/month</span>
                </div>
                <p className="text-gray-600 mt-2">Advanced analytics & AI</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Real-time KPI tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Predictive alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>AI-powered insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>24/7 support</span>
                </li>
              </ul>
              
              <Link to="/signup">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Professional Plan
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">$5</span>
                  <span className="text-gray-500 ml-2">/door/month</span>
                </div>
                <p className="text-gray-600 mt-2">Full-service solution</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Start Enterprise Plan
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Questions about pricing? Need custom enterprise pricing for large portfolios?
            </p>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Stories */}
      <div id="customers" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how industry leaders are transforming their operations with OPSIGHT
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                quote: "OPSIGHT helped us increase NOI by 22% across our portfolio while reducing operational overhead by 35%.",
                author: "Sarah Chen",
                title: "Portfolio Manager",
                company: "Premier Real Estate Group"
              },
              {
                quote: "The predictive alerts alone saved us from three major issues that could have cost millions.",
                author: "Michael Rodriguez",
                title: "Asset Manager", 
                company: "Coastal Properties"
              },
              {
                quote: "We now have complete visibility into our portfolio performance. The AI insights are game-changing.",
                author: "Jennifer Walsh",
                title: "VP of Operations",
                company: "Metro Holdings"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.title}</p>
                  <p className="text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is OPSIGHT Video Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What is OPSIGHT?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch this comprehensive overview to understand how OPSIGHT transforms 
              real estate portfolio management through AI-powered intelligence.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-8">
              <div className="aspect-video bg-white rounded-xl shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full p-8 mx-auto mb-6 hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What is OPSIGHT?</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Comprehensive platform overview and capabilities demonstration
                  </p>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Full Overview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of real estate professionals who trust OPSIGHT to optimize 
              their operations and maximize returns.
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                  alt="OPSIGHT" 
                  className="h-8 w-8 mr-3"
                />
                <span className="text-xl font-bold">OPSIGHT</span>
              </div>
              <p className="text-gray-400 mb-4">
                The world's most advanced real estate intelligence platform.
              </p>
              <p className="text-gray-400 text-sm">
                Transform your portfolio performance with AI-powered insights.
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
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/company" className="hover:text-white">About</Link></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OPSIGHT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
