
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus } from 'lucide-react';

interface KPINoDataStateProps {
  category: string;
  onReset: () => void;
}

const KPINoDataState = ({ category, onReset }: KPINoDataStateProps) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No KPI Data Available</h3>
        <p className="text-gray-600 mb-6">
          {category === 'all' 
            ? 'No KPI metrics found. Start by adding some properties and data sources.'
            : `No metrics found for ${category} category. Try selecting a different category or add data sources.`
          }
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onReset} variant="outline">
            View All Categories
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Data Source
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPINoDataState;
