
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Property {
  id: string;
  name: string;
  pm_software: string;
  integration_id: string;
  sync_status: string;
  last_sync: string | null;
  kpi_data?: any[];
}

export const usePropertyData = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProperties = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get PM integrations with their KPI data
      const { data: integrations, error: intError } = await supabase
        .from('pm_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (intError) throw intError;

      if (!integrations || integrations.length === 0) {
        setProperties([]);
        setCurrentProperty(null);
        return;
      }

      // Get KPI data for each integration
      const propertiesWithData = await Promise.all(
        integrations.map(async (integration) => {
          const { data: kpiData } = await supabase
            .from('extracted_kpis')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          // Get unique property names from KPI data for this integration
          const propertyNames = kpiData 
            ? [...new Set(kpiData.map(k => k.property_name).filter(Boolean))]
            : [integration.integration_name];

          return propertyNames.map(propertyName => ({
            id: `${integration.id}-${propertyName}`,
            name: propertyName || integration.integration_name,
            pm_software: integration.pm_software,
            integration_id: integration.id,
            sync_status: integration.sync_status,
            last_sync: integration.last_sync,
            kpi_data: kpiData?.filter(k => k.property_name === propertyName) || []
          }));
        })
      );

      const flattenedProperties = propertiesWithData.flat();
      setProperties(flattenedProperties);
      
      // Set current property to first one if none selected
      if (!currentProperty && flattenedProperties.length > 0) {
        setCurrentProperty(flattenedProperties[0]);
      }

    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setCurrentProperty(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentProperty]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  return {
    properties,
    currentProperty,
    setCurrentProperty,
    isLoading,
    refreshProperties: loadProperties
  };
};
