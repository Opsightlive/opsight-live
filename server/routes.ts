import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserProfileSchema, 
  insertUserPreferencesSchema, 
  insertUserPropertySchema, 
  insertOnboardingDataSchema,
  insertKpiUpdateSchema,
  insertUserActivityLogSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User Profile Routes
  app.get("/api/user-profile/:id", async (req, res) => {
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

  app.get("/api/user-profile/by-email/:email", async (req, res) => {
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

  app.post("/api/user-profile", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid user profile data" });
    }
  });

  app.put("/api/user-profile/:id", async (req, res) => {
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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
