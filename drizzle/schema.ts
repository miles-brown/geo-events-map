import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Define role enum for PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin"]);

// Define status enum for event approval workflow
export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Events table for storing geo-located bizarre and strange events
 */
export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  
  // Event details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategories: text("subcategories"), // JSON array
  tags: text("tags"), // JSON array
  eventDate: timestamp("event_date").notNull(),
  timeOfDay: varchar("time_of_day", { length: 20 }), // "morning", "afternoon", "evening", "night"
  dayOfWeek: varchar("day_of_week", { length: 20 }), // "monday", "tuesday", etc.
  
  // Comprehensive Location Data
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  locationName: varchar("location_name", { length: 255 }).notNull(),
  fullAddress: text("full_address"), // Complete address string
  streetAddress: varchar("street_address", { length: 255 }), // Street name and number
  postcode: varchar("postcode", { length: 20 }), // UK postcode
  borough: varchar("borough", { length: 100 }), // London Borough
  district: varchar("district", { length: 100 }), // District/neighborhood
  ward: varchar("ward", { length: 100 }), // Electoral ward
  venueName: varchar("venue_name", { length: 255 }), // Specific venue/shop/landmark
  venueType: varchar("venue_type", { length: 100 }), // "shop", "restaurant", "station", "park", etc.
  nearbyLandmarks: text("nearby_landmarks"), // JSON array of nearby points of interest
  
  // Video & Media Metadata
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  videoDuration: integer("video_duration"), // Duration in seconds
  videoQuality: varchar("video_quality", { length: 20 }), // "720p", "1080p", etc.
  platform: varchar("platform", { length: 50 }), // "instagram", "tiktok", "twitter"
  platformVideoId: varchar("platform_video_id", { length: 255 }), // Original platform video ID
  
  // Social Media Metadata
  sourceUrl: text("source_url"),
  authorUsername: varchar("author_username", { length: 255 }),
  authorName: varchar("author_name", { length: 255 }),
  authorFollowers: integer("author_followers"),
  videoViews: integer("video_views"),
  videoLikes: integer("video_likes"),
  videoShares: integer("video_shares"),
  videoComments: integer("video_comments"),
  hashtags: text("hashtags"), // JSON array
  mentions: text("mentions"), // JSON array
  caption: text("caption"), // Original video caption/description
  
  // Event Context
  peopleInvolved: text("people_involved"),
  numberOfPeople: integer("number_of_people"), // Estimated number of people in video
  vehiclesInvolved: text("vehicles_involved"), // Description of vehicles
  weaponsInvolved: text("weapons_involved"), // If applicable
  injuries: text("injuries"), // Description of injuries if any
  policeInvolvement: boolean("police_involvement").default(false),
  emergencyServices: text("emergency_services"), // "police", "ambulance", "fire", etc.
  
  // Environmental Context
  weatherConditions: varchar("weather_conditions", { length: 100 }),
  lighting: varchar("lighting", { length: 50 }), // "daylight", "dark", "streetlit"
  crowdSize: varchar("crowd_size", { length: 50 }), // "small", "medium", "large"
  
  // Additional Details
  backgroundInfo: text("background_info"),
  details: text("details"),
  outcome: text("outcome"), // What happened as a result
  relatedIncidents: text("related_incidents"), // JSON array of related event IDs
  
  // Verification & Credibility
  isCrime: boolean("is_crime").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedBy: integer("verified_by"), // User ID who verified
  verifiedAt: timestamp("verified_at"),
  credibilityScore: integer("credibility_score"), // 0-100
  sourceReliability: varchar("source_reliability", { length: 50 }), // "high", "medium", "low"
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  
  // Metadata
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastEditedBy: integer("last_edited_by"),
  lastEditedAt: timestamp("last_edited_at"),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
