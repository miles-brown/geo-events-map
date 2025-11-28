import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getCategoryById } from "@shared/categories";
import { useState } from "react";

export default function EventView() {
  const [, params] = useRoute("/event/:id");
  const eventId = params?.id ? parseInt(params.id) : null;
  const [copied, setCopied] = useState(false);

  const { data: event, isLoading, error } = trpc.events.byId.useQuery(
    { id: eventId! },
    { enabled: eventId !== null }
  );

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `Check out this event: ${event?.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this event: ${event?.title} - ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Event Not Found</CardTitle>
            <CardDescription>The event you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = getCategoryById(event.category);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-slate-400 hover:text-white">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 hover:bg-blue-500/10"
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 hover:bg-blue-500/10"
                onClick={handleShareTwitter}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 hover:bg-blue-500/10"
                onClick={handleShareFacebook}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 hover:bg-blue-500/10"
                onClick={handleShareWhatsApp}
              >
                <Share2 className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2">{event.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category && (
                      <Badge
                        style={{ backgroundColor: category.color + '40', color: category.color }}
                        className="border-0"
                      >
                        {category.icon} {category.label}
                      </Badge>
                    )}
                    {event.subcategories && Array.isArray(event.subcategories) && event.subcategories.map((sub: string) => (
                      <Badge key={sub} variant="outline" className="border-slate-600 text-slate-300">
                        {sub}
                      </Badge>
                    ))}
                    {event.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        ✓ Verified
                      </Badge>
                    )}
                    {event.isCrime && (
                      <Badge className="bg-red-500/20 text-red-400 border-0">
                        ⚠️ Crime
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video */}
              {event.videoUrl && (
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                  <iframe
                    src={event.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Location</p>
                  <p className="text-white">{event.locationName}</p>
                  {event.borough && (
                    <p className="text-slate-400 text-xs mt-1">{event.borough}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Date</p>
                  <p className="text-white">{format(new Date(event.eventDate), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Coordinates</p>
                  <p className="text-white font-mono text-xs">
                    {event.latitude}, {event.longitude}
                  </p>
                </div>
                {event.peopleInvolved && (
                  <div>
                    <p className="text-slate-400 mb-1">People Involved</p>
                    <p className="text-white">{event.peopleInvolved}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-slate-300 leading-relaxed">{event.description}</p>
              </div>

              {/* Background Info */}
              {event.backgroundInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Background</h3>
                  <p className="text-slate-300 leading-relaxed">{event.backgroundInfo}</p>
                </div>
              )}

              {/* Additional Details */}
              {event.details && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Additional Details</h3>
                  <p className="text-slate-300 leading-relaxed">{event.details}</p>
                </div>
              )}

              {/* Source */}
              {event.sourceUrl && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Source</p>
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {event.sourceUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
