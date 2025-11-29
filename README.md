# 🗺️ Geo Events Map

**Intelligence Tracking System for Bizarre and Unusual Events**

An interactive, over-the-top CIA/military-styled web application for visualizing and tracking geo-located unusual events across the globe. Built with a cinematic Hollywood spy thriller aesthetic, this application transforms event data into an immersive intelligence briefing experience.

---

## 🎯 Project Purpose

Geo Events Map serves as an intelligence tracking system designed to catalog, visualize, and analyze unusual, bizarre, and paranormal events from around the world. The application presents historical and contemporary incidents through an exaggerated CIA/military command center interface, making data exploration both functional and entertaining.

The project demonstrates modern web development practices while creating an engaging user experience that feels like accessing a classified government database from a spy movie.

---

## ✨ Key Features

### 📍 Interactive Map Interface

The core of the application is a fully interactive map powered by Google Maps integration through the Manus proxy system. Users can explore events geographically with real-time filtering and visualization capabilities.

**Map Capabilities:**
- **Dynamic Event Markers**: Color-coded pins representing different event categories (Crime, Strange, Paranormal, Accident, etc.)
- **Cluster Visualization**: Numbered clusters showing event density in specific areas
- **Event Details Panel**: Click any marker to view comprehensive incident information including title, date, location, category, and description
- **Heatmap Mode**: Toggle heat visualization to identify event concentration hotspots
- **Responsive Navigation**: Smooth pan and zoom controls with full touch support

### ⏱️ Timeline Animation System

The timeline feature provides chronological playback of events from 1970 to 2024, allowing users to visualize how incidents unfold over time.

**Timeline Controls:**
- **Progressive Playback**: Events appear sequentially on the map as the timeline advances
- **Playback Speed Control**: Adjust animation speed between 1x, 2x, and 4x
- **Interactive Scrubber**: Click anywhere on the progress bar to jump to specific time periods
- **Skip Navigation**: Jump forward or backward through events with dedicated controls
- **Event Counter**: Real-time display showing current incident number (e.g., "INCIDENT 5 / 20")
- **Date Range Display**: Shows the full timeline span with current position
- **Incident Alert Box**: Displays event details during playback with classified document styling

### 🔍 Advanced Filtering System

The sidebar provides comprehensive filtering options to narrow down events based on multiple criteria.

**Filter Categories:**
- **Time Period**: Latest Month, Latest 6 Months, Latest Year, Latest 5 Years, Latest 10 Years, All Time
- **London Boroughs**: Geographic filtering by specific London administrative areas
- **Event Categories**: Crime, Transport, Fire, Emergency, Weather, Social Media, Public Event, Celebrity, Strange, Construction, Accident, Paranormal, Government, Technology

Each filter updates the map in real-time, allowing users to focus on specific types of incidents or time ranges.

### 📊 Statistics Dashboard

An analytics dashboard providing comprehensive insights into event data with dramatic CIA-style presentation.

**Dashboard Features:**
- **Decryption Intro Sequence**: 7-second animated authentication process with security clearance checks
- **Web Audio API Sound Effects**: Tactical beeps and data processing sounds on hover interactions
- **Key Metrics Cards**: Total Events, Categories, Boroughs, Time Span
- **Category Distribution**: Pie chart showing event breakdown by type
- **Geographic Analysis**: Bar chart displaying top boroughs by incident count
- **Temporal Trends**: Line chart visualizing events over time from 1970 to 2024
- **Security Classifications**: "TOP SECRET // EYES ONLY" and "TS//SCI//NOFORN" badges throughout

### 🔐 Admin Panel

A secure administrative interface for managing event data with role-based access control.

**Admin Capabilities:**
- **Event Management**: Create, read, update, and delete (CRUD) operations for all events
- **Category Assignment**: Organize events into predefined categories
- **Location Management**: Set precise coordinates and location names
- **Date Control**: Assign accurate timestamps to historical and contemporary events
- **Authentication**: Manus OAuth integration with admin role verification
- **Classified Styling**: Military-themed forms and interfaces matching the overall aesthetic

---

## 🎨 Design Philosophy

### CIA/Military Movie Aesthetic

The entire application embraces an exaggerated Hollywood spy thriller visual language, creating an immersive experience that feels like accessing classified government intelligence.

