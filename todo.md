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

## Bug Fixes - Right Panel
- [x] Fix right details panel not appearing when pin is clicked
- [x] Add smooth slide-in animation for details panel
- [x] Make map shift leftward when panel opens
- [x] Ensure panel is scrollable for long content
- [x] Verify video player displays and works correctly

## Backend Improvements
- [x] Improve event editing interface in admin panel
- [x] Ensure all edits sync properly to Supabase database
- [x] Add real-time validation for event data
- [x] Improve error handling and user feedback

## London Borough Filtering
- [x] Add borough field to database schema
- [x] Create list of 32 London Boroughs + City of London
- [x] Add borough filter to API endpoints
- [x] Add borough dropdown to filter UI
- [ ] Auto-detect borough from coordinates when possible

## CIA/Military UI Enhancements
- [ ] Add advanced animations (glitch effects, scan lines, data streams)
- [x] Implement sound effects for hover interactions
- [x] Add sound effects for click/select actions
- [ ] Create tactical HUD-style overlays
- [ ] Add matrix-style data visualization effects
- [ ] Improve color scheme with neon accents

## Timeline Mode
- [x] Create timeline view component
- [x] Add play/pause button for timeline playback
- [x] Implement automatic pin addition as timeline progresses
- [x] Add timeline scrubber for manual navigation
- [x] Create event caption box that appears with each pin
- [x] Add speed controls for timeline playback
- [x] Sync map animations with timeline events

## Advanced CIA Visual Effects
- [x] Add scan line overlay effect
- [x] Implement glitch animations on text and borders
- [x] Create HUD-style corner brackets and overlays
- [x] Add matrix-style data stream effects
- [x] Add pulsing grid background
- [x] Implement chromatic aberration effects
- [x] Add tactical status indicators

## Timeline Toggle
- [x] Add timeline toggle button in header
- [x] Implement smooth show/hide animation for timeline
- [ ] Save timeline state in local storage
- [x] Add visual indicator when timeline is active

## Auto-Borough Detection
- [x] Integrate reverse geocoding API
- [x] Auto-detect borough from coordinates in admin panel
- [x] Add manual override option for borough selection
- [x] Show detected borough with confidence indicator

## Event Heatmap Visualization
- [ ] Add heatmap layer toggle to map interface
- [ ] Implement heatmap rendering with color gradients
- [ ] Show event density patterns across London
- [ ] Add heatmap intensity controls
- [ ] Integrate with time period filtering

## CSV Bulk Import
- [ ] Create CSV upload interface in admin panel
- [ ] Parse and validate CSV data
- [ ] Support batch event creation
- [ ] Add error handling and validation feedback
- [ ] Provide CSV template download

## Event Sharing
- [ ] Generate unique URLs for each event
- [ ] Add share buttons to event details panel
- [ ] Support social media sharing (Twitter, Facebook, WhatsApp)
- [ ] Implement deep linking to specific events
- [ ] Add copy-to-clipboard functionality

## Event Heatmap Visualization
- [x] Install leaflet.heat plugin for heatmap rendering
- [x] Add heatmap layer toggle button in map controls
- [x] Implement heatmap rendering with color gradients (blue → green → yellow → red)
- [x] Show event density patterns across London
- [x] Add heatmap intensity slider control
- [x] Integrate heatmap with time period filtering
- [x] Add smooth transitions when toggling heatmap on/off

## CSV Bulk Import
- [x] Create CSV upload interface in admin panel
- [x] Add CSV file picker with drag-and-drop support
- [x] Parse and validate CSV data (title, description, lat, lon, date, category, etc.)
- [x] Support batch event creation with progress indicator
- [x] Add detailed error handling and validation feedback
- [x] Provide downloadable CSV template with example data
- [x] Show import summary (success count, error count, skipped)

## Event Sharing
- [x] Generate unique URLs for each event (/event/:id)
- [x] Add share buttons to event details panel
- [x] Support social media sharing (Twitter, Facebook, WhatsApp, LinkedIn)
- [x] Implement deep linking to open specific events on page load
- [x] Add copy-to-clipboard functionality with toast confirmation
- [ ] Generate Open Graph meta tags for rich social media previews
- [ ] Add QR code generation for event URLs

## Event Statistics Dashboard
- [x] Create statistics API endpoint with aggregated data
- [x] Build dashboard page with interactive charts
- [x] Add total events by category chart (pie/donut chart)
- [x] Add events over time trend chart (line/area chart)
- [x] Add top boroughs chart (bar chart)
- [x] Add event count cards with icons
- [x] Integrate with time period filtering
- [ ] Add export statistics functionality

## User Event Submissions
- [ ] Add event submission form for authenticated users
- [ ] Create pending events table in database
- [ ] Add moderation status field (pending, approved, rejected)
- [ ] Build admin moderation queue interface
- [ ] Add approve/reject buttons in admin panel
- [ ] Send notifications to users on approval/rejection
- [ ] Add submission guidelines and validation
- [ ] Track submission history per user

