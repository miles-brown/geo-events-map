import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const sampleEvents = [
  {
    title: "Mysterious Lights Over Camden",
    description: "Strange glowing orbs were spotted hovering over Camden Market late at night, captured on multiple phones by witnesses.",
    category: "paranormal",
    eventDate: new Date("2024-11-15T22:30:00Z"),
    latitude: "51.5410",
    longitude: "-0.1426",
    locationName: "Camden Market, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source1",
    peopleInvolved: "Multiple witnesses",
    backgroundInfo: "This area has a history of unusual sightings dating back decades.",
    details: "The lights appeared around 10:30 PM and lasted for approximately 15 minutes before disappearing.",
    isCrime: false,
    isVerified: false,
    createdBy: 1,
  },
  {
    title: "Flash Mob Turns Chaotic in Piccadilly",
    description: "What started as a peaceful flash mob dance quickly escalated into a chaotic scene with minor scuffles.",
    category: "protest",
    eventDate: new Date("2024-11-20T15:00:00Z"),
    latitude: "51.5099",
    longitude: "-0.1342",
    locationName: "Piccadilly Circus, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source2",
    peopleInvolved: "Approximately 200 participants",
    backgroundInfo: "The event was organized through social media but quickly got out of hand.",
    details: "Police arrived within 10 minutes to disperse the crowd. No serious injuries reported.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Bizarre Street Performance in Covent Garden",
    description: "A street performer appeared to levitate for several minutes, leaving crowds baffled and amazed.",
    category: "strange",
    eventDate: new Date("2024-11-18T14:20:00Z"),
    latitude: "51.5118",
    longitude: "-0.1226",
    locationName: "Covent Garden, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source3",
    peopleInvolved: "Unknown performer, large crowd",
    backgroundInfo: "Covent Garden is known for its street performers, but this act was particularly unusual.",
    details: "The performer collected tips and disappeared into the crowd before anyone could question the trick.",
    isCrime: false,
    isVerified: false,
    createdBy: 1,
  },
  {
    title: "Shoplifting Gang Caught on Camera",
    description: "A coordinated shoplifting operation was caught on CCTV at Oxford Street stores.",
    category: "crime",
    eventDate: new Date("2024-11-22T11:45:00Z"),
    latitude: "51.5152",
    longitude: "-0.1419",
    locationName: "Oxford Street, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source4",
    peopleInvolved: "5 suspects, currently at large",
    backgroundInfo: "This gang has been targeting high-end stores across central London for weeks.",
    details: "Police are investigating and have released images of the suspects.",
    isCrime: true,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Unexpected Flooding in Underground Station",
    description: "Water suddenly burst through the walls of King's Cross station, causing evacuation.",
    category: "accident",
    eventDate: new Date("2024-11-19T08:15:00Z"),
    latitude: "51.5308",
    longitude: "-0.1238",
    locationName: "King's Cross Station, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source5",
    peopleInvolved: "Hundreds of commuters",
    backgroundInfo: "A water main burst near the station, causing significant disruption.",
    details: "The station was closed for several hours while repairs were made. No injuries reported.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Spontaneous Dance Party on Tower Bridge",
    description: "A group of people suddenly started dancing on Tower Bridge, blocking traffic for 20 minutes.",
    category: "strange",
    eventDate: new Date("2024-11-21T17:30:00Z"),
    latitude: "51.5055",
    longitude: "-0.0754",
    locationName: "Tower Bridge, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source6",
    peopleInvolved: "About 30 dancers",
    backgroundInfo: "The event appeared to be spontaneous with no clear organizer.",
    details: "Traffic was backed up for miles before police cleared the bridge.",
    isCrime: false,
    isVerified: false,
    createdBy: 1,
  },
  {
    title: "Mysterious Fog Engulfs Hyde Park",
    description: "An unusually thick fog rolled into Hyde Park in the middle of a sunny afternoon, lasting only 10 minutes.",
    category: "paranormal",
    eventDate: new Date("2024-11-17T13:00:00Z"),
    latitude: "51.5074",
    longitude: "-0.1657",
    locationName: "Hyde Park, London",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://example.com/source7",
    peopleInvolved: "Park visitors",
    backgroundInfo: "Weather conditions were clear before and after the fog appeared.",
    details: "Meteorologists have no explanation for the sudden fog formation.",
    isCrime: false,
    isVerified: false,
    createdBy: 1,
  },
];

async function seed() {
  try {
    console.log("Seeding database with sample events...");
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    for (const event of sampleEvents) {
      await connection.execute(
        `INSERT INTO events (title, description, category, eventDate, latitude, longitude, locationName, videoUrl, sourceUrl, peopleInvolved, backgroundInfo, details, isCrime, isVerified, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.category,
          event.eventDate,
          event.latitude,
          event.longitude,
          event.locationName,
          event.videoUrl,
          event.sourceUrl,
          event.peopleInvolved,
          event.backgroundInfo,
          event.details,
          event.isCrime,
          event.isVerified,
          event.createdBy,
        ]
      );
      console.log(`✓ Added: ${event.title}`);
    }
    
    await connection.end();
    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
