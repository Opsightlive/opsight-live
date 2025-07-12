import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface BackToHomeButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  children?: React.ReactNode;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ 
  variant = 'outline', 
  className = '',
  children = 'Back to Home'
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      // If user is logged in, go to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If user is not logged in, go to landing page
      navigate('/', { replace: true });
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};
