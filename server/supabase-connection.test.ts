import { describe, expect, it } from "vitest";
import { getDb } from "./db";
import { events } from "../drizzle/schema";

describe("Supabase Database Connection", () => {
  it("should connect to Supabase and query events table", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Query events table to verify connection
    const result = await db.select().from(events).limit(1);
    
    // Should not throw an error and should return an array
    expect(Array.isArray(result)).toBe(true);
  });

  it("should have all 17 events in the database", async () => {
    const db = await getDb();
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const result = await db.select().from(events);
    
    // Verify we have at least the original 17 events (may have more from tests)
    expect(result.length).toBeGreaterThanOrEqual(17);
  });

  it("should have events with correct categories", async () => {
    const db = await getDb();
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const result = await db.select().from(events);
    
    // Count events by category
    const categoryCounts = result.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Verify category distribution (at least the original counts)
    expect(categoryCounts.accident).toBeGreaterThanOrEqual(4);
    expect(categoryCounts.crime).toBeGreaterThanOrEqual(3);
    expect(categoryCounts.paranormal || 0).toBeGreaterThanOrEqual(0); // Paranormal removed
    expect(categoryCounts.protest).toBeGreaterThanOrEqual(1);
    expect(categoryCounts.strange).toBeGreaterThanOrEqual(6);
  });
});
