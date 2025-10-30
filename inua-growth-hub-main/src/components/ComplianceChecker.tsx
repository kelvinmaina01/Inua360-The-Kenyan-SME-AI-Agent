import { useState } from "react";
import { CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "required" | "recommended" | "optional";
  urgency: "high" | "medium" | "low";
}

const ComplianceChecker = () => {
  const [businessType, setBusinessType] = useState("");
  const [sector, setSector] = useState("");
  const [region, setRegion] = useState("");
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual API call to Django backend
  const checkCompliance = async () => {
    if (!businessType || !sector || !region) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Simulated API call - replace with actual backend integration
    setTimeout(() => {
      const mockData: ComplianceItem[] = [
        {
          id: "1",
          name: "Business Registration Certificate",
          description: "Register your business with the Business Registration Service (BRS)",
          status: "required",
          urgency: "high"
        },
        {
          id: "2",
          name: "KRA PIN Certificate",
          description: "Obtain a Personal Identification Number from Kenya Revenue Authority",
          status: "required",
          urgency: "high"
        },
        {
          id: "3",
          name: "County Business Permit",
          description: "Apply for a single business permit from your county government",
          status: "required",
          urgency: "high"
        },
        {
          id: "4",
          name: "NSSF Registration",
          description: "Register with National Social Security Fund for employee benefits",
          status: "recommended",
          urgency: "medium"
        },
        {
          id: "5",
          name: "NHIF Registration",
          description: "Register with National Hospital Insurance Fund",
          status: "recommended",
          urgency: "medium"
        },
        {
          id: "6",
          name: "Fire Safety Certificate",
          description: "Obtain fire safety compliance certificate from county fire department",
          status: "optional",
          urgency: "low"
        }
      ];
      
      setComplianceItems(mockData);
      setIsLoading(false);
      toast.success("Compliance check completed!");
    }, 1500);
  };

  const downloadChecklist = () => {
    // TODO: Implement PDF generation or connect to backend API
    toast.success("Checklist download ready!");
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

  const getUrgencyIcon = (urgency: string) => {
    return urgency === "high" ? (
      <AlertCircle className="h-5 w-5 text-destructive" />
    ) : (
      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
    );
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Compliance Checker
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Check business compliance requirements based on your sector, location, and business type
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Business Type</label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="limited">Limited Company</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sector</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
                  <SelectItem value="eldoret">Eldoret</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={checkCompliance} 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Checking..." : "Check Compliance"}
          </Button>

          {complianceItems.length > 0 && (
            <div className="space-y-4 pt-4">
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
                  Download
                </Button>
              </div>

              <div className="space-y-3">
                {complianceItems.map((item) => (
                  <Card key={item.id} className="border-l-4" style={{
                    borderLeftColor: item.urgency === "high" ? "hsl(var(--destructive))" : "hsl(var(--muted))"
                  }}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getUrgencyIcon(item.urgency)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{item.name}</h4>
                            <Badge className={getStatusColor(item.status)} variant="secondary">
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-xs text-muted-foreground p-4 bg-muted/50 rounded-lg">
                💡 <strong>Note:</strong> This checklist is generated based on your inputs. 
                For precise requirements, please consult with BRF or legal advisors.
                {/* TODO: Replace with AI-generated recommendations from ML models */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceChecker;
