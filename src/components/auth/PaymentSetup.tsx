
import React from 'react';
import EnhancedPaymentSetup from './EnhancedPaymentSetup';

interface PaymentSetupProps {
  onComplete: () => void;
}

const PaymentSetup: React.FC<PaymentSetupProps> = ({ onComplete }) => {
  return <EnhancedPaymentSetup onComplete={onComplete} />;
};

export default PaymentSetup;