**Visual Elements:**
- **Pure Black Backgrounds** (#000000) for classified document appearance
- **Military Color Palette**: Red (#DC2626) for alerts and borders, Green (#22C55E) for status text, Yellow (#EAB308) for warnings
- **Security Clearance Badges**: "TOP SECRET", "CLASSIFIED", "TS//SCI//NOFORN", "COMPARTMENT: UMBRA"
- **HUD-Style Brackets**: Corner brackets framing interface sections
- **Scan Line Effects**: Animated horizontal lines sweeping across screens
- **Film Grain Overlay**: Subtle texture for vintage intelligence footage aesthetic
- **Vignette Effects**: Darkened corners emphasizing the classified nature

### Typography System

The application uses a carefully selected font stack optimized for both aesthetics and readability.

**Font Hierarchy:**
- **Inter**: Primary body font providing excellent legibility at small sizes with efficient character spacing
- **Barlow Condensed**: Headings and tactical elements offering authoritative military presence while conserving horizontal space
- **IBM Plex Mono**: Technical readouts and monospace text delivering professional, readable code-style displays
- **Orbitron**: Display font for dramatic headers and security classifications

All fonts are loaded from Google Fonts CDN with optimized weight selections to minimize load times while maintaining visual impact.

---

## 🛠️ Technical Stack

### Frontend Technologies

The client-side application is built with modern React and TypeScript, ensuring type safety and component reusability.

**Core Framework:**
- **React 19**: Latest version with concurrent features and automatic batching
- **TypeScript**: Full type coverage across components, hooks, and utilities
- **Vite**: Lightning-fast development server with hot module replacement (HMR)
- **Tailwind CSS 4**: Utility-first CSS framework with custom theme configuration

**UI Components:**
- **shadcn/ui**: High-quality accessible components built on Radix UI primitives
- **Lucide React**: Icon library providing consistent visual language
- **Recharts**: Composable charting library for statistics visualizations
- **React Leaflet**: React bindings for Leaflet.js map integration

**State Management:**
- **tRPC React Query**: Type-safe API calls with automatic cache management
- **React Hooks**: useState, useEffect, useMemo for local component state
- **Context API**: Global auth state management via useAuth hook

### Backend Technologies

The server implements a modern Node.js stack with end-to-end type safety through tRPC.

**Server Framework:**
- **Express 4**: Minimal web framework handling HTTP routing
- **tRPC 11**: Type-safe API layer with automatic TypeScript inference
- **SuperJSON**: Serialization supporting Date objects and other complex types
- **tsx**: TypeScript execution engine for development workflow

**Database Layer:**
- **Drizzle ORM**: Type-safe SQL query builder with schema-first approach
- **MySQL/TiDB**: Relational database for event storage
- **Schema Migrations**: Version-controlled database changes via drizzle-kit

**Authentication:**
- **Manus OAuth**: Integrated authentication system with session management
- **JWT Tokens**: Secure session cookies with automatic refresh
- **Role-Based Access Control**: Admin and user roles with procedure-level authorization

### Infrastructure & Services

The application leverages several managed services for enhanced functionality.

**Manus Platform Services:**
- **S3 Storage**: File uploads and static asset hosting via `storagePut` and `storageGet` helpers
- **LLM Integration**: AI-powered features through `invokeLLM` with OpenAI-compatible API
- **Voice Transcription**: Audio-to-text conversion via Whisper API integration
- **Image Generation**: AI image creation through internal ImageService
- **Maps Proxy**: Full Google Maps JavaScript API access without API key management
- **Notification System**: Owner alerts via `notifyOwner` helper for operational updates

**Development Tools:**
- **pnpm**: Fast, disk-efficient package manager
- **Vitest**: Unit testing framework with TypeScript support
- **ESLint**: Code quality and consistency enforcement
- **TypeScript Compiler**: Type checking and compilation

---

## 📁 Project Structure

The repository follows a monorepo structure with clear separation between client and server code.

```
geo-events-map/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets (served at root)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   ├── AIChatBox.tsx    # Chat interface component
│   │   │   ├── CategoryFilterNew.tsx  # Event category filters
│   │   │   ├── DashboardLayout.tsx    # Admin panel layout
│   │   │   ├── Map.tsx          # Google Maps integration
│   │   │   └── Timeline.tsx     # Timeline animation controls
│   │   ├── contexts/            # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/
│   │   │   └── trpc.ts          # tRPC client configuration
│   │   ├── pages/               # Page-level components
│   │   │   ├── Admin.tsx        # Admin event management
│   │   │   ├── Home.tsx         # Main map interface
│   │   │   └── Statistics.tsx   # Analytics dashboard
│   │   ├── App.tsx              # Route configuration
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles and theme
│   └── index.html               # HTML template
├── server/                      # Backend Node.js application
│   ├── _core/                   # Framework-level code (do not modify)
│   │   ├── context.ts           # tRPC context builder
│   │   ├── env.ts               # Environment variable validation
│   │   ├── imageGeneration.ts   # Image generation helper
│   │   ├── llm.ts               # LLM integration helper
│   │   ├── map.ts               # Google Maps API helper
│   │   ├── notification.ts      # Owner notification helper
│   │   ├── oauth.ts             # OAuth flow implementation
│   │   └── voiceTranscription.ts # Audio transcription helper
│   ├── db.ts                    # Database query helpers
│   ├── routers.ts               # tRPC procedure definitions
│   └── *.test.ts                # Vitest unit tests
├── drizzle/                     # Database schema and migrations
│   └── schema.ts                # Drizzle table definitions
├── storage/                     # S3 storage helpers
├── shared/                      # Shared types and constants
├── package.json                 # Dependencies and scripts
├── drizzle.config.ts            # Drizzle ORM configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── todo.md                      # Feature tracking
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js**: Version 22.13.0 or higher
- **pnpm**: Version 9.x or higher (install via `npm install -g pnpm`)
- **MySQL/TiDB**: Database server (or connection string to hosted instance)

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/miles-brown/geo-events-map.git
cd geo-events-map

# Install dependencies
pnpm install
```

### Environment Configuration

The application requires several environment variables for full functionality. These are automatically injected by the Manus platform in production, but for local development you'll need to configure them manually.

**Required Environment Variables:**

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/geo_events

# Authentication
JWT_SECRET=your-secret-key-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# Owner Information
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Manus Services (Backend)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-backend-api-key

# Manus Services (Frontend)
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Application Branding
VITE_APP_TITLE=Geo Events Map
VITE_APP_LOGO=/logo.svg
```

Create a `.env` file in the project root with these values. **Never commit this file to version control.**

### Database Setup

Initialize the database schema and push migrations:

```bash
# Generate migration files
pnpm drizzle-kit generate

# Push schema to database
pnpm db:push
```

### Development Server

Start the development server with hot module replacement:

```bash
# Start both frontend and backend
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api

### Building for Production

Create an optimized production build:

```bash
# Build both client and server
pnpm build

# Start production server
pnpm start
```

---

## 🧪 Testing

The project includes comprehensive unit tests for backend procedures using Vitest.

### Running Tests

Execute the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

Tests are located alongside their corresponding implementation files with the `.test.ts` extension. Each tRPC procedure should have associated tests covering:

- **Success cases**: Valid inputs producing expected outputs
- **Error cases**: Invalid inputs throwing appropriate errors
- **Authorization**: Protected procedures rejecting unauthorized access
- **Edge cases**: Boundary conditions and unusual inputs

**Example test file:**

```typescript
// server/auth.logout.test.ts
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('auth.logout', () => {
  it('should clear session cookie', async () => {
    const caller = appRouter.createCaller({ user: mockUser });
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});
```

---

## 📖 Usage Guide

### Exploring Events

Navigate to the main map interface to begin exploring events. Use the sidebar filters to narrow down incidents by time period, location, or category. Click any map marker to view detailed information in the right-side panel.

### Timeline Playback

Click the **"SHOW TIMELINE"** button in the red classification bar to activate timeline mode. The timeline controls will appear at the bottom of the screen. Press the play button to begin chronological animation, or use the scrubber to jump to specific time periods. Adjust playback speed using the speed control button (1x/2x/4x).

### Viewing Statistics

Navigate to the **Statistics** page via the header link. After the 7-second decryption intro sequence, explore the analytics dashboard showing event distribution, geographic analysis, and temporal trends. Hover over charts and cards to hear tactical sound effects.

### Admin Management

Access the **Admin** panel via the header link (requires admin role). Log in with Manus OAuth to manage events. Create new incidents by filling out the form with title, description, category, location coordinates, and date. Edit or delete existing events using the table controls.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines when submitting pull requests.

### Development Workflow

1. **Fork the repository** and create a new branch for your feature
2. **Make your changes** following the existing code style and conventions
3. **Write tests** for new functionality or bug fixes
4. **Run the test suite** to ensure all tests pass
5. **Update documentation** if you've changed APIs or added features
6. **Submit a pull request** with a clear description of your changes

### Code Style

The project uses ESLint for code quality enforcement. Run the linter before committing:

```bash
pnpm lint
```

Follow these conventions:
- Use TypeScript for all new files
- Prefer functional components with hooks over class components
- Use tRPC procedures for all API endpoints (no manual REST routes)
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use Tailwind utility classes instead of custom CSS

### Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>: <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat: Add date range filtering to timeline

Implement custom date picker allowing users to set start/end dates
for timeline playback. Adds new tRPC procedure for filtered event
queries and updates Timeline component with date controls.

Closes #42
```

---

## 📄 License

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## 🙏 Acknowledgments

**Built with:**
- [React](https://react.dev/) - UI framework
- [tRPC](https://trpc.io/) - End-to-end type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries
- [shadcn/ui](https://ui.shadcn.com/) - Accessible component library
- [Google Maps](https://developers.google.com/maps) - Interactive mapping
- [Manus Platform](https://manus.im/) - Hosting and managed services

**Fonts:**
- [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) by Jeremy Tribby
- [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) by IBM
- [Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney

---

## 📞 Contact

**Project Maintainer:** Miles Brown

**Repository:** [github.com/miles-brown/geo-events-map](https://github.com/miles-brown/geo-events-map)

For questions, issues, or feature requests, please open an issue on GitHub.

---

**⚠️ CLASSIFIED // TOP SECRET // NOFORN // EYES ONLY ⚠️**

*This is a fictional intelligence tracking system created for entertainment and educational purposes. No actual classified information is contained within this application.*
