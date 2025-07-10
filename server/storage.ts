import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  userProfiles, 
  userPreferences, 
  userProperties, 
  onboardingData,
  kpiUpdates,
  userActivityLogs,
  type User, 
  type InsertUser,
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
  type InsertUserActivityLog
} from "@shared/schema";

export interface IStorage {
  // Legacy user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<string, UserProfile>;
  private userPreferences: Map<string, UserPreferences>;
  private userProperties: Map<string, UserProperty[]>;
  private onboardingData: Map<string, OnboardingData>;
  private kpiUpdates: Map<string, KpiUpdate[]>;
  private userActivityLogs: Map<string, UserActivityLog[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.userPreferences = new Map();
    this.userProperties = new Map();
    this.onboardingData = new Map();
    this.kpiUpdates = new Map();
    this.userActivityLogs = new Map();
    this.currentId = 1;
  }

  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
}

// Use DatabaseStorage for production, MemStorage for development/testing
export const storage = new DatabaseStorage();
