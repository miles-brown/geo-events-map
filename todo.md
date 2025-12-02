# Geo Events Map - Frontend Rebuild

## Core Layout & Architecture
- [ ] Update index.css with proper z-index CSS variables
- [ ] Rebuild App.tsx with mobile-first routing
- [ ] Create proper overflow handling in main layout
- [ ] Set up responsive breakpoint utilities

## Home Page (Main Map View)
- [x] Rebuild Home.tsx with proper layout structure
- [x] Implement responsive header component
- [x] Create collapsible filter sidebar (mobile overlay, desktop fixed)
- [x] Build map container with z-index: 0
- [x] Create event details panel (mobile full-screen, desktop slide-in)
- [x] Add proper viewport constraints for all panels
- [x] Implement timeline controls
- [x] Add stats overlay

## Components
- [ ] Rebuild EventMapNew with correct z-index
- [ ] Update CategoryFilterNew for mobile responsiveness
- [ ] Rebuild EventDetails with proper positioning
- [ ] Update Timeline component for mobile
- [ ] Rebuild Heatmap component

## Statistics Page
- [x] Rebuild Statistics.tsx with mobile-responsive charts
- [x] Make charts stack vertically on mobile
- [x] Ensure intro sequence works on all devices
- [x] Add responsive padding and spacing
- [x] Optimize touch targets for mobile

## Admin Page
- [x] Rebuild Admin.tsx with responsive forms
- [x] Make table horizontally scrollable on mobile
- [x] Optimize form inputs for touch
- [x] Add mobile-friendly navigation
- [x] Ensure all buttons meet 44x44px minimum

## Styling
- [ ] Apply CIA/military theme consistently
- [ ] Ensure all touch targets are 44x44px minimum
- [ ] Add proper hover states for desktop
- [ ] Test all breakpoints (mobile, tablet, desktop)

## Testing
- [ ] Test on mobile viewport (375x667)
- [ ] Test on tablet viewport (768x1024)
- [ ] Test on desktop viewport (1920x1080)
- [ ] Verify z-index layering works correctly
- [ ] Ensure no viewport overflow issues
- [ ] Test all interactive elements

## Mobile Swipe Gestures
- [x] Create custom useSwipe hook for touch gesture detection
- [x] Implement swipe-left gesture to open filter sidebar
- [x] Implement swipe-right gesture to close filter sidebar
- [x] Implement swipe-right gesture to close event details panel
- [x] Implement swipe-up gesture on event details for smooth dismissal
- [ ] Add visual feedback during swipe (panel follows finger)
- [x] Set minimum swipe distance threshold (e.g., 50px)
- [x] Add swipe velocity detection for quick flicks
- [ ] Test gestures on iOS Safari and Android Chrome

## Supabase Database Migration
- [x] Update Drizzle config to use PostgreSQL dialect
- [x] Update DATABASE_URL secret with Supabase connection string
- [x] Push database schema to Supabase (tables already exist)
- [x] Verify database connection
- [x] Test application with Supabase database


## Manual Video Submission System (URL-based)

### Phase 1: Research & Architecture
- [x] Research Instagram video scraping APIs (Firecrawl MCP)
- [x] Research TikTok video scraping APIs
- [x] Research X/Twitter video scraping APIs (Twitter Data API)
- [x] Design database schema for pending submissions (add status field)
- [x] Plan AI analysis workflow (location detection, categorization)

### Phase 2: Admin Submission Interface
- [x] Create "Submit Video" page in admin panel
- [x] Build URL input form with platform detection (Instagram/TikTok/X)
- [x] Add loading states and progress indicators
- [x] Display preview of extracted metadata

### Phase 3: Backend Video Processing
- [x] Create tRPC endpoint for video URL submission
- [x] Implement video metadata extraction for each platform
- [ ] Build video download and S3 upload functionality
- [x] Extract captions, descriptions, tags, timestamps

### Phase 4: AI-Powered Analysis
- [ ] Implement AI location detection from video text/captions
- [ ] Build AI event categorization (Crime, Strange, Paranormal, etc.)
- [ ] Extract people involved and event details using LLM
- [ ] Integrate Google Maps Geocoding for location validation
- [ ] Handle cases where location is ambiguous (default to London)

### Phase 5: Review Queue & Approval
- [ ] Add "status" field to events table (pending, approved, rejected)
- [ ] Create pending submissions view in admin panel
- [ ] Build approval/rejection workflow with edit capabilities
- [ ] Add bulk approval functionality

### Phase 6: Testing & Delivery
- [ ] Test with real Instagram video URLs
- [ ] Test with real TikTok video URLs
- [ ] Test with real X/Twitter video URLs
- [ ] Verify AI analysis accuracy
- [ ] Test end-to-end workflow from submission to map display
- [ ] Create documentation for video submission process


## Enhanced Schema & Metadata Extraction

### Database Schema Enhancements
- [x] Add comprehensive video metadata fields (duration, views, likes, shares, platform-specific IDs)
- [x] Add detailed location fields (full address, postcode, district, venue name, landmark)
- [x] Add temporal fields (time of day, day of week, season)
- [x] Add event context fields (weather conditions, witnesses, police involvement)
- [x] Add social media engagement metrics
- [x] Add verification and credibility fields
- [x] Apply schema changes to Supabase

### AI Extraction Enhancements
- [x] Extract video duration and technical metadata
- [x] Parse full address from captions/descriptions
- [x] Identify venue/shop/landmark names
- [x] Extract time of day and temporal context
- [x] Detect weather conditions from text
- [x] Identify number of people involved
- [x] Extract hashtags and mentions
- [ ] Calculate engagement metrics

### Geocoding Enhancements
- [ ] Implement Google Maps Geocoding API integration
- [ ] Extract full address components (street, postcode, district)
- [ ] Identify London borough from coordinates
- [ ] Find nearby landmarks
- [ ] Validate and normalize location data
