import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertUserProfileSchema, 
  insertUserPreferencesSchema, 
  insertUserPropertySchema, 
  insertOnboardingDataSchema,
  insertKpiUpdateSchema,
  insertUserActivityLogSchema,
  insertPropertyMetricSchema,
  insertAlertSchema,
  insertAiInsightSchema,
  insertMarketDataSchema,
  insertIntegrationSchema,
  insertReportSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Calendly integration routes
  app.get("/api/calendly/booking-url", isAuthenticated, async (req: any, res) => {
    try {
      // Return the provided Calendly URL
      const calendlyUrl = "https://www.opsight.live/";
      res.json({ bookingUrl: calendlyUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to get booking URL" });
    }
  });

  app.post("/api/calendly/book", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { meetingType, dateTime, email, notes } = req.body;
      
      // Log the booking attempt
      await storage.createUserActivityLog({
        userId,
        actionType: "calendly_booking",
        actionDetails: {
          meetingType,
          dateTime,
          email,
          notes,
          calendlyUrl: "https://www.opsight.live/"
        },
        success: true
      });

      res.json({
        success: true,
        message: "Booking logged successfully",
        redirectUrl: "https://www.opsight.live/"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process booking" });
    }
  });
  // User Profile Routes (Protected)
  app.get("/api/user-profile/:id", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user profile" });
    }
  });

  app.get("/api/user-profile/by-email/:email", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getUserProfileByEmail(req.params.email);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user profile" });
    }
  });

  app.post("/api/user-profile", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid user profile data" });
    }
  });

  app.put("/api/user-profile/:id", isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // User Properties Routes
  app.get("/api/user-properties/:userId", async (req, res) => {
    try {
      const properties = await storage.getUserProperties(req.params.userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user properties" });
    }
  });

  app.post("/api/user-properties", async (req, res) => {
    try {
      const validatedData = insertUserPropertySchema.parse(req.body);
      const property = await storage.createUserProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid user property data" });
    }
  });

  app.put("/api/user-properties/:id", async (req, res) => {
    try {
      const property = await storage.updateUserProperty(req.params.id, req.body);
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user property" });
    }
  });

  app.delete("/api/user-properties/:id", async (req, res) => {
    try {
      await storage.deleteUserProperty(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user property" });
    }
  });

  // User Preferences Routes
  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(req.params.userId);
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user preferences" });
    }
  });

  app.post("/api/user-preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.createUserPreferences(validatedData);
      res.status(201).json(preferences);
    } catch (error) {
      res.status(400).json({ error: "Invalid user preferences data" });
    }
  });

  app.put("/api/user-preferences/:userId", async (req, res) => {
    try {
      const preferences = await storage.updateUserPreferences(req.params.userId, req.body);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  // Onboarding Data Routes
  app.get("/api/onboarding-data/:userId", async (req, res) => {
    try {
      const data = await storage.getOnboardingData(req.params.userId);
      if (!data) {
        return res.status(404).json({ error: "Onboarding data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get onboarding data" });
    }
  });

  app.post("/api/onboarding-data", async (req, res) => {
    try {
      const validatedData = insertOnboardingDataSchema.parse(req.body);
      const data = await storage.createOnboardingData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid onboarding data" });
    }
  });

  app.put("/api/onboarding-data/:userId", async (req, res) => {
    try {
      const data = await storage.updateOnboardingData(req.params.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update onboarding data" });
    }
  });

  // KPI Updates Routes
  app.get("/api/kpi-updates/:userId", async (req, res) => {
    try {
      const updates = await storage.getKpiUpdates(req.params.userId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get KPI updates" });
    }
  });

  app.post("/api/kpi-updates", async (req, res) => {
    try {
      const validatedData = insertKpiUpdateSchema.parse(req.body);
      const update = await storage.createKpiUpdate(validatedData);
      res.status(201).json(update);
    } catch (error) {
      res.status(400).json({ error: "Invalid KPI update data" });
    }
  });

  // User Activity Logs Routes
  app.get("/api/user-activity-logs/:userId", async (req, res) => {
    try {
      const logs = await storage.getUserActivityLogs(req.params.userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user activity logs" });
    }
  });

  app.post("/api/user-activity-logs", async (req, res) => {
    try {
      const validatedData = insertUserActivityLogSchema.parse(req.body);
      const log = await storage.createUserActivityLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid user activity log data" });
    }
  });

  // Business Intelligence API Routes

  // Property Metrics Routes
  app.get("/api/property-metrics/:propertyId", async (req, res) => {
    try {
      const { metricType } = req.query;
      const metrics = await storage.getPropertyMetrics(req.params.propertyId, metricType as string);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to get property metrics" });
    }
  });

  app.post("/api/property-metrics", async (req, res) => {
    try {
      const validatedData = insertPropertyMetricSchema.parse(req.body);
      const metric = await storage.createPropertyMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid property metric data" });
    }
  });

  app.get("/api/metrics-summary/:userId", async (req, res) => {
    try {
      const summary = await storage.getMetricsSummary(req.params.userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to get metrics summary" });
    }
  });

  // Alerts Routes
  app.get("/api/alerts/:userId", async (req, res) => {
    try {
      const { unreadOnly } = req.query;
      const alerts = await storage.getAlerts(req.params.userId, unreadOnly === 'true');
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:alertId/read", async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.alertId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark alert as read" });
    }
  });

  app.patch("/api/alerts/:alertId/resolve", async (req, res) => {
    try {
      const { resolvedBy } = req.body;
      await storage.resolveAlert(req.params.alertId, resolvedBy);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve alert" });
    }
  });

  // AI Insights Routes
  app.get("/api/ai-insights/:userId", async (req, res) => {
    try {
      const { propertyId } = req.query;
      const insights = await storage.getAiInsights(req.params.userId, propertyId as string);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const validatedData = insertAiInsightSchema.parse(req.body);
      const insight = await storage.createAiInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      res.status(400).json({ error: "Invalid AI insight data" });
    }
  });

  app.patch("/api/ai-insights/:insightId/implement", async (req, res) => {
    try {
      await storage.markInsightAsImplemented(req.params.insightId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark insight as implemented" });
    }
  });

  // Market Data Routes
  app.get("/api/market-data/:area", async (req, res) => {
    try {
      const { dataType } = req.query;
      const marketData = await storage.getMarketData(req.params.area, dataType as string);
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: "Failed to get market data" });
    }
  });

  app.post("/api/market-data", async (req, res) => {
    try {
      const validatedData = insertMarketDataSchema.parse(req.body);
      const data = await storage.createMarketData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid market data" });
    }
  });

  // Integrations Routes
  app.get("/api/integrations/:userId", async (req, res) => {
    try {
      const integrations = await storage.getIntegrations(req.params.userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      res.status(400).json({ error: "Invalid integration data" });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const integration = await storage.updateIntegration(req.params.id, req.body);
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to update integration" });
    }
  });

  // Reports Routes
  app.get("/api/reports/:userId", async (req, res) => {
    try {
      const reports = await storage.getReports(req.params.userId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  app.put("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.updateReport(req.params.id, req.body);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  // Advanced Business Intelligence Endpoints
  
  // Dashboard Data Endpoint - Returns comprehensive dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const [properties, alerts, insights, metrics] = await Promise.all([
        storage.getUserProperties(req.params.userId),
        storage.getAlerts(req.params.userId, true),
        storage.getAiInsights(req.params.userId),
        storage.getMetricsSummary(req.params.userId)
      ]);

      // Generate sample KPI data
      const kpiData = {
        occupancy: { value: 92.5, change: +2.3, trend: 'up' },
        revenue: { value: metrics.totalRevenue, change: +5.2, trend: 'up' },
        noi: { value: metrics.totalRevenue * 0.6, change: +3.1, trend: 'up' },
        expenses: { value: metrics.totalRevenue * 0.4, change: -1.2, trend: 'down' }
      };

      res.json({
        properties,
        alerts: alerts.slice(0, 5), // Latest 5 alerts
        insights: insights.slice(0, 3), // Latest 3 insights
        metrics,
        kpiData,
        summary: {
          totalProperties: properties.length,
          totalUnits: properties.reduce((sum, p) => sum + p.units, 0),
          occupiedUnits: Math.floor(properties.reduce((sum, p) => sum + p.units, 0) * 0.925),
          unreadAlerts: alerts.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard data" });
    }
  });

  // AI Analysis Endpoint - Generates AI insights for properties
  app.post("/api/ai-analysis", async (req, res) => {
    try {
      const { userId, propertyId, analysisType } = req.body;
      
      // Mock AI analysis based on property data
      const property = await storage.getUserProperties(userId);
      const targetProperty = property.find(p => p.id === propertyId);
      
      if (!targetProperty) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Generate AI insights based on analysis type
      const insights = await generateAIInsights(targetProperty, analysisType);
      
      // Store the insights
      for (const insight of insights) {
        await storage.createAiInsight({
          userId,
          propertyId,
          ...insight
        });
      }

      res.json({ insights, message: "AI analysis completed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to perform AI analysis" });
    }
  });

  // Predictive Analytics Endpoint
  app.post("/api/predictive-analytics", async (req, res) => {
    try {
      const { userId, timeframe, metrics } = req.body;
      
      // Mock predictive analytics
      const predictions = {
        occupancy: {
          current: 92.5,
          predicted: [93.2, 94.1, 93.8, 95.2],
          confidence: 87.3
        },
        revenue: {
          current: 150000,
          predicted: [155000, 162000, 158000, 167000],
          confidence: 91.2
        },
        maintenance: {
          upcomingIssues: 3,
          riskScore: 0.23,
          recommendations: ["Schedule HVAC maintenance", "Inspect plumbing in Building A"]
        }
      };

      res.json({ predictions, timeframe, generatedAt: new Date() });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate predictive analytics" });
    }
  });

  // Seed data endpoint (for testing)
  app.post("/api/seed-data", async (req, res) => {
    try {
      const { seedBusinessIntelligenceData } = await import("./seedData");
      const userId = await seedBusinessIntelligenceData();
      res.json({ 
        success: true, 
        message: "Sample business intelligence data created successfully",
        userId
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;

// Helper function to generate AI insights
async function generateAIInsights(property: any, analysisType: string) {
  const insights = [];
  
  switch (analysisType) {
    case 'performance':
      insights.push({
        insightType: 'performance',
        category: 'financial',
        title: 'Revenue Optimization Opportunity',
        description: `Property ${property.name} is performing below market average for rent per unit.`,
        recommendation: 'Consider increasing rent by 3-5% to match market rates while maintaining competitive positioning.',
        confidence: 89.5,
        impact: 'medium'
      });
      break;
      
    case 'market':
      insights.push({
        insightType: 'market',
        category: 'market',
        title: 'Market Trend Analysis',
        description: 'Local market shows increasing demand for multifamily housing.',
        recommendation: 'This is an opportune time to consider rent increases or property improvements.',
        confidence: 92.1,
        impact: 'high'
      });
      break;
      
    case 'risk':
      insights.push({
        insightType: 'risk',
        category: 'operational',
        title: 'Maintenance Risk Assessment',
        description: 'Aging HVAC systems may require replacement within 2 years.',
        recommendation: 'Schedule preventive maintenance and budget for system replacement.',
        confidence: 76.8,
        impact: 'high'
      });
      break;
      
    default:
      insights.push({
        insightType: 'opportunity',
        category: 'operational',
        title: 'General Property Analysis',
        description: 'Property shows strong fundamentals with room for improvement.',
        recommendation: 'Focus on tenant retention and minor capital improvements.',
        confidence: 82.3,
        impact: 'medium'
      });
  }
  
  return insights;
}
}
