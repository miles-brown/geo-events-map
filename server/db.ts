import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, events, InsertEvent, Event } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
      });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Events query helpers

export async function createEvent(event: InsertEvent & { subcategories?: string[]; tags?: string[] }): Promise<Event> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Serialize arrays to JSON strings
  const eventData = {
    ...event,
    subcategories: event.subcategories ? JSON.stringify(event.subcategories) : null,
    tags: event.tags ? JSON.stringify(event.tags) : null,
  };

  const result = await db.insert(events).values(eventData).returning();
  if (!result[0]) {
    throw new Error("Failed to insert event");
  }
  
  return parseEventJson(result[0]);
}

// Helper to parse JSON fields in events
function parseEventJson(event: Event): Event {
  return {
    ...event,
    subcategories: event.subcategories ? JSON.parse(event.subcategories as unknown as string) : null,
    tags: event.tags ? JSON.parse(event.tags as unknown as string) : null,
  };
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const results = await db.select().from(events).orderBy(desc(events.eventDate));
  return results.map(parseEventJson);
}

export interface EventFilters {
  categories?: string[];
  subcategories?: string[];
  timePeriod?: "month" | "6months" | "year" | "5years" | "10years" | "all";
  startDate?: Date;
  endDate?: Date;
  boroughs?: string[];
}

export async function getFilteredEvents(filters: EventFilters): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  let query = db.select().from(events);
  const conditions = [];

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    conditions.push(inArray(events.category, filters.categories));
  }

  // Filter by boroughs
  if (filters.boroughs && filters.boroughs.length > 0) {
    conditions.push(inArray(events.borough, filters.boroughs));
  }

  // Filter by time period
  if (filters.timePeriod && filters.timePeriod !== "all") {
    const now = new Date();
    let startDate: Date;
    
    switch (filters.timePeriod) {
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "6months":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "5years":
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      case "10years":
        startDate = new Date(now.setFullYear(now.getFullYear() - 10));
        break;
      default:
        startDate = new Date(0);
    }
    conditions.push(gte(events.eventDate, startDate));
  }

  // Filter by custom date range
  if (filters.startDate) {
    conditions.push(gte(events.eventDate, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(events.eventDate, filters.endDate));
  }

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const results = await query.orderBy(desc(events.eventDate));
  
  // Filter by subcategories in application layer (since they're stored as JSON)
  let filteredResults = results;
  if (filters.subcategories && filters.subcategories.length > 0) {
    filteredResults = results.filter(event => {
      if (!event.subcategories) return false;
      const eventSubcats = JSON.parse(event.subcategories as unknown as string) as string[];
      return filters.subcategories!.some(sub => eventSubcats.includes(sub));
    });
  }

  return filteredResults.map(parseEventJson);
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(events).where(eq(events.category, category)).orderBy(desc(events.eventDate));
}

export async function getEventById(id: number): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

export async function updateEvent(id: number, updates: Partial<InsertEvent> & { subcategories?: string[]; tags?: string[] }): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  // Serialize arrays to JSON strings
  const updateData: any = { ...updates };
  if (updates.subcategories !== undefined) {
    updateData.subcategories = updates.subcategories ? JSON.stringify(updates.subcategories) : null;
  }
  if (updates.tags !== undefined) {
    updateData.tags = updates.tags ? JSON.stringify(updates.tags) : null;
  }

  await db.update(events).set(updateData).where(eq(events.id, id));
  
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0] ? parseEventJson(result[0]) : undefined;
}



export async function deleteEvent(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(events).where(eq(events.id, id));
  return true;
}

export async function getEventCategories(): Promise<string[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const result = await db.select({ category: events.category }).from(events);
  const uniqueCategories = Array.from(new Set(result.map(r => r.category)));
  return uniqueCategories.sort();
}
