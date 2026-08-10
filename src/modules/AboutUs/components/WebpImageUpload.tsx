"use client";

import { useEffect, useRef, useState } from "react";
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
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const previewUrl = localPreview || value || null;

  const handleFile = async (file: File | undefined) => {
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
    setLocalPreview(objectUrl);
    setStatus("uploading");

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
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      onChange(buildCloudFrontUrl(presignJson.key));
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setStatus("error");
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setLocalPreview(null);
    }
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLocalPreview(null);
    setError(null);
    setStatus("idle");
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
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#2a2418] bg-[#0a0908] p-2.5">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-[#2a2418] bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            {status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-4 w-4 animate-spin text-[#e6ba35]" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-[#9a9278]">
              {status === "uploading" ? "Uploading…" : "Image uploaded"}
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={status === "uploading"}
              className="text-[10px] font-semibold uppercase tracking-wide text-[#e6ba35] hover:underline disabled:opacity-50"
            >
              Replace
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={status === "uploading"}
            className="flex-shrink-0 text-[#5a5240] hover:text-red-400 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2418] bg-[#0a0908] px-4 py-4 text-xs text-[#7a7258] transition-colors",
            "hover:border-[#e6ba35]/40 hover:text-[#e6ba35] disabled:opacity-50"
          )}
        >
          {status === "uploading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageUp className="h-4 w-4" />
          )}
          {status === "uploading" ? "Uploading…" : "Upload .webp image"}
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
