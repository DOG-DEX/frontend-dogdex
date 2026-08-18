"use client";

import { useState, useRef, useEffect, useCallback, type PointerEvent } from "react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageFile: File | null;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

export function ImageCropperModal({
  isOpen,
  imageFile,
  onCropComplete,
  onCancel,
}: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3">("1:1");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load image from file
  useEffect(() => {
    if (!imageFile) {
      setImageSrc(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Pointer drag events for panning
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleConfirmCrop = useCallback(() => {
    if (!imageRef.current) return;
    const img = imageRef.current;

    // Create high-res offscreen canvas
    const outputCanvas = document.createElement("canvas");
    const outputSize = aspectRatio === "1:1" ? 800 : { width: 800, height: 600 };
    const outWidth = typeof outputSize === "number" ? outputSize : outputSize.width;
    const outHeight = typeof outputSize === "number" ? outputSize : outputSize.height;

    outputCanvas.width = outWidth;
    outputCanvas.height = outHeight;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    // Background white
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, outWidth, outHeight);

    // Calculate crop parameters
    const container = containerRef.current;
    const containerWidth = container ? container.clientWidth : 320;
    const containerHeight = container ? container.clientHeight : 320;

    const scale = (img.naturalWidth / containerWidth) / zoom;

    // Center coordinates
    const sourceCenterX = (img.naturalWidth / 2) - (offset.x * scale);
    const sourceCenterY = (img.naturalHeight / 2) - (offset.y * scale);

    const sourceCropWidth = (containerWidth * scale);
    const sourceCropHeight = (containerHeight * scale);

    ctx.drawImage(
      img,
      sourceCenterX - sourceCropWidth / 2,
      sourceCenterY - sourceCropHeight / 2,
      sourceCropWidth,
      sourceCropHeight,
      0,
      0,
      outWidth,
      outHeight
    );

    outputCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File(
          [blob],
          imageFile ? `cropped_${imageFile.name.replace(/\.[^/.]+$/, "")}.jpg` : "pet_avatar.jpg",
          { type: "image/jpeg" }
        );
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, previewUrl);
      },
      "image/jpeg",
      0.92
    );
  }, [aspectRatio, imageFile, offset, onCropComplete, zoom]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#232B26]/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex w-full max-w-lg flex-col rounded-[2rem] border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[8px_8px_0px_#232B26]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#232B26] pb-4">
          <div>
            <h3 className="font-mono text-lg font-black uppercase text-[#232B26]">
              Cắt & Căn Chỉnh Ảnh Cún
            </h3>
            <p className="text-xs font-semibold text-[#4B5750]">
              Kéo ảnh để căn giữa khuôn mặt cún, dùng thanh trượt để phóng to.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-white font-mono font-bold text-[#232B26] hover:bg-[#FF3B30] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative overflow-hidden rounded-2xl border-4 border-[#232B26] bg-[#232B26] shadow-[4px_4px_0px_#232B26] cursor-grab active:cursor-grabbing select-none ${
              aspectRatio === "1:1" ? "h-64 w-64 sm:h-72 sm:w-72" : "h-56 w-72 sm:h-64 sm:w-80"
            }`}
          >
            {/* Target overlay guide */}
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Target"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
              className="h-full w-full object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-[#232B26] bg-white p-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black uppercase text-[#232B26] shrink-0">
              Thu phóng:
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#F0EDE6] accent-[#00A170]"
            />
            <span className="font-mono text-xs font-bold text-[#232B26] shrink-0 w-10 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>

          {/* Aspect Ratio & Reset Buttons */}
          <div className="flex items-center justify-between pt-1 border-t border-[#232B26]/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio("1:1")}
                className={`rounded-xl border-2 border-[#232B26] px-3 py-1 font-mono text-xs font-bold ${
                  aspectRatio === "1:1" ? "bg-[#00A170] text-white" : "bg-[#F0EDE6] text-[#232B26]"
                }`}
              >
                1:1 Vuông
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio("4:3")}
                className={`rounded-xl border-2 border-[#232B26] px-3 py-1 font-mono text-xs font-bold ${
                  aspectRatio === "4:3" ? "bg-[#00A170] text-white" : "bg-[#F0EDE6] text-[#232B26]"
                }`}
              >
                4:3 Ngang
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="rounded-xl border border-[#232B26]/30 bg-[#F0EDE6] px-3 py-1 font-mono text-xs font-semibold text-[#232B26] hover:bg-[#232B26] hover:text-white"
            >
              Đặt lại vị trí
            </button>
          </div>
        </div>

        {/* Actions Bottom Bar */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-[#232B26] bg-white px-5 py-2.5 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] hover:bg-[#F0EDE6] active:translate-x-0.5 active:translate-y-0.5"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="btn-brutal rounded-xl border-2 border-[#232B26] bg-[#00A170] px-6 py-2.5 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5"
          >
            Xác nhận cắt ảnh
          </button>
        </div>
      </div>
    </div>
  );
}
