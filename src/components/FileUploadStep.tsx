// src/components/FileUploadStep.tsx
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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

const FileUploadStep: React.FC<Props> = ({ stepId, title, description, required, profileId, onValidationComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<DocState>("not_started");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      console.log("upload payload:", {
        profile: Number(profileId),
        document_type: stepId,
        file
      });

      const fd = new FormData();
      fd.append("file", file);
      fd.append("document_type", stepId);
      fd.append("profile", String(Number(profileId))); // final correct line

      const res = await axiosInstance.post("/api/documents/", fd);
      const serverDocId = res.data.id || res.data.document_id || res.data.doc_id || res.data.document?.id || null;

      if (!serverDocId){
        console.error("Unexpected response:", res.data);
        throw new Error("No document ID returned from server.");
      } 

      setStatus("validating");
      await handleValidate(serverDocId);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.detail || err.message || "Upload failed";
      toast.error(msg);
      setStatus("needs_review");
      onValidationComplete("needs_review");
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case "validated":
        return <CheckCircle2 className="text-green-500" />;
      case "uploading":
      case "validating":
        return <Loader2 className="animate-spin text-blue-500" />;
      case "needs_review":
        return <AlertCircle className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          {title && <h3 className="font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div>{renderStatusIcon()}</div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Choose File
        </Button>
        <Button onClick={handleUpload} disabled={!file || status === "uploading" || status === "validating"}>
          {status === "uploading" || status === "validating" ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {file && <p className="text-xs mt-2">Selected file: {file.name}</p>}
    </div>
  );
};

export default FileUploadStep;
