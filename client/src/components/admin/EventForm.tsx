import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X, Upload } from "lucide-react";
import { Event } from "../../../../drizzle/schema";
import { toast } from "sonner";
import { CATEGORIES } from "@shared/categories";

interface EventFormProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventForm({ event, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category || "strange",
    eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
    latitude: event?.latitude || "",
    longitude: event?.longitude || "",
    locationName: event?.locationName || "",
    videoUrl: event?.videoUrl || "",
    sourceUrl: event?.sourceUrl || "",
    peopleInvolved: event?.peopleInvolved || "",
    backgroundInfo: event?.backgroundInfo || "",
    details: event?.details || "",
    isCrime: event?.isCrime || false,
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const updateEvent = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const uploadVideo = trpc.events.uploadVideo.useMutation({
    onSuccess: (data: { url: string; key: string }) => {
      setFormData({ ...formData, videoUrl: data.url });
      toast.success("Video uploaded successfully");
      setVideoFile(null);
      setUploadProgress(0);
    },
    onError: (error) => {
      toast.error(`Failed to upload video: ${error.message}`);
      setUploadProgress(0);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("Video file must be under 25MB");
        return;
      }
      setVideoFile(file);
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadProgress(50);
      uploadVideo.mutate({
        filename: videoFile.name,
        contentType: videoFile.type,
        data: base64,
      });
    };
    reader.readAsDataURL(videoFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      eventDate: new Date(formData.eventDate),
      latitude: formData.latitude.toString(),
      longitude: formData.longitude.toString(),
    };

    if (event) {
      updateEvent.mutate({ id: event.id, ...eventData });
    } else {
      createEvent.mutate(eventData);
    }
  };

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{event ? "Edit Event" : "Create New Event"}</CardTitle>
              <CardDescription>
                {event ? "Update event details" : "Add a new geo-located event"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Event title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Brief description of the event"
                rows={3}
              />
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="locationName">Location Name *</Label>
              <Input
                id="locationName"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                required
                placeholder="e.g., Camden Market, London"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                  placeholder="51.5074"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                  placeholder="-0.1278"
                />
              </div>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="videoFile">Video Upload (Max 25MB)</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {videoFile && (
                  <Button
                    type="button"
                    onClick={handleUploadVideo}
                    disabled={uploadVideo.isPending}
                  >
                    {uploadVideo.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (or upload above)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl || ""}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Source URL */}
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                value={formData.sourceUrl || ""}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* People Involved */}
            <div className="space-y-2">
              <Label htmlFor="peopleInvolved">People Involved</Label>
              <Textarea
                id="peopleInvolved"
                value={formData.peopleInvolved || ""}
                onChange={(e) => setFormData({ ...formData, peopleInvolved: e.target.value })}
                placeholder="Names or descriptions of people involved"
                rows={2}
              />
            </div>

            {/* Background Info */}
            <div className="space-y-2">
              <Label htmlFor="backgroundInfo">Background Information</Label>
              <Textarea
                id="backgroundInfo"
                value={formData.backgroundInfo || ""}
                onChange={(e) => setFormData({ ...formData, backgroundInfo: e.target.value })}
                placeholder="Historical context or background"
                rows={3}
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                value={formData.details || ""}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Detailed information about the event"
                rows={3}
              />
            </div>

            {/* Crime Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCrime"
                checked={formData.isCrime}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isCrime: checked as boolean })
                }
              />
              <Label htmlFor="isCrime" className="cursor-pointer">
                This event involves criminal activity
              </Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{event ? "Update Event" : "Create Event"}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
