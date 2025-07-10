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

// Legacy users table for backward compatibility
export const users = pgTable("users", {
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
