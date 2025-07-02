
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  showBackButton = true, 
  onBack, 
  className = "flex items-center mb-8" 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Don't show back button on home/landing pages
  const hideOnRoutes = ['/', '/login', '/signup'];
  const shouldShow = showBackButton && !hideOnRoutes.includes(location.pathname);

  if (!shouldShow) return null;

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="mr-4 hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Navigation;
