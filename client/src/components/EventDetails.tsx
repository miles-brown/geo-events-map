import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Calendar, ExternalLink, Users, AlertCircle, Share2 } from "lucide-react";
import { Event } from "../../../drizzle/schema";
import { format } from "date-fns";

interface EventDetailsProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetails({ event, onClose }: EventDetailsProps) {
  if (!event) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-md border-l border-blue-500/30 h-full w-full flex items-center justify-center p-8">
        <div className="text-center text-slate-400">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="tracking-wider uppercase text-sm">Select an event on the map to view details</p>
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
    <div className="bg-black/95 backdrop-blur-md border-l-2 border-red-600 h-full w-full flex flex-col shadow-2xl max-md:fixed max-md:inset-0 max-md:z-50 max-md:border-l-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-red-600 bg-black/80 flex-shrink-0 max-md:p-3">
        <h2 className="font-bold text-lg tracking-wider text-red-500 uppercase font-stencil max-md:text-base">INCIDENT DETAILS</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              const url = `${window.location.origin}/event/${event.id}`;
              navigator.clipboard.writeText(url);
            }}
            className="hover:bg-red-500/20 hover:text-red-300 transition-colors max-md:h-8 max-md:w-8"
            title="Copy share link"
          >
            <Share2 className="h-5 w-5 text-green-400 max-md:h-4 max-md:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-red-500/20 hover:text-red-300 transition-colors max-md:h-8 max-md:w-8"
          >
            <X className="h-5 w-5 text-green-400 max-md:h-4 max-md:w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 max-md:p-4 max-md:space-y-4">
          {/* Video Player */}
          {embedUrl && (
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-blue-500/30 shadow-lg">
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
            <h3 className="font-bold text-2xl mb-3 text-slate-100 leading-tight">{event.title}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize bg-blue-500/20 border-blue-500/50 text-blue-300">
                {event.category}
              </Badge>
              {event.isCrime && (
                <Badge variant="outline" className="bg-red-500/20 border-red-500/50 text-red-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Crime
                </Badge>
              )}
              {event.isVerified && (
                <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <div className="h-px bg-blue-500/20" />

          {/* Location */}
          <div className="flex items-start gap-3 p-4 bg-slate-900/50 border border-blue-500/20 rounded-lg">
            <MapPin className="h-5 w-5 mt-0.5 text-cyan-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm text-slate-200 font-medium">{event.locationName}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {event.latitude}, {event.longitude}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3 p-4 bg-slate-900/50 border border-blue-500/20 rounded-lg">
            <Calendar className="h-5 w-5 mt-0.5 text-cyan-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-1">Event Date</p>
              <p className="text-sm text-slate-200 font-mono">
                {format(new Date(event.eventDate), "PPP")}
              </p>
            </div>
          </div>

          <div className="h-px bg-blue-500/20" />

          {/* Description */}
          <div>
            <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Details */}
          {event.details && (
            <div>
              <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-2">Details</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {event.details}
              </p>
            </div>
          )}

          {/* Background Info */}
          {event.backgroundInfo && (
            <div>
              <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-2">Background</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {event.backgroundInfo}
              </p>
            </div>
          )}

          {/* People Involved */}
          {event.peopleInvolved && (
            <div className="flex items-start gap-3 p-4 bg-slate-900/50 border border-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 mt-0.5 text-cyan-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-blue-400 uppercase tracking-wider mb-1">People Involved</p>
                <p className="text-sm text-slate-300">{event.peopleInvolved}</p>
              </div>
            </div>
          )}

          <div className="h-px bg-blue-500/20" />

          {/* Source Link */}
          {event.sourceUrl && (
            <div>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                <ExternalLink className="h-4 w-4" />
                View Original Source
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
