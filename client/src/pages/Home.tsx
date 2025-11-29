import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import EventMapNew from "@/components/EventMapNew";
import CategoryFilterNew from "@/components/CategoryFilterNew";
import EventDetails from "@/components/EventDetails";
import Timeline from "@/components/Timeline";
import CIAEffects from "@/components/CIAEffects";
import Heatmap from "@/components/Heatmap";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock, Flame, Shield, Lock, Eye, AlertTriangle, Radio } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import type { TimePeriod } from "@shared/categories";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [timelineMode, setTimelineMode] = useState(true);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [visibleEventIds, setVisibleEventIds] = useState<number[]>([]);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(1.0);
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
    <div className="min-h-screen bg-black text-green-400 flex flex-col relative overflow-hidden font-mono-tech">
      {/* CIA Visual Effects */}
      <CIAEffects />
      
      {/* Tactical background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black pointer-events-none" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none animate-scan" />
      
      {/* Corner HUD brackets */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-red-500/50 z-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-red-500/50 z-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-red-500/50 z-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-red-500/50 z-50 pointer-events-none" />
      
      {/* Header - CIA Style */}
      <header className="relative z-10 border-b-2 border-red-600 bg-black/95 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="h-12 w-12 text-red-500 animate-pulse" />
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-30" />
              </div>
              <div>
                <h1 className="text-3xl font-tactical text-red-500 tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  GEO EVENTS MAP
                </h1>
                <p className="text-xs text-green-400 tracking-[0.3em] font-stencil">
                  INTELLIGENCE TRACKING SYSTEM
                </p>
              </div>
            </div>
            
            {/* Right side - Status and Security Badges */}
            <div className="flex items-center gap-6">
              {/* System Status */}
              <div className="flex items-center gap-2 px-3 py-1 border border-green-500/50 bg-green-950/20">
                <Radio className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 tracking-widest font-stencil">SYSTEM ONLINE</span>
              </div>
              
              {/* Security Badge */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] text-red-500">
                  <Lock className="h-3 w-3" />
                  <span className="tracking-widest font-stencil">ENCRYPTED</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                  <Eye className="h-3 w-3" />
                  <span className="tracking-widest font-stencil">MONITORED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Classification Bar with Controls */}
        <div className="bg-red-600 text-black py-2 px-4">
          <div className="container mx-auto flex items-center justify-center gap-4">
            {/* Timeline Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-2 border-black bg-red-600 hover:bg-red-700 text-black font-stencil tracking-wider text-xs"
              onClick={() => setTimelineMode(!timelineMode)}
            >
              <Clock className="h-3 w-3 mr-1" />
              {timelineMode ? 'HIDE TIMELINE' : 'SHOW TIMELINE'}
            </Button>
            
            {/* Heatmap Toggle */}
            <Button
              variant="outline"
              size="sm"
              className={`h-7 border-2 border-black bg-red-600 hover:bg-red-700 text-black font-stencil tracking-wider text-xs ${
                heatmapEnabled ? 'bg-red-700' : ''
              }`}
              onClick={() => setHeatmapEnabled(!heatmapEnabled)}
            >
              <Flame className="h-3 w-3 mr-1" />
              {heatmapEnabled ? 'HIDE HEATMAP' : 'SHOW HEATMAP'}
            </Button>
            
            {/* Navigation Links */}
            <a
              href="/statistics"
              className="text-xs text-black hover:text-gray-800 transition-colors tracking-[0.2em] font-stencil border-2 border-black px-3 py-1 hover:bg-red-700"
            >
              STATISTICS
            </a>
            <a
              href="/admin"
              className="text-xs text-black hover:text-gray-800 transition-colors tracking-[0.2em] font-stencil border-2 border-black px-3 py-1 hover:bg-red-700"
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-30">
              <div className="flex flex-col items-center gap-6 border-2 border-red-600 bg-black/80 p-12">
                <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                  <p className="text-lg text-green-400 tracking-[0.3em] font-stencil">
                    [ ACCESSING CLASSIFIED DATABASE ]
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-100" />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-200" />
                </div>
                <p className="text-xs text-gray-600 tracking-widest font-mono">
                  SECURITY CLEARANCE: LEVEL 5 // DECRYPTING...
                </p>
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
              
              {/* Heatmap Layer */}
              <Heatmap
                map={mapInstance}
                events={events || []}
                enabled={heatmapEnabled}
                intensity={heatmapIntensity}
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

          {/* Stats overlay - CIA Style */}
          <div className="absolute top-4 left-4 bg-black/95 backdrop-blur-md border-2 border-red-600 px-4 py-3 z-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="flex flex-col gap-2">
              <div className="text-[10px] text-red-500 tracking-[0.3em] font-stencil border-b border-red-900 pb-1">
                TACTICAL OVERVIEW
              </div>
              <div className="flex items-center gap-6 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 tracking-wider">INCIDENTS:</span>
                  <span className="text-red-500 font-black text-lg tracking-wider">{events?.length || 0}</span>
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex items-center gap-2 border-l border-red-900 pl-4">
                    <span className="text-gray-500 tracking-wider">FILTERED:</span>
                    <span className="text-yellow-500 font-black text-lg tracking-wider">{selectedCategories.length}</span>
                  </div>
                )}
              </div>
              <div className="text-[9px] text-gray-600 tracking-widest font-mono">
                CLASSIFICATION: TS//SCI
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Panel */}
        <div
          className={`fixed right-0 top-[121px] bottom-0 w-[480px] transition-transform duration-300 ease-in-out z-30 ${
            detailsVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(239, 68, 68, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.15) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-scroll 30s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        .bg-scan-lines {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .animate-scan {
          animation: scan 10s linear infinite;
        }

        @keyframes grid-scroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
