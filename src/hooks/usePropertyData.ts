
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
  property_count?: number;
}

export const usePropertyData = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProperties = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading properties for user:', user.id);

      // Get actual PM integrations from database
      const { data: integrations, error: intError } = await supabase
        .from('pm_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (intError) {
        console.error('Error loading integrations:', intError);
        throw intError;
      }

      console.log('Found integrations:', integrations);

      if (!integrations || integrations.length === 0) {
        console.log('No integrations found');
        setProperties([]);
        setCurrentProperty(null);
        setIsLoading(false);
        return;
      }

      // Get KPI data to find actual property names
      const { data: kpiData, error: kpiError } = await supabase
        .from('extracted_kpis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (kpiError) {
        console.error('Error loading KPI data:', kpiError);
      }

      console.log('Found KPI data:', kpiData);

      // Process integrations to create property list
      const processedProperties: Property[] = [];

      for (const integration of integrations) {
        // Get KPIs for this integration
        const integrationKPIs = kpiData?.filter(kpi => kpi.property_name) || [];
        
        if (integrationKPIs.length > 0) {
          // Get unique property names from KPI data
          const propertyNames = [...new Set(integrationKPIs.map(kpi => kpi.property_name))];
          
          propertyNames.forEach(propertyName => {
            const propertyKPIs = integrationKPIs.filter(kpi => kpi.property_name === propertyName);
            
            processedProperties.push({
              id: `${integration.id}-${propertyName}`,
              name: propertyName,
              pm_software: integration.pm_software,
              integration_id: integration.id,
              sync_status: integration.sync_status,
              last_sync: integration.last_sync,
              kpi_data: propertyKPIs
            });
          });
        } else {
          // If no KPI data, use integration name as property name
          processedProperties.push({
            id: integration.id,
            name: integration.integration_name || `${integration.pm_software} Property`,
            pm_software: integration.pm_software,
            integration_id: integration.id,
            sync_status: integration.sync_status,
            last_sync: integration.last_sync,
            kpi_data: []
          });
        }
      }

      console.log('Processed properties:', processedProperties);
      setProperties(processedProperties);
      
      // Set current property to first one if none selected
      if (!currentProperty && processedProperties.length > 0) {
        setCurrentProperty(processedProperties[0]);
        console.log('Set current property to:', processedProperties[0]);
      }

    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setCurrentProperty(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentProperty?.id]);

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  return {
    properties,
    currentProperty,
    setCurrentProperty,
    isLoading,
    refreshProperties: loadProperties
  };
};
