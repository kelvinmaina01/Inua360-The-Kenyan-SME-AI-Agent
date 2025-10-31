// src/pages/ComplianceWizard.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Sparkles,
  Loader2,
  Lightbulb,
  Home,
  ArrowRight,
  SkipForward,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

/**
 * ComplianceWizard.tsx
 *
 * Single-page wizard that walks the SME through 6 compliance documents:
 * 1. Business Registration Certificate
 * 2. KRA PIN Certificate
 * 3. County Business Permit
 * 4. NSSF Registration
 * 5. NHIF Registration
 * 6. Tax Compliance Certificate
 *
 * Flow:
 * - Manual Next / Back navigation
 * - Upload -> Uploading -> Validating -> Result
 * - User can Skip a step (will mark as "skipped")
 * - After all steps, show Final Summary (with aggregated AI recommendations)
 *
 * Backend expectations:
 * - POST ${API_BASE}/api/documents/         (multipart/form-data: file, document_type, optional profile)
 * - POST ${API_BASE}/api/documents/{id}/validate/   (trigger validation; may be synchronous)
 * - GET  ${API_BASE}/api/documents/{id}/  (optional: fetch stored doc + validation result)
 *
 * Environment:
 * - VITE_API_BASE environment variable (e.g., VITE_API_BASE=http://localhost:8080/compliance-agent)
 *
 * Notes:
 * - This file intentionally does not send raw files to any LLM; backend must do extraction & call the LLM.
 * - The frontend expects validation result JSON: { valid: boolean, reason?: string, recommendations?: string[], confidence?: number }
 */

/* ---------------------------
   Types
   --------------------------- */
type DocState = "not_started" | "uploading" | "validating" | "validated" | "needs_review" | "skipped";

interface ValidationResult {
  valid: boolean;
  reason?: string;
  recommendations?: string[]; // NOTE: we will only display these at the final summary
  confidence?: number; // 0 - 100
}

interface Step {
  id: string;
  title: string;
  description: string;
  required: boolean;
  state: DocState;
  uploadedFileName?: string;
  uploadedAt?: number;
  serverDocId?: number | string;
  validation?: ValidationResult | null;
}

/* ---------------------------
   Config
   --------------------------- */
  // const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8080/compliance-agent";

/* ---------------------------
   Animations
   --------------------------- */
const containerVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* ---------------------------
   Component
   --------------------------- */
const ComplianceWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();

  // Steps configuration (the list you confirmed)
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  // aggregated recommendations (from all validations) shown on final summary only
  const [aggregatedRecommendations, setAggregatedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Initialize steps (could be fetched from server if you prefer)
    const stepList: Step[] = [
      {
        id: "business_registration",
        title: "Business Registration Certificate",
        description: "Official certificate from Business Registration Service (BRS).",
        required: true,
        state: "not_started",
      },
      {
        id: "kra_pin",
        title: "KRA PIN Certificate",
        description: "Your tax identification (KRA) certificate.",
        required: true,
        state: "not_started",
      },
      {
        id: "county_permit",
        title: "County Business Permit",
        description: "Single business permit issued by your county/municipality.",
        required: true,
        state: "not_started",
      },
      {
        id: "nssf",
        title: "NSSF Registration",
        description: "National Social Security Fund registration for employees.",
        required: false,
        state: "not_started",
      },
      {
        id: "nhif",
        title: "NHIF Registration",
        description: "National Hospital Insurance Fund registration for employees.",
        required: false,
        state: "not_started",
      },
      {
        id: "tax_compliance",
        title: "Tax Compliance Certificate",
        description: "Certificate showing your tax compliance or clearance.",
        required: true,
        state: "not_started",
      },
    ];
    setSteps(stepList);
    setIsInitializing(false);
  }, []);

  /* ---------------------------
     Helpers
     --------------------------- */
  const totalSteps = steps.length;
  const currentStep = steps[currentIndex];

  const progressPercent = () => {
    // count only validated steps as progress
    if (steps.length === 0) return 0;
    const validated = steps.filter((s) => s.state === "validated").length;
    return Math.round((validated / steps.length) * 100);
  };

  const updateStep = (id: string, patch: Partial<Step>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  /* ---------------------------
     Upload & Validate (core)
     --------------------------- */

  // Upload the file to backend and call validate endpoint.
  // The backend should extract text, mask sensitive parts, call LLM, and return JSON.
  async function uploadAndValidateFile(stepId: string, file: File) {
    // Update UI to uploading
    updateStep(stepId, { state: "uploading", uploadedFileName: file.name, uploadedAt: Date.now() });

    try {
      // 1) Upload file
      const fd = new FormData();
      fd.append("file", file);
      fd.append("document_type", stepId);

      // optional: include profile info from localStorage if available
      const profile = localStorage.getItem("sme_profile_data");
      if (profile) fd.append("profile", profile);

      const uploadResp = await fetch(`${API_BASE}/api/documents/`, {
        method: "POST",
        body: fd,
      });

      if (!uploadResp.ok) {
        const text = await uploadResp.text().catch(() => "");
        throw new Error(text || "Upload failed");
      }

      const uploadJson = await uploadResp.json();
      const serverDocId = uploadJson.id ?? uploadJson.pk ?? uploadJson.document_id ?? null;

      // Move to validating
      updateStep(stepId, { state: "validating", serverDocId });

      // 2) Trigger validation
      // Backend may do validation synchronously and respond with result,
      // or it may queue and we need to poll. We'll attempt synchronous call first,
      // and if backend returns a 202 or no JSON, we fall back to polling GET /api/documents/{id}/
      const validateResp = await fetch(`${API_BASE}/api/documents/${serverDocId}/validate/`, {
        method: "POST",
      });

      if (!validateResp.ok) {
        // If synchronous validation isn't available, backend might still have queued job.
        // We'll attempt to poll GET endpoint for result (simple fallback).
        updateStep(stepId, { state: "validating" });
        await pollForValidationResult(serverDocId, stepId);
        toast.dismiss();
        return;
      }

      // If validation returned a JSON result, handle it
      const valJson = await validateResp.json().catch(() => null);
      if (valJson && typeof valJson.valid !== "undefined") {
        applyValidationResult(stepId, serverDocId, valJson as ValidationResult);
        return;
      }

      // If not, poll for result
      await pollForValidationResult(serverDocId, stepId);
    } catch (err: any) {
      console.error("Upload/validate error:", err);
      toast.error("Upload or validation failed. Please try again.");
      updateStep(stepId, { state: "not_started", uploadedFileName: undefined, uploadedAt: undefined });
    } finally {
      toast.dismiss();
    }
  }

  // Poll GET /api/documents/{id}/ until validation result exists or timeout
  async function pollForValidationResult(serverDocId: string | number, stepId: string, timeoutMs = 30000, intervalMs = 2000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetch(`${API_BASE}/api/documents/${serverDocId}/`);
        if (res.ok) {
          const json = await res.json();
          const val = json.validation_result ?? json.validation ?? json;
          if (val && typeof val.valid !== "undefined") {
            applyValidationResult(stepId, serverDocId, val as ValidationResult);
            return;
          }
        }
      } catch (e) {
        // ignore network errors and retry until timeout
        console.warn("poll error", e);
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    // If we timed out:
    toast.warning("Validation timed out. Please try again later.");
    updateStep(stepId, { state: "needs_review" });
  }

  // Apply validation result to step and collect recommendations
  function applyValidationResult(stepId: string, serverDocId: string | number | null, val: ValidationResult) {
    updateStep(stepId, {
      serverDocId: serverDocId ?? undefined,
      validation: val,
      state: val.valid ? "validated" : "needs_review",
    });

    // Only collect recommendations for summary; we aggregate them (avoid duplicates)
    if (val.recommendations && val.recommendations.length) {
      setAggregatedRecommendations((prev) => {
        const all = [...prev, ...val.recommendations!];
        // uniq
        return Array.from(new Set(all));
      });
    }
  }

  /* ---------------------------
     Step controls: next, back, skip
     --------------------------- */

  function goNext() {
    if (currentIndex < totalSteps - 1) setCurrentIndex((i) => i + 1);
  }

  function goBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function skipCurrent() {
    const s = steps[currentIndex];
    if (!s) return;
    updateStep(s.id, { state: "skipped", uploadedFileName: undefined, uploadedAt: undefined });
    // move forward automatically (but user still can go back)
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  /* ---------------------------
     Summary helpers
     --------------------------- */
  const allDone = steps.every((s) => ["validated", "skipped", "needs_review"].includes(s.state));
  const validatedCount = steps.filter((s) => s.state === "validated").length;

  /* ---------------------------
     Download summary PDF
     --------------------------- */
  function downloadSummary() {
    const el = document.getElementById("wizard-summary");
    if (!el) {
      toast.error("No summary available to download.");
      return;
    }
    html2pdf().from(el).save("SME_Compliance_Summary.pdf");
    toast.success("Downloading summary...");
  }

  /* ---------------------------
     Render helpers: icons & tidy display
     --------------------------- */
  function renderStateIcon(s: Step) {
    switch (s.state) {
      case "validated":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "uploading":
      case "validating":
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case "needs_review":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case "skipped":
        return <SkipForward className="h-6 w-6 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-6 w-6 text-muted-foreground" />;
    }
  }

  /* ---------------------------
     UI: Step content component inline
     --------------------------- */
  const renderStepCard = (s: Step) => {
    return (
      <Card className="border-l-4 hover:shadow transition-all" key={s.id} style={{ borderLeftColor: s.required ? "hsl(var(--destructive))" : "hsl(var(--muted))" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {renderStateIcon(s)}
              <div>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription className="text-sm">{s.description}</CardDescription>
              </div>
            </div>
            <div>{s.required ? <Badge className="bg-red-100 text-red-700">Required</Badge> : <Badge variant="outline">Optional</Badge>}</div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* uploaded file info */}
            {s.uploadedFileName && (
              <div className="text-xs text-muted-foreground">
                📄 {s.uploadedFileName} • {s.uploadedAt ? new Date(s.uploadedAt).toLocaleString() : ""}
                {s.validation?.reason && <div className="mt-1">🧠 {s.validation.reason}</div>}
              </div>
            )}

            {/* file input if not uploading/validating/validated */}
            {["not_started", "needs_review", "skipped"].includes(s.state) && (
              <div className="flex items-center gap-3">
                <label htmlFor={`file-${s.id}`}>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" /> Choose file
                  </Button>
                </label>
                <input
                  id={`file-${s.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  ref={(el) => (fileInputsRef.current[s.id] = el)}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // Client-side quick check (size/type)
                    const allowed = ["application/pdf", "image/png", "image/jpeg"];
                    if (!allowed.includes(file.type)) {
                      toast.error("Only PDF, PNG, JPG files are allowed.");
                      return;
                    }
                    // start upload+validate
                    uploadAndValidateFile(s.id, file);
                  }}
                />

                {/* Skip button */}
                <Button variant="ghost" onClick={skipCurrent}>
                  Skip
                </Button>
              </div>
            )}

            {/* If validating, show spinner */}
            {s.state === "uploading" && <div className="text-sm text-muted-foreground">Uploading file…</div>}
            {s.state === "validating" && <div className="text-sm text-muted-foreground">Validating with AI…</div>}

            {/* If validated or needs review show brief result (recommendations are kept for final summary) */}
            {s.state === "validated" && (
              <div className="text-sm text-green-700">Validated ✓ {s.validation?.confidence ? `• Confidence ${s.validation.confidence}%` : ""}</div>
            )}
            {s.state === "needs_review" && <div className="text-sm text-yellow-700">Needs review • {s.validation?.reason}</div>}
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ---------------------------
     UI: Main render
     --------------------------- */
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Top actions + header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-semibold">Compliance Validation Wizard</h1>
              <p className="text-sm text-muted-foreground">Step-by-step guidance through your key compliance documents.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Step {currentIndex + 1} of {totalSteps}</div>
          <div className="w-48">
            <Progress value={progressPercent()} className="h-3" />
          </div>
        </div>
      </div>

      {/* Main card - shows current step (wizard) */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Wizard</CardTitle>
              <CardDescription className="text-white/90">Upload each document, validate it, then move to the next.</CardDescription>
            </div>

            <div className="text-sm text-white/90">{progressPercent()}% complete • {validatedCount} validated</div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Step content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep?.id || "empty"}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {currentStep ? renderStepCard(currentStep) : <div>No step</div>}
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={goBack} disabled={currentIndex === 0}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="outline" onClick={() => {
                // re-open file dialog for current step
                const el = fileInputsRef.current[currentStep?.id || ""];
                el?.click();
              }}>
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Next moves to next step. If last step, go to summary (displayed below) */}
              {currentIndex < totalSteps - 1 ? (
                <Button onClick={goNext}>Next <ArrowRight className="h-4 w-4" /></Button>
              ) : (
                <Button onClick={() => { /* onFinish just shows summary below; nothing special required */ }}>
                  Finish
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary - visible when user manually advances to last step and clicks Finish OR when all steps done */}
      {(currentIndex === totalSteps - 1 || allDone) && (
        <Card id="wizard-summary" className="shadow-lg">
          <CardHeader className="bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600" />
                <CardTitle>Summary & AI Recommendations</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">{validatedCount} validated • {steps.filter(s => s.state === "skipped").length} skipped</div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* list each step with final state */}
              {steps.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center gap-3">
                    {renderStateIcon(s)}
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {s.state === "validated" && <span className="text-green-600">Validated</span>}
                    {s.state === "needs_review" && <span className="text-yellow-600">Needs review</span>}
                    {s.state === "skipped" && <span className="text-muted-foreground">Skipped</span>}
                    {s.state === "not_started" && <span className="text-muted-foreground">Not started</span>}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <h4 className="font-semibold">AI Recommendations</h4>
                {aggregatedRecommendations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No AI recommendations yet — upload and validate documents to receive personalized suggestions.</p>
                ) : (
                  <ul className="list-disc list-inside mt-2">
                    {aggregatedRecommendations.map((r, idx) => <li key={idx} className="text-sm text-muted-foreground">{r}</li>)}
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={downloadSummary}><Download className="h-4 w-4 mr-2" /> Download Report</Button>
                <Button onClick={() => { toast.success("Wizard complete — continue to the dashboard."); onComplete?.(); }}>
                  Finish & Exit <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceWizard;
