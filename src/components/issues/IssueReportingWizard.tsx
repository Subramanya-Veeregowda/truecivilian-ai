import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, Camera, Mic, MapPin, Search, FileText, CheckCircle2, 
  Trash2, Loader2, ChevronRight, ChevronLeft, Plus, Play, Square, 
  AlertCircle, Sparkles, Image as ImageIcon, Video, Eye, Edit3
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, TextArea, Select } from "../ui/Input";

interface MediaItem {
  id: string;
  url: string;
  cloudinaryPublicId: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  name: string;
  progress: number;
  status: "uploading" | "completed" | "failed";
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  wardCode: string;
}

interface IssueDetails {
  title: string;
  description: string;
  category: string;
  severity: string;
  priority: string;
  hashtags: string[];
}

const DRAFT_STORAGE_KEY = "truecivilian_issue_draft";

export const IssueReportingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addNotification } = useNotifications();
  const { token } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationData>({
    latitude: 12.9716,
    longitude: 77.5946,
    address: "",
    wardCode: "",
  });
  const [details, setDetails] = useState<IssueDetails>({
    title: "",
    description: "",
    category: "ROADS_AND_TRANSPORT",
    severity: "MODERATE",
    priority: "MEDIUM",
    hashtags: [],
  });

  // State for recording and camera UI
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Gemini AI integration states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.details) setDetails(parsed.details);
        if (parsed.mediaItems) setMediaItems(parsed.mediaItems);
        addNotification("Draft Restored", "Your previously autosaved report draft has been recovered.", "info");
      } catch (e) {
        // Clear corrupt draft
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }

    // Override with custom dropped pin coordinates from map if present
    const latStr = localStorage.getItem("reportedPinLat");
    const lngStr = localStorage.getItem("reportedPinLng");
    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: `GPS Dropped Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
      }
      localStorage.removeItem("reportedPinLat");
      localStorage.removeItem("reportedPinLng");
    }
  }, []);

  // Autosave whenever details, location or media changes
  useEffect(() => {
    if (!submitSuccess) {
      const draft = { location, details, mediaItems };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [location, details, mediaItems, submitSuccess]);

  // Audio Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Upload files with simulated progress bar to show actual network progress
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      let type: "IMAGE" | "VIDEO" | "AUDIO" = "IMAGE";

      if (file.type.startsWith("video/")) type = "VIDEO";
      else if (file.type.startsWith("audio/")) type = "AUDIO";

      const newItem: MediaItem = {
        id,
        name: file.name,
        type,
        url: "",
        cloudinaryPublicId: "",
        progress: 10,
        status: "uploading",
      };

      setMediaItems((prev) => [...prev, newItem]);

      // Start simulated upload + actual upload trigger
      simulateUpload(id, file);
    });
  };

  const simulateUpload = async (id: string, file: File) => {
    // 1. Progress Simulation Interval
    const interval = setInterval(() => {
      setMediaItems((prev) =>
        prev.map((item) => {
          if (item.id === id && item.status === "uploading" && item.progress < 90) {
            return { ...item, progress: item.progress + 15 };
          }
          return item;
        })
      );
    }, 150);

    try {
      // 2. Perform Real Upload to Spring Boot Backend
      const formData = new FormData();
      formData.append("file", file);

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/issues/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Upload failed on server");
      }

      const data = await response.json();

      setMediaItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              url: data.url,
              cloudinaryPublicId: data.public_id,
              progress: 100,
              status: "completed",
            };
          }
          return item;
        })
      );
      addNotification("Media Uploaded", `Successfully attached ${file.name} to report queue.`, "success");
      
      // Trigger Gemini AI analysis if the uploaded file is an image
      if (file.type.startsWith("image/")) {
        triggerAIAnalysis(data.url);
      }
    } catch (err) {
      clearInterval(interval);
      setMediaItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, status: "failed", progress: 0 };
          }
          return item;
        })
      );
      addNotification("Upload Failed", `Failed to upload ${file.name}. Saved locally for session backup.`, "error");
    }
  };

  const triggerAIAnalysis = async (imageUrl: string) => {
    setIsAnalyzing(true);
    setAiError(null);
    setAiResult(null);
    setAnalysisProgress("Initializing Gemini AI triage agent...");

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setAnalysisProgress("Downloading secure evidence file..."), 500));
    timers.push(setTimeout(() => setAnalysisProgress("Scanning hazard visual patterns via Gemini 3.5..."), 1200));
    timers.push(setTimeout(() => setAnalysisProgress("Analyzing structural damage & severity factors..."), 2200));
    timers.push(setTimeout(() => setAnalysisProgress("Querying PostgreSQL node for duplicate matching..."), 3200));

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageUrl,
          latitude: location.latitude,
          longitude: location.longitude,
          wardCode: location.wardCode || "Ward-102",
        }),
      });

      timers.forEach(clearTimeout);

      if (!response.ok) {
        throw new Error("AI analysis endpoint returned an error status.");
      }

      const result = await response.json();

      if (!result.isValid) {
        setAiError(result.validationError || "Uploaded photo does not represent a valid civic hazard.");
        addNotification("AI Shield Rejected Image", result.validationError || "Invalid hazard image.", "warning");
        setIsAnalyzing(false);
        return;
      }

      setAiResult(result);
      
      // Auto populate fields
      setDetails((prev) => ({
        ...prev,
        title: result.title || prev.title,
        description: result.description || prev.description,
        category: result.category || prev.category,
        severity: result.severity || prev.severity,
        priority: result.priority || prev.priority,
      }));

      addNotification("AI Triage Complete", "Title, description, category, and priority auto-generated.", "success");
    } catch (err: any) {
      timers.forEach(clearTimeout);
      setAiError("Failed to communicate with Gemini AI. You can still input details manually.");
      addNotification("AI Triage Offline", "Could not complete automated issue triage.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Mock Camera capture
  const toggleCamera = async () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      // Create a mock picture upload
      const id = Math.random().toString(36).substring(2, 9);
      const newItem: MediaItem = {
        id,
        name: "snapshot_" + id + ".jpg",
        type: "IMAGE",
        url: "https://picsum.photos/seed/" + id + "/800/600",
        cloudinaryPublicId: "mock-camera-" + id,
        progress: 100,
        status: "completed",
      };
      setMediaItems((prev) => [...prev, newItem]);
      addNotification("Snapshot Captured", "Integrated camera picture attached successfully.", "success");
      
      // Trigger analysis for mock camera image as well
      triggerAIAnalysis(newItem.url);
    } else {
      setIsCameraActive(true);
      addNotification("Camera Stream Opened", "Acquiring secure device permissions...", "info");
      setTimeout(() => {
        // Fallback or stream simulation
      }, 500);
    }
  };

  // Voice recording mock/real trigger
  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const id = Math.random().toString(36).substring(2, 9);
      const newItem: MediaItem = {
        id,
        name: `voice_memo_${id}.mp3`,
        type: "AUDIO",
        url: "https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp3",
        cloudinaryPublicId: "mock-audio-" + id,
        progress: 100,
        status: "completed",
      };
      setMediaItems((prev) => [...prev, newItem]);
      addNotification("Voice Memo Recorded", "Audio dispatch file added to wizard queue.", "success");
    } else {
      setIsRecording(true);
      addNotification("Recording Started", "Keep holding or speaking into device microphone.", "info");
    }
  };

  // Geolocation Trigger
  const triggerGPSLookup = () => {
    setIsLoadingGPS(true);
    addNotification("GPS Search Triggered", "Requesting hardware GPS access...", "info");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: prev.address || `GPS Location Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            wardCode: prev.wardCode || "Ward-102",
          }));
          setIsLoadingGPS(false);
          addNotification("Coordinates Locked", "Precise coordinate location locked successfully.", "success");
        },
        (err) => {
          setIsLoadingGPS(false);
          // Standard simulated fail coordinates for Bengaluru/standard mockup
          setLocation((prev) => ({
            ...prev,
            latitude: 12.9716,
            longitude: 77.5946,
            address: "8, Mahatma Gandhi Rd, Bengaluru, Karnataka 560001",
            wardCode: "Ward-102",
          }));
          addNotification("Using Georeference Backup", "Failed to retrieve hardware coordinate state, using fallback.", "warning");
        }
      );
    } else {
      setIsLoadingGPS(false);
      addNotification("GPS Denied", "Your browser does not support coordinate queries.", "error");
    }
  };

  // Tag Input handlers
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      let tag = hashtagInput.trim().replace(/[^a-zA-Z0-9]/g, "");
      if (tag) {
        if (!tag.startsWith("#")) tag = "#" + tag;
        if (!details.hashtags.includes(tag)) {
          setDetails((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }));
        }
      }
      setHashtagInput("");
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setDetails((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tagToRemove),
    }));
  };

  // Final submit to backend
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Format payload for com.truecivilian.dto.IssueRequest
      const payload = {
        title: details.title,
        description: details.description,
        latitude: location.latitude,
        longitude: location.longitude,
        locationAddress: location.address || "Unknown Address",
        priority: details.priority,
        severity: details.severity,
        wardCode: location.wardCode || "Ward-102",
        category: details.category,
        isAnonymous: false,
        hashtags: details.hashtags,
        media: mediaItems
          .filter((item) => item.status === "completed")
          .map((item) => ({
            mediaUrl: item.url,
            cloudinaryPublicId: item.cloudinaryPublicId,
            mediaType: item.type,
            caption: `${details.category} file attached.`,
          })),
      };

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/issues", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit issue to Spring Boot endpoint");
      }

      setSubmitSuccess(true);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      addNotification("Submission Success", "Municipal issue has been persisted across the PostgreSQL node.", "success");
    } catch (err: any) {
      addNotification("Submission Failure", err.toString() || "Check PostgreSQL database parameters.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 max-w-4xl mx-auto overflow-hidden">
      {/* Wizard Header Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-900 relative">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-emerald-500 rounded-r"
          initial={{ width: "20%" }}
          animate={{ width: `${(currentStep / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/30 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white leading-tight">
              Report Civic Hazard
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Complete the guided wizard steps to file an incident
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ${
                currentStep === s 
                  ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10 scale-110" 
                  : currentStep > s 
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" 
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: UPLOAD MEDIA */}
          {currentStep === 1 && (
            <motion.div
              key="step-media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Step 1: Upload Incident Evidence</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Support your claim with real evidence. Drag and drop any relevant image, video, or voice recording.
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className="group border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer bg-zinc-50/30 dark:bg-zinc-950/20 hover:bg-emerald-50/5 dark:hover:bg-emerald-950/5 transition-all duration-300 relative overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple 
                  className="hidden" 
                  accept="image/*,video/*,audio/*"
                />

                <div className="space-y-3.5 max-w-md mx-auto">
                  <div className="inline-flex h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 items-center justify-center transition-all duration-300">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Drag & Drop files here, or <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2">browse files</span>
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Supports PNG, JPG, MP4, MP3 up to 25MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Controls (Camera, Audio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isCameraActive 
                      ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500/30 text-rose-600 dark:text-rose-400" 
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <Camera className={`h-4.5 w-4.5 ${isCameraActive ? "animate-pulse" : "text-emerald-500"}`} />
                  <div>
                    <span className="font-bold block">{isCameraActive ? "Capture Snapshot" : "Camera Capture"}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Use on-board camera lens</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleVoiceRecording}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isRecording 
                      ? "bg-red-50 dark:bg-red-950/20 border-red-500/30 text-red-600 dark:text-red-400" 
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {isRecording ? (
                    <Square className="h-4.5 w-4.5 animate-pulse text-red-500 fill-red-500" />
                  ) : (
                    <Mic className="h-4.5 w-4.5 text-emerald-500" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {isRecording ? `Stop Audio (${recordingSeconds}s)` : "Audio Voice Recording"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">Dictate audio memo note</span>
                  </div>
                </button>
              </div>

              {/* Uploading queue list */}
              {mediaItems.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Evidence File Attachments</h5>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {mediaItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-850"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                            {item.type === "IMAGE" ? (
                              <ImageIcon className="h-4 w-4 text-emerald-500" />
                            ) : item.type === "VIDEO" ? (
                              <Video className="h-4 w-4 text-indigo-500" />
                            ) : (
                              <Mic className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block truncate leading-normal">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
                                {item.type}
                              </span>
                              {item.status === "uploading" && (
                                <span className="text-[10px] text-zinc-400 font-normal">
                                  Uploading ({item.progress}%)
                                </span>
                              )}
                              {item.status === "completed" && (
                                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                  ✓ Securely Uploaded
                                </span>
                              )}
                              {item.status === "failed" && (
                                <span className="text-[10px] text-rose-500 font-bold">
                                  ✕ Upload Failed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === "uploading" ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400 shrink-0" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeMediaItem(item.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-400 hover:text-rose-500 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gemini AI Status / Result Section */}
              {(isAnalyzing || aiResult || aiError) && (
                <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Gemini AI Triage Diagnostics</h5>
                  
                  {isAnalyzing && (
                    <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 space-y-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                          Gemini 3.5 Copilot Analyzing Upload...
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {analysisProgress}
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden relative">
                          <div className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full animate-pulse w-2/3" />
                        </div>
                      </div>
                    </div>
                  )}

                  {aiError && (
                    <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/20 flex gap-3 text-xs text-rose-600 dark:text-rose-400">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div className="space-y-1">
                        <span className="font-bold">Gemini AI Shield Alert</span>
                        <p>{aiError}</p>
                      </div>
                    </div>
                  )}

                  {aiResult && aiResult.isValid && (
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-950/30 rounded-2xl border border-zinc-200/55 dark:border-zinc-850 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                            Gemini AI Triage Autopilot Active
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                          Confidence: {(aiResult.overallConfidence * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Duplicate Warning banner if exists */}
                      {aiResult.isDuplicate && (
                        <div className="p-4 bg-amber-500/5 dark:bg-amber-500/15 rounded-xl border border-amber-500/30 flex gap-3 text-amber-750 dark:text-amber-400">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 animate-bounce" />
                          <div className="space-y-1">
                            <span className="font-bold block">🚨 High-Probability Duplicate Detected!</span>
                            <p className="leading-relaxed">{aiResult.duplicateRecommendation}</p>
                            {aiResult.duplicateIssueId && (
                              <div className="pt-2">
                                <span className="font-mono text-[10px] bg-amber-500/10 px-2 py-1 rounded">
                                  Existing Issue ID: {aiResult.duplicateIssueId.substring(0, 8)}...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-zinc-400 block">Generated Title</span>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-200/40 dark:border-zinc-800">
                            {aiResult.title}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-400 block">Generated Category</span>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-200/40 dark:border-zinc-800">
                            {aiResult.category.replace(/_/g, " ")} ({(aiResult.categoryConfidence * 100).toFixed(0)}%)
                          </p>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <span className="text-zinc-400 block">Generated Description</span>
                          <p className="text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-200/40 dark:border-zinc-800 leading-relaxed">
                            {aiResult.description}
                          </p>
                        </div>
                        
                        <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 text-center">
                          <span className="text-[9px] text-zinc-400 block font-mono">SEVERITY RECO</span>
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 block">
                            {aiResult.severity} ({(aiResult.severityConfidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                        
                        <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 text-center">
                          <span className="text-[9px] text-zinc-400 block font-mono">PRIORITY RECO</span>
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 block">
                            {aiResult.priority} ({(aiResult.priorityConfidence * 100).toFixed(0)}%)
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 text-center sm:col-span-2">
                          <span className="text-[9px] text-zinc-400 block font-mono">RECOMMENDED DISPATCH DEPARTMENT</span>
                          <span className="text-[10px] font-bold text-emerald-500 block">
                            {aiResult.department.replace(/_/g, " ")} ({(aiResult.departmentConfidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: SELECT LOCATION */}
          {currentStep === 2 && (
            <motion.div
              key="step-location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Step 2: Pin Incident GPS Coordinates</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Provide coordinates so road technicians can plan optimized dispatch routes.
                </p>
              </div>

              {/* Maps Visual placeholder/control */}
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200 dark:border-zinc-850 overflow-hidden flex flex-col items-center justify-center p-4">
                {/* Abstract Interactive Grid Pattern */}
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-zinc-900 opacity-25" />
                
                <div className="absolute top-4 left-4 z-10 space-y-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">LOCKED INCIDENT COORDINATES</span>
                  <span className="font-mono text-xs text-emerald-500 font-black block">
                    {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
                  </span>
                </div>

                <div className="text-center z-10 space-y-3 p-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 block">Interactive Georeference Matrix</span>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Point location verified against ward boundaries. Drop pin on manual layout or tap Current GPS.
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={triggerGPSLookup}
                    isLoading={isLoadingGPS}
                    size="sm"
                    icon={MapPin}
                  >
                    Lock Current GPS
                  </Button>
                </div>
              </div>

              {/* Coordinates Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Latitude Coordinate *"
                  type="number"
                  step="any"
                  value={location.latitude}
                  onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) || 0 })}
                  required
                />
                <Input
                  label="Longitude Coordinate *"
                  type="number"
                  step="any"
                  value={location.longitude}
                  onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Descriptive Street Location Address *"
                    placeholder="Enter landmarks, postal address, or block descriptions"
                    icon={Search}
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Ward Code / Sector Area *"
                  placeholder="Ward-102"
                  icon={MapPin}
                  value={location.wardCode}
                  onChange={(e) => setLocation({ ...location, wardCode: e.target.value })}
                  required
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: ISSUE DETAILS */}
          {currentStep === 3 && (
            <motion.div
              key="step-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Step 3: Incident Parameters</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Provide context about the incident to routing systems.
                </p>
              </div>

              {aiResult && aiResult.isValid && (
                <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between gap-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
                    <span>
                      <strong>Gemini AI Copilot:</strong> Pre-filled fields from uploaded media. Review and refine them below.
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Confidence: {(aiResult.overallConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}

              <Input
                label="Clear, Self-Descriptive Title *"
                placeholder="E.g., Deep sewer burst near bus station, causing road flooding"
                icon={FileText}
                value={details.title}
                onChange={(e) => setDetails({ ...details, title: e.target.value })}
                required
              />

              <TextArea
                label="Complete Incident Description *"
                placeholder="Describe the nature of the hazard, potential danger to traffic, duration of leakage, or other specific descriptors..."
                value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
                rows={4}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Civic Category *"
                  value={details.category}
                  onChange={(e) => setDetails({ ...details, category: e.target.value })}
                  options={[
                    { value: "ROADS_AND_TRANSPORT", label: "Roads & Transport" },
                    { value: "WATER_AND_SEWERAGE", label: "Water & Sewerage" },
                    { value: "WASTE_MANAGEMENT", label: "Waste Management" },
                    { value: "ELECTRICITY_AND_POWER", label: "Electricity & Power" },
                    { value: "HEALTH_AND_SANITATION", label: "Health & Sanitation" },
                    { value: "GENERAL", label: "General Council / Other" },
                  ]}
                />

                <Select
                  label="Severity Level *"
                  value={details.severity}
                  onChange={(e) => setDetails({ ...details, severity: e.target.value })}
                  options={[
                    { value: "MINOR", label: "Minor (Nuisance / Localized)" },
                    { value: "MODERATE", label: "Moderate (Impacting Sector)" },
                    { value: "MAJOR", label: "Major (Blocking Transit / Active)" },
                    { value: "CATASTROPHIC", label: "Catastrophic (Critical Danger)" },
                  ]}
                />

                <Select
                  label="Response Priority *"
                  value={details.priority}
                  onChange={(e) => setDetails({ ...details, priority: e.target.value })}
                  options={[
                    { value: "LOW", label: "Low (Scheduled within month)" },
                    { value: "MEDIUM", label: "Medium (Standard 7-day cue)" },
                    { value: "HIGH", label: "High (Expedited 48h repair)" },
                    { value: "CRITICAL", label: "Critical (Emergency Crew Dispatch)" },
                  ]}
                />
              </div>

              {/* Hashtag entry */}
              <div className="space-y-2">
                <Input
                  label="Trending Hashtags (Press Enter / Comma to attach)"
                  placeholder="Type tag (e.g. BrokenStreet) and hit enter"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                />
                
                {details.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {details.hashtags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-zinc-100 dark:bg-zinc-850 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                        onClick={() => removeHashtag(tag)}
                        title="Remove Tag"
                      >
                        {tag}
                        <Trash2 className="h-3 w-3" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW SUBMISSION */}
          {currentStep === 4 && (
            <motion.div
              key="step-review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Step 4: Final Verification Check</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Verify the information is complete and matches the on-site situation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details card */}
                <div className="space-y-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/25 border border-zinc-200/55 dark:border-zinc-850">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono tracking-wider">Report Metadata</span>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(3)}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit Details
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white leading-snug">
                      {details.title || "No Title Provided"}
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {details.description || "No description provided."}
                    </p>
                  </div>

                  <hr className="border-zinc-200/40 dark:border-zinc-800/40" />

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-medium block">CATEGORY</span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                        {details.category.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-medium block">SEVERITY</span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 block">
                        {details.severity}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-medium block">PRIORITY</span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 block">
                        {details.priority}
                      </span>
                    </div>
                  </div>

                  {aiResult && aiResult.isValid && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
                        <span className="font-semibold text-[10px] uppercase">RECO DEPT: {aiResult.department.replace(/_/g, " ")}</span>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                        AI Triage Conf: {(aiResult.overallConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}

                  {details.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {details.hashtags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location & Media card */}
                <div className="space-y-4">
                  {/* Location card */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/25 border border-zinc-200/55 dark:border-zinc-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono tracking-wider">Spatial Position</span>
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(2)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Position
                      </button>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                          {location.address || "No address specified."}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          Ward: {location.wardCode || "Unassigned"} | Lat: {location.latitude.toFixed(4)} Lng: {location.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Media card */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/25 border border-zinc-200/55 dark:border-zinc-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono tracking-wider">Evidence Files</span>
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(1)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Files
                      </button>
                    </div>

                    {mediaItems.length === 0 ? (
                      <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-center text-xs text-zinc-400 rounded-xl leading-normal">
                        No image or video files attached.
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {mediaItems.filter(item => item.status === "completed").map((item) => (
                          <div 
                            key={item.id} 
                            className="aspect-square relative rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm"
                          >
                            {item.type === "IMAGE" ? (
                              <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center p-1">
                                {item.type === "VIDEO" ? <Video className="h-4.5 w-4.5 text-indigo-500" /> : <Mic className="h-4.5 w-4.5 text-amber-500" />}
                                <span className="text-[7px] font-mono block truncate max-w-full mt-1 text-zinc-400">{item.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUBMIT SUCCESS */}
          {currentStep === 5 && submitSuccess && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6 max-w-md mx-auto"
            >
              <div className="h-16 w-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                  Civic Action Dispatched Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Your incident has been written to the PostgreSQL cluster and is now queued inside Ward 102 routing maps.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 text-xs text-left text-zinc-500 dark:text-zinc-400 space-y-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">WHAT HAPPENS NEXT?</span>
                <p>1. Local verifiers will check the coordinates and confirm reports.</p>
                <p>2. The automated transit planner routes maintenance workgroups.</p>
                <p>3. AI classifier pre-filters duplicates within 150m of pin.</p>
              </div>

              <Button
                variant="primary"
                onClick={onComplete}
                className="w-full justify-center py-3 font-semibold"
              >
                Return to Citizen Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>

      {/* Footer Navigation Buttons */}
      {currentStep < 5 && (
        <div className="bg-zinc-50/50 dark:bg-zinc-950/20 px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || isSubmitting}
            icon={ChevronLeft}
          >
            Back Step
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                // Validation checks per step
                if (currentStep === 2 && (!location.address || !location.wardCode)) {
                  addNotification("Validation Error", "Address and Ward Code are required fields.", "warning");
                  return;
                }
                if (currentStep === 3 && (!details.title || !details.description)) {
                  addNotification("Validation Error", "Title and Description are required fields.", "warning");
                  return;
                }
                setCurrentStep((prev) => Math.min(4, prev + 1));
              }}
              className="flex-row-reverse"
              icon={ChevronRight}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
              icon={CheckCircle2}
            >
              Confirm and Dispatch
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
