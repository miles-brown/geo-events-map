import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { CATEGORIES, TIME_PERIODS } from "@shared/categories";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  events: router({
    // Get all events with optional filtering
    list: publicProcedure
      .input(
        z.object({
          categories: z.array(z.string()).optional(),
          subcategories: z.array(z.string()).optional(),
          timePeriod: z.enum(["month", "6months", "year", "5years", "10years", "all"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          boroughs: z.array(z.string()).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return db.getFilteredEvents(input || {});
      }),

    // Get events by category
    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getEventsByCategory(input.category);
      }),

    // Get single event by ID
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const event = await db.getEventById(input.id);
        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
          });
        }
        return event;
      }),

    // Get all unique categories
    categories: publicProcedure.query(async () => {
      return db.getEventCategories();
    }),

    // Create new event (protected - requires authentication)
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          category: z.string().min(1),
          subcategories: z.array(z.string()).optional(),
          tags: z.array(z.string()).optional(),
          eventDate: z.date(),
          latitude: z.string(),
          longitude: z.string(),
          locationName: z.string().min(1),
          borough: z.string().optional(),
          videoUrl: z.string().optional(),
          thumbnailUrl: z.string().url().optional(),
          sourceUrl: z.string().url().optional(),
          peopleInvolved: z.string().optional(),
          backgroundInfo: z.string().optional(),
          details: z.string().optional(),
          isCrime: z.boolean().default(false),
          isVerified: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return db.createEvent({
          ...input,
          createdBy: ctx.user.id,
        } as any);
      }),

    // Update event (protected)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          category: z.string().min(1).optional(),
          subcategories: z.array(z.string()).optional(),
          tags: z.array(z.string()).optional(),
          eventDate: z.date().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          locationName: z.string().min(1).optional(),
          borough: z.string().optional(),
          videoUrl: z.string().url().optional(),
          thumbnailUrl: z.string().url().optional(),
          sourceUrl: z.string().url().optional(),
          peopleInvolved: z.string().optional(),
          backgroundInfo: z.string().optional(),
          details: z.string().optional(),
          isCrime: z.boolean().optional(),
          isVerified: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return db.updateEvent(id, updates as any);
      }),

    // Delete event (protected)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteEvent(input.id);
      }),
    
    // Upload video file (protected)
    uploadVideo: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          data: z.string(), // base64 encoded
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can upload videos",
          });
        }
        
        // Decode base64
        const base64Data = input.data.split(",")[1] || input.data;
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique filename
        const ext = input.filename.split(".").pop();
        const key = `videos/${nanoid()}.${ext}`;
        
        // Upload to S3
        const result = await storagePut(key, buffer, input.contentType);
        
        return { url: result.url, key: result.key };
      }),
  }),
});

export type AppRouter = typeof appRouter;
