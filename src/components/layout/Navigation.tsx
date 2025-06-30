
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
  className = "fixed top-6 left-6 z-[9999]" 
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
        variant="outline"
        size="lg"
        onClick={handleBack}
        className="bg-white hover:bg-gray-50 border-2 border-gray-300 shadow-xl h-14 w-14 rounded-full flex items-center justify-center min-h-[56px] min-w-[56px] p-0"
      >
        <ArrowLeft className="h-8 w-8 text-gray-700" />
      </Button>
    </div>
  );
};

export default Navigation;
