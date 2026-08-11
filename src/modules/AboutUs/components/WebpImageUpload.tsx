"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImageUp, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";
const WEBP_CONTENT_TYPE = "image/webp";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // keep in sync with backend MAX_UPLOAD_BYTES

const buildCloudFrontUrl = (key: string) => {
  const normalizedBase = CLOUDFRONT_URL.endsWith("/")
    ? CLOUDFRONT_URL.slice(0, -1)
    : CLOUDFRONT_URL;
  return `${normalizedBase}/${key}`;
};

type UploadStatus = "idle" | "uploading" | "error";

type WebpImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  className?: string;
};

export function WebpImageUpload({ value, onChange, className }: WebpImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isModalOpen = pendingFile !== null;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const openPicker = () => inputRef.current?.click();

  // File selection only stages the file for review — nothing is uploaded
  // to S3 until the user confirms in the preview modal.
  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (file.type !== WEBP_CONTENT_TYPE) {
      setError("Only .webp images are accepted. Convert your image and try again.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image is too large (max 15MB).");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPendingFile(file);
    setPendingPreview(objectUrl);
  };

  const closeModal = () => {
    if (status === "uploading") return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPendingFile(null);
    setPendingPreview(null);
    setError(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    setStatus("uploading");
    setError(null);

    try {
      const presignRes = await fetch(`${API_BASE}/uploads/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: WEBP_CONTENT_TYPE }),
      });
      const presignJson = await presignRes.json().catch(() => ({}));
      if (!presignRes.ok || !presignJson?.uploadUrl || !presignJson?.key) {
        throw new Error(presignJson?.message || "Could not start upload");
      }

      const putRes = await fetch(presignJson.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": WEBP_CONTENT_TYPE },
        body: pendingFile,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      onChange(buildCloudFrontUrl(presignJson.key));
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPendingFile(null);
      setPendingPreview(null);
      setStatus("idle");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setStatus("error");
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/webp"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#2a2418] bg-[#0a0908] p-2.5">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-[#2a2418] bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-[#9a9278]">Image uploaded</p>
            <button
              type="button"
              onClick={openPicker}
              className="text-[10px] font-semibold uppercase tracking-wide text-[#e6ba35] hover:underline"
            >
              Replace
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="flex-shrink-0 text-[#5a5240] hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2418] bg-[#0a0908] px-4 py-4 text-xs text-[#7a7258] transition-colors",
            "hover:border-[#e6ba35]/40 hover:text-[#e6ba35]"
          )}
        >
          <ImageUp className="h-4 w-4" />
          Upload .webp image
        </button>
      )}

      {error && !isModalOpen && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      <ImagePreviewModal
        isOpen={isModalOpen}
        previewUrl={pendingPreview}
        status={status}
        error={error}
        onChooseAnother={openPicker}
        onConfirm={() => void confirmUpload()}
        onClose={closeModal}
      />
    </div>
  );
}

type ImagePreviewModalProps = {
  isOpen: boolean;
  previewUrl: string | null;
  status: UploadStatus;
  error: string | null;
  onChooseAnother: () => void;
  onConfirm: () => void;
  onClose: () => void;
};

function ImagePreviewModal({
  isOpen,
  previewUrl,
  status,
  error,
  onChooseAnother,
  onConfirm,
  onClose,
}: ImagePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !previewUrl || typeof document === "undefined") return null;

  const isUploading = status === "uploading";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm image"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#2a2418] bg-[#0c0b08] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {!isUploading && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#e6ba35] hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="relative aspect-square w-full bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Selected image preview" className="h-full w-full object-contain" />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Loader2 className="h-8 w-8 animate-spin text-[#e6ba35]" />
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-white text-sm font-semibold mb-1">
            {isUploading ? "Uploading…" : "Use this image?"}
          </p>
          <p className="text-[#7a7258] text-xs mb-4">
            {isUploading
              ? "Please wait while your image uploads."
              : "Review your image before it's uploaded."}
          </p>

          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onChooseAnother}
              disabled={isUploading}
              className="flex-1 h-10 rounded-lg border border-[#2a2418] text-[#9a9278] text-xs font-semibold uppercase tracking-wide hover:bg-[#e6ba35]/10 hover:text-[#e6ba35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Choose Another
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isUploading}
              className="flex-1 h-10 rounded-lg bg-[#e6ba35] text-black text-xs font-bold uppercase tracking-wide hover:bg-[#d4a82e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isUploading ? "Uploading" : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
