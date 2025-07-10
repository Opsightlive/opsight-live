
import React from 'react';
import PropertyPaymentSetup from './PropertyPaymentSetup';

interface EnhancedPaymentSetupProps {
  onComplete: () => void;
}

const EnhancedPaymentSetup: React.FC<EnhancedPaymentSetupProps> = ({ onComplete }) => {
  return <PropertyPaymentSetup onComplete={onComplete} />;
};

export default EnhancedPaymentSetup;
