import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { callDataApi } from "./_core/dataApi";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

const platformEnum = z.enum(["instagram", "tiktok", "twitter"]);

export const videoRouter = router({
  submitUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        platform: platformEnum,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { url, platform } = input;

      try {
        // Extract metadata based on platform
        let metadata: any;
        
        switch (platform) {
          case "tiktok":
            metadata = await extractTikTokMetadata(url);
            break;
          case "twitter":
            metadata = await extractTwitterMetadata(url);
            break;
          case "instagram":
            metadata = await extractInstagramMetadata(url);
            break;
          default:
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Unsupported platform",
            });
        }

        // Use AI to analyze the content and extract event information
        const eventData = await analyzeWithAI(metadata);

        // Create pending event in database with comprehensive metadata
        const event = await db.createEvent({
          // Basic event info
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          subcategories: eventData.subcategories || [],
          tags: eventData.tags || [],
          eventDate: eventData.eventDate,
          timeOfDay: eventData.timeOfDay || null,
          dayOfWeek: eventData.dayOfWeek || null,
          
          // Location data
          latitude: eventData.latitude,
          longitude: eventData.longitude,
          locationName: eventData.locationName,
          fullAddress: eventData.fullAddress || null,
          streetAddress: eventData.streetAddress || null,
          postcode: eventData.postcode || null,
          borough: eventData.borough || null,
          district: eventData.district || null,
          venueName: eventData.venueName || null,
          venueType: eventData.venueType || null,
          nearbyLandmarks: null, // Will be populated by geocoding
          
          // Video metadata
          videoUrl: metadata.videoUrl || null,
          thumbnailUrl: metadata.thumbnailUrl || null,
          videoDuration: metadata.duration || null,
          platform: platform,
          platformVideoId: metadata.videoId || null,
          
          // Social media metadata
          sourceUrl: url,
          authorUsername: metadata.authorUsername || null,
          authorName: metadata.authorName || null,
          caption: metadata.caption || null,
          hashtags: metadata.hashtags || [],
          
          // Event context
          peopleInvolved: eventData.peopleInvolved || null,
          numberOfPeople: eventData.numberOfPeople || null,
          vehiclesInvolved: eventData.vehiclesInvolved || null,
          weaponsInvolved: eventData.weaponsInvolved || null,
          injuries: eventData.injuries || null,
          policeInvolvement: eventData.policeInvolvement || false,
          emergencyServices: eventData.emergencyServices || null,
          
          // Environmental context
          weatherConditions: eventData.weatherConditions || null,
          lighting: eventData.lighting || null,
          crowdSize: eventData.crowdSize || null,
          
          // Additional details
          backgroundInfo: eventData.backgroundInfo || null,
          details: eventData.details || null,
          outcome: eventData.outcome || null,
          
          // Verification
          isCrime: eventData.isCrime,
          isVerified: false,
          credibilityScore: eventData.credibilityScore || null,
          sourceReliability: "medium", // Default, can be adjusted
          
          // Metadata
          createdBy: ctx.user.id,
        });

        return {
          success: true,
          eventId: event.id,
          title: eventData.title,
          status: "pending",
        };
      } catch (error) {
        console.error("[VideoRouter] Error processing video:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process video",
        });
      }
    }),
});

