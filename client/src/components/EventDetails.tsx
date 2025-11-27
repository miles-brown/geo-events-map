import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, MapPin, Calendar, ExternalLink, Users, AlertCircle } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import { format } from "date-fns";

interface EventDetailsProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetails({ event, onClose }: EventDetailsProps) {
  if (!event) {
    return (
      <div className="bg-card border-l border-border h-full w-96 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an event on the map to view details</p>
        </div>
      </div>
    );
  }

  // Extract video ID from various URL formats
  const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : new URLSearchParams(new URL(url).search).get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Default: return original URL
    return url;
  };

  const embedUrl = event.videoUrl ? getVideoEmbedUrl(event.videoUrl) : null;

  return (
    <div className="bg-card border-l border-border h-full w-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Event Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Video Player */}
          {embedUrl && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={event.title}
              />
            </div>
          )}

          {/* Title and Category */}
          <div>
            <h3 className="font-bold text-xl mb-2">{event.title}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="capitalize">
                {event.category}
              </Badge>
              {event.isCrime && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Crime
                </Badge>
              )}
              {event.isVerified && <Badge variant="default">Verified</Badge>}
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Location</p>
              <p className="text-sm text-muted-foreground">{event.locationName}</p>
              <p className="text-xs text-muted-foreground">
                {event.latitude}, {event.longitude}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Event Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.eventDate), "PPP")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className="font-medium text-sm mb-2">Description</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Details */}
          {event.details && (
            <div>
              <p className="font-medium text-sm mb-2">Details</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.details}
              </p>
            </div>
          )}

          {/* Background Info */}
          {event.backgroundInfo && (
            <div>
              <p className="font-medium text-sm mb-2">Background</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.backgroundInfo}
              </p>
            </div>
          )}

          {/* People Involved */}
          {event.peopleInvolved && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">People Involved</p>
                <p className="text-sm text-muted-foreground">{event.peopleInvolved}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Source Link */}
          {event.sourceUrl && (
            <div>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View Original Source
              </a>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
