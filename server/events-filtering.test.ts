import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@example.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("events.list with filtering", () => {
  it("returns all events when no filters applied", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters events by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.list({
      categories: ["crime"],
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // All returned events should be crime category
    result.forEach(event => {
      expect(event.category).toBe("crime");
    });
  });

  it("filters events by multiple categories", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.list({
      categories: ["crime", "accident"],
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // All returned events should be either crime or accident
    result.forEach(event => {
      expect(["crime", "accident"]).toContain(event.category);
    });
  });

  it("filters events by time period - latest month", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await caller.events.list({
      timePeriod: "month",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // All returned events should be within the last month
    result.forEach(event => {
      const eventDate = new Date(event.eventDate);
      expect(eventDate.getTime()).toBeGreaterThanOrEqual(oneMonthAgo.getTime());
    });
  });

  it("filters events by time period - latest year", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await caller.events.list({
      timePeriod: "year",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // All returned events should be within the last year
    result.forEach(event => {
      const eventDate = new Date(event.eventDate);
      expect(eventDate.getTime()).toBeGreaterThanOrEqual(oneYearAgo.getTime());
    });
  });

  it("combines category and time period filters", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await caller.events.list({
      categories: ["crime"],
      timePeriod: "year",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // All returned events should match both filters
    result.forEach(event => {
      expect(event.category).toBe("crime");
      const eventDate = new Date(event.eventDate);
      expect(eventDate.getTime()).toBeGreaterThanOrEqual(oneYearAgo.getTime());
    });
  });

  it("returns all events when timePeriod is 'all'", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const allEvents = await caller.events.list();
    const filteredEvents = await caller.events.list({
      timePeriod: "all",
    });

    expect(allEvents.length).toBe(filteredEvents.length);
  });
});

describe("events CRUD with subcategories and tags", () => {
  it("creates event with subcategories and tags", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const newEvent = await caller.events.create({
      title: "Test Event with Subcategories",
      description: "Testing subcategory support",
      category: "crime",
      subcategories: ["robbery", "shoplifting"],
      tags: ["test", "vitest"],
      eventDate: new Date(),
      latitude: "51.5074",
      longitude: "-0.1278",
      locationName: "Test Location",
      isCrime: true,
      isVerified: false,
    });

    expect(newEvent).toBeDefined();
    expect(newEvent.id).toBeDefined();
    expect(newEvent.category).toBe("crime");
    expect(newEvent.subcategories).toEqual(["robbery", "shoplifting"]);
    expect(newEvent.tags).toEqual(["test", "vitest"]);

    // Cleanup
    await caller.events.delete({ id: newEvent.id });
  });

  it("updates event subcategories and tags", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create event
    const newEvent = await caller.events.create({
      title: "Test Event for Update",
      description: "Testing update functionality",
      category: "transport",
      subcategories: ["bus"],
      eventDate: new Date(),
      latitude: "51.5074",
      longitude: "-0.1278",
      locationName: "Test Location",
      isCrime: false,
      isVerified: false,
    });

    // Update event
    const updated = await caller.events.update({
      id: newEvent.id,
      subcategories: ["bus", "road-collision"],
      tags: ["updated"],
    });

    expect(updated).toBeDefined();
    expect(updated?.subcategories).toEqual(["bus", "road-collision"]);
    expect(updated?.tags).toEqual(["updated"]);

    // Cleanup
    await caller.events.delete({ id: newEvent.id });
  });
});
