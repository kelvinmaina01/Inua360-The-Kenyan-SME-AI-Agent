import { useState } from "react";
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
const questions = [{
  id: "business_name",
  question: "What's your business name?",
  type: "text",
  ml_field: false,
  placeholder: "e.g., TechVentures Kenya Ltd"
}, {
  id: "country",
  question: "Which country is your business located in?",
  type: "select",
  ml_field: true,
  options: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Other"]
}, {
  id: "sector",
  question: "What sector does your business operate in?",
  type: "select",
  ml_field: true,
  options: ["Agriculture", "Retail", "Manufacturing", "Services", "Technology", "Health", "Food & Beverage"]
}, {
  id: "employees",
  question: "How many employees do you have?",
  type: "number",
  ml_field: true,
  placeholder: "e.g., 25"
}, {
  id: "annual_revenue",
  question: "What's your annual revenue in USD?",
  type: "number",
  ml_field: true,
  placeholder: "e.g., 500000"
}, {
  id: "growth_last_yr",
  question: "What was your growth percentage last year?",
  type: "number",
  ml_field: true,
  placeholder: "e.g., 35"
}, {
  id: "tech_adoption_level",
  question: "How would you rate your technology adoption?",
  type: "select",
  ml_field: true,
  options: ["Low", "Medium", "High", "Very High"]
}, {
  id: "funding_status",
  question: "What's your current funding status?",
  type: "select",
  ml_field: true,
  options: ["Bootstrapped", "Seed Funded", "Series A", "Series B+", "Not Seeking"]
}, {
  id: "female_owned",
  question: "Is this a female-owned business?",
  type: "boolean",
  ml_field: true
}, {
  id: "remote_work_policy",
  question: "What's your remote work policy?",
  type: "select",
  ml_field: true,
  options: ["Fully Remote", "Hybrid", "On-site Only", "Flexible"]
}];
const SMEProfileBuilder = ({
  onComplete,
  initialData
}: SMEProfileBuilderProps = {}) => {
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
  const progress = (currentStep + 1) / questions.length * 100;
  const handleNext = () => {
    const currentValue = formData[currentQuestion.id as keyof ProfileData];
    if (!currentValue && currentValue !== false) {
      toast.error("Please answer this question before continuing");
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateReport();
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Store profile data in localStorage for other agents to use
      localStorage.setItem('sme_profile_data', JSON.stringify(formData));
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockReport: ReportData = {
        businessName: formData.business_name,
        profile: {
          business_name: formData.business_name,
          sector: formData.sector,
          country: formData.country,
          female_owned: formData.female_owned,
          remote_work_policy: formData.remote_work_policy
        },
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
        summary: `${formData.business_name} is a ${formData.female_owned ? 'woman-owned' : ''} ${formData.sector} business in ${formData.country} with ${formData.employees} employees. With an annual revenue of $${parseInt(formData.annual_revenue).toLocaleString()}, the company has achieved ${formData.growth_last_yr}% growth last year.`,
        suggestions: [`Given your ${formData.tech_adoption_level} tech adoption, consider integrating AI-powered analytics to optimize operations.`, `With ${formData.employees} employees, invest in comprehensive training programs to boost productivity.`, `Your ${formData.growth_last_yr}% growth rate is promising - explore scaling opportunities in adjacent markets.`],
        complianceScore: Math.floor(Math.random() * 30) + 65,
        sectorAverage: formData.sector === "Technology" ? 78 : formData.sector === "Retail" ? 72 : 75,
        historicalScores: [{
          date: "Q1 2024",
          score: 60
        }, {
          date: "Q2 2024",
          score: 68
        }, {
          date: "Q3 2024",
          score: 73
        }, {
          date: "Q4 2024",
          score: Math.floor(Math.random() * 30) + 65
        }],
        generatedAt: new Date().toISOString()
      };
      setCurrentReport(mockReport);
      toast.success("✅ Profile created successfully!");
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
      console.error("Report generation error:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };
  if (currentReport) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          {onComplete && <Button onClick={onComplete} size="lg" className="gap-2">
              Continue to Compliance Check
              <ArrowRight className="h-4 w-4" />
            </Button>}
        </div>
        <SMEReport report={currentReport} />
      </div>;
  }
  return <div className="max-w-3xl mx-auto space-y-6">
      <Button onClick={() => navigate('/')} variant="outline" className="gap-2 mb-4">
        <Home className="h-4 w-4" />
        Back to Home
      </Button>

      <Card className="shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              SME Profile Builder
            </CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Question {currentStep + 1} of {questions.length}
            </Badge>
          </div>
          <CardDescription className="text-primary-foreground/90">
            Let's build your business profile step by step
          </CardDescription>
          <Progress value={progress} className="h-2 mt-4 bg-white/20" />
        </CardHeader>

        <CardContent className="p-8">
          {isGeneratingReport ? <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-primary">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Generating your profile report...</p>
              </div>
            </div> : <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{currentQuestion.question}</h3>
                    {currentQuestion.ml_field}
                  </div>
                </div>

                <div className="pl-[60px]">
                  {currentQuestion.type === "text" && <Input value={formData[currentQuestion.id as keyof ProfileData] as string} onChange={e => setFormData({
                ...formData,
                [currentQuestion.id]: e.target.value
              })} placeholder={currentQuestion.placeholder} className="text-lg p-6" autoFocus />}

                  {currentQuestion.type === "number" && <Input type="number" value={formData[currentQuestion.id as keyof ProfileData] as string} onChange={e => setFormData({
                ...formData,
                [currentQuestion.id]: e.target.value
              })} placeholder={currentQuestion.placeholder} className="text-lg p-6" autoFocus />}

                  {currentQuestion.type === "select" && <Select value={formData[currentQuestion.id as keyof ProfileData] as string} onValueChange={value => setFormData({
                ...formData,
                [currentQuestion.id]: value
              })}>
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentQuestion.options?.map(option => <SelectItem key={option} value={option} className="text-lg">
                            {option}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>}

                  {currentQuestion.type === "boolean" && <div className="flex items-center gap-4 p-6 border rounded-lg">
                      <Switch checked={formData[currentQuestion.id as keyof ProfileData] as boolean} onCheckedChange={checked => setFormData({
                  ...formData,
                  [currentQuestion.id]: checked
                })} />
                      <Label className="text-lg cursor-pointer">
                        {formData[currentQuestion.id as keyof ProfileData] ? "Yes" : "No"}
                      </Label>
                    </div>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 pl-[60px]">
                <Button onClick={handlePrevious} variant="outline" disabled={currentStep === 0}>
                  ← Previous
                </Button>

                <Button onClick={handleNext} size="lg" className="gap-2">
                  {currentStep === questions.length - 1 ? "Generate Profile" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default SMEProfileBuilder;