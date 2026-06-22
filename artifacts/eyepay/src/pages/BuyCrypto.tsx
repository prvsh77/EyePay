import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Headphones, RefreshCw, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { useLocation, Link } from "wouter";
import { api } from "../lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const popularCoins = [
  { name: "Bitcoin", symbol: "BTC", price: 65847.18, change: "+0.08%", up: true, color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", price: 3492.21, change: "+1.12%", up: true, color: "#627EEA" },
  { name: "Tether", symbol: "USDT", price: 1.00, change: "+0.01%", up: true, color: "#26A17B" },
  { name: "BNB", symbol: "BNB", price: 604.08, change: "+0.61%", up: true, color: "#F3BA2F" },
  { name: "Solana", symbol: "SOL", price: 142.36, change: "+2.35%", up: true, color: "#9945FF" },
];

const conversions = [
  { from: "BTC", to: "USD", fromColor: "#F7931A", toColor: "#27AE60", rate: "1 BTC = $65,847.18 USD" },
  { from: "BTC", to: "EUR", fromColor: "#F7931A", toColor: "#3498DB", rate: "1 BTC = €57,017.08" },
  { from: "BTC", to: "TRY", fromColor: "#F7931A", toColor: "#E74C3C", rate: "1 BTC = ₺3,049,383.13" },
  { from: "BTC", to: "GBP", fromColor: "#F7931A", toColor: "#9B59B6", rate: "1 BTC = £49,312.52" },
  { from: "BTC", to: "AUD", fromColor: "#F7931A", toColor: "#27AE60", rate: "1 BTC = A$93,500.00" },
  { from: "BTC", to: "JPY", fromColor: "#F7931A", toColor: "#E74C3C", rate: "1 BTC = ¥9,873,451.22" },
  { from: "BTC", to: "INR", fromColor: "#F7931A", toColor: "#F39C12", rate: "1 BTC = ₹6,225,192.86" },
  { from: "BTC", to: "BRL", fromColor: "#F7931A", toColor: "#27AE60", rate: "1 BTC = R$334,503.70" },
  { from: "BTC", to: "RUB", fromColor: "#F7931A", toColor: "#E74C3C", rate: "1 BTC = ₽4,802,235.19" },
];

const faqs = [
  ["How do I buy crypto with USD online?", "You can buy crypto with USD by creating an account, verifying your identity, adding a payment method, and placing your order."],
  ["What payment methods are supported?", "EyePay supports credit/debit cards, bank transfers, Apple Pay, Google Pay, and more."],
  ["How long does it take to receive my crypto?", "Most purchases are instant. Bank transfers may take 1-3 business days."],
  ["Are there any fees when buying crypto?", "Fees vary by payment method. Credit/debit cards typically have a 1.8% fee; bank transfers are lower."],
  ["Can I buy crypto without verification?", "Some methods allow small purchases without KYC, but full verification unlocks higher limits."],
  ["What is the minimum amount I can buy?", "The minimum purchase is typically $10, but it varies by cryptocurrency and payment method."],
];

const conversionTable = [
  { amount: "0.01 BTC", usd: "$658.47" },
  { amount: "0.1 BTC", usd: "$6,584.72" },
  { amount: "1 BTC", usd: "$65,847.18" },
  { amount: "10 BTC", usd: "$658,471.80" },
  { amount: "50 BTC", usd: "$3,292,359.00" },
  { amount: "100 BTC", usd: "$6,584,718.00" },
];

import { CryptoLogo } from "../components/CryptoLogo";

function CoinDot({ symbol, name, color }: { symbol: string; name?: string; color: string }) {
  return <CryptoLogo symbol={symbol} name={name} color={color} className="w-7 h-7" />;
}

