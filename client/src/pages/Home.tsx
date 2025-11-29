import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import EventMapNew from "@/components/EventMapNew";
import CategoryFilterNew from "@/components/CategoryFilterNew";
import EventDetails from "@/components/EventDetails";
import Timeline from "@/components/Timeline";
import CIAEffects from "@/components/CIAEffects";
import Heatmap from "@/components/Heatmap";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Clock, Flame, BarChart3, Lock } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import type { TimePeriod } from "@shared/categories";
import { useSwipe } from "@/hooks/useSwipe";

export default function Home() {
  // State management
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [timelineMode, setTimelineMode] = useState(false);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [visibleEventIds, setVisibleEventIds] = useState<number[]>([]);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("all");
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);

  // Fetch filtered events
  const { data: events, isLoading } = trpc.events.list.useQuery({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    subcategories: selectedSubcategories.length > 0 ? selectedSubcategories : undefined,
    timePeriod: selectedTimePeriod,
    boroughs: selectedBoroughs.length > 0 ? selectedBoroughs : undefined,
  });

  // Event handlers
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setDetailsPanelOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Swipe gesture handlers
  const mainSwipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => {
      // Only open filter sidebar on mobile when swiping left from edge
      if (window.innerWidth < 768 && !filterSidebarOpen) {
        setFilterSidebarOpen(true);
      }
    },
  });

  const filterSwipeRef = useSwipe<HTMLDivElement>({
    onSwipeRight: () => {
      // Close filter sidebar when swiping right
      if (filterSidebarOpen) {
        setFilterSidebarOpen(false);
      }
    },
  });

  const detailsSwipeRef = useSwipe<HTMLDivElement>({
    onSwipeRight: () => {
      // Close details panel when swiping right
      if (detailsPanelOpen) {
        handleCloseDetails();
      }
    },
    onSwipeUp: () => {
      // Also allow swipe up to close details on mobile
      if (window.innerWidth < 768 && detailsPanelOpen) {
        handleCloseDetails();
      }
    },
  });

  const handleTimelineProgress = useCallback((eventIds: number[], currentEvent: Event | null) => {
    setVisibleEventIds(eventIds);
    if (currentEvent && isTimelinePlaying) {
      setSelectedEvent(currentEvent);
      setDetailsPanelOpen(true);
    }
  }, [isTimelinePlaying]);

  // Filter events for timeline mode
  const displayedEvents = timelineMode && isTimelinePlaying
    ? (events || []).filter(e => visibleEventIds.includes(e.id))
    : events || [];

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* CIA Visual Effects */}
      <CIAEffects />
      
      {/* Tactical background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-red-950/10 via-black to-black pointer-events-none" />
      
      {/* Corner HUD brackets */}
      <div className="fixed top-0 left-0 w-16 h-16 md:w-24 md:h-24 border-t-2 border-l-2 border-red-500/50 pointer-events-none" style={{ zIndex: 'var(--z-header)' }} />
      <div className="fixed top-0 right-0 w-16 h-16 md:w-24 md:h-24 border-t-2 border-r-2 border-red-500/50 pointer-events-none" style={{ zIndex: 'var(--z-header)' }} />
      <div className="fixed bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 border-b-2 border-l-2 border-red-500/50 pointer-events-none" style={{ zIndex: 'var(--z-header)' }} />
      <div className="fixed bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 border-b-2 border-r-2 border-red-500/50 pointer-events-none" style={{ zIndex: 'var(--z-header)' }} />
      
      {/* Header */}
      <header className="relative border-b-2 border-red-600 bg-black/95 backdrop-blur-md shrink-0" style={{ zIndex: 'var(--z-header)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                className="md:hidden p-2 text-green-400 hover:text-red-500 transition-colors"
                aria-label="Toggle filters"
              >
                {filterSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center gap-2 md:gap-4">
                <div className="relative">
                  <Shield className="h-8 w-8 md:h-12 md:w-12 text-red-500 animate-pulse" />
                  <div className="absolute inset-0 bg-red-500 blur-xl opacity-30" />
                </div>
                <div>
                  <h1 className="text-lg md:text-3xl font-tactical text-red-500 tracking-widest">
                    GEO EVENTS MAP
                  </h1>
                  <p className="text-[8px] md:text-xs text-green-600 tracking-[0.3em] font-mono-tech">
                    INTELLIGENCE TRACKING SYSTEM
                  </p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1 border border-green-600/50 bg-green-950/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-mono-tech tracking-wider">SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 border border-red-600/50 bg-red-950/20">
                <Lock className="h-3 w-3 text-red-500" />
                <span className="text-red-400 font-mono-tech tracking-wider">ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification Bar */}
        <div className="bg-red-600 px-4 py-2 md:px-6 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <Button
              onClick={() => setTimelineMode(!timelineMode)}
              variant="outline"
              size="sm"
              className="bg-black border-black text-green-400 hover:bg-green-950 hover:text-green-300 h-8 px-2 md:px-3 text-xs"
            >
              <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">{timelineMode ? "HIDE" : "SHOW"} TIMELINE</span>
              <span className="sm:hidden">TIME</span>
            </Button>
            
            <Button
              onClick={() => setHeatmapEnabled(!heatmapEnabled)}
              variant="outline"
              size="sm"
              className="bg-black border-black text-yellow-400 hover:bg-yellow-950 hover:text-yellow-300 h-8 px-2 md:px-3 text-xs"
            >
              <Flame className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">{heatmapEnabled ? "HIDE" : "SHOW"} HEATMAP</span>
              <span className="sm:hidden">HEAT</span>
            </Button>
            
            <Link href="/statistics">
              <Button
                variant="outline"
                size="sm"
                className="bg-black border-black text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 h-8 px-2 md:px-3 text-xs"
              >
                <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">STATISTICS</span>
                <span className="sm:hidden">STATS</span>
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="bg-black border-black text-red-400 hover:bg-red-950 hover:text-red-300 h-8 px-2 md:px-3 text-xs"
              >
                <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">ADMIN ACCESS</span>
                <span className="sm:hidden">ADMIN</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={mainSwipeRef} className="flex-1 flex overflow-hidden relative">
        {/* Filter Sidebar - Mobile: Overlay, Desktop: Fixed */}
        <aside
          ref={filterSwipeRef}
          className={`
            fixed md:relative
            inset-y-0 left-0
            w-80 md:w-80
            bg-black/95 md:bg-black/90
            border-r-2 border-red-600
            transition-transform duration-300 ease-in-out
            overflow-y-auto
            ${filterSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ 
            zIndex: 'var(--z-filter-sidebar)',
            top: 'var(--header-height, 0)'
          }}
        >
          <CategoryFilterNew
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedSubcategories={selectedSubcategories}
            onSubcategoryChange={setSelectedSubcategories}
            selectedTimePeriod={selectedTimePeriod}
            onTimePeriodChange={setSelectedTimePeriod}
            selectedBoroughs={selectedBoroughs}
            onBoroughChange={setSelectedBoroughs}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </aside>

        {/* Mobile Backdrop for Filter Sidebar */}
        {filterSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 'calc(var(--z-filter-sidebar) - 1)' }}
            onClick={() => setFilterSidebarOpen(false)}
          />
        )}

        {/* Map Container */}
        <div className="flex-1 relative" style={{ zIndex: 'var(--z-map)' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="flex flex-col items-center gap-4 border-2 border-red-600 bg-black/80 p-8 md:p-12">
                <div className="text-green-400 font-stencil tracking-[0.3em] text-sm md:text-lg">
                  [ ACCESSING CLASSIFIED DATABASE ]
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-100" />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-200" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <EventMapNew
                events={displayedEvents}
                selectedEvent={selectedEvent}
                onEventSelect={handleEventSelect}
                onMapReady={setMapInstance}
              />
              
              <Heatmap
                map={mapInstance}
                events={events || []}
                enabled={heatmapEnabled}
                intensity={1.0}
              />

              {timelineMode && (
                <Timeline
                  events={events || []}
                  onTimelineProgress={handleTimelineProgress}
                  isPlaying={isTimelinePlaying}
                  onPlayPauseToggle={() => setIsTimelinePlaying(!isTimelinePlaying)}
                />
              )}
            </>
          )}

          {/* Stats Overlay */}
          <div 
            className="absolute top-4 left-4 bg-black/95 backdrop-blur-md border-2 border-red-600 px-3 py-2 md:px-4 md:py-3"
            style={{ zIndex: 'var(--z-stats-overlay)' }}
          >
            <div className="text-[10px] text-red-500 tracking-[0.3em] font-stencil border-b border-red-900 pb-1 mb-2">
              TACTICAL OVERVIEW
            </div>
            <div className="flex items-center gap-4 text-xs md:text-sm font-mono">
              <div>
                <span className="text-gray-500">INCIDENTS:</span>
                <span className="text-red-500 font-black text-base md:text-lg ml-2">{events?.length || 0}</span>
              </div>
            </div>
            <div className="text-[8px] text-gray-600 tracking-widest font-mono mt-1">
              CLASSIFICATION: TS//SCI
            </div>
          </div>
        </div>

        {/* Event Details Panel - Mobile: Full Screen, Desktop: Slide-in */}
        {detailsPanelOpen && selectedEvent && (
          <>
            {/* Mobile Backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm"
              style={{ zIndex: 'calc(var(--z-details-panel) - 1)' }}
              onClick={handleCloseDetails}
            />
            
            {/* Details Panel */}
            <aside
              ref={detailsSwipeRef}
              className={`
                fixed
                inset-0 md:inset-y-0 md:right-0 md:left-auto
                w-full md:w-[480px]
                bg-black/95
                border-l-2 border-red-600
                overflow-y-auto
                transition-transform duration-300 ease-in-out
                ${detailsPanelOpen ? 'translate-x-0' : 'translate-x-full'}
              `}
              style={{ 
                zIndex: 'var(--z-details-panel)',
                top: 'var(--header-height, 0)'
              }}
            >
              <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
