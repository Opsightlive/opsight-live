
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PlaceholderModuleProps {
  moduleName: string;
  description?: string;
  comingSoon?: boolean;
}

const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ 
  moduleName, 
  description,
  comingSoon = true 
}) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <Construction className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{moduleName}</CardTitle>
          <CardDescription className="text-base">
            {description || `The ${moduleName} module is currently under development.`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {comingSoon && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Coming Soon!</p>
              <p className="text-sm text-blue-700 mt-1">
                This feature is actively being developed and will be available in an upcoming release.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">What's planned:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Advanced analytics and reporting</li>
              <li>• Real-time data visualization</li>
              <li>• Automated workflows and alerts</li>
              <li>• Integration with existing systems</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-2 text-xs text-gray-500">
            Route: {location.pathname}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderModule;
