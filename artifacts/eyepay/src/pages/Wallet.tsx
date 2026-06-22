import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  const queryClient = useQueryClient();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositError, setDepositError] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Fetch wallet
  const {
    data: wallet,
    isLoading,
    error: walletLoadError,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.wallets.get,
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: api.wallets.deposit,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setDepositSuccess(true);
      setDepositAmount("");
      setTimeout(() => setDepositSuccess(false), 5000);
    },
    onError: (err: Error) => {
      setDepositError(err.message || "Failed to deposit funds.");
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: api.wallets.withdraw,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setWithdrawSuccess(true);
      setWithdrawAmount("");
      setTimeout(() => setWithdrawSuccess(false), 5000);
    },
    onError: (err: Error) => {
      setWithdrawError(err.message || "Failed to withdraw funds.");
    },
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    setDepositSuccess(false);

    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setDepositError("Please enter a valid positive amount.");
      return;
    }

    depositMutation.mutate({ amount: amountNum });
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(false);

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError("Please enter a valid positive amount.");
      return;
    }

    const currentBalance = parseFloat(wallet?.balance || "0.00");
    if (amountNum > currentBalance) {
      setWithdrawError("Insufficient wallet balance.");
      return;
    }

    withdrawMutation.mutate({ amount: amountNum });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (walletLoadError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-foreground">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-6 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Error Loading Wallet</h2>
          <p className="text-sm">{walletLoadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 relative z-10 text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">My Wallet</h1>
        <p className="text-muted-foreground text-sm">Add or withdraw funds to make transfers instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Balance card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-primary to-blue-700 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between min-h-[220px] border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-80 uppercase tracking-wider">Account Balance</span>
            <WalletIcon className="h-6 w-6 opacity-75" />
          </div>
          <div>
            <div className="text-5xl font-black mb-1 font-mono">
              ${parseFloat(wallet?.balance || "0.00").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs opacity-75">{wallet?.currency || "USD"} Base Currency</div>
          </div>
          <div className="text-[10px] bg-white/20 px-3 py-1 rounded-full w-fit uppercase font-bold tracking-wider font-mono">
            Active Account
          </div>
        </div>

        {/* Action Panel: Deposit & Withdraw */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Deposit panel */}
          <div className="border border-border/50 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
                <h2 className="font-extrabold text-lg text-foreground">Deposit Funds</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-normal">
                Top up your wallet balance instantly. Credit cards, debit cards, and bank transfers supported.
              </p>

              <form onSubmit={handleDeposit} className="space-y-4">
                {depositError && (
                  <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 text-xs p-2.5 rounded-xl animate-shake" data-testid="deposit-error">
                    {depositError}
                  </div>
                )}
                {depositSuccess && (
                  <div className="bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/60 text-xs p-2.5 rounded-xl" data-testid="deposit-success">
                    Funds deposited successfully!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Amount (USD)</label>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                    <span className="pl-3 text-muted-foreground text-sm font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 py-2.5 px-2 text-sm focus:outline-none font-bold bg-transparent text-foreground"
                      data-testid="input-deposit-amount"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={depositMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 font-bold border-none"
                  data-testid="button-deposit-submit"
                >
                  {depositMutation.isPending ? "Processing..." : "Confirm Deposit"}
                </Button>
              </form>
            </div>
          </div>

          {/* Withdraw panel */}
          <div className="border border-border/50 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ArrowUpCircle className="h-5 w-5" />
                </div>
                <h2 className="font-extrabold text-lg text-foreground">Withdraw Funds</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-normal">
                Transfer money out of your wallet back to your linked bank account or card.
              </p>

              <form onSubmit={handleWithdraw} className="space-y-4">
                {withdrawError && (
                  <div className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 text-xs p-2.5 rounded-xl animate-shake" data-testid="withdraw-error">
                    {withdrawError}
                  </div>
                )}
                {withdrawSuccess && (
                  <div className="bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/60 text-xs p-2.5 rounded-xl" data-testid="withdraw-success">
                    Withdrawal completed successfully!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Amount (USD)</label>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                    <span className="pl-3 text-muted-foreground text-sm font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 py-2.5 px-2 text-sm focus:outline-none font-bold bg-transparent text-foreground"
                      data-testid="input-withdraw-amount"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={withdrawMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 font-bold border-none"
                  data-testid="button-withdraw-submit"
                >
                  {withdrawMutation.isPending ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
