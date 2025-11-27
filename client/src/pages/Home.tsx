import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import EventMap from "@/components/EventMap";
import CategoryFilter from "@/components/CategoryFilter";
import EventDetails from "@/components/EventDetails";
import MapLegend from "@/components/MapLegend";
import { Event } from "../../../drizzle/schema";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  // Fetch all events
  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery();
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = trpc.events.categories.useQuery();

  // Filter events based on selected category
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!selectedCategory) return events;
    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  if (eventsLoading || categoriesLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading events map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Panel - Category Filter */}
      <CategoryFilter
        categories={categories || []}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        isCollapsed={isFilterCollapsed}
        onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
      />

      {/* Map */}
      <div className="flex-1 relative">
        <EventMap
          events={filteredEvents}
          onEventClick={handleEventClick}
          selectedEventId={selectedEvent?.id}
        />
        <MapLegend />
      </div>

      {/* Right Panel - Event Details */}
      <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
    </div>
  );
}
