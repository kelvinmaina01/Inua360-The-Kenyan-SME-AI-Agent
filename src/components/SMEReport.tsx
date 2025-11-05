import {
  Download,
  TrendingUp,
  CheckCircle2,
  Share2,
  Mail,
  MessageCircle,
  Lightbulb,
  Target,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import html2pdf from "html2pdf.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface ReportData {
  businessName: string;
  profile: {
    business_name: string;
    sector: string;
    country: string;
    female_owned: boolean;
    remote_work_policy: string;
  };
  financialSnapshot: {
    employees: number;
    annual_revenue: number;
    growth_last_year: number;
    funding_status: string;
  };
  techOperations: {
    tech_adoption_level: string;
    digital_tools_used: string[];
    main_challenges: string[];
  };
  summary: string;
  suggestions: string[];
  complianceScore: number;
  sectorAverage?: number;
  historicalScores?: Array<{ date: string; score: number }>;
  generatedAt: string;
}

interface SMEReportProps {
  report: ReportData;
}

const SMEReport = ({ report }: SMEReportProps) => {
  const navigate = useNavigate();

  
  // ✅ Handle PDF download
  const handleDownloadPDF = () => {
    const element = document.getElementById("sme-report-content");
    if (!element) return;

    const opt: any = {
      margin: 1,
      filename: `${report.businessName.replace(/\s+/g, "_")}_Report_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => {
        console.error("PDF Generation Error:", err);
        toast.error("Failed to generate PDF. Please try again.");
      });
  };

  // ✅ Chart Data
  const scoreData = [
    {
      name: report.businessName,
      score: report.complianceScore,
      fill: "hsl(var(--primary))",
    },
    ...(report.sectorAverage
      ? [
          {
            name: "Sector Average",
            score: report.sectorAverage,
            fill: "hsl(var(--secondary))",
          },
        ]
      : []),
  ];

  // ✅ Utility functions
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getSuggestionIcon = (index: number) => {
    const icons = [Target, Lightbulb, TrendingUp, CheckCircle2, AlertCircle];
    return icons[index % icons.length];
  };

  // ✅ Handle Sharing
  const handleShare = (method: "email" | "whatsapp") => {
    const reportText = `${report.businessName} - Inua360 Business Report

📋 PROFILE
• Sector: ${report.profile.sector}
• Country: ${report.profile.country}
• Ownership: ${
      report.profile.female_owned ? "Woman-Owned" : "Standard"
    }

💰 FINANCIAL SNAPSHOT
• Employees: ${report.financialSnapshot.employees}
• Revenue: $${report.financialSnapshot.annual_revenue.toLocaleString()}
• Growth: ${report.financialSnapshot.growth_last_year}%
• Funding: ${report.financialSnapshot.funding_status}

⚡ TECH & OPERATIONS
• Tech Level: ${report.techOperations.tech_adoption_level}
• Tools: ${report.techOperations.digital_tools_used.join(", ")}

📊 SMART PROFILE SCORE: ${report.complianceScore}/100

${report.summary}`;

    if (method === "email") {
      const subject = encodeURIComponent(
        `${report.businessName} - Inua360 Business Report` 
      );
      const body = encodeURIComponent(reportText);
      window.open(`mailto:?subject=${subject}&body=${body}`);
      toast.success("Opening email client...");
    } else {
      const text = encodeURIComponent(reportText);
      window.open(`https://wa.me/?text=${text}`);
      toast.success("Opening WhatsApp...");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          📊 Business Analysis Report
        </h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleShare("email")}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleDownloadPDF} className="gradient-hero">
            <Download className="h-4 w-4 mr-2" />
            Download Report as PDF
          </Button>
        </div>
      </div>

      <div id="sme-report-content" className="space-y-6">
        {/* Profile Summary */}
        <Card className="shadow-card">
          <CardHeader className="gradient-hero text-primary-foreground">
            <CardTitle>{report.businessName}</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Generated:{" "}
              {new Date(report.generatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* SME Profile */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>📋 SME Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Business Name</p>
              <p className="font-semibold">{report.profile.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sector</p>
              <p className="font-semibold">{report.profile.sector}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-semibold">{report.profile.country}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ownership Type</p>
              <p className="font-semibold">
                {report.profile.female_owned ? "Woman-Owned" : "Standard"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remote Work Policy</p>
              <p className="font-semibold">
                {report.profile.remote_work_policy}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Snapshot */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>💰 Financial Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Employee Count</p>
              <p className="text-2xl font-bold text-primary">
                {report.financialSnapshot.employees}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <p className="text-2xl font-bold text-primary">
                ${report.financialSnapshot.annual_revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth Last Year</p>
              <p className="text-2xl font-bold text-secondary">
                {report.financialSnapshot.growth_last_year}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funding Status</p>
              <p className="font-semibold">
                {report.financialSnapshot.funding_status}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tech & Operations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>⚡ Tech & Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Tech Adoption Level
              </p>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {report.techOperations.tech_adoption_level}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Digital Tools Used
              </p>
              <div className="flex flex-wrap gap-2">
                {report.techOperations.digital_tools_used.map((tool, idx) => (
                  <Badge key={idx} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Main Challenges
              </p>
              <div className="flex flex-wrap gap-2">
                {report.techOperations.main_challenges.map((challenge, idx) => (
                  <Badge
                    key={idx}
                    variant="destructive"
                    className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                  >
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts + Summary */}
        <Accordion type="multiple" defaultValue={["score", "summary"]}>
          <AccordionItem value="score">
            <Card className="shadow-card">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Smart Profile Summary
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p
                        className={`text-5xl font-bold ${getScoreColor(
                          report.complianceScore
                        )}`}
                      >
                        {report.complianceScore}
                      </p>
                      <p className="text-sm text-muted-foreground">out of 100</p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {getScoreBadge(report.complianceScore)}
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="score"
                        name="Smart Profile Score"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="summary">
            <Card className="shadow-card">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle>Executive Summary</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {report.summary}
                  </p>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        {/* Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Actionable Recommendations
            </CardTitle>
            <CardDescription>
              Steps to improve your business performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.suggestions.map((suggestion, index) => {
                const IconComponent = getSuggestionIcon(index);
                return (
                  <div
                    key={index}
                    className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">{suggestion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default SMEReport;
 
