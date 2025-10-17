import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Download, Upload, ArrowRight, Home, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "required" | "recommended" | "optional";
  completionStatus: "pending" | "done";
  uploadedFile?: {
    name: string;
    type: string;
    timestamp: number;
  };
}

interface ComplianceCheckerProps {
  onComplete?: () => void;
}

const ComplianceChecker = ({ onComplete }: ComplianceCheckerProps = {}) => {
  const navigate = useNavigate();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Load profile data from localStorage
    const stored = localStorage.getItem('sme_profile_data');
    if (stored) {
      setProfileData(JSON.parse(stored));
      checkCompliance(JSON.parse(stored));
    }
  }, []);

  const checkCompliance = async (data: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const hasEmployees = data?.employees && parseInt(data.employees) > 0;
      
      const mockData: ComplianceItem[] = [
        {
          id: "1",
          name: "Business Registration Certificate",
          description: "Register your business with the Business Registration Service (BRS)",
          status: "required",
          completionStatus: "pending"
        },
        {
          id: "2",
          name: "KRA PIN Certificate",
          description: "Obtain a Personal Identification Number from Kenya Revenue Authority",
          status: "required",
          completionStatus: "pending"
        },
        {
          id: "3",
          name: "County Business Permit",
          description: "Apply for a single business permit from your county government",
          status: "required",
          completionStatus: "pending"
        },
        {
          id: "4",
          name: "NSSF Registration",
          description: hasEmployees ? "Required: Register with National Social Security Fund for employee benefits" : "Register with National Social Security Fund",
          status: hasEmployees ? "required" : "recommended",
          completionStatus: "pending"
        },
        {
          id: "5",
          name: "NHIF Registration",
          description: hasEmployees ? "Required: Register with National Hospital Insurance Fund for employees" : "Register with National Hospital Insurance Fund",
          status: hasEmployees ? "required" : "recommended",
          completionStatus: "pending"
        },
        {
          id: "6",
          name: "Fire Safety Certificate",
          description: "Obtain fire safety compliance certificate from county fire department",
          status: "optional",
          completionStatus: "pending"
        }
      ];
      
      setComplianceItems(mockData);
      setIsLoading(false);
      toast.success("Compliance checklist generated!");
    }, 1500);
  };

  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setComplianceItems(prev => prev.map(item => 
      item.id === itemId 
        ? {
            ...item,
            completionStatus: "done" as const,
            uploadedFile: {
              name: file.name,
              type: file.type,
              timestamp: Date.now()
            }
          }
        : item
    ));

    toast.success(`${file.name} uploaded successfully`);
  };

  const calculateProgress = () => {
    if (complianceItems.length === 0) return 0;
    const completed = complianceItems.filter(item => item.completionStatus === "done").length;
    return Math.round((completed / complianceItems.length) * 100);
  };

  const downloadChecklist = () => {
    const element = document.getElementById("compliance-report");
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${profileData?.business_name?.replace(/\s+/g, "_")}_Compliance_Report.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const }
    };

    html2pdf().set(opt).from(element).save();
    toast.success("Downloading compliance report...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "required":
        return "bg-destructive text-destructive-foreground";
      case "recommended":
        return "bg-secondary text-secondary-foreground";
      case "optional":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
        <Home className="h-4 w-4" />
        Back to Home
      </Button>

      <Card className="shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 animate-pulse" />
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Compliance Validation
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mt-2">
                Let's now validate your compliance by uploading the required documents to ensure your business meets all legal requirements ✨
              </CardDescription>
            </div>
          </div>
          {profileData && (
            <Badge variant="secondary" className="bg-white/20 text-white w-fit mt-2">
              {profileData.business_name} • {profileData.sector}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-primary">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Generating your compliance checklist...</p>
              </div>
            </div>
          ) : complianceItems.length > 0 ? (
            <div id="compliance-report" className="space-y-6">
              {/* Progress Summary */}
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Progress</CardTitle>
                  <CardDescription>Track your compliance journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{calculateProgress()}%</span>
                    </div>
                    <Progress value={calculateProgress()} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Compliance Checklist ({complianceItems.length} items)
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadChecklist}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>

                <div className="space-y-3">
                  {complianceItems.map((item) => (
                    <Card key={item.id} className="border-l-4" style={{
                      borderLeftColor: item.status === "required" ? "hsl(var(--destructive))" : item.status === "recommended" ? "hsl(var(--secondary))" : "hsl(var(--muted))"
                    }}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            {item.completionStatus === "done" ? (
                              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-foreground">{item.name}</h4>
                                <Badge className={getStatusColor(item.status)} variant="secondary">
                                  {item.status}
                                </Badge>
                                {item.completionStatus === "done" && (
                                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                    Completed ✓
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              
                              {item.uploadedFile && (
                                <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                  📄 {item.uploadedFile.name} • Uploaded {new Date(item.uploadedFile.timestamp).toLocaleString()}
                                </div>
                              )}

                              {item.completionStatus === "pending" && (
                                <div className="pt-2">
                                  <label htmlFor={`file-${item.id}`} className="cursor-pointer">
                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                      <span>
                                        <Upload className="h-4 w-4" />
                                        Upload Document
                                      </span>
                                    </Button>
                                  </label>
                                  <input
                                    id={`file-${item.id}`}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(item.id, e)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {onComplete && (
                <div className="flex justify-end pt-4">
                  <Button onClick={onComplete} size="lg" className="gap-2">
                    Continue to Financial Assistant
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Please complete the Profile Builder first to generate your compliance checklist.</p>
              <Button onClick={() => navigate('/profile-builder')} className="mt-4">
                Go to Profile Builder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceChecker;
