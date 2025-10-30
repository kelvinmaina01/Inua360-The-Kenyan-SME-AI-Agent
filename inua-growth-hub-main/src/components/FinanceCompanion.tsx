import { Construction } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const FinanceCompanion = () => {
  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto shadow-card">
        <CardHeader className="gradient-hero text-primary-foreground rounded-t-xl">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Construction className="h-6 w-6" />
            🎉 Bonus Hackathon Module
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            This agent will be integrated with backend APIs and ML models
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-2xl font-bold text-foreground">Finance Companion</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get personalized financial recommendations based on your business size, sector, and goals.
            Discover micro-loans, grants, savings plans, and budgeting tools.
          </p>
          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">🔗 Ready for integration with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Django REST API endpoints</li>
              <li>Financial institutions APIs</li>
              <li>ML-based recommendation engine</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceCompanion;
