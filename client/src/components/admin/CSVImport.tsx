import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface CSVImportProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  errorDetails: string[];
}

export default function CSVImport({ onClose, onSuccess }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bulkCreate = trpc.events.bulkCreate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setImporting(false);
      if (data.success > 0) {
        toast.success(`Successfully imported ${data.success} events`);
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`);
      setImporting(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV file is empty or has no data rows");
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const events = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const event: any = {};
      
      headers.forEach((header, index) => {
        event[header] = values[index] || '';
      });

      events.push(event);
    }

    return events;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      const text = await file.text();
      const parsedEvents = parseCSV(text);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await bulkCreate.mutateAsync({ events: parsedEvents });

      clearInterval(progressInterval);
      setProgress(100);
    } catch (error: any) {
      toast.error(`Failed to parse CSV: ${error.message}`);
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `title,description,category,subcategories,eventDate,latitude,longitude,locationName,borough,videoUrl,sourceUrl,peopleInvolved,backgroundInfo,details,isCrime
"Example Event","This is a sample event description","crime","fights,altercations","2024-01-15T14:30:00","51.5074","-0.1278","Camden Market, London","Camden","https://example.com/video.mp4","https://example.com/source","John Doe, Jane Smith","Background information about the event","Additional details","true"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">CSV Bulk Import</CardTitle>
              <CardDescription>Import multiple events from a CSV file</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Template */}
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <FileText className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-slate-300">
              Download the CSV template to see the required format and example data.
              <Button
                variant="link"
                className="ml-2 h-auto p-0 text-blue-400"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-1" />
                Download Template
              </Button>
            </AlertDescription>
          </Alert>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Select CSV File</label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>
            {file && (
              <p className="text-sm text-slate-400">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Progress */}
          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Importing events...</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Success</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{result.success}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Errors</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{result.errors}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{result.total}</p>
                </div>
              </div>

              {result.errorDetails.length > 0 && (
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-slate-300">
                    <p className="font-medium mb-2">Import Errors:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.errorDetails.slice(0, 5).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                      {result.errorDetails.length > 5 && (
                        <li>... and {result.errorDetails.length - 5} more errors</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import Events"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
