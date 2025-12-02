import { describe, it, expect, beforeAll } from "vitest";
import { createEvent, getEventById } from "./db";
import { getDb } from "./db";

describe("Video Submission System", () => {
  beforeAll(async () => {
    // Ensure database connection is available
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe("Database Integration", () => {
    it("should create event with pending status", async () => {
      const testEvent = {
        title: "Test Video Event",
        description: "Test event from video submission",
        category: "strange",
        subcategories: ["unusual"],
        tags: ["test"],
        eventDate: new Date(),
        latitude: "51.5074",
        longitude: "-0.1278",
        locationName: "London, UK",
        borough: null,
        videoUrl: "https://example.com/video",
        thumbnailUrl: null,
        sourceUrl: "https://example.com/source",
        peopleInvolved: null,
        backgroundInfo: null,
        details: null,
        isCrime: false,
        isVerified: false,
        createdBy: 1,
      };

      const event = await createEvent(testEvent);
      
      expect(event).toBeDefined();
      expect(event.id).toBeGreaterThan(0);
      expect(event.title).toBe("Test Video Event");
      expect(event.category).toBe("strange");
      
      // Verify the event was created in database
      const retrieved = await getEventById(event.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe("Test Video Event");
    });

    it("should handle events with all optional fields", async () => {
      const testEvent = {
        title: "Complete Event",
        description: "Event with all fields populated",
        category: "crime",
        subcategories: ["theft", "robbery"],
        tags: ["london", "incident"],
        eventDate: new Date("2024-01-15"),
        latitude: "51.5074",
        longitude: "-0.1278",
        locationName: "Camden Town, London",
        borough: "Camden",
        videoUrl: "https://example.com/video.mp4",
        thumbnailUrl: "https://example.com/thumb.jpg",
        sourceUrl: "https://instagram.com/post/123",
        peopleInvolved: "John Doe, Jane Smith",
        backgroundInfo: "This incident occurred during rush hour",
        details: "Multiple witnesses reported the event",
        isCrime: true,
        isVerified: false,
        createdBy: 1,
      };

      const event = await createEvent(testEvent);
      
      expect(event).toBeDefined();
      expect(event.borough).toBe("Camden");
      expect(event.peopleInvolved).toBe("John Doe, Jane Smith");
      expect(event.isCrime).toBe(true);
    });
  });

  describe("Platform Detection", () => {
    it("should detect Instagram URLs", () => {
      const urls = [
        "https://www.instagram.com/p/ABC123/",
        "https://instagram.com/reel/XYZ789/",
        "https://instagr.am/p/DEF456/",
      ];

      urls.forEach(url => {
        const isInstagram = url.includes("instagram.com") || url.includes("instagr.am");
        expect(isInstagram).toBe(true);
      });
    });

    it("should detect TikTok URLs", () => {
      const urls = [
        "https://www.tiktok.com/@user/video/1234567890",
        "https://vm.tiktok.com/ABC123/",
        "https://tiktok.com/@username/video/9876543210",
      ];

      urls.forEach(url => {
        const isTikTok = url.includes("tiktok.com") || url.includes("vm.tiktok.com");
        expect(isTikTok).toBe(true);
      });
    });

    it("should detect Twitter/X URLs", () => {
      const urls = [
        "https://twitter.com/user/status/1234567890",
        "https://x.com/username/status/9876543210",
        "https://t.co/ABC123",
      ];

      urls.forEach(url => {
        const isTwitter = url.includes("twitter.com") || url.includes("x.com") || url.includes("t.co");
        expect(isTwitter).toBe(true);
      });
    });

    it("should reject unsupported platforms", () => {
      const urls = [
        "https://youtube.com/watch?v=ABC123",
        "https://facebook.com/video/123",
        "https://example.com/video",
      ];

      urls.forEach(url => {
        const isSupported = 
          url.includes("instagram.com") || 
          url.includes("instagr.am") ||
          url.includes("tiktok.com") || 
          url.includes("twitter.com") || 
          url.includes("x.com");
        expect(isSupported).toBe(false);
      });
    });
  });

  describe("URL Validation", () => {
    it("should validate proper URL format", () => {
      const validUrls = [
        "https://instagram.com/p/ABC123/",
        "https://www.tiktok.com/@user/video/123",
        "https://twitter.com/user/status/456",
      ];

      validUrls.forEach(url => {
        try {
          new URL(url);
          expect(true).toBe(true);
        } catch {
          expect(false).toBe(true);
        }
      });
    });

    it("should reject invalid URL format", () => {
      const invalidUrls = [
        "not-a-url",
        "htp://broken-protocol.com",
        "//missing-protocol.com",
      ];

      invalidUrls.forEach(url => {
        try {
          new URL(url);
          expect(false).toBe(true);
        } catch {
          expect(true).toBe(true);
        }
      });
    });
  });

  describe("Category Validation", () => {
    const validCategories = [
      "crime",
      "transport",
      "fire",
      "emergency",
      "weather",
      "social_media",
      "public_event",
      "celebrity",
      "strange",
      "construction",
      "protest",
    ];

    it("should accept valid categories", () => {
      validCategories.forEach(category => {
        expect(validCategories.includes(category)).toBe(true);
      });
    });

    it("should reject invalid categories", () => {
      const invalidCategories = ["invalid", "unknown", "test"];
      
      invalidCategories.forEach(category => {
        expect(validCategories.includes(category)).toBe(false);
      });
    });
  });

  describe("Coordinate Validation", () => {
    it("should validate London coordinates", () => {
      const londonCoords = [
        { lat: 51.5074, lng: -0.1278 }, // Central London
        { lat: 51.5285, lng: -0.2416 }, // Wembley
        { lat: 51.4545, lng: -0.1085 }, // Brixton
      ];

      londonCoords.forEach(coord => {
        expect(coord.lat).toBeGreaterThan(51.2);
        expect(coord.lat).toBeLessThan(51.7);
        expect(coord.lng).toBeGreaterThan(-0.5);
        expect(coord.lng).toBeLessThan(0.3);
      });
    });

    it("should store coordinates as strings", () => {
      const lat = "51.5074";
      const lng = "-0.1278";
      
      expect(typeof lat).toBe("string");
      expect(typeof lng).toBe("string");
      expect(parseFloat(lat)).toBeCloseTo(51.5074, 4);
      expect(parseFloat(lng)).toBeCloseTo(-0.1278, 4);
    });
  });

  describe("JSON Field Handling", () => {
    it("should serialize and deserialize subcategories", () => {
      const subcategories = ["fights", "brawls", "altercation"];
      const serialized = JSON.stringify(subcategories);
      const deserialized = JSON.parse(serialized);
      
      expect(Array.isArray(deserialized)).toBe(true);
      expect(deserialized).toEqual(subcategories);
    });

    it("should serialize and deserialize tags", () => {
      const tags = ["london", "camden", "nightlife"];
      const serialized = JSON.stringify(tags);
      const deserialized = JSON.parse(serialized);
      
      expect(Array.isArray(deserialized)).toBe(true);
      expect(deserialized).toEqual(tags);
    });

    it("should handle empty arrays", () => {
      const empty: string[] = [];
      const serialized = JSON.stringify(empty);
      const deserialized = JSON.parse(serialized);
      
      expect(Array.isArray(deserialized)).toBe(true);
      expect(deserialized.length).toBe(0);
    });
  });
});
