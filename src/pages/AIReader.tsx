import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Bot, Clock, File, Database, Link } from 'lucide-react';

const AIReader = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [managementSoftwareConnected, setManagementSoftwareConnected] = useState(true);

  const uploadedFiles = [
    {
      id: 1,
      name: "Monthly_Report_Oak_Ridge_Oct_2024.pdf",
      uploadDate: "2024-10-15 14:32",
      type: "PDF",
      status: "processed",
      property: "Oak Ridge Complex"
    },
    {
      id: 2,
      name: "Leasing_Summary_Sept_2024.xlsx", 
      uploadDate: "2024-10-12 09:15",
      type: "Excel",
      status: "processed",
      property: "Meridian Apartments"
    },
    {
      id: 3,
      name: "Collections_Report_Q3_2024.pdf",
      uploadDate: "2024-10-10 16:45",
      type: "PDF",
      status: "error",
      property: "Cedar Point Villas"
    }
  ];

  const extractedKPIs = [
    {
      metric: "Physical Occupancy",
      value: "94.2%",
      confidence: 98,
      source: "Page 2, Table 1"
    },
    {
      metric: "Economic Occupancy", 
      value: "92.8%",
      confidence: 95,
      source: "Page 2, Table 1"
    },
    {
      metric: "Collections Rate",
      value: "96.1%", 
      confidence: 99,
      source: "Page 4, Collections Summary"
    },
    {
      metric: "Average Rent",
      value: "$1,847",
      confidence: 97,
      source: "Page 3, Rent Roll"
    }
  ];

  const syncLogs = [
    {
      id: 1,
      timestamp: "2024-10-15 14:35:22",
      type: "Auto Sync",
      status: "success",
      message: "Successfully extracted 12 KPIs from Monthly_Report_Oak_Ridge_Oct_2024.pdf"
    },
    {
      id: 2,
      timestamp: "2024-10-12 09:18:41", 
      type: "Manual Sync",
      status: "success",
      message: "Processed Leasing_Summary_Sept_2024.xlsx - 8 KPIs updated"
    },
    {
      id: 3,
      timestamp: "2024-10-10 16:47:15",
      type: "Auto Sync", 
      status: "error",
      message: "Failed to parse Collections_Report_Q3_2024.pdf - File format not recognized"
    },
    {
      id: 4,
      timestamp: "2024-10-08 02:00:15",
      type: "Scheduled Sync",
      status: "success", 
      message: "Automatic 24-hour sync completed - 24 KPIs updated across 4 properties"
    }
  ];

  const handleFileUpload = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const handleManualSync = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">AI Reader</h1>
        <p className="text-gray-600">Automatically sync from management software or manually upload reports</p>
      </div>

      {/* Management Software Integration */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">Management Software Integration</h2>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${managementSoftwareConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${managementSoftwareConnected ? 'text-green-600' : 'text-red-600'}`}>
                {managementSoftwareConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {managementSoftwareConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <Database className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Automatic Sync Active</h3>
              </div>
              <p className="text-green-800 text-sm mb-4">
                Reports are automatically pulled from your property management software every 24 hours.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="sr-only"
                  />
                  <div 
                    onClick={() => setAutoSync(!autoSync)}
                    className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                      autoSync ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-1 ml-1 ${
                      autoSync ? 'transform translate-x-4' : ''
                    }`} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-green-900">Auto Sync Every 24 Hours</span>
                </div>
                <button 
                  onClick={handleManualSync}
                  disabled={isProcessing}
                  className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <Link className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="font-medium text-gray-900">Connect Management Software</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Connect your property management software to automatically sync reports.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700">
                Connect Software
              </button>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p className="mb-1">Last Auto Sync: Oct 15, 2024 at 2:00 AM</p>
            <p>Next Scheduled Sync: Oct 16, 2024 at 2:00 AM</p>
          </div>
        </div>
      </div>

      {/* Manual Upload Zone */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Manual Report Upload</h2>
          <p className="text-sm text-gray-600 mt-1">Upload individual reports not covered by automatic sync</p>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="mb-4">
              <p className="text-lg font-medium text-black">Upload PDFs or Excel Reports</p>
              <p className="text-sm text-gray-600">Supported formats: PDF, XLS, XLSX</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleFileUpload}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </div>
                ) : (
                  "Choose Files"
                )}
              </button>
              <button className="border border-gray-300 px-6 py-2 font-medium text-black hover:bg-gray-50">
                Browse from Vault
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Extracted KPIs Panel */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-black">Extracted KPI Data</h2>
          </div>
          
          <div className="p-6">
            {extractedKPIs.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-black">{kpi.metric}</p>
                  <p className="text-sm text-gray-600">{kpi.source}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">{kpi.value}</p>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">{kpi.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Processing Status */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-black">AI Processing Status</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Bot className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-black">GPT-4 Document Parser: </span>
                <span className="text-green-600 ml-1">Active</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-black">Avg Processing Time: </span>
                <span className="text-black ml-1">45 seconds</span>
              </div>
              <div className="flex items-center text-sm">
                <Database className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-black">Auto Sync Status: </span>
                <span className={managementSoftwareConnected ? 'text-green-600' : 'text-red-600'}>
                  {managementSoftwareConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="font-medium text-black mb-3">Processing Queue</h3>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600">No documents currently processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status Log */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Processing History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {syncLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {log.type === 'Auto Sync' || log.type === 'Scheduled Sync' ? 'Management Software' : 'Manual Upload'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${
                        log.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIReader;
