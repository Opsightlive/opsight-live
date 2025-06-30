
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
  className 
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
    <div className={className || "fixed top-4 left-4 z-[99999]"}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="bg-white hover:bg-gray-50 border-2 border-gray-400 shadow-2xl h-12 w-12 rounded-full flex items-center justify-center p-0 hover:shadow-3xl transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Button>
    </div>
  );
};

export default Navigation;
