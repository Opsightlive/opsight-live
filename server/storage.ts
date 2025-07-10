import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  legacyUsers,
  userProfiles, 
  userPreferences, 
  userProperties, 
  onboardingData,
  kpiUpdates,
  userActivityLogs,
  propertyMetrics,
  alerts,
  aiInsights,
  marketData,
  integrations,
  reports,
  type User, 
  type UpsertUser,
  type LegacyUser,
  type InsertLegacyUser,
  type UserProfile,
  type InsertUserProfile,
  type UserPreferences,
  type InsertUserPreferences,
  type UserProperty,
  type InsertUserProperty,
  type OnboardingData,
  type InsertOnboardingData,
  type KpiUpdate,
  type InsertKpiUpdate,
  type UserActivityLog,
  type InsertUserActivityLog,
  type PropertyMetric,
  type InsertPropertyMetric,
  type Alert,
  type InsertAlert,
  type AiInsight,
  type InsertAiInsight,
  type MarketData,
  type InsertMarketData,
  type Integration,
  type InsertIntegration,
  type Report,
  type InsertReport
} from "@shared/schema";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legacy user methods
  getLegacyUser(id: number): Promise<LegacyUser | undefined>;
  getLegacyUserByUsername(username: string): Promise<LegacyUser | undefined>;
  createLegacyUser(user: InsertLegacyUser): Promise<LegacyUser>;
  
  // User profile methods
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  
  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences>;
  
  // User properties methods
  getUserProperties(userId: string): Promise<UserProperty[]>;
  createUserProperty(property: InsertUserProperty): Promise<UserProperty>;
  updateUserProperty(id: string, updates: Partial<UserProperty>): Promise<UserProperty>;
  deleteUserProperty(id: string): Promise<void>;
  
  // Onboarding data methods
  getOnboardingData(userId: string): Promise<OnboardingData | undefined>;
  createOnboardingData(data: InsertOnboardingData): Promise<OnboardingData>;
  updateOnboardingData(userId: string, updates: Partial<OnboardingData>): Promise<OnboardingData>;
  
  // KPI updates methods
  getKpiUpdates(userId: string): Promise<KpiUpdate[]>;
  createKpiUpdate(update: InsertKpiUpdate): Promise<KpiUpdate>;
  
  // User activity logs methods
  getUserActivityLogs(userId: string): Promise<UserActivityLog[]>;
  createUserActivityLog(log: InsertUserActivityLog): Promise<UserActivityLog>;
  
  // Property metrics methods
  getPropertyMetrics(propertyId: string, metricType?: string): Promise<PropertyMetric[]>;
  createPropertyMetric(metric: InsertPropertyMetric): Promise<PropertyMetric>;
  getMetricsSummary(userId: string): Promise<any>;
  
  // Alerts methods
  getAlerts(userId: string, unreadOnly?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(alertId: string): Promise<void>;
  resolveAlert(alertId: string, resolvedBy: string): Promise<void>;
  
  // AI insights methods
  getAiInsights(userId: string, propertyId?: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  markInsightAsImplemented(insightId: string): Promise<void>;
  
  // Market data methods
  getMarketData(area: string, dataType?: string): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  
  // Integrations methods
  getIntegrations(userId: string): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration>;
  
  // Reports methods
  getReports(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: string, updates: Partial<Report>): Promise<Report>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Legacy user methods
  async getLegacyUser(id: number): Promise<LegacyUser | undefined> {
    const result = await db.select().from(legacyUsers).where(eq(legacyUsers.id, id));
    return result[0];
  }

  async getLegacyUserByUsername(username: string): Promise<LegacyUser | undefined> {
    const result = await db.select().from(legacyUsers).where(eq(legacyUsers.username, username));
    return result[0];
  }

  async createLegacyUser(insertUser: InsertLegacyUser): Promise<LegacyUser> {
    const result = await db.insert(legacyUsers).values(insertUser).returning();
    return result[0];
  }

  // User profile methods
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return result[0];
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.email, email));
    return result[0];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const result = await db.update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.id, id))
      .returning();
    return result[0];
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0];
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const result = await db.insert(userPreferences).values(preferences).returning();
    return result[0];
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const result = await db.update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return result[0];
  }

  // User properties methods
  async getUserProperties(userId: string): Promise<UserProperty[]> {
    return await db.select().from(userProperties).where(eq(userProperties.userId, userId));
  }

  async createUserProperty(property: InsertUserProperty): Promise<UserProperty> {
    const result = await db.insert(userProperties).values(property).returning();
    return result[0];
  }

  async updateUserProperty(id: string, updates: Partial<UserProperty>): Promise<UserProperty> {
    const result = await db.update(userProperties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProperties.id, id))
      .returning();
    return result[0];
  }

  async deleteUserProperty(id: string): Promise<void> {
    await db.delete(userProperties).where(eq(userProperties.id, id));
  }

  // Onboarding data methods
  async getOnboardingData(userId: string): Promise<OnboardingData | undefined> {
    const result = await db.select().from(onboardingData).where(eq(onboardingData.userId, userId));
    return result[0];
  }

  async createOnboardingData(data: InsertOnboardingData): Promise<OnboardingData> {
    const result = await db.insert(onboardingData).values(data).returning();
    return result[0];
  }

  async updateOnboardingData(userId: string, updates: Partial<OnboardingData>): Promise<OnboardingData> {
    const result = await db.update(onboardingData)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(onboardingData.userId, userId))
      .returning();
    return result[0];
  }

  // KPI updates methods
  async getKpiUpdates(userId: string): Promise<KpiUpdate[]> {
    return await db.select().from(kpiUpdates).where(eq(kpiUpdates.userId, userId));
  }

  async createKpiUpdate(update: InsertKpiUpdate): Promise<KpiUpdate> {
    const result = await db.insert(kpiUpdates).values(update).returning();
    return result[0];
  }

  // User activity logs methods
  async getUserActivityLogs(userId: string): Promise<UserActivityLog[]> {
    return await db.select().from(userActivityLogs).where(eq(userActivityLogs.userId, userId));
  }

  async createUserActivityLog(log: InsertUserActivityLog): Promise<UserActivityLog> {
    const result = await db.insert(userActivityLogs).values(log).returning();
    return result[0];
  }

  // Property metrics methods
  async getPropertyMetrics(propertyId: string, metricType?: string): Promise<PropertyMetric[]> {
    if (metricType) {
      return await db.select().from(propertyMetrics)
        .where(and(eq(propertyMetrics.propertyId, propertyId), eq(propertyMetrics.metricType, metricType)))
        .orderBy(desc(propertyMetrics.date));
    }
    
    return await db.select().from(propertyMetrics)
      .where(eq(propertyMetrics.propertyId, propertyId))
      .orderBy(desc(propertyMetrics.date));
  }

  async createPropertyMetric(metric: InsertPropertyMetric): Promise<PropertyMetric> {
    const result = await db.insert(propertyMetrics).values(metric).returning();
    return result[0];
  }

  async getMetricsSummary(userId: string): Promise<any> {
    // Get user's properties first
    const userProps = await this.getUserProperties(userId);
    const propertyIds = userProps.map(p => p.id);
    
    if (propertyIds.length === 0) {
      return {
        totalProperties: 0,
        totalUnits: 0,
        totalRevenue: 0,
        averageOccupancy: 0,
        metrics: []
      };
    }

    // Calculate summary metrics
    const totalUnits = userProps.reduce((sum, prop) => sum + prop.units, 0);
    
    return {
      totalProperties: userProps.length,
      totalUnits,
      totalRevenue: totalUnits * 1500, // Mock calculation
      averageOccupancy: 92.5, // Mock calculation
      metrics: [
        {
          type: 'occupancy',
          value: 92.5,
          change: +2.3,
          trend: 'up'
        },
        {
          type: 'revenue',
          value: totalUnits * 1500,
          change: +5.2,
          trend: 'up'
        },
        {
          type: 'noi',
          value: totalUnits * 850,
          change: +3.1,
          trend: 'up'
        }
      ]
    };
  }

  // Alerts methods
  async getAlerts(userId: string, unreadOnly?: boolean): Promise<Alert[]> {
    if (unreadOnly) {
      return await db.select().from(alerts)
        .where(and(eq(alerts.userId, userId), eq(alerts.isRead, false)))
        .orderBy(desc(alerts.createdAt));
    }
    
    return await db.select().from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    await db.update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, alertId));
  }

  async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
    await db.update(alerts)
      .set({ 
        isResolved: true, 
        resolvedAt: new Date(),
        resolvedBy: resolvedBy 
      })
      .where(eq(alerts.id, alertId));
  }

  // AI insights methods
  async getAiInsights(userId: string, propertyId?: string): Promise<AiInsight[]> {
    if (propertyId) {
      return await db.select().from(aiInsights)
        .where(and(eq(aiInsights.userId, userId), eq(aiInsights.propertyId, propertyId)))
        .orderBy(desc(aiInsights.createdAt));
    }
    
    return await db.select().from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.createdAt));
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const result = await db.insert(aiInsights).values(insight).returning();
    return result[0];
  }

  async markInsightAsImplemented(insightId: string): Promise<void> {
    await db.update(aiInsights)
      .set({ 
        isImplemented: true,
        implementedAt: new Date()
      })
      .where(eq(aiInsights.id, insightId));
  }

  // Market data methods
  async getMarketData(area: string, dataType?: string): Promise<MarketData[]> {
    if (dataType) {
      return await db.select().from(marketData)
        .where(and(eq(marketData.area, area), eq(marketData.dataType, dataType)))
        .orderBy(desc(marketData.period));
    }
    
    return await db.select().from(marketData)
      .where(eq(marketData.area, area))
      .orderBy(desc(marketData.period));
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const result = await db.insert(marketData).values(data).returning();
    return result[0];
  }

  // Integrations methods
  async getIntegrations(userId: string): Promise<Integration[]> {
    return await db.select().from(integrations).where(eq(integrations.userId, userId));
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const result = await db.insert(integrations).values(integration).returning();
    return result[0];
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    const result = await db.update(integrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(integrations.id, id))
      .returning();
    return result[0];
  }

  // Reports methods
  async getReports(userId: string): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.userId, userId));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(report).returning();
    return result[0];
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    const result = await db.update(reports)
      .set(updates)
      .where(eq(reports.id, id))
      .returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private legacyUsers: Map<number, LegacyUser>;
  private userProfiles: Map<string, UserProfile>;
  private userPreferences: Map<string, UserPreferences>;
  private userProperties: Map<string, UserProperty[]>;
  private onboardingData: Map<string, OnboardingData>;
  private kpiUpdates: Map<string, KpiUpdate[]>;
  private userActivityLogs: Map<string, UserActivityLog[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.legacyUsers = new Map();
    this.userProfiles = new Map();
    this.userPreferences = new Map();
    this.userProperties = new Map();
    this.onboardingData = new Map();
    this.kpiUpdates = new Map();
    this.userActivityLogs = new Map();
    this.currentId = 1;
  }

  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...existingUser,
      ...userData,
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
  }

  // Legacy user methods
  async getLegacyUser(id: number): Promise<LegacyUser | undefined> {
    return this.legacyUsers.get(id);
  }

  async getLegacyUserByUsername(username: string): Promise<LegacyUser | undefined> {
    return Array.from(this.legacyUsers.values()).find(
      (user) => user.username === username,
    );
  }

  async createLegacyUser(insertUser: InsertLegacyUser): Promise<LegacyUser> {
    const id = this.currentId++;
    const user: LegacyUser = { ...insertUser, id };
    this.legacyUsers.set(id, user);
    return user;
  }

  // User profile methods
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.email === email,
    );
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = crypto.randomUUID();
    const userProfile: UserProfile = { 
      ...profile, 
      id,
      fullName: profile.fullName ?? null,
      companyName: profile.companyName ?? null,
      role: profile.role ?? null,
      phone: profile.phone ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existing = this.userProfiles.get(id);
    if (!existing) throw new Error(`User profile ${id} not found`);
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.userProfiles.set(id, updated);
    return updated;
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = crypto.randomUUID();
    const userPrefs: UserPreferences = { 
      ...preferences, 
      id,
      userId: preferences.userId ?? null,
      preferences: preferences.preferences ?? {},
      savedViews: preferences.savedViews ?? [],
      savedFilters: preferences.savedFilters ?? {},
      dashboardSettings: preferences.dashboardSettings ?? {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userPreferences.set(preferences.userId!, userPrefs);
    return userPrefs;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const existing = this.userPreferences.get(userId);
    if (!existing) throw new Error(`User preferences ${userId} not found`);
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.userPreferences.set(userId, updated);
    return updated;
  }

  // User properties methods
  async getUserProperties(userId: string): Promise<UserProperty[]> {
    return this.userProperties.get(userId) || [];
  }

  async createUserProperty(property: InsertUserProperty): Promise<UserProperty> {
    const id = crypto.randomUUID();
    const userProperty: UserProperty = { 
      ...property, 
      id,
      userId: property.userId ?? null,
      pmSoftware: property.pmSoftware ?? null,
      paymentMethod: property.paymentMethod ?? null,
      monthlyCost: property.monthlyCost ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.userProperties.get(property.userId!) || [];
    this.userProperties.set(property.userId!, [...existing, userProperty]);
    return userProperty;
  }

  async updateUserProperty(id: string, updates: Partial<UserProperty>): Promise<UserProperty> {
    for (const [userId, properties] of Array.from(this.userProperties.entries())) {
      const index = properties.findIndex((p: UserProperty) => p.id === id);
      if (index !== -1) {
        const updated = { ...properties[index], ...updates, updatedAt: new Date() };
        properties[index] = updated;
        return updated;
      }
    }
    throw new Error(`User property ${id} not found`);
  }

  async deleteUserProperty(id: string): Promise<void> {
    for (const [userId, properties] of Array.from(this.userProperties.entries())) {
      const index = properties.findIndex((p: UserProperty) => p.id === id);
      if (index !== -1) {
        properties.splice(index, 1);
        return;
      }
    }
    throw new Error(`User property ${id} not found`);
  }

  // Onboarding data methods
  async getOnboardingData(userId: string): Promise<OnboardingData | undefined> {
    return this.onboardingData.get(userId);
  }

  async createOnboardingData(data: InsertOnboardingData): Promise<OnboardingData> {
    const id = crypto.randomUUID();
    const onboarding: OnboardingData = { 
      ...data, 
      id,
      userId: data.userId ?? null,
      companyName: data.companyName ?? null,
      role: data.role ?? null,
      dataSource: data.dataSource ?? null,
      totalCost: data.totalCost ?? null,
      discount: data.discount ?? null,
      setupCompleted: data.setupCompleted ?? null,
      paymentCompleted: data.paymentCompleted ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.onboardingData.set(data.userId!, onboarding);
    return onboarding;
  }

  async updateOnboardingData(userId: string, updates: Partial<OnboardingData>): Promise<OnboardingData> {
    const existing = this.onboardingData.get(userId);
    if (!existing) throw new Error(`Onboarding data ${userId} not found`);
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.onboardingData.set(userId, updated);
    return updated;
  }

  // KPI updates methods
  async getKpiUpdates(userId: string): Promise<KpiUpdate[]> {
    return this.kpiUpdates.get(userId) || [];
  }

  async createKpiUpdate(update: InsertKpiUpdate): Promise<KpiUpdate> {
    const id = crypto.randomUUID();
    const kpiUpdate: KpiUpdate = { 
      ...update, 
      id,
      userId: update.userId ?? null,
      propertyId: update.propertyId ?? null,
      currentValue: update.currentValue ?? null,
      previousValue: update.previousValue ?? null,
      changePercentage: update.changePercentage ?? null,
      alertLevel: update.alertLevel ?? null,
      createdAt: new Date()
    };
    
    const existing = this.kpiUpdates.get(update.userId!) || [];
    this.kpiUpdates.set(update.userId!, [...existing, kpiUpdate]);
    return kpiUpdate;
  }

  // User activity logs methods
  async getUserActivityLogs(userId: string): Promise<UserActivityLog[]> {
    return this.userActivityLogs.get(userId) || [];
  }

  async createUserActivityLog(log: InsertUserActivityLog): Promise<UserActivityLog> {
    const id = crypto.randomUUID();
    const activityLog: UserActivityLog = { 
      ...log, 
      id,
      userId: log.userId ?? null,
      actionDetails: log.actionDetails ?? {},
      success: log.success ?? null,
      errorMessage: log.errorMessage ?? null,
      createdAt: new Date()
    };
    
    const existing = this.userActivityLogs.get(log.userId!) || [];
    this.userActivityLogs.set(log.userId!, [...existing, activityLog]);
    return activityLog;
  }

  // Business Intelligence methods - simplified for MemStorage
  async getPropertyMetrics(propertyId: string, metricType?: string): Promise<PropertyMetric[]> {
    return []; // Mock implementation
  }

  async createPropertyMetric(metric: InsertPropertyMetric): Promise<PropertyMetric> {
    return { ...metric, id: crypto.randomUUID(), createdAt: new Date() } as PropertyMetric;
  }

  async getMetricsSummary(userId: string): Promise<any> {
    return {
      totalProperties: 0,
      totalUnits: 0,
      totalRevenue: 0,
      averageOccupancy: 0,
      metrics: []
    };
  }

  async getAlerts(userId: string, unreadOnly?: boolean): Promise<Alert[]> {
    return [];
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    return { ...alert, id: crypto.randomUUID(), isRead: false, isResolved: false, resolvedAt: null, resolvedBy: null, createdAt: new Date() } as Alert;
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    // No-op for MemStorage
  }

  async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
    // No-op for MemStorage
  }

  async getAiInsights(userId: string, propertyId?: string): Promise<AiInsight[]> {
    return [];
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    return { ...insight, id: crypto.randomUUID(), isImplemented: false, implementedAt: null, createdAt: new Date() } as AiInsight;
  }

  async markInsightAsImplemented(insightId: string): Promise<void> {
    // No-op for MemStorage
  }

  async getMarketData(area: string, dataType?: string): Promise<MarketData[]> {
    return [];
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    return { ...data, id: crypto.randomUUID(), createdAt: new Date() } as MarketData;
  }

  async getIntegrations(userId: string): Promise<Integration[]> {
    return [];
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    return { ...integration, id: crypto.randomUUID(), lastSync: null, errorMessage: null, createdAt: new Date(), updatedAt: new Date() } as Integration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    return { id, ...updates, updatedAt: new Date() } as Integration;
  }

  async getReports(userId: string): Promise<Report[]> {
    return [];
  }

  async createReport(report: InsertReport): Promise<Report> {
    return { ...report, id: crypto.randomUUID(), data: {}, status: 'pending', filePath: null, createdAt: new Date(), completedAt: null } as Report;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    return { id, ...updates } as Report;
  }
}

// Use DatabaseStorage for production, MemStorage for development/testing
export const storage = new DatabaseStorage();