function MiniChart({ up }: { up: boolean }) {
  const points = up
    ? "0,20 10,18 20,15 30,16 40,12 50,10 60,8"
    : "0,8 10,10 20,12 30,10 40,14 50,16 60,18";
  return (
    <svg width="60" height="28" viewBox="0 0 60 28">
      <polyline points={points} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BuyCrypto() {
  const [tab, setTab] = useState<"buy" | "sell" | "convert">("buy");
  const [amount, setAmount] = useState("100");
  const [selectedCoin, setSelectedCoin] = useState(popularCoins[0]);
  const [loading, setLoading] = useState(false);
  
  const { user, wallet, refreshWallet } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Read URL params if loaded with specific coin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const coinSymbol = params.get("coin");
    if (coinSymbol) {
      const match = popularCoins.find(c => c.symbol.toUpperCase() === coinSymbol.toUpperCase());
      if (match) setSelectedCoin(match);
    }
  }, []);

  const rate = selectedCoin.price;
  const numAmount = parseFloat(amount) || 0;
  
  const estBtc = tab === "buy" 
    ? (numAmount / rate).toFixed(6)
    : tab === "sell"
    ? (numAmount * rate).toFixed(2)
    : (numAmount / rate).toFixed(6);

  const handleTransaction = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to complete your transaction.",
      });
      setLocation("/login");
      return;
    }

    if (numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a value greater than 0.",
      });
      return;
    }

    setLoading(true);
    try {
      if (tab === "buy") {
        // Simulate credit card purchase: call deposit USD into user's wallet
        await api.wallets.deposit({ amount: numAmount });
        await refreshWallet();
        toast({
          title: "Purchase Successful",
          description: `You bought ${estBtc} ${selectedCoin.symbol} for $${numAmount} USD! Funds loaded to sandbox wallet.`,
        });
      } else if (tab === "sell") {
        // Simulate sell: withdraw USD equivalent from wallet
        const usdEquivalent = numAmount * rate;
        if (wallet && parseFloat(wallet.balance) < usdEquivalent) {
          throw new Error("Insufficient sandbox wallet balance to sell this amount of crypto.");
        }
        await api.wallets.withdraw({ amount: usdEquivalent });
        await refreshWallet();
        toast({
          title: "Sale Successful",
          description: `You sold ${numAmount} ${selectedCoin.symbol} for $${usdEquivalent.toFixed(2)} USD!`,
        });
      } else {
        // Convert
        toast({
          title: "Conversion Completed",
          description: `Successfully converted ${amount} USD equivalent to ${estBtc} ${selectedCoin.symbol}!`,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: err.message || "Failed to process sandbox transaction.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Buy Crypto<br />in Seconds</h1>
            <p className="text-muted-foreground mb-6 text-lg">Secure, fast and simple way to buy Bitcoin and 200+ cryptocurrencies.</p>
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: <Shield className="w-5 h-5 text-primary" />, label: "Secure Transactions" },
                { icon: <Zap className="w-5 h-5 text-primary" />, label: "Instant Delivery" },
                { icon: <Headphones className="w-5 h-5 text-primary" />, label: "24/7 Support" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium">
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="glass-card rounded-3xl shadow-xl p-6 w-72">
              <div className="text-sm font-bold text-primary mb-3">EyePay — Buy Crypto</div>
              <div className="text-xs text-muted-foreground mb-1">You spend</div>
              <div className="text-3xl font-extrabold mb-1">100 <span className="text-lg font-semibold text-muted-foreground">USD</span></div>
              <div className="text-xs text-muted-foreground mb-1 mt-3">You get</div>
              <div className="text-2xl font-bold">0.001524 <span className="text-base font-semibold text-muted-foreground">BTC</span></div>
              <Button onClick={() => { setAmount("100"); handleTransaction(); }} className="w-full mt-5 font-semibold">Buy BTC</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Buy/Sell/Convert + Popular */}
      <section className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/50">
          <div className="flex border-b border-border/50 mb-5">
            {(["buy", "sell", "convert"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`capitalize px-5 py-2 text-sm font-semibold transition-colors ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                data-testid={`tab-${t}`}
              >{t}</button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium">
                {tab === "buy" ? "You spend" : tab === "sell" ? "You sell" : "Convert from"}
              </label>
              <div className="flex mt-1 border border-border/80 rounded-xl overflow-hidden bg-background/50">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 px-4 py-3 text-2xl font-bold focus:outline-none bg-transparent text-foreground"
                  data-testid="input-spend-amount"
                />
                <div className="flex items-center gap-1 px-4 bg-muted/30 border-l border-border text-sm font-semibold">
                  <CryptoLogo symbol={tab === "sell" ? selectedCoin.symbol : "USD"} name={tab === "sell" ? selectedCoin.name : "US Dollar"} color={tab === "sell" ? selectedCoin.color : "#27AE60"} className="w-5 h-5 mr-1" /> {tab === "sell" ? selectedCoin.symbol : "USD"}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">
                {tab === "buy" ? "You get (est.)" : tab === "sell" ? "You receive (est.)" : "Convert to (est.)"}
              </label>
              <div className="flex mt-1 border border-border/80 rounded-xl overflow-hidden bg-muted/20">
                <div className="flex-1 px-4 py-3 text-2xl font-bold text-foreground/80">{estBtc}</div>
                <div className="flex items-center gap-1 px-4 border-l border-border text-sm font-semibold bg-muted/30">
                  <CryptoLogo symbol={tab === "sell" ? "USD" : selectedCoin.symbol} name={tab === "sell" ? "US Dollar" : selectedCoin.name} color={tab === "sell" ? "#27AE60" : selectedCoin.color} className="w-5 h-5" />
                  <span className="ml-1 text-foreground">{tab === "sell" ? "USD" : selectedCoin.symbol}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
                <span>1 {selectedCoin.symbol} = ${rate.toLocaleString()} USD</span>
                <button onClick={() => toast({ title: "Rate Updated", description: "Rates refreshed with global index." })} className="text-primary flex items-center gap-1 hover:underline">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
            
            {user && wallet && (
              <div className="text-xs bg-primary/5 rounded-lg p-2.5 flex items-center gap-2 border border-primary/20 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Connected Sandbox Balance: <strong>${parseFloat(wallet.balance).toFixed(2)} USD</strong></span>
              </div>
            )}

            <Button
              onClick={handleTransaction}
              disabled={loading}
              className="w-full py-3 text-base font-bold"
              data-testid="button-buy-btc"
            >
              {loading ? "Processing..." : tab === "buy" ? `Buy ${selectedCoin.symbol}` : tab === "sell" ? `Sell ${selectedCoin.symbol}` : "Convert Asset"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Secure payments powered by EyePay Escrow</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-foreground">Popular Cryptocurrencies</h3>
            <Link href="/markets" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="space-y-1">
            {popularCoins.map((coin) => (
              <div
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin)}
                className={`flex items-center px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer ${selectedCoin.symbol === coin.symbol ? "bg-muted/30 border border-primary/20" : ""}`}
                data-testid={`coin-row-${coin.symbol}`}
              >
                <CoinDot symbol={coin.symbol} name={coin.name} color={coin.color} />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-sm text-foreground">{coin.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{coin.symbol}</div>
                </div>
                <div className="mr-6">
                  <MiniChart up={coin.up} />
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-foreground">${coin.price.toLocaleString()}</div>
                  <div className={`text-xs font-medium ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular BTC Conversions */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">Popular Bitcoin Conversions</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Fiat Matrix", description: "Loading global fiat indices..." }); }} className="text-sm text-primary hover:underline font-medium">View all conversions</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversions.map((c, i) => (
            <div
              key={i}
              onClick={() => {
                const match = popularCoins.find(pc => pc.symbol === c.from);
                if (match) {
                  setSelectedCoin(match);
                  toast({ title: "Asset Selected", description: `Active conversion set to ${c.from} -> ${c.to}` });
                }
              }}
              className="flex items-center gap-3 border border-border/50 rounded-xl p-4 hover:shadow-sm hover:bg-muted/20 transition-all cursor-pointer"
              data-testid={`conversion-${c.from}-${c.to}`}
            >
              <div className="flex -space-x-2">
                <CryptoLogo symbol={c.from} color={c.fromColor} className="w-8 h-8" />
                <CryptoLogo symbol={c.to} color={c.toColor} className="w-8 h-8" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{c.from} to {c.to}</div>
                <div className="text-xs text-muted-foreground font-mono">{c.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bitcoin Markets + Conversion Table */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-border/50 rounded-2xl p-6 bg-background/30 backdrop-blur">
          <h3 className="font-bold text-xl mb-4 text-foreground">Bitcoin Markets</h3>
          <div className="flex items-start gap-4 mb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F7931A] inline-block animate-pulse" />
                <span className="font-semibold text-foreground">BTC/USD</span>
              </div>
              <div className="text-2xl font-extrabold mt-1 text-foreground">$65,847.18</div>
              <div className="text-green-500 text-sm font-medium">+0.08% (24h)</div>
            </div>
            <div className="flex gap-6 ml-auto text-sm flex-wrap">
              {[
                { label: "Market Cap", value: "$1.32T" },
                { label: "Volume", value: "$27.46B" },
                { label: "Circulating", value: "20.04M BTC" },
                { label: "Dominance", value: "51.28%" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                  <div className="font-bold text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl h-28 flex items-end px-4 pb-2 relative overflow-hidden">
            <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
              <polyline points="0,60 40,55 80,58 120,50 160,45 200,40 240,42 280,35 320,30 360,28 400,22" fill="none" stroke="#1E63FF" strokeWidth="2" />
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E63FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1E63FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points="0,60 40,55 80,58 120,50 160,45 200,40 240,42 280,35 320,30 360,28 400,22 400,80 0,80" fill="url(#chartGrad)" />
            </svg>
          </div>
        </div>
        <div className="border border-border/50 rounded-2xl p-6 bg-background/30 backdrop-blur">
          <div className="flex gap-3 mb-4">
            <button className="flex-1 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-lg border border-primary/20" data-testid="tab-btc-to-usd">BTC to USD</button>
            <button onClick={() => toast({ title: "Inversion Layer", description: "Tables inverted to USD to BTC." })} className="flex-1 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/40 rounded-lg" data-testid="tab-usd-to-btc">USD to BTC</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border/50">
                <th className="text-left pb-2">Amount</th>
                <th className="text-right pb-2">USD</th>
              </tr>
            </thead>
            <tbody>
              {conversionTable.map((row, i) => (
                <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30" data-testid={`conversion-row-${i}`}>
                  <td className="py-2.5 font-medium text-foreground">{row.amount}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{row.usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Matrix Loaded", description: "Global indices rendering in background." }); }} className="block text-center text-xs text-primary mt-3 hover:underline font-medium">View full conversion table</a>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl text-foreground">FAQs around Buying Crypto</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Support Hub", description: "Loading KYC requirements, limits, and region coverage..." }); }} className="text-sm text-primary hover:underline font-medium">View all FAQs</a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map(([q, a], i) => (
            <Accordion type="single" collapsible key={i}>
              <AccordionItem value={`faq-${i}`} className="border border-border/50 rounded-xl px-4 bg-background/20">
                <AccordionTrigger className="text-sm font-medium text-left text-foreground hover:text-primary" data-testid={`faq-${i}`}>{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </section>

      {/* Security CTA */}
      <section className="bg-muted/30 dark:bg-muted/5 border-t border-border/40 py-8">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <div className="font-bold text-foreground">Your security is our priority</div>
              <div className="text-sm text-muted-foreground">All transactions are encrypted and 100% secure</div>
            </div>
          </div>
          <Button onClick={() => { setAmount("500"); handleTransaction(); }} className="px-8 font-bold" data-testid="button-start-buying">Start Buying Now</Button>
        </div>
      </section>
    </div>
  );
}
