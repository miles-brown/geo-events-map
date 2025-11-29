import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import { soundEffects } from "@/lib/sounds";
import { format } from "date-fns";

interface TimelineProps {
  events: Event[];
  onTimelineProgress: (visibleEventIds: number[], currentEvent: Event | null) => void;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
}

export default function Timeline({ events, onTimelineProgress, isPlaying, onPlayPauseToggle }: TimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sort events by date (memoized to prevent re-sorting)
  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => 
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    ),
    [events]
  );

  const totalEvents = sortedEvents.length;
  const currentEvent = sortedEvents[currentIndex] || null;

  // Calculate date range
  const startDate = sortedEvents[0]?.eventDate;
  const endDate = sortedEvents[totalEvents - 1]?.eventDate;

  // Handle playback
  useEffect(() => {
    if (isPlaying && currentIndex < totalEvents) {
      const baseDelay = 2000; // 2 seconds per event at 1x speed
      const delay = baseDelay / playbackSpeed;

      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= totalEvents) {
            onPlayPauseToggle(); // Auto-pause at end
            return prev;
          }
          
          // Play tick sound for each new event
          soundEffects.tick();
          return next;
        });
      }, delay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, currentIndex, totalEvents, playbackSpeed, onPlayPauseToggle]);

  // Update visible events
  useEffect(() => {
    const visibleEventIds = sortedEvents
      .slice(0, currentIndex + 1)
      .map(e => e.id);
    
    onTimelineProgress(visibleEventIds, currentEvent);
    
    // Update progress percentage
    setProgress(totalEvents > 0 ? ((currentIndex + 1) / totalEvents) * 100 : 0);
  }, [currentIndex, totalEvents]); // Removed sortedEvents, currentEvent, onTimelineProgress from deps

  const handlePlayPause = () => {
    soundEffects.click();
    
    // If at end, restart from beginning
    if (currentIndex >= totalEvents - 1 && !isPlaying) {
      setCurrentIndex(0);
    }
    
    onPlayPauseToggle();
  };

  const handleReset = () => {
    soundEffects.click();
    setCurrentIndex(0);
    if (isPlaying) {
      onPlayPauseToggle();
    }
  };

  const handleSkipForward = () => {
    soundEffects.click();
    setCurrentIndex(prev => Math.min(prev + 1, totalEvents - 1));
  };

  const handleSkipBack = () => {
    soundEffects.click();
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const cycleSpeed = () => {
    soundEffects.select();
    setPlaybackSpeed(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 4;
      return 1;
    });
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newIndex = Math.floor(percentage * totalEvents);
    
    soundEffects.click();
    setCurrentIndex(Math.max(0, Math.min(newIndex, totalEvents - 1)));
  };

  if (totalEvents === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* Event Caption Box - CIA Style */}
      {currentEvent && isPlaying && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/95 backdrop-blur-md border-2 border-red-600 p-4 shadow-2xl max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-[9px] text-red-500 tracking-[0.3em] font-stencil mb-2">INCIDENT ALERT</div>
                <h4 className="font-semibold text-green-400 text-sm mb-1 tracking-wide">{currentEvent.title}</h4>
                <p className="text-xs text-green-400/70 mb-2 font-mono-tech">{currentEvent.locationName}</p>
                <p className="text-xs text-gray-500 font-mono-tech tracking-wider">
                  {format(new Date(currentEvent.eventDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Controls - CIA Style */}
      <div className="bg-black/95 backdrop-blur-md border-t-2 border-red-600 p-4 pointer-events-auto">
        <div className="container mx-auto max-w-7xl">
          {/* Progress Bar - CIA Style */}
          <div 
            className="relative h-2 bg-red-950/50 border border-red-900 mb-4 cursor-pointer group"
            onClick={handleScrubberClick}
            onMouseEnter={() => soundEffects.hover()}
          >
            {/* Progress fill */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            
            {/* Event markers */}
            {sortedEvents.map((event, idx) => {
              const position = ((idx + 1) / totalEvents) * 100;
              const isPast = idx <= currentIndex;
              
              return (
                <div
                  key={event.id}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 border-2 transition-all duration-300 ${
                    isPast 
                      ? "bg-red-500 border-red-400 scale-100" 
                      : "bg-gray-800 border-gray-700 scale-75 opacity-50"
                  }`}
                  style={{ left: `${position}%` }}
                  title={event.title}
                />
              );
            })}

            {/* Current position indicator */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-600 border-2 border-yellow-500 shadow-lg transition-all duration-300"
              style={{ left: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-red-600 animate-ping opacity-75" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Date Range - CIA Style */}
            <div className="text-xs text-green-400 font-mono-tech tracking-wider">
              {startDate && endDate && (
                <>
                  <span>{format(new Date(startDate), "MMM yyyy")}</span>
                  <span className="mx-2">→</span>
                  <span>{format(new Date(endDate), "MMM yyyy")}</span>
                </>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-red-700 bg-black hover:bg-red-950 hover:border-red-500 text-green-400"
                onClick={handleReset}
                onMouseEnter={() => soundEffects.hover()}
                disabled={currentIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-red-700 bg-black hover:bg-red-950 hover:border-red-500 text-green-400"
                onClick={handleSkipBack}
                onMouseEnter={() => soundEffects.hover()}
                disabled={currentIndex === 0}
              >
                <SkipBack className="h-3 w-3" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 bg-red-600 hover:bg-red-700 text-black border-2 border-yellow-500"
                onClick={handlePlayPause}
                onMouseEnter={() => soundEffects.hover()}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-red-700 bg-black hover:bg-red-950 hover:border-red-500 text-green-400"
                onClick={handleSkipForward}
                onMouseEnter={() => soundEffects.hover()}
                disabled={currentIndex >= totalEvents - 1}
              >
                <SkipForward className="h-3 w-3" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-red-700 bg-black hover:bg-red-950 hover:border-red-500 text-green-400"
                onClick={handleSkipForward}
                onMouseEnter={() => soundEffects.hover()}
                disabled={currentIndex >= totalEvents - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-red-700 bg-black hover:bg-red-950 hover:border-red-500 font-mono-tech text-xs text-green-400"
                onClick={cycleSpeed}
                onMouseEnter={() => soundEffects.hover()}
              >
                {playbackSpeed}x
              </Button>
            </div>

            {/* Event Counter - CIA Style */}
            <div className="text-xs text-green-400 font-mono-tech tracking-wider">
              INCIDENT {currentIndex + 1} / {totalEvents}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
