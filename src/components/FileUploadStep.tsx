import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ImageIcon,
  X,
} from "lucide-react";
import axiosInstance from "./utils/axios";

type DocState = "not_started" | "uploading" | "validating" | "validated" | "needs_review";

interface Props {
  stepId: string;
  title?: string;
  description?: string;
  required?: boolean;
  profileId: string;
  onValidationComplete: (state: DocState, validation?: any, serverDocId?: number | string) => void;
}

const FileUploadStep: React.FC<Props> = ({
  stepId,
  title,
  description,
  required,
  profileId,
  onValidationComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<DocState>("not_started");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleValidate = async (serverDocId: number | string) => {
    try {
      await axiosInstance.post(`/api/documents/${serverDocId}/validate/`);
      toast.loading("Validating document with AI...");

      const timeout = 30000;
      const interval = 2000;
      const start = Date.now();

      while (Date.now() - start < timeout) {
        const res = await axiosInstance.get(`/api/documents/${serverDocId}/`);
        const val = res.data.validation ?? res.data.validation_result;

        if (val && typeof val.valid !== "undefined") {
          toast.dismiss();
          setStatus(val.valid ? "validated" : "needs_review");
          onValidationComplete(val.valid ? "validated" : "needs_review", val, serverDocId);
          return;
        }
        await new Promise((r) => setTimeout(r, interval));
      }

      toast.warning("Validation timed out. Try again later.");
      setStatus("needs_review");
      onValidationComplete("needs_review");
    } catch (err: any) {
      console.error("Validation failed", err);
      toast.error("Validation failed. Try again.");
      setStatus("needs_review");
      onValidationComplete("needs_review");
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    setStatus("uploading");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("document_type", stepId);
      fd.append("profile", String(Number(profileId)));

      const res = await axiosInstance.post("/api/documents/", fd);
      const serverDocId =
        res.data.id ||
        res.data.document_id ||
        res.data.doc_id ||
        res.data.document?.id ||
        null;

      if (!serverDocId) {
        console.error("Unexpected response:", res.data);
        throw new Error("No document ID returned from server.");
      }

      setStatus("validating");
      await handleValidate(serverDocId);
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Upload failed";
      toast.error(msg);
      setStatus("needs_review");
      onValidationComplete("needs_review");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderStatusIcon = () => {
    switch (status) {
      case "validated":
        return <CheckCircle2 className="text-green-500 h-5 w-5" />;
      case "uploading":
      case "validating":
        return <Loader2 className="animate-spin text-blue-500 h-5 w-5" />;
      case "needs_review":
        return <AlertCircle className="text-yellow-600 h-5 w-5" />;
      default:
        return null;
    }
  };

  const isImage = (f: File | null) => f?.type.startsWith("image/");

  return (
    <div className="p-4 border rounded-lg bg-card w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          {title && <h3 className="font-semibold text-base truncate">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
          {required && (
            <span className="inline-block mt-1 text-xs text-blue-600 font-medium">Required</span>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center justify-end h-6">
          {renderStatusIcon()}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto flex-1 sm:flex-none justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-1.5" /> Choose File
        </Button>
        <Button
          size="sm"
          className="w-full sm:w-auto flex-1 sm:flex-none justify-center"
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "validating"}
        >
          {status === "uploading" || status === "validating" ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />{" "}
              {status === "uploading" ? "Uploading" : "Validating"}
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>

      {/* Preview Section */}
      {previewUrl && file && (
        <div className="mt-4 p-3 border rounded-md bg-background/80 backdrop-blur-sm shadow-sm w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isImage(file) ? (
                <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {file.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              onClick={clearFile}
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mt-3 flex justify-center">
            {isImage(file) ? (
              <div className="relative border border-border rounded bg-muted/30 flex items-center justify-center overflow-hidden w-full max-w-[280px] h-[140px]">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain w-full h-full p-1"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center border border-dashed border-border rounded bg-muted/20 w-full max-w-[200px] h-[120px]">
                <FileText className="h-8 w-8 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">PDF Document</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-xs text-muted-foreground text-center">
            {Math.round(file.size / 1024)} KB
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadStep;