import { FileText, CheckCircle2, Wallet, Bot } from "lucide-react";

interface NavigationProps {
  activeAgent: string;
  onAgentChange: (agent: string) => void;
}

const agents = [
  { id: "profile", label: "SME Profile Builder", icon: FileText, available: true },
  { id: "compliance", label: "Compliance Checker", icon: CheckCircle2, available: true },
  { id: "finance", label: "Finance Companion", icon: Wallet, available: true },
  { id: "agent", label: "Interactive Agent", icon: Bot, available: true },
];

const Navigation = ({ activeAgent, onAgentChange }: NavigationProps) => {
  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-card/50 backdrop-blur-sm p-2 rounded-2xl shadow-card">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = activeAgent === agent.id;
            
            return (
              <button
                key={agent.id}
                onClick={() => agent.available && onAgentChange(agent.id)}
                disabled={!agent.available}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium
                  transition-all duration-200 ease-in-out relative
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-hover scale-105' 
                    : agent.available
                    ? 'bg-transparent text-foreground hover:bg-muted hover:scale-102'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{agent.label}</span>
                {!agent.available && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
