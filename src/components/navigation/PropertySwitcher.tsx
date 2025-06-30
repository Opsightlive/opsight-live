
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Plus, Settings } from 'lucide-react';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNavigate } from 'react-router-dom';

const PropertySwitcher = () => {
  const { properties, currentProperty, setCurrentProperty } = usePropertyData();
  const navigate = useNavigate();

  if (properties.length === 0) {
    return (
      <div className="p-3 border-b border-gray-200">
        <Button
          onClick={() => navigate('/data-integration')}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect Property
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Property</h3>
        <Badge 
          variant={currentProperty?.sync_status === 'active' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {currentProperty?.sync_status || 'inactive'}
        </Badge>
      </div>

      <Select
        value={currentProperty?.id || ''}
        onValueChange={(value) => {
          const property = properties.find(p => p.id === value);
          if (property) {
            setCurrentProperty(property);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select property" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              <div className="flex items-center justify-between w-full">
                <span>{property.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {property.pm_software}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentProperty && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Via {currentProperty.pm_software}</span>
          <Button
            onClick={() => navigate('/data-integration')}
            variant="ghost"
            size="sm"
            className="h-6 px-2"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertySwitcher;
