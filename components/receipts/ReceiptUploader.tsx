"use client";

import { useState, useCallback } from "react";
import { Upload, FileImage, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { runOcr, type OcrResult } from "@/lib/ocr";

interface ReceiptUploaderProps {
  onResult: (result: OcrResult, file: File) => void;
  disabled?: boolean;
}

export const ReceiptUploader = ({ onResult, disabled }: ReceiptUploaderProps) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = useCallback(async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setProcessing(true);
    setStatus("processing");
    setProgress(0);

    try {
      const result = await runOcr(f, setProgress);
      setStatus("done");
      onResult(result, f);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "OCR failed");
    } finally {
      setProcessing(false);
    }
  }, [onResult]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.startsWith("image/") || dropped.type === "application/pdf")) {
      processFile(dropped);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all",
            dragging ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-[var(--border)] hover:border-[var(--brand)]/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center">
            <Upload className="w-7 h-7 text-[var(--brand)]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Drop receipt here or click to upload</p>
            <p className="text-xs text-muted mt-1">Supports JPG, PNG, PDF · AI will extract data automatically</p>
          </div>
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileInput} disabled={disabled} />
        </label>
      ) : (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* Preview */}
          <div className="relative bg-[var(--bg)] h-48 flex items-center justify-center">
            {preview && (
              <img src={preview} alt="Receipt preview" className="max-h-full max-w-full object-contain" />
            )}
            <button
              onClick={reset}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status bar */}
          <div className="px-4 py-3 border-t border-[var(--border)]">
            {status === "processing" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--brand)]" />
                  <span>Extracting data with AI... {progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand)] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {status === "done" && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle className="w-4 h-4" />
                <span>Data extracted successfully — review below</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg ?? "Extraction failed — fill in details manually"}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
