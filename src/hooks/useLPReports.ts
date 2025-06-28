
import { useState, useEffect, useCallback } from 'react';
import { lpReportService, LPReport, LPReportTemplate, ReportGenerationStats } from '@/services/lpReportService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useLPReports = (userId: string) => {
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  // Queries
  const {
    data: reports = [],
    isLoading: reportsLoading,
    error: reportsError
  } = useQuery({
    queryKey: ['lp-reports', userId],
    queryFn: () => lpReportService.getReports(userId),
    enabled: !!userId,
    refetchInterval: 30000 // Refetch every 30 seconds for status updates
  });

  const {
    data: templates = [],
    isLoading: templatesLoading
  } = useQuery({
    queryKey: ['lp-report-templates', userId],
    queryFn: () => lpReportService.getReportTemplates(userId),
    enabled: !!userId
  });

  const {
    data: statistics
  } = useQuery({
    queryKey: ['lp-report-statistics', userId],
    queryFn: () => lpReportService.getReportStatistics(userId),
    enabled: !!userId
  });

  // Mutations
  const generateReportMutation = useMutation({
    mutationFn: (config: any) => lpReportService.generateReport(userId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-reports', userId] });
    }
  });

  const saveTemplateMutation = useMutation({
    mutationFn: (template: LPReportTemplate) => lpReportService.saveReportTemplate(userId, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-report-templates', userId] });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: string) => lpReportService.deleteReportTemplate(userId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-report-templates', userId] });
    }
  });

  const downloadReportMutation = useMutation({
    mutationFn: (reportId: string) => lpReportService.downloadReport(userId, reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-reports', userId] });
    }
  });

  const emailReportMutation = useMutation({
    mutationFn: ({ reportId, recipients }: { reportId: string; recipients: string[] }) => 
      lpReportService.emailReport(userId, reportId, recipients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-reports', userId] });
    }
  });

  // Real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = lpReportService.subscribeToReportUpdates(userId, (updatedReport) => {
      queryClient.setQueryData(['lp-reports', userId], (oldData: LPReport[] = []) => {
        const index = oldData.findIndex(report => report.id === updatedReport.id);
        if (index >= 0) {
          const newData = [...oldData];
          newData[index] = updatedReport;
          return newData;
        }
        return [updatedReport, ...oldData];
      });
    });

    setRealtimeChannel(channel);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [userId, queryClient]);

  // Helper functions
  const getReportsByStatus = useCallback((status: string) => {
    return reports.filter(report => report.generation_status === status);
  }, [reports]);

  const getRecentReports = useCallback((limit: number = 5) => {
    return reports.slice(0, limit);
  }, [reports]);

  return {
    // Data
    reports,
    templates,
    statistics,
    
    // Loading states
    reportsLoading,
    templatesLoading,
    
    // Error states
    reportsError,
    
    // Mutations
    generateReport: generateReportMutation.mutate,
    generateReportLoading: generateReportMutation.isPending,
    
    saveTemplate: saveTemplateMutation.mutate,
    saveTemplateLoading: saveTemplateMutation.isPending,
    
    deleteTemplate: deleteTemplateMutation.mutate,
    deleteTemplateLoading: deleteTemplateMutation.isPending,
    
    downloadReport: downloadReportMutation.mutate,
    downloadReportLoading: downloadReportMutation.isPending,
    
    emailReport: emailReportMutation.mutate,
    emailReportLoading: emailReportMutation.isPending,
    
    // Helper functions
    getReportsByStatus,
    getRecentReports,
    
    // Default sections
    getDefaultSections: lpReportService.getDefaultReportSections
  };
};
