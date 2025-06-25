
import React from 'react';
import { Building2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const PortfolioOverview = () => {
  const properties = [
    {
      id: 1,
      name: "Meridian Apartments",
      location: "Austin, TX",
      units: 240,
      occupancy: 94.2,
      revenue: 485000,
      redFlags: 2,
      pmScore: 87,
      status: "performing"
    },
    {
      id: 2,
      name: "Oak Ridge Complex",
      location: "Dallas, TX", 
      units: 156,
      occupancy: 88.1,
      revenue: 298000,
      redFlags: 5,
      pmScore: 72,
      status: "at-risk"
    },
    {
      id: 3,
      name: "Sunset Gardens",
      location: "Houston, TX",
      units: 320,
      occupancy: 96.8,
      revenue: 642000,
      redFlags: 0,
      pmScore: 95,
      status: "excellent"
    },
    {
      id: 4,
      name: "Cedar Point Villas",
      location: "San Antonio, TX",
      units: 188,
      occupancy: 81.3,
      revenue: 312000,
      redFlags: 8,
      pmScore: 58,
      status: "critical"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'performing': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const portfolioMetrics = {
    totalProperties: 4,
    totalUnits: 904,
    avgOccupancy: 90.1,
    totalRevenue: 1737000,
    activeRedFlags: 15,
    avgPMScore: 78
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Portfolio Overview</h1>
        <p className="text-gray-600">Monitor asset performance across your entire portfolio</p>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-xl font-bold text-black">{portfolioMetrics.totalProperties}</p>
            </div>
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-xl font-bold text-black">{portfolioMetrics.totalUnits}</p>
            </div>
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Occupancy</p>
              <p className="text-xl font-bold text-black">{portfolioMetrics.avgOccupancy}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xl font-bold text-black">${portfolioMetrics.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Red Flags</p>
              <p className="text-xl font-bold text-red-600">{portfolioMetrics.activeRedFlags}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg PM Score</p>
              <p className="text-xl font-bold text-black">{portfolioMetrics.avgPMScore}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Property Performance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red Flags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-black">{property.name}</div>
                      <div className="text-sm text-gray-500">{property.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{property.units}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-black">{property.occupancy}%</span>
                      {property.occupancy >= 95 ? 
                        <TrendingUp className="ml-1 h-4 w-4 text-green-600" /> : 
                        property.occupancy < 85 ? 
                        <TrendingDown className="ml-1 h-4 w-4 text-red-600" /> : 
                        <TrendingUp className="ml-1 h-4 w-4 text-blue-600" />
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">${property.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${property.redFlags === 0 ? 'text-green-600' : property.redFlags > 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {property.redFlags}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{property.pmScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 text-xs font-medium">
                        View Details
                      </button>
                      {property.redFlags > 0 && (
                        <button className="bg-red-600 text-white px-3 py-1 text-xs font-medium">
                          View Alerts
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
