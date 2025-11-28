import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Statistics API", () => {
  it("should return statistics with all required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.statistics.getStats();
    
    // Check that stats object has all required fields
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("byCategory");
    expect(stats).toHaveProperty("byBorough");
    expect(stats).toHaveProperty("byMonth");
    
    // Check types
    expect(typeof stats.total).toBe("number");
    expect(Array.isArray(stats.byCategory)).toBe(true);
    expect(Array.isArray(stats.byBorough)).toBe(true);
    expect(Array.isArray(stats.byMonth)).toBe(true);
  });

  it("should return category statistics with name and count", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.statistics.getStats();
    
    if (stats.byCategory.length > 0) {
      const category = stats.byCategory[0];
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("count");
      expect(typeof category.name).toBe("string");
      expect(typeof category.count).toBe("number");
      expect(category.count).toBeGreaterThan(0);
    }
  });

  it("should return borough statistics sorted by count descending", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.statistics.getStats();
    
    // Check that boroughs are sorted by count (descending)
    for (let i = 0; i < stats.byBorough.length - 1; i++) {
      expect(stats.byBorough[i].count).toBeGreaterThanOrEqual(
        stats.byBorough[i + 1].count
      );
    }
    
    // Check that we get max 10 boroughs
    expect(stats.byBorough.length).toBeLessThanOrEqual(10);
  });

  it("should return monthly statistics sorted chronologically", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.statistics.getStats();
    
    if (stats.byMonth.length > 0) {
      const month = stats.byMonth[0];
      expect(month).toHaveProperty("month");
      expect(month).toHaveProperty("count");
      
      // Check month format (YYYY-MM)
      expect(month.month).toMatch(/^\d{4}-\d{2}$/);
      
      // Check chronological order
      for (let i = 0; i < stats.byMonth.length - 1; i++) {
        expect(stats.byMonth[i].month.localeCompare(stats.byMonth[i + 1].month))
          .toBeLessThanOrEqual(0);
      }
    }
  });

  it("should have total equal to sum of all categories", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.statistics.getStats();
    
    const categorySum = stats.byCategory.reduce((sum, cat) => sum + cat.count, 0);
    expect(stats.total).toBe(categorySum);
  });
});
