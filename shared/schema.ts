import { pgTable, text, serial, integer, boolean, uuid, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  companyName: text("company_name"),
  role: text("role"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  preferences: jsonb("preferences").default({}),
  savedViews: jsonb("saved_views").default([]),
  savedFilters: jsonb("saved_filters").default({}),
  dashboardSettings: jsonb("dashboard_settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User properties table
export const userProperties = pgTable("user_properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  units: integer("units").notNull(),
  tier: text("tier").notNull(), // 'basic', 'professional', 'enterprise'
  pmSoftware: text("pm_software"),
  paymentMethod: text("payment_method"), // 'card', 'ach'
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Onboarding data table
export const onboardingData = pgTable("onboarding_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  companyName: text("company_name"),
  role: text("role"),
  dataSource: text("data_source"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 10, scale: 2 }),
  setupCompleted: boolean("setup_completed").default(false),
  paymentCompleted: boolean("payment_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KPI updates table
export const kpiUpdates = pgTable("kpi_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id").references(() => userProperties.id, { onDelete: "cascade" }),
  kpiType: text("kpi_type").notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  previousValue: decimal("previous_value", { precision: 10, scale: 2 }),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  alertLevel: text("alert_level"), // 'low', 'medium', 'high', 'critical'
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity logs table
export const userActivityLogs = pgTable("user_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(),
  actionDetails: jsonb("action_details").default({}),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property metrics table for real-time KPI tracking
export const propertyMetrics = pgTable("property_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => userProperties.id, { onDelete: "cascade" }),
  metricType: text("metric_type").notNull(), // 'occupancy', 'revenue', 'noi', 'expenses', etc.
  value: decimal("value", { precision: 15, scale: 2 }),
  period: text("period"), // 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts and notifications table
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id").references(() => userProperties.id, { onDelete: "cascade" }),
  alertType: text("alert_type").notNull(), // 'threshold', 'anomaly', 'predictive', 'maintenance'
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default({}),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: uuid("resolved_by").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI insights and recommendations table
export const aiInsights = pgTable("ai_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id").references(() => userProperties.id, { onDelete: "cascade" }),
  insightType: text("insight_type").notNull(), // 'performance', 'market', 'risk', 'opportunity'
  category: text("category").notNull(), // 'financial', 'operational', 'market', 'maintenance'
  title: text("title").notNull(),
  description: text("description").notNull(),
  recommendation: text("recommendation"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0-100
  impact: text("impact"), // 'low', 'medium', 'high'
  data: jsonb("data").default({}),
  isImplemented: boolean("is_implemented").default(false),
  implementedAt: timestamp("implemented_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Market data table for predictive analytics
export const marketData = pgTable("market_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  area: text("area").notNull(), // zip code, city, or market area
  dataType: text("data_type").notNull(), // 'rent', 'vacancy', 'absorption', 'supply'
  value: decimal("value", { precision: 15, scale: 2 }),
  period: timestamp("period").notNull(),
  source: text("source"), // 'costar', 'reis', 'axiometrics', etc.
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property management integrations table
export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id").references(() => userProperties.id, { onDelete: "cascade" }),
  integrationType: text("integration_type").notNull(), // 'yardi', 'appfolio', 'buildium', etc.
  status: text("status").notNull(), // 'connected', 'disconnected', 'error', 'syncing'
  lastSync: timestamp("last_sync"),
  config: jsonb("config").default({}),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reports table for generated reports
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  reportType: text("report_type").notNull(), // 'kpi', 'performance', 'financial', 'market'
  title: text("title").notNull(),
  description: text("description"),
  parameters: jsonb("parameters").default({}),
  data: jsonb("data").default({}),
  format: text("format").default('json'), // 'json', 'pdf', 'excel'
  status: text("status").default('pending'), // 'pending', 'generating', 'completed', 'failed'
  filePath: text("file_path"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Legacy users table for backward compatibility
export const legacyUsers = pgTable("legacy_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  email: true,
  fullName: true,
  companyName: true,
  role: true,
  phone: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  preferences: true,
  savedViews: true,
  savedFilters: true,
  dashboardSettings: true,
});

export const insertUserPropertySchema = createInsertSchema(userProperties).pick({
  userId: true,
  name: true,
  address: true,
  units: true,
  tier: true,
  pmSoftware: true,
  paymentMethod: true,
  monthlyCost: true,
});

export const insertOnboardingDataSchema = createInsertSchema(onboardingData).pick({
  userId: true,
  companyName: true,
  role: true,
  dataSource: true,
  totalCost: true,
  discount: true,
  setupCompleted: true,
  paymentCompleted: true,
});

export const insertKpiUpdateSchema = createInsertSchema(kpiUpdates).pick({
  userId: true,
  propertyId: true,
  kpiType: true,
  currentValue: true,
  previousValue: true,
  changePercentage: true,
  alertLevel: true,
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).pick({
  userId: true,
  actionType: true,
  actionDetails: true,
  success: true,
  errorMessage: true,
});

export const insertUserSchema = createInsertSchema(legacyUsers).pick({
  username: true,
  password: true,
});

export const insertPropertyMetricSchema = createInsertSchema(propertyMetrics).pick({
  propertyId: true,
  metricType: true,
  value: true,
  period: true,
  date: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  userId: true,
  propertyId: true,
  alertType: true,
  severity: true,
  title: true,
  message: true,
  data: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).pick({
  userId: true,
  propertyId: true,
  insightType: true,
  category: true,
  title: true,
  description: true,
  recommendation: true,
  confidence: true,
  impact: true,
  data: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).pick({
  area: true,
  dataType: true,
  value: true,
  period: true,
  source: true,
  metadata: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).pick({
  userId: true,
  propertyId: true,
  integrationType: true,
  status: true,
  config: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  userId: true,
  reportType: true,
  title: true,
  description: true,
  parameters: true,
  format: true,
});

// Types
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertUserProperty = z.infer<typeof insertUserPropertySchema>;
export type UserProperty = typeof userProperties.$inferSelect;

export type InsertOnboardingData = z.infer<typeof insertOnboardingDataSchema>;
export type OnboardingData = typeof onboardingData.$inferSelect;

export type InsertKpiUpdate = z.infer<typeof insertKpiUpdateSchema>;
export type KpiUpdate = typeof kpiUpdates.$inferSelect;

export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;

export type InsertLegacyUser = z.infer<typeof insertUserSchema>;
export type LegacyUser = typeof legacyUsers.$inferSelect;

export type InsertPropertyMetric = z.infer<typeof insertPropertyMetricSchema>;
export type PropertyMetric = typeof propertyMetrics.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
