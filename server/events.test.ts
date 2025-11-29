import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("events API", () => {
  it("should list all events", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const events = await caller.events.list();

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    
    // Check structure of first event
    if (events.length > 0) {
      const event = events[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("description");
      expect(event).toHaveProperty("category");
      expect(event).toHaveProperty("latitude");
      expect(event).toHaveProperty("longitude");
      expect(event).toHaveProperty("videoUrl");
    }
  });

  it("should get all unique categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.events.categories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    
    // Categories should be sorted and unique
    const sortedCategories = [...categories].sort();
    expect(categories).toEqual(sortedCategories);
    
    const uniqueCategories = [...new Set(categories)];
    expect(categories.length).toBe(uniqueCategories.length);
  });

  it("should filter events by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.events.categories();
    
    if (categories.length > 0) {
      const testCategory = categories[0];
      const events = await caller.events.byCategory({ category: testCategory });

      expect(Array.isArray(events)).toBe(true);
      
      // All events should have the requested category
      events.forEach((event) => {
        expect(event.category).toBe(testCategory);
      });
    }
  });

  it("should get event by ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const allEvents = await caller.events.list();
    
    if (allEvents.length > 0) {
      const testEvent = allEvents[0];
      const event = await caller.events.byId({ id: testEvent.id });

      expect(event).toBeDefined();
      expect(event.id).toBe(testEvent.id);
      expect(event.title).toBe(testEvent.title);
    }
  });

  it("should throw error for non-existent event ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.events.byId({ id: 999999 })
    ).rejects.toThrow("Event not found");
  });

  it("should require authentication to create event", async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const newEvent = {
      title: "Test Event",
      description: "Test description",
      category: "test",
      eventDate: new Date(),
      latitude: "51.5074",
      longitude: "-0.1278",
      locationName: "Test Location",
      videoUrl: "https://www.youtube.com/watch?v=test",
      isCrime: false,
      isVerified: false,
    };

    await expect(
      publicCaller.events.create(newEvent)
    ).rejects.toThrow();
  });

  it("should create event when authenticated", async () => {
    const authCtx = createAuthContext();
    const authCaller = appRouter.createCaller(authCtx);

    const newEvent = {
      title: "Test Event Created",
      description: "Test description for created event",
      category: "test",
      eventDate: new Date(),
      latitude: "51.5074",
      longitude: "-0.1278",
      locationName: "Test Location",
      videoUrl: "https://www.youtube.com/watch?v=test123",
      isCrime: false,
      isVerified: false,
    };

    const created = await authCaller.events.create(newEvent);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.title).toBe(newEvent.title);
    expect(created.description).toBe(newEvent.description);
    expect(created.createdBy).toBe(1);

    // Clean up - delete the test event
    await authCaller.events.delete({ id: created.id });
  });
});
