
import React from 'react';
import LPReportBuilder from '@/components/reports/LPReportBuilder';
import Layout from '@/components/layout/Layout';

const LPReportGenerator = () => {
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <LPReportBuilder />
      </div>
    </Layout>
  );
};

export default LPReportGenerator;
