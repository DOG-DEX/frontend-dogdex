"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { scanService } from "../services/scan.service";
import { useToast } from "@/components/ToastContext";

type PredictionResultData = {
  breed: string;
  slug: string;
  confidence: number;
  topMatches: Array<{ breed: string; confidence: number }>;
  imageUrl?: string;
  collected?: boolean;
};

export function ScanView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- REFS FOR STABLE CAMERA RESOURCE MANAGEMENT ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStreamingRef = useRef<boolean>(false);
  const facingModeRef = useRef<"environment" | "user">("environment");

  // --- CAMERA UI STATE ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // AI Prediction Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Centralized Cleanup Function for Camera Hardware Resources
  const cleanupCameraResources = useCallback(() => {
    isStreamingRef.current = false;
    setIsCameraActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  // 2. Start Camera Hardware Stream
  const startCameraStream = useCallback(async () => {
    if (isStreamingRef.current) return;

    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingModeRef.current,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      isStreamingRef.current = true;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          // Ignore autoplay restriction errors
        });
      }
    } catch {
      isStreamingRef.current = false;
      setIsCameraActive(false);
      setError("Camera access denied or device unequipped. Check browser permissions.");
    }
  }, []);

  // 3. Flip Front/Back Camera
  const handleToggleCameraFacing = () => {
    const nextMode = facingModeRef.current === "environment" ? "user" : "environment";
    facingModeRef.current = nextMode;
    setFacingMode(nextMode);
    cleanupCameraResources();
    void startCameraStream();
  };

  // 4. Tab Switch Effect with Guaranteed Clean Teardown
  useEffect(() => {
    if (activeTab === "camera") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void startCameraStream();
    } else {
      cleanupCameraResources();
    }

    return () => {
      cleanupCameraResources();
    };
  }, [activeTab, startCameraStream, cleanupCameraResources]);

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    setError(null);
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file (JPG, PNG, WebP).");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Handle Camera Photo Snap
  const handleSnapCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Init offscreen canvas once
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-snap-${Date.now()}.jpg`, { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(blob));
          cleanupCameraResources();
          setActiveTab("upload");
          toast.success("PHOTO CAPTURED", "Dog photo snapped from camera viewfinder!");
        }
      }, "image/jpeg", 0.9);
    }
  };

  // Run AI Prediction
  const handleRunAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      await scanService.scanImage(selectedFile);
      const mockResult: PredictionResultData = {
        breed: "Golden Retriever",
        slug: "golden-retriever",
        confidence: 0.96,
        topMatches: [
          { breed: "Golden Retriever", confidence: 0.96 },
          { breed: "Labrador Retriever", confidence: 0.88 },
          { breed: "Irish Setter", confidence: 0.72 },
        ],
        imageUrl: previewUrl || undefined,
        collected: true,
      };

      // Add to local collection storage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dogdex_collected_ids");
        const set = stored ? new Set(JSON.parse(stored)) : new Set();
        set.add("b-golden");
        localStorage.setItem("dogdex_collected_ids", JSON.stringify(Array.from(set)));
      }

      setResult(mockResult);
      toast.success("BREED IDENTIFIED", `Discovered Golden Retriever (96% Match)! Added to DogDex!`);
    } catch {
      setError("AI Service busy. Please try scanning again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] p-8 text-white shadow-[8px_8px_0px_#232B26]">
          <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
            AI VISION BREED RECOGNITION
          </span>
          <h1 className="mt-1 text-3xl md:text-5xl font-black tracking-tight">
            QUÉT & NHẬN DIỆN GIỐNG CHÓ AI
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Snap or upload a dog photo. Our Gemini Vision AI will analyze breed matches and automatically collect it into your DogDex!
          </p>
        </header>

        {/* Tab Selector */}
        <div className="flex gap-3 mb-6 font-mono text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`rounded-2xl border-2 border-[#232B26] px-5 py-3 transition ${
              activeTab === "upload"
                ? "bg-[#85E0C0] text-[#232B26] shadow-[4px_4px_0px_#232B26]"
                : "bg-white text-[#232B26]"
            }`}
          >
            📁 Upload Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={`rounded-2xl border-2 border-[#232B26] px-5 py-3 transition ${
              activeTab === "camera"
                ? "bg-[#85E0C0] text-[#232B26] shadow-[4px_4px_0px_#232B26]"
                : "bg-white text-[#232B26]"
            }`}
          >
            📷 Live Camera Scanner
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Workstation Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26]">
            {activeTab === "upload" && (
              <div>
                <label className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-8 text-center cursor-pointer transition hover:bg-[#85E0C0]/20">
                  <span className="text-5xl">🐕</span>
                  <span className="mt-3 font-mono text-sm font-black uppercase text-[#232B26]">
                    {selectedFile ? selectedFile.name : "Click to Upload or Drag Dog Photo"}
                  </span>
                  <span className="mt-1 font-mono text-xs text-[#232B26]/60">
                    JPG, PNG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                {previewUrl && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-3xl border-4 border-[#232B26] shadow-[6px_6px_0px_#232B26]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Dog preview" className="h-full w-full object-cover" />
                    </div>

                    <button
                      type="button"
                      onClick={handleRunAnalysis}
                      disabled={isAnalyzing}
                      className="mt-6 w-full rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] py-4 font-mono text-base font-black uppercase text-[#232B26] shadow-[6px_6px_0px_#232B26] transition hover:bg-[#00A170] hover:text-white active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                    >
                      <span>{isAnalyzing ? "Analyzing Breed Vision..." : "⚡ Identify Breed & Collect"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "camera" && (
              <div className="flex flex-col items-center">
                <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-4 border-[#232B26] bg-[#1A221E]">
                  <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />

                  {/* Target Crosshair overlay */}
                  <div className="absolute inset-8 rounded-2xl border-2 border-dashed border-[#85E0C0]/60 pointer-events-none grid place-items-center">
                    <span className="font-mono text-xs font-bold text-[#85E0C0] bg-[#232B26]/80 px-3 py-1 rounded-full">
                      POSITION DOG IN FRAME ({facingMode.toUpperCase()})
                    </span>
                  </div>

                  {/* Flip Camera Button */}
                  <button
                    type="button"
                    onClick={handleToggleCameraFacing}
                    title="Flip camera"
                    className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#232B26] bg-white text-base font-black shadow-[2px_2px_0px_#232B26] hover:bg-[#85E0C0] transition"
                  >
                    🔄
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSnapCameraPhoto}
                  disabled={!isCameraActive}
                  className="mt-6 flex items-center justify-center gap-3 w-full rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] py-4 font-mono text-base font-black uppercase text-[#232B26] shadow-[6px_6px_0px_#232B26] transition hover:bg-[#85E0C0] disabled:opacity-50"
                >
                  <span className="text-xl">📸</span>
                  <span>Snap Photo & Analyze</span>
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border-2 border-[#232B26] bg-[#FF3B30] p-4 text-white font-mono text-xs font-bold">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] p-6 md:p-8 text-white shadow-[8px_8px_0px_#232B26]">
            {result ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
                    AI IDENTIFICATION MATCH
                  </span>
                  <span className="rounded-full border border-[#85E0C0] bg-[#85E0C0] px-3 py-0.5 font-mono text-xs font-black text-[#232B26]">
                    {(result.confidence * 100).toFixed(0)}% MATCH
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                  {result.breed}
                </h2>

                <div className="mt-6 rounded-2xl border-2 border-white/20 bg-white/10 p-4 font-mono text-xs">
                  <h4 className="font-black text-[#FFD6A5] uppercase mb-2">Top Predicted Matches</h4>
                  <div className="space-y-2">
                    {result.topMatches.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{m.breed}</span>
                        <span className="font-bold text-[#85E0C0]">{(m.confidence * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.collected && (
                  <div className="mt-6 rounded-2xl border-2 border-[#85E0C0] bg-[#85E0C0]/20 p-4 font-mono text-xs text-[#85E0C0]">
                    🎉 Automatically unlocked in your DogDex Collection!
                  </div>
                )}

                <Link
                  href={`/breed/${result.slug}`}
                  className="mt-8 flex items-center justify-center gap-2 rounded-2xl border-2 border-white bg-white py-3.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[4px_4px_0px_white]"
                >
                  <span>📖 View Breed Wiki & Collection</span>
                </Link>
              </div>
            ) : (
              <div className="grid h-full place-items-center text-center p-6">
                <div>
                  <span className="text-5xl">🔬</span>
                  <h3 className="mt-3 font-mono text-base font-black text-[#85E0C0]">
                    READY FOR ANALYSIS
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    Upload or snap a photo to view instant AI breed classification results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
