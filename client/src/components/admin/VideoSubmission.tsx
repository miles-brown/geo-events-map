import { useState } from "react";
import { X, Loader2, Video, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface VideoSubmissionProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Platform = "instagram" | "tiktok" | "twitter" | "unknown";

export default function VideoSubmission({ onClose, onSuccess }: VideoSubmissionProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("unknown");

  const submitVideo = trpc.videos.submitUrl.useMutation({
    onSuccess: (data: { success: boolean; eventId: number; title: string; status: string }) => {
      toast.success(`Video submitted successfully! ${data.title || 'Processing...'}`);
      onSuccess();
    },
    onError: (error: { message: string }) => {
      toast.error(`Failed to submit video: ${error.message}`);
    },
  });

  const detectPlatform = (url: string): Platform => {
    if (url.includes("instagram.com") || url.includes("instagr.am")) {
      return "instagram";
    }
    if (url.includes("tiktok.com") || url.includes("vm.tiktok.com")) {
      return "tiktok";
    }
    if (url.includes("twitter.com") || url.includes("x.com") || url.includes("t.co")) {
      return "twitter";
    }
    return "unknown";
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setPlatform(detectPlatform(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (platform === "unknown") {
      toast.error("Unsupported platform. Please use Instagram, TikTok, or Twitter/X URLs.");
      return;
    }

    submitVideo.mutate({ url: videoUrl, platform });
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return "📸";
      case "tiktok":
        return "🎵";
      case "twitter":
        return "🐦";
      default:
        return "🎥";
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case "instagram":
        return "INSTAGRAM";
      case "tiktok":
        return "TIKTOK";
      case "twitter":
        return "TWITTER/X";
      default:
        return "UNKNOWN PLATFORM";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black border-2 border-red-600 relative">
        {/* Classification header */}
        <div className="bg-red-600 text-black text-center py-2 border-b-2 border-red-700">
          <span className="text-xs font-black tracking-[0.4em] font-stencil">
            VIDEO INTELLIGENCE SUBMISSION SYSTEM
          </span>
        </div>

        <CardHeader className="border-b-2 border-red-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-tactical text-2xl text-red-500 tracking-[0.2em]">
                SUBMIT VIDEO URL
              </CardTitle>
              <CardDescription className="text-green-400 font-stencil tracking-wider mt-2">
                Automated intelligence extraction and analysis
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-red-500 hover:text-red-400 hover:bg-red-950"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-green-400 font-stencil tracking-wider text-sm">
                VIDEO URL
              </label>
              <Input
                type="url"
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://instagram.com/... or https://tiktok.com/... or https://twitter.com/..."
                className="bg-black border-2 border-green-600 text-green-400 font-mono-tech h-12 focus:border-red-500"
                disabled={submitVideo.isPending}
              />
            </div>

            {/* Platform Detection */}
            {videoUrl && (
              <div className="border-2 border-cyan-900 bg-cyan-950/20 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPlatformIcon()}</span>
                  <div>
                    <p className="text-cyan-400 font-stencil tracking-wider text-sm">
                      DETECTED PLATFORM
                    </p>
                    <p className="text-white font-tactical text-lg tracking-wider">
                      {getPlatformName()}
                    </p>
                  </div>
                  {platform !== "unknown" ? (
                    <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-500 ml-auto" />
                  )}
                </div>
              </div>
            )}

            {/* Processing Info */}
            <div className="border-2 border-yellow-900 bg-yellow-950/20 p-4 space-y-2">
              <p className="text-yellow-500 font-stencil tracking-wider text-xs">
                AUTOMATED PROCESSING PIPELINE:
              </p>
              <ul className="text-green-400 font-mono-tech text-xs space-y-1 ml-4">
                <li>→ Extract video metadata and captions</li>
                <li>→ AI-powered location detection from text</li>
                <li>→ Automatic event categorization</li>
                <li>→ Geocoding and coordinate validation</li>
                <li>→ Create pending entry for review</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitVideo.isPending || !videoUrl || platform === "unknown"}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-black font-stencil tracking-wider border-2 border-red-700"
              >
                {submitVideo.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    SUBMIT FOR ANALYSIS
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitVideo.isPending}
                className="border-2 border-green-600 text-green-400 hover:bg-green-950 font-stencil tracking-wider h-12"
              >
                CANCEL
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
