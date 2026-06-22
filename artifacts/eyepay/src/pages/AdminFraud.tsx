import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type FraudAlert } from "../lib/api";
import { CheckCircle, XCircle, AlertTriangle, Shield, ShieldAlert, User, Globe, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";

export default function AdminFraud() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch flagged fraud alerts
  const {
    data: alerts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fraudAlerts"],
    queryFn: api.admin.listFraudAlerts,
  });

  // Action mutation (approve/reject)
  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: "approve" | "reject" }) =>
      api.admin.actionFraudAlert(id, action),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["fraudAlerts"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast({
        title: `Transaction ${data.status === "approved" ? "Approved" : "Rejected"}`,
        description: `Alert ID #${data.id} resolved successfully.`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Action Failed",
        description: err.message || "An error occurred while resolving the alert.",
        variant: "destructive",
      });
    },
  });

  const handleAction = (id: number, action: "approve" | "reject") => {
    actionMutation.mutate({ id, action });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-foreground">
        <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 p-6 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Error Loading Control Room</h2>
          <p className="text-sm">{(error as Error).message}</p>
          <Button onClick={() => void refetch()} className="mt-4 font-semibold">Retry</Button>
        </div>
      </div>
    );
  }

  const pendingCount = alerts.filter(a => a.status === "pending").length;
  const approvedCount = alerts.filter(a => a.status === "approved").length;
  const rejectedCount = alerts.filter(a => a.status === "rejected").length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 relative z-10 text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Fraud Detection Control Room</h1>
          <p className="text-muted-foreground text-sm">Monitor flagged high-risk transactions, review AI risk vectors, and approve or reject transfers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()} className="flex items-center gap-1.5 font-semibold w-fit">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh List
        </Button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-4 border border-border/40 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase font-mono mb-1">Total Flagged</div>
          <div className="text-2xl font-black">{alerts.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-amber-500/20 text-center bg-amber-500/5">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase font-mono mb-1">Pending Review</div>
          <div className="text-2xl font-black text-amber-500">{pendingCount}</div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-green-500/20 text-center bg-green-500/5">
          <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase font-mono mb-1">Approved</div>
          <div className="text-2xl font-black text-green-500">{approvedCount}</div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-red-500/20 text-center bg-red-500/5">
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase font-mono mb-1">Rejected & Refunded</div>
          <div className="text-2xl font-black text-red-500">{rejectedCount}</div>
        </div>
      </div>

      {/* Main Alerts List */}
      {alerts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-border/40 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Fraud Alerts Logged</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            All system transactions are currently classified as low risk. Any transactions scoring &ge; 70 risk points will populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => {
            let reasonsList: string[] = [];
            try {
              reasonsList = JSON.parse(alert.reasons);
            } catch (e) {
              reasonsList = [alert.reasons];
            }

            return (
              <div
                key={alert.id}
                className={`glass-card rounded-3xl border p-6 transition-all duration-300 ${
                  alert.status === "pending"
                    ? "border-amber-500/30 hover:border-amber-500/50 bg-amber-500/[0.02]"
                    : alert.status === "approved"
                    ? "border-green-500/20 hover:border-green-500/30 bg-green-500/[0.01]"
                    : "border-red-500/20 hover:border-red-500/30 bg-red-500/[0.01]"
                }`}
                data-testid={`alert-card-${alert.id}`}
              >
                {/* Top Row: Info and badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${
                      alert.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                      alert.status === "approved" ? "bg-green-500/10 text-green-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-foreground">Alert ID: #{alert.id}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                        <Calendar className="h-3 w-3" /> {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                      alert.status === "pending" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                      alert.status === "approved" ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400" :
                      "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                    }`}>
                      {alert.status}
                    </span>

                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 font-mono">
                      Risk Score: {alert.riskScore}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sender & Transaction Info */}
                  <div className="space-y-3 md:border-r md:border-border/30 md:pr-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">Sender Account</div>
                        <div className="font-bold text-sm">{alert.user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{alert.user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">Destination Country</div>
                        <div className="font-bold text-sm">{alert.transaction.destinationCountry || "US"}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono mb-0.5">Amount Flagged</div>
                      <div className="text-lg font-black font-mono text-foreground">${parseFloat(alert.transaction.amount).toFixed(2)} USD</div>
                    </div>
                  </div>

                  {/* AI Risk Reasonings */}
                  <div className="md:col-span-2 flex flex-col justify-between h-full">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono mb-2">AI Risk Diagnostics</div>
                      <ul className="space-y-2">
                        {reasonsList.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-foreground bg-muted/20 p-2 rounded-xl border border-border/30">
                            <span className="text-red-500 font-black font-mono">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action buttons (only if alert is pending) */}
                    {alert.status === "pending" && (
                      <div className="flex gap-3 mt-6 pt-4 border-t border-border/30 sm:justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(alert.id, "reject")}
                          disabled={actionMutation.isPending}
                          className="flex items-center gap-1.5 border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold px-4 py-2 hover:border-red-500/40 rounded-xl"
                        >
                          <XCircle className="h-4 w-4" /> Reject &amp; Refund
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAction(alert.id, "approve")}
                          disabled={actionMutation.isPending}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-xl"
                        >
                          <CheckCircle className="h-4 w-4" /> Approve Transfer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
