import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Events table for storing geo-located bizarre and strange events
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Event details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Primary category e.g., "crime", "transport", "fire"
  subcategories: text("subcategories"), // JSON array of subcategory IDs e.g., ["fights", "brawls"]
  tags: text("tags"), // JSON array of additional tags for flexible categorization
  eventDate: timestamp("eventDate").notNull(), // When the event occurred
  
  // Location data
  latitude: varchar("latitude", { length: 50 }).notNull(), // Store as string to avoid precision issues
  longitude: varchar("longitude", { length: 50 }).notNull(),
  locationName: varchar("locationName", { length: 255 }).notNull(), // e.g., "Camden Town, London"
  borough: varchar("borough", { length: 100 }), // London Borough e.g., "Camden", "Westminster"
  
  // Media
  videoUrl: text("videoUrl"), // URL to the video source (optional)
  thumbnailUrl: text("thumbnailUrl"), // Optional thumbnail image
  
  // Additional context
  sourceUrl: text("sourceUrl"), // Original source URL
  peopleInvolved: text("peopleInvolved"), // Names or descriptions of people involved
  backgroundInfo: text("backgroundInfo"), // Additional context and background
  details: text("details"), // Specific details about the event
  
  // Flags
  isCrime: boolean("isCrime").default(false).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(), // Whether the event has been verified
  
  // Metadata
  createdBy: int("createdBy").notNull(), // User ID who created this event
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
