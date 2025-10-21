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
  year_established: string;
  employees: string;
  business_size: string;
  annual_revenue: string;
  growth_last_yr: string;
  funding_status: string;
  ownership_type: string;
  female_owned: boolean;
  location: string;
  main_challenges: string;
  digital_tools_used: string;
  tech_adoption_level: string;
  remote_work_policy: string;
}

const questions = [
  { id: "business_name", question: "What's your business name?", type: "text", placeholder: "e.g., TechVentures Kenya Ltd" },
  { id: "country", question: "Which country is your business located in?", type: "select", options: ["Kenya"] },
  { id: "sector", question: "What sector does your business operate in?", type: "select", options: ["Agriculture", "Retail", "Manufacturing", "Services", "Technology", "Health", "Food & Beverage"] },
  { id: "year_established", question: "What year was your business established?", type: "number", placeholder: "e.g., 2018" },
  { id: "employees", question: "How many employees do you have?", type: "number", placeholder: "e.g., 25" },
  { id: "business_size", question: "What is the size of your business?", type: "select", options: ["Micro", "Small", "Medium", "Large"] },
  { id: "annual_revenue", question: "What's your annual revenue in Ksh?", type: "number", placeholder: "e.g., 500000" },
  {
    id: "funding_status",
    question: "What's your current funding status?",
    type: "select",
    options: [
      "Bootstrapped (Self-funded)",
      "Seed Funded (Early stage)",
      "Series A (Growth stage)",
      "Series B+ (Scaling)",
      "Not Seeking (Stable)"
    ]
  },
  { id: "ownership_type", question: "What type of ownership structure does your business have?", type: "select", options: ["Sole Proprietor", "Partnership", "Limited Company", "Cooperative"] },
  { id: "female_owned", question: "Is this a female-owned business?", type: "boolean" },
  { id: "location", question: "Where is your business located?", type: "text", placeholder: "e.g., Nairobi, Kenya" },
  { id: "main_challenges", question: "What are your main business challenges? (comma separated)", type: "text", placeholder: "e.g., access to finance, market reach" },
  { id: "digital_tools_used", question: "Which digital tools does your business use? (comma separated)", type: "text", placeholder: "e.g., WhatsApp, Excel, QuickBooks" },
  { id: "tech_adoption_level", question: "How would you rate your technology adoption?", type: "select", options: ["Low", "Medium", "High", "Very High"] },
  { id: "remote_work_policy", question: "What's your remote work policy?", type: "select", options: ["Fully Remote", "Hybrid", "On-site Only", "Flexible"] },
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
    year_established: initialData?.year_established || "",
    employees: initialData?.employees || "",
    business_size: initialData?.business_size || "",
    annual_revenue: initialData?.annual_revenue || "",
    growth_last_yr: initialData?.growth_last_yr || "",
    funding_status: initialData?.funding_status || "",
    ownership_type: initialData?.ownership_type || "",
    female_owned: initialData?.female_owned || false,
    location: initialData?.location || "",
    main_challenges: initialData?.main_challenges || "",
    digital_tools_used: initialData?.digital_tools_used || "",
    tech_adoption_level: initialData?.tech_adoption_level || "",
    remote_work_policy: initialData?.remote_work_policy || ""
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    const value = formData[currentQuestion.id as keyof ProfileData];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      toast.error("Please answer this question before continuing");
      return;
    }
    if (currentStep < questions.length - 1) setCurrentStep(prev => prev + 1);
    else generateReport();
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      localStorage.setItem("sme_profile_data", JSON.stringify(formData));
      await new Promise(res => setTimeout(res, 1500));

      const mockReport: ReportData = {
        businessName: formData.business_name,
        profile: {
          business_name: formData.business_name,
          sector: formData.sector,
          country: formData.country,
          female_owned: formData.female_owned,
          remote_work_policy: formData.remote_work_policy,
        },
        financialSnapshot: {
          employees: parseInt(formData.employees) || 0,
          annual_revenue: parseInt(formData.annual_revenue) || 0,
          growth_last_yr: parseFloat(formData.growth_last_yr) || 0,
          funding_status: formData.funding_status,
        },
        techOperations: {
          tech_adoption_level: formData.tech_adoption_level,
          digital_tools_used: formData.digital_tools_used.split(",").map(t => t.trim()),
          main_challenges: formData.main_challenges.split(",").map(c => c.trim()),
        },
        summary: `${formData.business_name} is a ${formData.female_owned ? "woman-owned" : ""} ${formData.sector} business in ${formData.country} with ${formData.employees} employees.`,
        suggestions: [
          `Explore AI-powered analytics given your ${formData.tech_adoption_level} tech adoption.`,
          `Invest in team development for your ${formData.employees} employees.`,
          `Your ${formData.growth_last_yr || 0}% growth last year shows scaling potential.`,
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
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while generating the report!");
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
          <Progress value={progress} className="h-3 mt-4 bg-white/30 [&>div]:bg-white" />
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

                {["text", "number"].includes(currentQuestion.type) && (
                  <Input
                    type={currentQuestion.type}
                    value={formData[currentQuestion.id as keyof ProfileData] as string}
                    onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                    placeholder={currentQuestion.placeholder}
                    className="text-lg p-6"
                    autoFocus
                  />
                )}

                {currentQuestion.type === "select" && (
                  <Select
                    value={formData[currentQuestion.id as keyof ProfileData] as string}
                    onValueChange={(value) => setFormData({ ...formData, [currentQuestion.id]: value })}
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
                      onCheckedChange={(checked) => setFormData({ ...formData, [currentQuestion.id]: checked })}
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
