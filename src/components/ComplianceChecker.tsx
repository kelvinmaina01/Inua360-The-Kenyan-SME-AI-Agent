import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Lightbulb, Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import FileUploadStep from "@/components/FileUploadStep";

interface Step {
  id: string;
  title: string;
  description: string;
  required: boolean;
  state?: "not_started" | "uploading" | "validating" | "validated" | "needs_review" | "skipped";
  validation?: any;
  serverDocId?: number | string;
}

const containerVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const ComplianceWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aggregatedRecommendations, setAggregatedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const stepList: Step[] = [
      { id: "business_registration", title: "Business Registration Certificate", description: "Official certificate from Business Registration Service (BRS).", required: true, state: "not_started" },
      { id: "kra_pin", title: "KRA PIN Certificate", description: "Your tax identification (KRA) certificate.", required: true, state: "not_started" },
      { id: "county_permit", title: "County Business Permit", description: "Single business permit issued by your county/municipality.", required: true, state: "not_started" },
      { id: "nssf", title: "NSSF Registration", description: "National Social Security Fund registration for employees.", required: false, state: "not_started" },
      { id: "nhif", title: "NHIF Registration", description: "National Hospital Insurance Fund registration for employees.", required: false, state: "not_started" },
      { id: "tax_compliance", title: "Tax Compliance Certificate", description: "Certificate showing your tax compliance or clearance.", required: true, state: "not_started" },
    ];
    setSteps(stepList);
  }, []);

  const currentStep = steps[currentIndex] || null;

  const progressPercent = Math.round(
    (steps.filter((s) => ["validated", "skipped", "needs_review"].includes(s.state || "")).length / steps.length) * 100
  );

  const updateStep = (id: string, patch: Partial<Step>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    if (patch.validation?.recommendations) {
      setAggregatedRecommendations((prev) => Array.from(new Set([...prev, ...patch.validation.recommendations])));
    }
  };

  const goNext = () => { if (currentIndex < steps.length - 1) setCurrentIndex(currentIndex + 1); };
  const goBack = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const downloadSummary = () => {
    const el = document.getElementById("wizard-summary");
    if (!el) return toast.error("No summary available to download.");
    html2pdf().from(el).save("SME_Compliance_Summary.pdf");
    toast.success("Downloading summary...");
  };

  const allDone = steps.every((s) => ["validated", "skipped", "needs_review"].includes(s.state || ""));

  return (
    <div className="max-w-4xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header + Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4" /> <span>Back to Home</span>
        </Button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Step {currentIndex + 1} of {steps.length}
          </div>
          <div className="w-full sm:w-48">
            <Progress value={progressPercent} className="h-2 sm:h-3" />
          </div>
        </div>
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <FileUploadStep
              stepId={currentStep.id}
              title={currentStep.title}
              description={currentStep.description}
              required={currentStep.required}
              profileId={localStorage.getItem("sme_profile_id") || ""}
              onValidationComplete={(state, validation, serverDocId) => {
                updateStep(currentStep.id, { state, validation, serverDocId });
              }}
            />

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                disabled={currentIndex === 0}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                size="sm"
                onClick={goNext}
                disabled={currentIndex === steps.length - 1}
                className="w-full sm:w-auto"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {(currentIndex === steps.length - 1 || allDone) && (
        <Card id="wizard-summary" className="shadow-lg mt-6">
          <CardHeader className="bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-lg">Summary & AI Recommendations</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {steps.filter(s => s.state === "validated").length} validated •{" "}
                {steps.filter(s => s.state === "skipped").length} skipped
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y">
              {steps.map((s) => (
                <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
                  </div>
                  <div className="text-sm whitespace-nowrap mt-1 sm:mt-0">
                    {s.state === "validated" && <span className="text-green-600">Validated</span>}
                    {s.state === "needs_review" && <span className="text-yellow-600">Needs review</span>}
                    {s.state === "skipped" && <span className="text-muted-foreground">Skipped</span>}
                    {s.state === "not_started" && <span className="text-muted-foreground">Not started</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="font-semibold text-base">AI Recommendations</h4>
              {aggregatedRecommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-1">
                  No recommendations yet — upload and validate documents to receive personalized suggestions.
                </p>
              ) : (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {aggregatedRecommendations.map((r, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{r}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={downloadSummary} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
              <Button size="sm" onClick={() => onComplete?.()} className="w-full sm:w-auto">
                Finish & Exit <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceWizard;