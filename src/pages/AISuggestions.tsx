
import React from 'react';
import Layout from '@/components/layout/Layout';
import AISuggestionsPanel from '@/components/ai/AISuggestionsPanel';

const AISuggestions = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">AI Suggestions</h1>
          <p className="text-blue-100">
            Get personalized AI-powered recommendations to optimize your property management operations
          </p>
        </div>
        
        <div className="max-w-4xl">
          <AISuggestionsPanel />
        </div>
      </div>
    </Layout>
  );
};

export default AISuggestions;