// Helper function to extract TikTok metadata
async function extractTikTokMetadata(url: string) {
  try {
    // Extract video ID from URL
    const videoIdMatch = url.match(/\/video\/(\d+)/);
    if (!videoIdMatch) {
      throw new Error("Invalid TikTok URL");
    }

    // Search for the video using TikTok API
    // Note: This is a simplified implementation
    // In production, you'd want to use the video ID to fetch specific video data
    const searchKeyword = "tiktok video"; // We'll improve this
    const result = await callDataApi("Tiktok/search_tiktok_video_general", {
      query: { keyword: searchKeyword, count: "1" },
    }) as any;

    if (result && result.data && result.data.length > 0) {
      const video = result.data[0];
      return {
        title: video.desc || "TikTok Video",
        description: video.desc || "Video from TikTok",
        videoUrl: url,
        thumbnailUrl: video.video?.cover || null,
        caption: video.desc || "",
        tags: video.text_extra?.map((tag: any) => tag.hashtag_name).filter(Boolean) || [],
        timestamp: video.create_time ? new Date(video.create_time * 1000) : new Date(),
      };
    }

    // Fallback if API doesn't return data
    return {
      title: "TikTok Video",
      description: "Video from TikTok",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[TikTok] Error extracting metadata:", error);
    // Return basic metadata on error
    return {
      title: "TikTok Video",
      description: "Video from TikTok",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  }
}

// Helper function to extract Twitter metadata
async function extractTwitterMetadata(url: string) {
  try {
    // Extract username and tweet ID from URL
    const tweetMatch = url.match(/\/([^\/]+)\/status\/(\d+)/);
    if (!tweetMatch) {
      throw new Error("Invalid Twitter URL");
    }

    const [, username] = tweetMatch;

    // Get user profile to get user ID
    const userProfile = await callDataApi("Twitter/get_user_profile_by_username", {
      query: { username },
    }) as any;

    if (!userProfile || !userProfile.result?.data?.user?.result?.rest_id) {
      throw new Error("Could not find Twitter user");
    }

    const userId = userProfile.result.data.user.result.rest_id;

    // Get user tweets
    const tweets = await callDataApi("Twitter/get_user_tweets", {
      query: { user: userId, count: "20" },
    }) as any;

    // Find the specific tweet (simplified - just use the first tweet for now)
    let tweetData: any = null;
    if (tweets?.result?.timeline?.instructions) {
      for (const instruction of tweets.result.timeline.instructions) {
        if (instruction.type === "TimelineAddEntries" && instruction.entries) {
          for (const entry of instruction.entries) {
            if (entry.entryId?.startsWith("tweet-")) {
              const content = entry.content?.itemContent?.tweet_results?.result;
              if (content) {
                tweetData = content;
                break;
              }
            }
          }
        }
        if (tweetData) break;
      }
    }

    if (tweetData) {
      const legacy = tweetData.legacy || {};
      return {
        title: legacy.full_text?.substring(0, 100) || "Twitter/X Post",
        description: legacy.full_text || "Post from Twitter/X",
        videoUrl: url,
        thumbnailUrl: legacy.entities?.media?.[0]?.media_url_https || null,
        caption: legacy.full_text || "",
        tags: legacy.entities?.hashtags?.map((h: any) => h.text) || [],
        timestamp: legacy.created_at ? new Date(legacy.created_at) : new Date(),
      };
    }

    // Fallback
    return {
      title: "Twitter/X Post",
      description: "Post from Twitter/X",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[Twitter] Error extracting metadata:", error);
    return {
      title: "Twitter/X Post",
      description: "Post from Twitter/X",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  }
}

// Helper function to extract Instagram metadata
async function extractInstagramMetadata(url: string) {
  try {
    // Use Firecrawl MCP to scrape Instagram content
    // Note: This requires the manus-mcp-cli to be available
    // For now, we'll return a placeholder and implement MCP integration separately
    
    // TODO: Implement Firecrawl MCP scraping
    // const result = await executeMcpTool('firecrawl', 'firecrawl_scrape', {
    //   url,
    //   formats: ['markdown'],
    // });

    return {
      title: "Instagram Post",
      description: "Post from Instagram",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[Instagram] Error extracting metadata:", error);
    return {
      title: "Instagram Post",
      description: "Post from Instagram",
      videoUrl: url,
      thumbnailUrl: null,
      caption: "",
      tags: [],
      timestamp: new Date(),
    };
  }
}

// Helper function to analyze content with AI
async function analyzeWithAI(metadata: any) {
  const prompt = `Analyze this social media post and extract comprehensive event information for a geo-events intelligence system.

Content:
Title: ${metadata.title}
Description: ${metadata.description}
Caption: ${metadata.caption}
Tags: ${metadata.tags.join(", ")}
Timestamp: ${metadata.timestamp}

Extract ALL available information in JSON format:
{
  "title": "Brief, descriptive title (max 100 chars)",
  "description": "Detailed description of what happened",
  "category": "One of: crime, transport, fire, emergency, weather, social_media, public_event, celebrity, strange, construction, protest",
  "subcategories": ["array of relevant subcategories"],
  "tags": ["additional tags"],
  "eventDate": "ISO date string",
  "timeOfDay": "morning/afternoon/evening/night",
  "dayOfWeek": "monday/tuesday/etc",
  
  "location": "Detected location from text",
  "locationName": "Full location name",
  "fullAddress": "Complete address if mentioned",
  "streetAddress": "Street name and number if available",
  "postcode": "UK postcode if mentioned",
  "borough": "London borough if applicable",
  "district": "District or neighborhood name",
  "venueName": "Specific venue, shop, or landmark name",
  "venueType": "shop/restaurant/station/park/etc",
  
  "peopleInvolved": "Names or descriptions",
  "numberOfPeople": number or null,
  "vehiclesInvolved": "Description of vehicles",
  "weaponsInvolved": "If applicable",
  "injuries": "Description of injuries",
  "policeInvolvement": boolean,
  "emergencyServices": "police/ambulance/fire/etc",
  
  "weatherConditions": "sunny/rainy/cloudy/etc",
  "lighting": "daylight/dark/streetlit",
  "crowdSize": "small/medium/large",
  
  "backgroundInfo": "Additional context",
  "details": "Specific details",
  "outcome": "What happened as a result",
  "isCrime": boolean,
  "credibilityScore": number 0-100
}

Extract as much detail as possible. If information is not available, use null. Default to London for ambiguous UK locations.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are an intelligence analyst extracting structured event data from social media posts. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "event_extraction",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            subcategories: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
            eventDate: { type: "string" },
            timeOfDay: { type: ["string", "null"] },
            dayOfWeek: { type: ["string", "null"] },
            location: { type: "string" },
            locationName: { type: "string" },
            fullAddress: { type: ["string", "null"] },
            streetAddress: { type: ["string", "null"] },
            postcode: { type: ["string", "null"] },
            borough: { type: ["string", "null"] },
            district: { type: ["string", "null"] },
            venueName: { type: ["string", "null"] },
            venueType: { type: ["string", "null"] },
            peopleInvolved: { type: ["string", "null"] },
            numberOfPeople: { type: ["number", "null"] },
            vehiclesInvolved: { type: ["string", "null"] },
            weaponsInvolved: { type: ["string", "null"] },
            injuries: { type: ["string", "null"] },
            policeInvolvement: { type: "boolean" },
            emergencyServices: { type: ["string", "null"] },
            weatherConditions: { type: ["string", "null"] },
            lighting: { type: ["string", "null"] },
            crowdSize: { type: ["string", "null"] },
            backgroundInfo: { type: ["string", "null"] },
            details: { type: ["string", "null"] },
            outcome: { type: ["string", "null"] },
            isCrime: { type: "boolean" },
            credibilityScore: { type: ["number", "null"] },
          },
          required: [
            "title",
            "description",
            "category",
            "subcategories",
            "tags",
            "eventDate",
            "location",
            "locationName",
            "isCrime",
            "policeInvolvement",
          ],
          additionalProperties: true,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content || typeof content !== "string") {
    throw new Error("No response from AI");
  }

  const extracted = JSON.parse(content);

  // Geocode the location to get coordinates
  const coordinates = await geocodeLocation(extracted.location);

  return {
    ...extracted,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    eventDate: new Date(extracted.eventDate),
  };
}

// Helper function to geocode location
async function geocodeLocation(location: string): Promise<{ latitude: string; longitude: string }> {
  // Default to London center if geocoding fails
  const defaultCoords = {
    latitude: "51.5074",
    longitude: "-0.1278",
  };

  // For now, return default coordinates
  // We'll implement actual geocoding using Google Maps API in the next iteration
  return defaultCoords;
}
