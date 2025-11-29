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

  statistics: router({
    getStats: publicProcedure.query(async () => {
      const allEvents = await db.getAllEvents();
      
      // Events by category
      const byCategory: Record<string, number> = {};
      allEvents.forEach(event => {
        byCategory[event.category] = (byCategory[event.category] || 0) + 1;
      });

      // Events by borough
      const byBorough: Record<string, number> = {};
      allEvents.forEach(event => {
        if (event.borough) {
          byBorough[event.borough] = (byBorough[event.borough] || 0) + 1;
        }
      });

      // Events over time (by month)
      const byMonth: Record<string, number> = {};
      allEvents.forEach(event => {
        const month = new Date(event.eventDate).toISOString().slice(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + 1;
      });

      return {
        total: allEvents.length,
        byCategory: Object.entries(byCategory).map(([name, count]) => ({ name, count })),
        byBorough: Object.entries(byBorough)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        byMonth: Object.entries(byMonth)
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      };
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

    // Bulk create events from CSV (protected)
    bulkCreate: protectedProcedure
      .input(
        z.object({
          events: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              category: z.string(),
              subcategories: z.string().optional(),
              tags: z.string().optional(),
              eventDate: z.string(),
              latitude: z.string(),
              longitude: z.string(),
              locationName: z.string(),
              borough: z.string().optional(),
              videoUrl: z.string().optional(),
              sourceUrl: z.string().optional(),
              peopleInvolved: z.string().optional(),
              backgroundInfo: z.string().optional(),
              details: z.string().optional(),
              isCrime: z.string().optional(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can bulk import events",
          });
        }

        const results = {
          success: 0,
          errors: 0,
          total: input.events.length,
          errorDetails: [] as string[],
        };

        for (let index = 0; index < input.events.length; index++) {
          const event = input.events[index];
          try {
            // Parse subcategories and tags from comma-separated strings
            const subcategories = event.subcategories
              ? event.subcategories.split(',').map((s: string) => s.trim())
              : [];
            const tags = event.tags
              ? event.tags.split(',').map((t: string) => t.trim())
              : [];

            // Create event
            await db.createEvent({
              title: event.title,
              description: event.description,
              category: event.category,
              subcategories: subcategories.length > 0 ? subcategories : undefined,
              tags: tags.length > 0 ? tags : undefined,
              eventDate: new Date(event.eventDate),
              latitude: event.latitude,
              longitude: event.longitude,
              locationName: event.locationName,
              borough: event.borough || null,
              videoUrl: event.videoUrl || null,
              sourceUrl: event.sourceUrl || null,
              peopleInvolved: event.peopleInvolved || null,
              backgroundInfo: event.backgroundInfo || null,
              details: event.details || null,
              isCrime: event.isCrime === 'true' || event.isCrime === '1',
              isVerified: false,
              createdBy: ctx.user.id,
            } as any);

            results.success++;
          } catch (error: any) {
            results.errors++;
            results.errorDetails.push(
              `Row ${index + 2}: ${error.message || 'Unknown error'}`
            );
          }
        }

        return results;
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
