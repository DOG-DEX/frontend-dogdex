'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { scanService } from '../services/scan.service';
import type { PredictionSubmission } from '@/shared/types/scan';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function ScanView() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submission, setSubmission] = useState<PredictionSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const clearSelectedFile = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
    setFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setSubmission(null);
    setError(null);

    if (!selectedFile) {
      clearSelectedFile();
      return;
    }
    if (!ACCEPTED_TYPES.has(selectedFile.type)) {
      clearSelectedFile();
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (selectedFile.size > MAX_IMAGE_SIZE) {
      clearSelectedFile();
      setError('Choose an image smaller than 10 MB.');
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const objectUrl = URL.createObjectURL(selectedFile);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setFile(selectedFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isSubmitting) return;

    setError(null);
    setSubmission(null);
    setIsSubmitting(true);

    try {
      setSubmission(await scanService.scanImage(file));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to submit this scan. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-brutal bg-white p-6 md:p-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#FF6B00]">
            AI field scan
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#232B26]">
            Scan a dog
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#4B5750]">
            Upload one clear dog photo. DogDex will queue it for breed analysis.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block cursor-pointer rounded-2xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-6 text-center transition hover:bg-[#FFD6A5]">
              <span className="block text-4xl">📷</span>
              <span className="mt-3 block font-mono text-sm font-black uppercase text-[#232B26]">
                {file ? file.name : 'Choose a dog photo'}
              </span>
              <span className="mt-1 block text-xs font-semibold text-[#4B5750]">
                JPG, PNG, or WebP · up to 10 MB
              </span>
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </label>

            {error && (
              <p className="rounded-xl border-2 border-[#232B26] bg-[#FF3B30] p-3 text-sm font-bold text-white" role="alert">
                {error}
              </p>
            )}

            {submission && (
              <div className="rounded-xl border-2 border-[#232B26] bg-[#85E0C0] p-4" role="status">
                <p className="font-mono text-xs font-black uppercase">Scan queued</p>
                <p className="mt-1 text-sm font-semibold text-[#232B26]">
                  Prediction ID: {submission.predictionId}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isSubmitting}
              className="btn-brutal w-full rounded-xl bg-[#00A170] px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting scan…' : 'Identify breed'}
            </button>
          </form>
        </div>

        <aside className="card-brutal min-h-80 overflow-hidden bg-[#232B26] p-4 text-white">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected dog for analysis"
              width={800}
              height={800}
              unoptimized
              className="h-full min-h-72 w-full rounded-xl border-2 border-white object-cover"
            />
          ) : (
            <div className="grid h-full min-h-72 place-items-center rounded-xl border-2 border-dashed border-white/70 p-8 text-center">
              <div>
                <p className="text-6xl">🐶</p>
                <p className="mt-4 font-mono text-sm font-black uppercase tracking-wider">
                  Preview station
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
