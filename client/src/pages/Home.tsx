import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import EventMapNew from "@/components/EventMapNew";
import CategoryFilterNew from "@/components/CategoryFilterNew";
import EventDetails from "@/components/EventDetails";
import Timeline from "@/components/Timeline";
import CIAEffects from "@/components/CIAEffects";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import type { TimePeriod } from "@shared/categories";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [timelineMode, setTimelineMode] = useState(true); // Timeline enabled by default
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [visibleEventIds, setVisibleEventIds] = useState<number[]>([]);
  
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

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
  };

  const handleTimelineProgress = useCallback((eventIds: number[], currentEvent: Event | null) => {
    setVisibleEventIds(eventIds);
    if (currentEvent && isTimelinePlaying) {
      setSelectedEvent(currentEvent);
      setDetailsVisible(true);
    }
  }, [isTimelinePlaying]);

  // Filter events for timeline mode
  const displayedEvents = timelineMode && isTimelinePlaying
    ? (events || []).filter(e => visibleEventIds.includes(e.id))
    : events || [];

  useEffect(() => {
    if (selectedEvent) {
      setDetailsVisible(true);
    }
  }, [selectedEvent]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* CIA Visual Effects */}
      <CIAEffects />
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-950 to-cyan-950/20 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-blue-500/30 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                GEO EVENTS MAP
              </h1>
              <p className="text-xs text-slate-400 tracking-wider">INTELLIGENCE TRACKING SYSTEM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="status-indicator"></span>
            <span className="text-sm text-green-400 tracking-wider">SYSTEM ONLINE</span>
            
            {/* Timeline Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
              onClick={() => setTimelineMode(!timelineMode)}
            >
              <Clock className="h-4 w-4 mr-2" />
              {timelineMode ? 'Hide Timeline' : 'Show Timeline'}
            </Button>
            
            <a
              href="/admin"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors tracking-wider"
            >
              ADMIN ACCESS
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Category Filter Panel */}
        <div className={`transition-all duration-300 ease-in-out ${filterCollapsed ? 'w-12' : 'w-80'} relative z-20`}>
          <CategoryFilterNew
            selectedCategories={selectedCategories}
            selectedSubcategories={selectedSubcategories}
            selectedTimePeriod={selectedTimePeriod}
            selectedBoroughs={selectedBoroughs}
            onCategoryChange={setSelectedCategories}
            onSubcategoryChange={setSelectedSubcategories}
            onTimePeriodChange={setSelectedTimePeriod}
            onBoroughChange={setSelectedBoroughs}
            isCollapsed={filterCollapsed}
            onToggleCollapse={() => setFilterCollapsed(!filterCollapsed)}
          />
        </div>

        {/* Map Container */}
        <div className={`flex-1 relative transition-all duration-300 ease-in-out ${detailsVisible ? 'mr-[480px]' : 'mr-0'}`}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-30">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-sm text-slate-400 tracking-wider">LOADING INTELLIGENCE DATA...</p>
              </div>
            </div>
          ) : (
            <>
              <EventMapNew
                events={displayedEvents}
                selectedEvent={selectedEvent}
                onEventSelect={handleEventSelect}
              />

              {/* Timeline Overlay */}
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

          {/* Stats overlay */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-blue-500/30 rounded-lg px-4 py-2 z-10">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-slate-400">EVENTS:</span>
                <span className="ml-2 text-blue-400 font-mono font-bold">{events?.length || 0}</span>
              </div>
              {selectedCategories.length > 0 && (
                <div className="border-l border-slate-700 pl-4">
                  <span className="text-slate-400">FILTERED:</span>
                  <span className="ml-2 text-cyan-400 font-mono font-bold">{selectedCategories.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Details Panel */}
        <div
          className={`fixed right-0 top-[73px] bottom-0 w-[480px] transition-transform duration-300 ease-in-out z-30 ${
            detailsVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-scroll 20s linear infinite;
        }

        @keyframes grid-scroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}
