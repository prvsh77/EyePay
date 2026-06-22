import { useQuery } from "@tanstack/react-query";
import { api, type InsightsData } from "../lib/api";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  UserCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  AlertCircle,
  Shield,
  Activity,
  ArrowUpRight,
  User,
  Zap,
  Info
} from "lucide-react";

export default function Intelligence() {
  const { data, isLoading, error } = useQuery<InsightsData>({
    queryKey: ["/api/insights"],
    queryFn: () => api.insights.get(),
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="glass-card p-8 rounded-2xl border border-border/40 text-center flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Booting EyePay AI Intelligence Engine...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="glass-card p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground mb-2">Engine Boot Failed</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {(error as Error)?.message || "Failed to initialize and load AI insights from transaction ledger."}
          </p>
          <Button onClick={() => window.location.reload()} className="font-semibold">
            Reboot Engine
          </Button>
        </div>
      </div>
    );
  }

  const { healthScore, insights, unusualActivity, recommendations } = data;

  // Score meter variables
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 stroke-green-500";
    if (score >= 50) return "text-yellow-500 stroke-yellow-500";
    return "text-red-500 stroke-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "SECURE";
    if (score >= 50) return "WARNING";
    return "CRITICAL";
  };

  // Icons mapper for insights
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case "growth":
        return <Globe className="w-5 h-5 text-green-500" />;
      case "recipient":
        return <UserCheck className="w-5 h-5 text-purple-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
    }
  };

  // Severity color for recommendations
  const getRecSeverityStyle = (sev: string) => {
    switch (sev) {
      case "critical":
        return {
          card: "border-red-500/20 bg-red-500/5 hover:bg-red-500/8",
          icon: "bg-red-500/10 text-red-500",
          badge: "bg-red-500/20 text-red-700 dark:text-red-300",
          indicator: "bg-red-500"
        };
      case "warning":
        return {
          card: "border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/8",
          icon: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
          badge: "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300",
          indicator: "bg-yellow-500"
        };
      default:
        return {
          card: "border-primary/20 bg-primary/5 hover:bg-primary/8",
          icon: "bg-primary/10 text-primary",
          badge: "bg-primary/20 text-primary",
          indicator: "bg-primary"
        };
    }
  };

  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-8 relative z-10">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-primary/10 text-primary font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> AI Powered
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">EyePay Intelligence Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Simulated AI compliance analytics evaluating ledger flow security, anomalies, and safety rankings.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = "/analytics"} 
          variant="outline"
          className="font-semibold flex items-center gap-2 text-xs"
        >
          View Technical Charts <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Score meter & Recommendations */}
        <div className="space-y-6 lg:col-span-1">
          {/* AI Health score meter */}
          <div className="glass-card p-6 rounded-2xl border border-border/40 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Shield className="w-5 h-5 text-primary opacity-20" />
            </div>
            
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-6 text-left">Security Health Score</h3>
            
            <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-muted/30 fill-none"
                  strokeWidth="8"
                />
                {/* Score bar */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(healthScore)}`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-foreground tracking-tighter font-mono">
                  {healthScore}
                </span>
                <span className={`text-[10px] font-bold tracking-widest ${getScoreColor(healthScore)}`}>
                  {getScoreLabel(healthScore)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed px-2 mt-2">
              Evaluated based on transacted risk flags, pending compliance audits, and sanctioned country spreads.
            </p>
          </div>

          {/* Recommendations List */}
          <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-lg">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Risk Recommendations</h3>
            
            {recommendations.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-xs">
                No actionable warnings detected. Core systems secure.
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, i) => {
                  const style = getRecSeverityStyle(rec.severity);
                  return (
                    <div 
                      key={i} 
                      className={`border p-4 rounded-xl transition-colors duration-200 flex gap-3 ${style.card}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.icon}`}>
                        {rec.severity === "critical" ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : rec.severity === "warning" ? (
                          <ShieldAlert className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <h4 className="font-bold text-xs text-foreground truncate">{rec.title}</h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${style.badge}`}>
                            {rec.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-normal">{rec.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Insights and Unusual Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Insights Grid */}
          <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-lg">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">AI Ledger Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((ins, i) => (
                <div 
                  key={i} 
                  className="border border-border/30 bg-muted/10 p-5 rounded-xl flex items-start gap-4 hover:border-primary/20 transition-all"
                >
                  <div className="p-2.5 bg-background border border-border/40 rounded-lg shadow-sm">
                    {getInsightIcon(ins.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{ins.title}</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        ins.impact === "positive" 
                          ? "bg-green-500/15 text-green-500" 
                          : ins.impact === "negative" 
                          ? "bg-red-500/15 text-red-500" 
                          : ins.impact === "warning"
                          ? "bg-yellow-500/15 text-yellow-500"
                          : "bg-blue-500/15 text-blue-500"
                      }`}>
                        {ins.metric}
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold leading-relaxed mb-1">{ins.description}</p>
                    <div className="text-[9px] text-muted-foreground capitalize flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                        ins.impact === "positive" 
                          ? "bg-green-500" 
                          : ins.impact === "negative" 
                          ? "bg-red-500" 
                          : ins.impact === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`} />
                      AI rated impact: {ins.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unusual Activity Banners */}
          <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-lg">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Unusual Activity Logs</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Flagged volume spikes or compliance risk warnings.</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                unusualActivity.length > 0 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" : "bg-green-500/20 text-green-500"
              }`}>
                {unusualActivity.length} anomalies
              </span>
            </div>

            {unusualActivity.length === 0 ? (
              <div className="border border-dashed border-border/60 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <h4 className="font-bold text-xs text-foreground">All Clear</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs leading-normal">
                  No anomalous transfers or elevated risk scores have been logged in your account history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {unusualActivity.map((act) => (
                  <div 
                    key={act.id} 
                    className="border border-border/40 bg-background/40 hover:bg-muted/10 p-4 rounded-xl transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-foreground">Transfer anomaly to {act.recipient}</span>
                          <span className="text-[9px] bg-red-500/15 text-red-500 px-1.5 py-0.5 rounded font-bold font-mono">
                            Risk {act.riskScore}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{act.reason}</p>
                        <span className="text-[9px] text-muted-foreground font-mono mt-1 block">
                          {new Date(act.date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className="text-sm font-bold text-foreground font-mono">
                        -${act.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
