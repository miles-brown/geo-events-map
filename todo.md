# Geo Events Map - Project TODO

## Core Features
- [x] Database schema for events with all required properties
- [x] Backend API endpoints for CRUD operations on events
- [x] Interactive full-screen map with location pins
- [x] Category/type selector panel on the left (collapsible)
- [x] Event details panel on the right with video player
- [x] Video hosting integration with URL support
- [x] Category filtering functionality
- [x] Initial focus on London events
- [x] GitHub repository setup
- [x] Database connection (Neon or Supabase)

## Database Properties
- [x] Event date/time
- [x] Event category/type
- [x] Event description
- [x] Video URL/source
- [x] People involved
- [x] Crime boolean flag
- [x] Additional details
- [x] Background information
- [x] Geolocation (latitude/longitude)
- [x] Location name/address

## UI Components
- [x] Map component with markers
- [x] Left sidebar with category filters
- [x] Right panel for video playback
- [x] Collapsible panels
- [x] Pin/marker interactions
- [x] Video embed player

## Technical Setup
- [x] Create GitHub repository
- [x] Set up database connection
- [x] Configure video hosting
- [ ] Deploy application

## New Features
- [x] Research 10 real unusual documented events from London
- [x] Add real events to database with accurate details and video sources

## Bug Fixes
- [x] Investigate and fix events not displaying on map

## UI Enhancements
- [x] Add different colored pins for each event category
- [x] Add different pin styles for each event type
- [x] Add map legend showing event types and colors

## Current Issues
- [x] Debug why events are not displaying on user's map
- [x] Verify database connection is working
- [x] Check API endpoints are returning data

## Database Migration
- [x] Create new Supabase project
- [x] Set up events table schema in Supabase
- [x] Export current database data
- [x] Import data to Supabase
- [x] Update application DATABASE_URL to Supabase
- [x] Verify all events display correctly after migration

## Admin Panel
- [x] Add "Admin Login" link to main site
- [x] Create admin authentication route
- [x] Build admin panel UI with event list
- [x] Create event creation form with all fields
- [x] Create event editing functionality
- [x] Create event deletion functionality
- [x] Implement video file upload (up to 25MB)
- [x] Store uploaded videos in S3
- [x] Test all admin CRUD operations

## Category System Overhaul
- [x] Update database schema to support subcategories and multiple tags
- [x] Define comprehensive category hierarchy (Crime, Transport, Fire, Emergency, Weather, Social Media, Public Event, Celebrity, Strange, Construction)
- [x] Create subcategories for each main category
- [x] Update backend API to support hierarchical filtering
- [x] Build time period filter (month, 6 months, year, 5 years, 10 years, specific year/decade)
- [x] Create expandable category filter UI with subcategories
- [x] Remove "Paranormal" category
- [x] Update admin form with new category/subcategory selection
- [x] Allow multiple categories/subcategories per event

## Map Improvements
- [x] Redesign pin icons with smaller precision points
- [x] Create distinct pin styles for each category
- [x] Implement map clustering for dense areas
- [x] Display cluster count when pins overlap
- [x] Add cluster expansion on click

## UI/UX Enhancements
- [x] Create modern, sleek military/CIA-style interface design
- [x] Add smooth animated transitions between pin selections
- [x] Implement animated map panning when clicking pins
- [x] Add glassmorphism effects and modern shadows
- [x] Create futuristic color scheme with accent colors
- [x] Add loading animations and transitions
- [x] Implement smooth panel slide animations
- [x] Add hover effects and micro-interactions
