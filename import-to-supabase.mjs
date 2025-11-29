import { readFileSync } from 'fs';
import pg from 'pg';
const { Client } = pg;

// Read exported events
const events = JSON.parse(readFileSync('/home/ubuntu/events-export.json', 'utf8'));

// Supabase connection string (will be set via environment variable)
const connectionString = process.env.SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  console.error('Error: SUPABASE_CONNECTION_STRING environment variable not set');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  console.log('Connected to Supabase');

  for (const event of events) {
    const query = `
      INSERT INTO events (
        title, description, category, event_date, latitude, longitude,
        location_name, video_url, thumbnail_url, source_url, people_involved,
        background_info, details, is_crime, is_verified, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `;
    
    const values = [
      event.title,
      event.description,
      event.category,
      event.eventDate,
      event.latitude,
      event.longitude,
      event.locationName,
      event.videoUrl,
      event.thumbnailUrl,
      event.sourceUrl,
      event.peopleInvolved,
      event.backgroundInfo,
      event.details,
      event.isCrime,
      event.isVerified,
      event.createdBy,
      event.createdAt,
      event.updatedAt
    ];

    await client.query(query, values);
    console.log(`Imported: ${event.title}`);
  }

  console.log(`\n✅ Successfully imported ${events.length} events to Supabase!`);
} catch (error) {
  console.error('Error importing to Supabase:', error);
  process.exit(1);
} finally {
  await client.end();
}
