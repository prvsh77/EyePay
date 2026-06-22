import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "../lib/api";
import { useAuth } from "../hooks/use-auth";
import { Wallet as WalletIcon, Send, ArrowDownRight, ArrowUpRight, PlusCircle, MinusCircle, Users, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch wallet details
  const {
    data: wallet,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.wallets.get,
  });

  // Fetch transactions history
  const {
    data: transactions,
    isLoading: isTxLoading,
    error: txError,
    refetch: refetchTxs,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.transactions.list,
  });

  const isLoading = isWalletLoading || isTxLoading;
  const hasError = walletError || txError;

  const handleRefresh = async () => {
    await Promise.all([refetchWallet(), refetchTxs()]);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-foreground">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-6 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm mb-4">{(walletError as Error)?.message || (txError as Error)?.message || "Something went wrong."}</p>
          <Button onClick={handleRefresh} className="font-semibold">Retry</Button>
        </div>
      </div>
    );
  }

  const recentTxs = transactions?.slice(0, 5) || [];
  const pendingTxs = transactions?.filter(tx => tx.status === "pending") || [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 relative z-10 text-foreground">
      {/* Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user?.name}. Manage your finances and assets securely.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1.5 font-semibold w-fit">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
        </Button>
      </div>

      {/* Security Alerts Banner */}
      {pendingTxs.length > 0 && (
        <div className="mb-8 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-5 rounded-3xl flex items-start gap-4 bg-amber-500/10 backdrop-blur-md">
          <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">Transfer Under Security Review</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We flagged {pendingTxs.length} transaction(s) due to elevated risk scores. These transfers are temporarily pending verification by administrators.
            </p>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet Balance Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-primary to-blue-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-primary/20">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
            <WalletIcon className="w-48 h-48" />
          </div>
          <div>
            <div className="flex items-center gap-2 opacity-80 text-xs font-semibold uppercase tracking-wider mb-1">
              <WalletIcon className="h-4 w-4" /> Available Balance
            </div>
            <div className="text-4xl font-black mb-1 font-mono">
              ${parseFloat(wallet?.balance || "0.00").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs opacity-75">{wallet?.currency || "USD"} Base Account</div>
          </div>
          <div className="flex gap-2.5 mt-6 z-10">
            <Link href="/wallet" className="flex-1">
              <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl border-none">
                <PlusCircle className="h-4 w-4" /> Deposit
              </Button>
            </Link>
            <Link href="/wallet" className="flex-1">
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 font-bold text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl">
                <MinusCircle className="h-4 w-4" /> Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link href="/transactions">
            <div className="border border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-background/40 dark:bg-slate-900/40 backdrop-blur group h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Send className="h-6 w-6" />
              </div>
              <div className="font-bold text-sm">Send Money</div>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">Transfer funds to contacts</p>
            </div>
          </Link>

          <Link href="/recipients">
            <div className="border border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-background/40 dark:bg-slate-900/40 backdrop-blur group h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <div className="font-bold text-sm">Manage Recipients</div>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">Add or edit contacts</p>
            </div>
          </Link>

          <Link href="/transactions">
            <div className="border border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-background/40 dark:bg-slate-900/40 backdrop-blur group h-full col-span-2 sm:col-span-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <WalletIcon className="h-6 w-6" />
              </div>
              <div className="font-bold text-sm">History</div>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">View transaction logs</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="mt-12 glass-card rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm text-primary hover:underline font-semibold">View All History</Link>
        </div>

        {recentTxs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border/40 rounded-2xl bg-muted/10">
            <p className="text-muted-foreground text-sm mb-2">No transactions recorded yet.</p>
            <Link href="/wallet">
              <Button size="sm" className="font-semibold text-xs mt-2">Fund Your Account</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {recentTxs.map((tx) => {
              const isIncome = tx.type === "deposit" || tx.type === "receive";
              return (
                <div key={tx.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0" data-testid={`tx-${tx.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? "bg-green-100 dark:bg-green-950/40 text-green-600" : "bg-red-100 dark:bg-red-950/40 text-red-600"}`}>
                      {isIncome ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm capitalize text-foreground">{tx.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.description || `Transaction ref: #${tx.id}`} • {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className={`font-bold text-sm font-mono ${isIncome ? "text-green-500" : "text-foreground"}`}>
                      {isIncome ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block uppercase tracking-wide font-mono ${
                        tx.status === "completed" ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400" :
                        tx.status === "pending" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                        "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                      }`}>
                        {tx.status}
                      </div>
                      {!isIncome && tx.riskScore !== undefined && (
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border inline-block font-mono ${
                          tx.riskScore < 30 ? "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5" :
                          tx.riskScore < 70 ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5" :
                          "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5"
                        }`}>
                          Score: {tx.riskScore}
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
    </div>
  );
}