## Advanced Search
- [ ] Implement full-text search across titles, descriptions, locations
- [ ] Add search bar in header with autocomplete
- [ ] Create search API endpoint with fuzzy matching
- [ ] Add autocomplete suggestions dropdown
- [ ] Implement saved search filters
- [ ] Add search history for users
- [ ] Support search by date range
- [ ] Add search result highlighting

## Statistics Dashboard Visual Enhancement
- [x] Transform Statistics page with exaggerated cinematic CIA/military movie aesthetics
- [x] Add dramatic scan lines and glitch effects
- [x] Implement classified document styling with redacted text effects
- [x] Add tactical readouts and data stream animations
- [x] Create intense visual effects (chromatic aberration, vignette, film grain)
- [x] Add "CLASSIFIED" stamps and security clearance indicators
- [x] Implement dramatic color scheme with high contrast
- [x] Add animated borders and HUD-style overlays
- [x] Create pulsing alerts and warning indicators
- [x] Add terminal-style text effects and monospace fonts

## Statistics Page Sound Effects & Intro Sequence
- [x] Create tactical sound effects system using Web Audio API
- [x] Add beep sounds when hovering over stat cards
- [x] Add data processing sounds when hovering over charts
- [x] Add alert tones for warning indicators
- [x] Implement dramatic decryption intro sequence
- [x] Add fake authentication progress bars
- [x] Create security clearance check animations
- [x] Add access authorization countdown
- [x] Include typing/terminal text effects in intro
- [x] Add "ACCESS GRANTED" reveal animation

## OTT CIA/Military Design Overhaul
- [x] Add authentic CIA-style stencil fonts (Special Elite, Share Tech Mono, Orbitron, Rajdhani)
- [x] Update global color scheme with military greens, intelligence agency reds, and tactical yellows
- [x] Redesign header with classified document styling and security badges
- [x] Transform sidebar filters with tactical panel aesthetics
- [x] Add "CLASSIFIED" watermarks and security clearance indicators throughout
- [x] Redesign map markers with military iconography
- [x] Transform event detail popups with intelligence briefing styling
- [x] Redesign admin panel with classified document forms
- [x] Add stencil-style typography throughout all interfaces
- [x] Implement consistent HUD-style borders and brackets
- [x] Add tactical grid patterns and scan line effects globally
- [x] Transform all buttons with military command styling
- [x] Add security classification headers to all major sections
- [x] Implement film grain and vignette effects site-wide

## Header Layout Reorganization
- [x] Move timeline button from main header to classification bar
- [x] Move heatmap button from main header to classification bar
- [x] Move statistics link from main header to classification bar
- [x] Move admin access link from main header to classification bar
- [x] Remove "CLASSIFIED // TOP SECRET // NOFORN // EYES ONLY" text from classification bar
- [x] Style controls to fit within classification bar aesthetics

## Font Optimization for Space Efficiency
- [x] Replace current fonts with more space-efficient alternatives
- [x] Choose condensed, professional fonts for body text (Inter, Barlow Condensed, Roboto Condensed)
- [x] Maintain authoritative aesthetic while improving legibility
- [x] Reduce letter-spacing/tracking on body text
- [x] Update font-stencil class with more practical font (Barlow Condensed)
- [x] Update font-tactical class with condensed alternative (Barlow Condensed)
- [x] Update font-mono-tech class with efficient monospace font (IBM Plex Mono)
- [x] Test readability across all interface elements

## Timeline Feature Implementation
- [x] Fix timeline toggle to properly show/hide timeline controls
- [x] Implement chronological event animation (year by year or month by month)
- [x] Add timeline playback controls (play/pause, speed control)
- [x] Display current date/period during timeline playback
- [x] Filter map markers to show only events up to current timeline position
- [x] Add timeline scrubber for manual navigation
- [x] Implement auto-play functionality
- [x] Add visual timeline bar showing event distribution over time

## Project Documentation
- [x] Create comprehensive README.md for GitHub repository
- [x] Document project purpose and vision
- [x] List all features and capabilities
- [x] Detail technical stack and architecture
- [x] Provide setup and installation instructions
- [x] Add usage examples and screenshots
- [x] Include contribution guidelines
- [x] Add license information

## Mobile Responsiveness
- [x] Implement collapsible filter sidebar with toggle button
- [x] Create collapsible event details panel with toggle button
- [x] Add hamburger menu for mobile navigation
- [x] Optimize header layout for mobile screens
- [x] Make timeline controls touch-friendly
- [x] Adjust classification bar for mobile
- [ ] Implement swipe gestures for panel controls
- [x] Add viewport meta tag for proper mobile scaling
- [x] Test on iPhone Safari and Android Chrome
- [x] Ensure all buttons are minimum 44x44px touch targets
- [x] Optimize font sizes for mobile readability
- [ ] Add compact mode for statistics dashboard

## Bug Fixes
- [x] Fix event details panel positioning to fit within viewport
- [x] Ensure panel doesn't extend beyond visible screen area
- [x] Adjust panel top position to account for header height

## Critical Bug - Event Details Panel
- [x] Fix event details panel extending beyond viewport on desktop
- [x] Ensure panel starts below header and fits within screen
- [x] Verify scrolling works properly within panel
- [x] Test on both desktop and mobile screen sizes
