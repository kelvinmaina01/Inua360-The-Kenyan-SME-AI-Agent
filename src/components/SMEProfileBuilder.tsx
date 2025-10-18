import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SMEReport, { ReportData } from "./SMEReport";

interface SMEProfileBuilderProps {
  onComplete?: () => void;
  initialData?: Partial<ProfileData>;
}

export interface ProfileData {
  business_name: string;
  country: string;
  sector: string;
  employees: string;
  annual_revenue: string;
  tech_adoption_level: string;
  main_challenges: string[];
  digital_tools_used: string[];
  growth_last_yr: string;
  funding_status: string;
  female_owned: boolean;
  remote_work_policy: string;
}

const questions = [
  { id: "business_name", question: "What's your business name?", type: "text", ml_field: false, placeholder: "e.g., TechVentures Kenya Ltd" },
  { id: "country", question: "Which country is your business located in?", type: "select", ml_field: true, options: ["Kenya"] },
  { id: "sector", question: "What sector does your business operate in?", type: "select", ml_field: true, options: ["Agriculture", "Retail", "Manufacturing", "Services", "Technology", "Health", "Food & Beverage"] },
  { id: "employees", question: "How many employees do you have?", type: "number", ml_field: true, placeholder: "e.g., 25" },
  { id: "annual_revenue", question: "What's your annual revenue in Ksh?", type: "number", ml_field: true, placeholder: "e.g., 500000" },
  //{ id: "growth_last_yr", question: "What was your growth percentage last year?", type: "number", ml_field: true, placeholder: "e.g., 35" },
  { id: "tech_adoption_level", question: "How would you rate your technology adoption?", type: "select", ml_field: true, options: ["Low", "Medium", "High", "Very High"] },
  { id: "funding_status", question: "What's your current funding status?", type: "select", ml_field: true, options: ["Bootstrapped", "Seed Funded", "Series A", "Series B+", "Not Seeking"] },
  { id: "female_owned", question: "Is this a female-owned business?", type: "boolean", ml_field: true },
  { id: "remote_work_policy", question: "What's your remote work policy?", type: "select", ml_field: true, options: ["Fully Remote", "Hybrid", "On-site Only", "Flexible"] },
];

const SMEProfileBuilder = ({ onComplete, initialData }: SMEProfileBuilderProps = {}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    business_name: initialData?.business_name || "",
    country: initialData?.country || "",
    sector: initialData?.sector || "",
    employees: initialData?.employees || "",
    annual_revenue: initialData?.annual_revenue || "",
    tech_adoption_level: initialData?.tech_adoption_level || "",
    main_challenges: initialData?.main_challenges || [],
    digital_tools_used: initialData?.digital_tools_used || [],
    growth_last_yr: initialData?.growth_last_yr || "",
    funding_status: initialData?.funding_status || "",
    female_owned: initialData?.female_owned || false,
    remote_work_policy: initialData?.remote_work_policy || ""
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    const value = formData[currentQuestion.id as keyof ProfileData];
    if (!value && value !== false) {
      toast.error("Please answer this question before continuing");
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      generateReport();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      localStorage.setItem("sme_profile_data", JSON.stringify(formData));
      await new Promise((r) => setTimeout(r, 1500));

      const mockReport: ReportData = {
        businessName: formData.business_name,
        profile: formData,
        financialSnapshot: {
          employees: parseInt(formData.employees) || 0,
          annual_revenue: parseInt(formData.annual_revenue) || 0,
          growth_last_yr: parseFloat(formData.growth_last_yr) || 0,
          funding_status: formData.funding_status
        },
        techOperations: {
          tech_adoption_level: formData.tech_adoption_level,
          digital_tools_used: formData.digital_tools_used,
          main_challenges: formData.main_challenges
        },
        summary: `${formData.business_name} is a ${formData.female_owned ? "woman-owned" : ""} ${formData.sector} business in ${formData.country} with ${formData.employees} employees.`,
        suggestions: [
          `Explore AI-powered analytics given your ${formData.tech_adoption_level} tech adoption.`,
          `Invest in team development for your ${formData.employees} employees.`,
          `Your ${formData.growth_last_yr}% growth last year shows scaling potential.`
        ],
        complianceScore: Math.floor(Math.random() * 30) + 65,
        sectorAverage: formData.sector === "Technology" ? 78 : 72,
        historicalScores: [
          { date: "Q1 2024", score: 62 },
          { date: "Q2 2024", score: 68 },
          { date: "Q3 2024", score: 74 },
          { date: "Q4 2024", score: Math.floor(Math.random() * 30) + 65 },
        ],
        generatedAt: new Date().toISOString(),
      };

      setCurrentReport(mockReport);
      toast.success("✅ Profile created successfully!");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (currentReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          {onComplete && (
            <Button onClick={onComplete} size="lg" className="gap-2">
              Continue to Compliance Check
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <SMEReport report={currentReport} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button onClick={() => navigate("/")} variant="outline" className="gap-2 mb-4">
        <Home className="h-4 w-4" /> Back to Home
      </Button>

      <Card className="shadow-2xl bg-gradient-to-br from-background to-muted/40 backdrop-blur-xl border border-primary/10">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl shadow-md">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" /> Business Profile Analyzer
            </CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Question {currentStep + 1} of {questions.length}
            </Badge>
          </div>
          <CardDescription className="text-primary-foreground/80 mt-2">
           Let’s get to know your business better — step by step.
          </CardDescription>
          <Progress value={progress} className="h-2 mt-4 bg-white/20" />
        </CardHeader>

        <CardContent className="p-8">
          {isGeneratingReport ? (
            <div className="text-center py-12 text-primary">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              </motion.div>
              <p className="text-lg font-medium">Generating your profile report...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>

                {currentQuestion.type === "text" && (
                  <Input
                    value={formData[currentQuestion.id as keyof ProfileData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [currentQuestion.id]: e.target.value })
                    }
                    placeholder={currentQuestion.placeholder}
                    className="text-lg p-6"
                    autoFocus
                  />
                )}

                {currentQuestion.type === "number" && (
                  <Input
                    type="number"
                    value={formData[currentQuestion.id as keyof ProfileData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [currentQuestion.id]: e.target.value })
                    }
                    placeholder={currentQuestion.placeholder}
                    className="text-lg p-6"
                    autoFocus
                  />
                )}

                {currentQuestion.type === "select" && (
                  <Select
                    value={formData[currentQuestion.id as keyof ProfileData] as string}
                    onValueChange={(value) =>
                      setFormData({ ...formData, [currentQuestion.id]: value })
                    }
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options?.map((option) => (
                        <SelectItem key={option} value={option} className="text-lg">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {currentQuestion.type === "boolean" && (
                  <div className="flex items-center gap-4 p-6 border rounded-lg">
                    <Switch
                      checked={formData[currentQuestion.id as keyof ProfileData] as boolean}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, [currentQuestion.id]: checked })
                      }
                    />
                    <Label className="text-lg cursor-pointer">
                      {formData[currentQuestion.id as keyof ProfileData] ? "Yes" : "No"}
                    </Label>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  <Button onClick={handlePrevious} variant="outline" disabled={currentStep === 0}>
                    ← Previous
                  </Button>
                  <Button onClick={handleNext} size="lg" className="gap-2">
                    {currentStep === questions.length - 1 ? "Generate Profile" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SMEProfileBuilder;
