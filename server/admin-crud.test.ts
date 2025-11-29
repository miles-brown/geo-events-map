import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-test-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin CRUD Operations", () => {
  it("should list all events", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const events = await caller.events.list();
    
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it("should allow admin to create an event", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const newEvent = {
      title: "Test Event",
      description: "This is a test event for admin functionality",
      category: "strange",
      eventDate: new Date("2024-12-01T12:00:00Z"),
      latitude: "51.5074",
      longitude: "-0.1278",
      locationName: "Test Location, London",
      videoUrl: "https://www.youtube.com/watch?v=test",
      isCrime: false,
      isVerified: false,
    };

    const created = await caller.events.create(newEvent);
    
    expect(created).toBeDefined();
    expect(created.title).toBe(newEvent.title);
    expect(created.category).toBe(newEvent.category);
  });

  it("should get events by category", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const crimeEvents = await caller.events.byCategory({ category: "crime" });
    
    expect(Array.isArray(crimeEvents)).toBe(true);
    crimeEvents.forEach(event => {
      expect(event.category).toBe("crime");
    });
  });

  it("should get all unique categories", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.events.categories();
    
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("crime");
    expect(categories).toContain("accident");
    expect(categories).toContain("paranormal");
  });
});
