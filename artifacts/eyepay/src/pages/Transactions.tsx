import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Send, ArrowDownRight, ArrowUpRight, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";

export default function Transactions() {
  const queryClient = useQueryClient();
  const [recipientId, setRecipientId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [description, setDescription] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("US");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const { toast } = useToast();

  // Fetch wallet
  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.wallets.get,
  });

  // Fetch recipients for dropdown
  const { data: recipients = [] } = useQuery({
    queryKey: ["recipients"],
    queryFn: api.recipients.list,
  });

  // Fetch transactions
  const {
    data: transactions = [],
    isLoading,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.transactions.list,
  });

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: api.transactions.transfer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Funds Transferred", description: `Successfully processed transaction.` });
      setTransferSuccess(true);
      setRecipientId("");
      setTransferAmount("");
      setDescription("");
      setDestinationCountry("US");
      setTimeout(() => setTransferSuccess(false), 5000);
    },
    onError: (err: Error) => {
      setTransferError(err.message || "Transfer failed.");
    },
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    setTransferSuccess(false);

    if (!recipientId) {
      setTransferError("Please select a recipient.");
      return;
    }

    const amountNum = parseFloat(transferAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferError("Please enter a valid positive amount.");
      return;
    }

    const currentBalance = parseFloat(wallet?.balance || "0.00");
    if (amountNum > currentBalance) {
      setTransferError("Insufficient balance in your wallet.");
      return;
    }

    transferMutation.mutate({
      recipientId: Number(recipientId),
      amount: amountNum,
      description: description.trim() || undefined,
      destinationCountry,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-foreground">
        <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 p-6 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Error Loading Transactions</h2>
          <p className="text-sm">{loadError.message}</p>
          <Button onClick={() => void refetch()} className="mt-4 font-semibold">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 relative z-10 text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Transactions</h1>
        <p className="text-muted-foreground text-sm">Send funds to recipients or view your past transaction logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Send Money Card */}
        <div className="lg:col-span-1 border border-border/50 glass-card rounded-3xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-lg">Send Money</h2>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            {transferError && (
              <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 text-xs p-2.5 rounded-xl animate-shake" data-testid="transfer-error">
                {transferError}
              </div>
            )}
            {transferSuccess && (
              <div className="bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/60 text-xs p-2.5 rounded-xl" data-testid="transfer-success">
                Transfer request submitted!
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase font-mono">Select Recipient</label>
              {recipients.length === 0 ? (
                <div className="text-xs text-yellow-800 dark:text-yellow-200 py-2 bg-yellow-100 dark:bg-yellow-950/40 p-2.5 border border-yellow-200 dark:border-yellow-900/50 rounded-xl leading-normal">
                  No saved recipients. Please add one in <a href="/recipients" className="text-primary hover:underline font-bold">Recipients tab</a>.
                </div>
              ) : (
                <select
                  value={recipientId}
                  onChange={e => setRecipientId(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground cursor-pointer font-semibold dark:bg-slate-900"
                  data-testid="select-recipient"
                  required
                >
                  <option value="" className="dark:bg-slate-950">Choose contact...</option>
                  {recipients.map(r => (
                    <option key={r.id} value={r.id} className="dark:bg-slate-950">{r.name} ({r.email})</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase font-mono">Destination Country</label>
              <select
                value={destinationCountry}
                onChange={e => setDestinationCountry(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground cursor-pointer font-semibold dark:bg-slate-900"
                data-testid="select-destination-country"
                required
              >
                <option value="US" className="dark:bg-slate-950">United States (US)</option>
                <option value="IN" className="dark:bg-slate-950">India (IN)</option>
                <option value="GB" className="dark:bg-slate-950">United Kingdom (GB)</option>
                <option value="KP" className="dark:bg-slate-950 text-red-500 font-semibold">North Korea (KP) - High Risk</option>
                <option value="IR" className="dark:bg-slate-950 text-red-500 font-semibold">Iran (IR) - High Risk</option>
                <option value="SY" className="dark:bg-slate-950 text-red-500 font-semibold">Syria (SY) - High Risk</option>
                <option value="RU" className="dark:bg-slate-950 text-red-500 font-semibold">Russia (RU) - High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase font-mono">Amount (USD)</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                <span className="pl-3 text-muted-foreground text-sm font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 py-2.5 px-2 text-sm focus:outline-none font-bold bg-transparent text-foreground"
                  data-testid="input-transfer-amount"
                  required
                />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1.5 font-mono">
                Balance: ${parseFloat(wallet?.balance || "0.00").toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase font-mono">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Rent, dinner, gift..."
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground"
                data-testid="input-transfer-desc"
              />
            </div>

            <Button
              type="submit"
              disabled={transferMutation.isPending || recipients.length === 0}
              className="w-full font-bold border-none text-white bg-primary hover:bg-primary/95"
              data-testid="button-transfer-submit"
            >
              {transferMutation.isPending ? "Sending..." : "Send Funds"}
            </Button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transaction History</h2>
            <Button variant="ghost" size="sm" onClick={() => void refetch()} className="flex items-center gap-1.5 font-semibold">
              <RefreshCw className="h-3.5 w-3.5" /> Reload
            </Button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl bg-muted/10">
              <p className="text-muted-foreground text-sm">No transaction records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                    <th className="pb-3 pl-4 pt-2">Type</th>
                    <th className="pb-3 pt-2">Details</th>
                    <th className="pb-3 pt-2">Date</th>
                    <th className="pb-3 text-right pr-4 pt-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {transactions.map((tx) => {
                    const isIncome = tx.type === "deposit" || tx.type === "receive";
                    return (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors" data-testid={`tx-${tx.id}`}>
                        <td className="py-3 flex items-center gap-2 pl-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? "bg-green-100 dark:bg-green-950/40 text-green-600" : "bg-red-100 dark:bg-red-950/40 text-red-600"}`}>
                            {isIncome ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <span className="font-bold capitalize text-foreground">{tx.type}</span>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                          {tx.description || "No description"}
                          {tx.destinationCountry && ` (${tx.destinationCountry})`}
                        </td>
                        <td className="py-3 text-muted-foreground text-xs font-mono">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right pr-4">
                          <div className={`font-bold font-mono ${isIncome ? "text-green-500" : "text-foreground"}`}>
                            {isIncome ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                          </div>
                          <div className="flex flex-col items-end gap-1 mt-1">
                            <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full inline-block ${
                              tx.status === "completed" ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400" :
                              tx.status === "pending" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                              "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                            }`}>
                              {tx.status}
                            </span>
                            {!isIncome && tx.riskScore !== undefined && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border inline-block font-mono ${
                                tx.riskScore < 30 ? "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5" :
                                tx.riskScore < 70 ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5" :
                                "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5"
                              }`}>
                                Score: {tx.riskScore}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
