import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  User,
  Building2,
  TrendingUp,
  Briefcase,
  Mic,
  ArrowRight,
  Award,
  Star
} from 'lucide-react';

const CompanyPage = () => {
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
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-blue-600 font-semibold text-xl">Leadership That Understands Your Challenges</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Built by Property Professionals,
              <span className="text-blue-600 block">For Property Owners</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              OPSIGHT was founded by someone who's been in your shoes. From managing thousands of units 
              to building a multi-million dollar portfolio, we understand what owners really need.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden">
              <div className="lg:flex">
                <div className="lg:w-2/5 flex flex-col">
                  <img 
                    src="/lovable-uploads/126f59a2-9c39-4959-8839-f7491c94712a.png" 
                    alt="CEO & Founder" 
                    className="w-full h-64 lg:h-80 object-cover object-center mt-8"
                  />
                  <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <p className="text-lg font-semibold text-gray-900">Proven Track Record</p>
                  </div>
                </div>
                <div className="lg:w-3/5 p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <User className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Chief Executive Officer & Founder</h3>
                      <p className="text-blue-600 font-semibold">Leading the Revolution in Property Intelligence</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-3">
                          <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="font-bold text-2xl text-gray-900">5,000+</span>
                        </div>
                        <p className="text-gray-600">Units Managed Throughout Career</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200">
                        <div className="flex items-center mb-3">
                          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                          <span className="font-bold text-3xl text-green-600">$20M+</span>
                        </div>
                        <p className="text-gray-600 font-semibold">Assets Under Management</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                        <Briefcase className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">From Ground Up Experience</h4>
                          <p className="text-gray-600">Worked from porter to regional property manager, understanding every level of operations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                        <Mic className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Industry Recognition</h4>
                          <p className="text-gray-600">Features on multiple podcasts and interviews by top successful investors in the Dallas-Fort Worth market</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white">
                      <blockquote className="text-lg italic mb-4">
                        "Having managed thousands of units and built my own portfolio, I've experienced firsthand 
                        the frustration of being left in the dark by traditional property management systems. 
                        OPSIGHT was born from the need to put real power back in the hands of property owners."
                      </blockquote>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">Trusted by Industry Leaders</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To revolutionize property management by putting owners back in control of their investments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Owner-First Approach</h3>
              <p className="text-gray-600">Every feature is designed with property owners in mind, not property managers</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Intelligence</h3>
              <p className="text-gray-600">Instant insights and predictive analytics to stay ahead of problems</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">Built on real-world experience managing thousands of units and millions in assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Take Back Control?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join property owners who are already using OPSIGHT to transform their operations
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

export default CompanyPage;
