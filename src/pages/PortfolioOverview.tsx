
import React from 'react';
import OwnerDashboard from '@/components/owner/OwnerDashboard';
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react';

const PortfolioOverview = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Portfolio Overview</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Complete portfolio performance summary with key metrics and property insights
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>24 Properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>1,847 Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>94.2% Occupancy</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>$2.4M Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-6">
          <OwnerDashboard />
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
