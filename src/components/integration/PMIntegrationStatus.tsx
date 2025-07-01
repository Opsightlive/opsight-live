
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Integration {
  id: string;
  pm_software: string;
  integration_name: string;
  sync_status: string;
  last_sync: string | null;
  error_log: string | null;
  sync_frequency: string;
  created_at: string;
}

const PMIntegrationStatus = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchIntegrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pm_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching integrations:', error);
        toast.error('Failed to load integrations');
        return;
      }

      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshIntegrations = async () => {
    setIsRefreshing(true);
    await fetchIntegrations();
    setIsRefreshing(false);
    toast.success('Integration status refreshed');
  };

  useEffect(() => {
    fetchIntegrations();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('pm_integrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pm_integrations',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Integration update received:', payload);
          fetchIntegrations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      case 'syncing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'paused': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Integration Status</h2>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Integration Status</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshIntegrations}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => window.location.href = '/pm-integration'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Integrations Found</h3>
            <p className="text-gray-600 mb-4">
              Connect your property management system to start syncing data automatically.
            </p>
            <Button onClick={() => window.location.href = '/pm-integration'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Integration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <span>{integration.integration_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {integration.pm_software}
                    </Badge>
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(integration.sync_status)}`}
                  >
                    {getStatusIcon(integration.sync_status)}
                    <span className="ml-1 capitalize">{integration.sync_status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Last Sync</h4>
                    <p className="text-sm text-gray-600">
                      {integration.last_sync 
                        ? new Date(integration.last_sync).toLocaleString()
                        : 'Never synced'
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Sync Frequency</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {integration.sync_frequency}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Created</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(integration.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {integration.error_log && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-sm text-red-800 mb-1">Error Details</h4>
                    <p className="text-sm text-red-700">{integration.error_log}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PMIntegrationStatus;
