import { useQuery } from "@tanstack/react-query";
import { api, type AnalyticsData } from "../lib/api";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Activity, 
  Globe, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Shield,
  Layers,
  Inbox
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function Analytics() {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    queryFn: () => api.analytics.get(),
  });

  if (isLoading) {
    return (
      <div className="container max-w-[1400px] mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="glass-card p-8 rounded-2xl border border-border/40 text-center flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Gathering analytics ledger aggregates...</p>
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
          <h3 className="font-bold text-lg text-foreground mb-2">Analytics Load Failed</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {(error as Error)?.message || "An unexpected error occurred while fetching analytics."}
          </p>
          <Button onClick={() => window.location.reload()} className="font-semibold">
            Retry Load
          </Button>
        </div>
      </div>
    );
  }

  const { totalVolume, volumeByType, monthlyTrends, countryDistribution, fraudStats, topRecipients } = data;

  const totalTransactionsCount = volumeByType.reduce((sum, v) => sum + v.count, 0);

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
    } catch {
      return monthStr;
    }
  };

  const mappedTrends = monthlyTrends.map(t => ({
    ...t,
    displayMonth: formatMonth(t.month),
  }));

  const mappedVolumeByType = volumeByType.map(v => ({
    ...v,
    displayName: v.type.charAt(0).toUpperCase() + v.type.slice(1),
  }));

  const hasData = totalVolume > 0;

  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-8 relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">EyePay Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time transaction volumes, history trends, country flows, and compliance fraud audit stats.
        </p>
      </div>

      {!hasData ? (
        <div className="glass-card p-12 text-center border border-border/50 rounded-2xl">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-foreground">No Transactions Recorded Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Make your first deposit, withdraw, or secure recipient transfer to view interactive analytics charts.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => window.location.href = "/wallet"} className="font-semibold">
              Deposit Funds
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/buy-crypto"} className="font-semibold">
              Buy Crypto
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Volume</span>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatCurrency(totalVolume)}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Across {totalTransactionsCount} logged transactions
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Transaction Risk</span>
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {fraudStats.avgRiskScore}/100
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                {fraudStats.avgRiskScore >= 70 ? (
                  <span className="text-red-500 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> High average risk</span>
                ) : fraudStats.avgRiskScore >= 30 ? (
                  <span className="text-yellow-500 flex items-center gap-0.5">Medium average risk</span>
                ) : (
                  <span className="text-green-500 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" /> Low risk profile</span>
                )}
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flagged Fraud Alerts</span>
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {fraudStats.totalFlagged}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {fraudStats.pendingAlertsCount > 0 ? (
                  <span className="text-red-500 font-semibold">{fraudStats.pendingAlertsCount} pending admin review</span>
                ) : (
                  "All triggers actioned or clear"
                )}
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Countries Shared</span>
                <Globe className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {countryDistribution.length}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Unique sovereign destination codes
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-md">
              <h3 className="font-bold text-base text-foreground mb-4">Monthly Transfer Volume Trends</h3>
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mappedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="displayMonth" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(tick) => `$${tick}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), "Volume"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      name="Volume transacted"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Volume breakdown */}
            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-md">
              <h3 className="font-bold text-base text-foreground mb-4">Volume by Transaction Type</h3>
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mappedVolumeByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="displayName" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(tick) => `$${tick}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar 
                      dataKey="totalAmount" 
                      name="Total Transacted Amount" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Country Share */}
            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-md lg:col-span-1 flex flex-col">
              <h3 className="font-bold text-base text-foreground mb-2">Country Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Outward transfer ratio by country.</p>
              
              {countryDistribution.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-xs py-8">
                  No outward transfers to analyze
                </div>
              ) : (
                <>
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryDistribution}
                          dataKey="volume"
                          nameKey="country"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          label
                        >
                          {countryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontFamily: "monospace",
                            fontSize: "12px",
                          }}
                          formatter={(value) => [formatCurrency(Number(value)), "Volume"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2 max-h-[140px] overflow-y-auto">
                    {countryDistribution.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <span 
                            className="w-2.5 h-2.5 rounded-full inline-block" 
                            style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                          />
                          <span>{c.country}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{formatCurrency(c.volume)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Top Recipients */}
            <div className="glass-card p-6 rounded-2xl border border-border/40 shadow-md lg:col-span-2">
              <h3 className="font-bold text-base text-foreground mb-1">Top Recipient Accounts</h3>
              <p className="text-xs text-muted-foreground mb-4">Contacts receiving the largest aggregate volume from your wallet.</p>
              
              {topRecipients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No recipient transfers documented
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase font-semibold">
                        <th className="pb-3">Name / Profile</th>
                        <th className="pb-3 text-right">Transactions</th>
                        <th className="pb-3 text-right">Aggregate Yield Sent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {topRecipients.map((r, i) => (
                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                {r.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-xs">{r.name}</div>
                                <div className="text-[10px] text-muted-foreground font-mono">{r.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-right font-mono text-xs text-foreground">
                            {r.count} times
                          </td>
                          <td className="py-3.5 text-right font-mono text-xs text-green-500 font-bold">
                            {formatCurrency(r.volume)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
