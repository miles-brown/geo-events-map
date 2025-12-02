import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Upload, Video } from "lucide-react";
import { Link } from "wouter";
import EventForm from "@/components/admin/EventForm";
import CSVImport from "@/components/admin/CSVImport";
import VideoSubmission from "@/components/admin/VideoSubmission";
import { Event } from "../../../drizzle/schema";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showVideoSubmission, setShowVideoSubmission] = useState(false);

  const { data: events, isLoading: eventsLoading, refetch } = trpc.events.list.useQuery();
  const deleteEvent = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 border-2 border-red-600 bg-black/80 p-12">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-green-400 font-stencil tracking-[0.3em]">[ VERIFYING CLEARANCE ]</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-3 md:p-4">
        <Card className="w-full max-w-md bg-black border-2 border-red-600">
          <CardHeader className="border-b-2 border-red-900 p-4 md:p-6">
            <CardTitle className="font-tactical text-xl md:text-2xl text-red-500 tracking-[0.1em] md:tracking-[0.2em]">ADMIN ACCESS REQUIRED</CardTitle>
            <CardDescription className="text-green-400 font-stencil tracking-wider">Authentication credentials needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 md:pt-6 p-4 md:p-6">
            <Button asChild className="w-full h-12 md:h-auto bg-red-600 hover:bg-red-700 text-black font-stencil tracking-wider border-2 border-red-700 text-sm md:text-base">
              <a href={getLoginUrl()}>AUTHENTICATE</a>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 md:h-auto border-2 border-green-600 text-green-400 hover:bg-green-950 font-stencil tracking-wider text-sm md:text-base">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETURN TO MAP
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-3 md:p-4">
        <Card className="w-full max-w-md bg-black border-2 border-red-600">
          <div className="bg-red-600 text-black text-center py-2 border-b-2 border-red-700">
            <span className="text-xs font-black tracking-[0.4em] font-stencil">SECURITY ALERT</span>
          </div>
          <CardHeader className="border-b-2 border-red-900 p-4 md:p-6">
            <CardTitle className="font-tactical text-xl md:text-2xl text-red-500 tracking-[0.1em] md:tracking-[0.2em]">ACCESS DENIED</CardTitle>
            <CardDescription className="text-yellow-500 font-stencil tracking-wider">Insufficient security clearance level</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild variant="outline" className="w-full h-12 md:h-auto border-2 border-green-600 text-green-400 hover:bg-green-950 font-stencil tracking-wider text-sm md:text-base">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETURN TO MAP
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate({ id });
    }
  };

  const handleFormClose = () => {
    setSelectedEvent(null);
    setIsCreating(false);
    refetch();
  };

  if (isCreating || selectedEvent) {
    return (
      <div className="min-h-screen bg-background">
        <EventForm
          event={selectedEvent}
          onClose={handleFormClose}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black pointer-events-none" />
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-red-500/50 z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-red-500/50 z-10 pointer-events-none" />
      
      <div className="container py-4 md:py-8 relative z-20 px-3 md:px-4">
        {/* Classification header */}
        <div className="bg-red-600 text-black text-center py-2 mb-6 border-2 border-red-700">
          <span className="text-xs font-black tracking-[0.4em] font-stencil">
            CLASSIFIED // TOP SECRET // ADMINISTRATIVE ACCESS ONLY
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8 border-2 border-red-600 bg-black/80 p-4 md:p-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-tactical text-red-500 tracking-[0.1em] md:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">ADMIN PANEL</h1>
            <p className="text-green-400 font-stencil tracking-[0.05em] md:tracking-[0.2em] text-xs md:text-sm mt-2">[ INCIDENT DATABASE MANAGEMENT SYSTEM ]</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button onClick={() => setShowVideoSubmission(true)} className="h-12 md:h-auto bg-red-600 hover:bg-red-700 text-black font-stencil tracking-wider border-2 border-red-700 text-sm md:text-base w-full md:w-auto">
              <Video className="h-4 w-4 mr-2" />
              SUBMIT VIDEO
            </Button>
            <Button onClick={() => setIsCreating(true)} variant="outline" className="h-12 md:h-auto border-2 border-cyan-600 text-cyan-400 hover:bg-cyan-950 font-stencil tracking-wider text-sm md:text-base w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              ADD MANUAL
            </Button>
            <Button onClick={() => setShowCSVImport(true)} variant="outline" className="h-12 md:h-auto border-2 border-yellow-600 text-yellow-500 hover:bg-yellow-950 font-stencil tracking-wider text-sm md:text-base w-full md:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              IMPORT CSV
            </Button>
            <Button asChild variant="outline" className="h-12 md:h-auto border-2 border-green-600 text-green-400 hover:bg-green-950 font-stencil tracking-wider text-sm md:text-base w-full md:w-auto">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETURN TO MAP
              </Link>
            </Button>
          </div>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center py-12 border-2 border-red-600 bg-black/80">
            <div className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
              <p className="text-green-400 font-stencil tracking-[0.3em]">[ ACCESSING DATABASE ]</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {events?.map((event) => (
              <Card key={event.id} className="bg-black/80 border-2 border-red-900 hover:border-red-600 transition-colors">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg md:text-2xl font-tactical text-red-500 tracking-wider">{event.title}</CardTitle>
                      <CardDescription className="mt-1 text-green-400 font-mono-tech tracking-wider">
                        {event.locationName} • {event.category}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEvent(event)}
                        className="border-2 border-yellow-600 text-yellow-500 hover:bg-yellow-950"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                        disabled={deleteEvent.isPending}
                        className="bg-red-600 hover:bg-red-700 border-2 border-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm text-green-400 line-clamp-2 font-mono-tech">
                    {event.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-mono">
                    <span className="text-cyan-400 border border-cyan-900 px-2 py-1">📍 {event.latitude}, {event.longitude}</span>
                    {event.videoUrl && <span className="text-purple-400 border border-purple-900 px-2 py-1">🎥 VIDEO ATTACHED</span>}
                    {event.isCrime && <span className="text-red-500 border border-red-600 px-2 py-1 animate-pulse">⚠️ CRIME INCIDENT</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Video Submission Modal */}
      {showVideoSubmission && (
        <VideoSubmission
          onClose={() => setShowVideoSubmission(false)}
          onSuccess={() => {
            setShowVideoSubmission(false);
            refetch();
          }}
        />
      )}
      
      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport
          onClose={() => setShowCSVImport(false)}
          onSuccess={() => {
            setShowCSVImport(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
