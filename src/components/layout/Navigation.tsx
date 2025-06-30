
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
  className = "fixed top-4 left-4 z-50" 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // If no history, go to landing page
        navigate('/');
      }
    }
  };

  // Show back button on all pages except the main landing page
  const hideOnRoutes = ['/'];
  const shouldShow = showBackButton && !hideOnRoutes.includes(location.pathname);

  if (!shouldShow) return null;

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 shadow-sm"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Navigation;
