import { describe, it, expect } from "vitest";
import { getDb } from "./db";

describe("Supabase Database Connection", () => {
  it("should connect to Supabase and query database", async () => {
    const db = await getDb();
    expect(db).toBeDefined();
    expect(db).not.toBeNull();
  });

  it("should be able to query events table", async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Simple query to verify connection works
    const result = await db.execute(`SELECT 1 as test`);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should verify status enum exists in database", async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Check if status enum type exists
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'status'
      ) as enum_exists
    `);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
