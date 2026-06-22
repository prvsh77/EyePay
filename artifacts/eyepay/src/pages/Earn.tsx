import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronRight, X, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/use-auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CryptoLogo } from "../components/CryptoLogo";

const flexibleProducts = [
  { symbol: "USDC", color: "#2775CA", apr: 6.34, type: "Flexible" },
  { symbol: "USDT", color: "#26A17B", apr: 5.14, type: "Flexible" },
  { symbol: "BNB", color: "#F3BA2F", apr: 8.56, type: "Flexible" },
  { symbol: "BTC", color: "#F7931A", apr: 3.12, type: "Flexible" },
];

const popularProducts = [
  { symbol: "USDC", color: "#2775CA", aprRange: "3.36% ~ 6.34%", aprValue: 6.34, duration: "Flexible" },
  { symbol: "USDT", color: "#26A17B", aprRange: "2.42% ~ 5.14%", aprValue: 5.14, duration: "Flexible" },
  { symbol: "BNB", color: "#F3BA2F", aprRange: "0.16% ~ 56.58%", aprValue: 12.45, duration: "Flexible / Locked" },
  { symbol: "BTC", color: "#F7931A", aprRange: "0.24% ~ 101.86%", aprValue: 4.12, duration: "Flexible / Locked" },
  { symbol: "ETH", color: "#627EEA", aprRange: "1.26% ~ 219.47%", aprValue: 3.86, duration: "Flexible / Locked" },
  { symbol: "SOL", color: "#9945FF", aprRange: "1.80% ~ 98.31%", aprValue: 5.48, duration: "Flexible / Locked" },
];

const categories = [
  { icon: "🏦", title: "Overview", desc: "One-stop portal for all Earn products" },
  { icon: "💰", title: "Simple Earn", desc: "Earn passive income on 300+ crypto assets with flexible and locked terms" },
  { icon: "📈", title: "Advanced Earn", desc: "Maximize your returns with our advanced yield investment products" },
  { icon: "🏠", title: "Loans", desc: "Access quick and easy loans with our competitive rates" },
];

const faqs = [
  ["What is EyePay Earn?", "EyePay Earn is a one-stop portal for earning interest on your idle cryptocurrencies. You can opt for Flexible terms to withdraw anytime or Locked terms for higher yields."],
  ["How does EyePay Earn work?", "You deposit supported cryptocurrencies and earn compounding interest based on the product type and duration you select."],
  ["Which cryptocurrencies are supported?", "EyePay Earn supports 300+ cryptocurrencies including BTC, ETH, BNB, USDT, USDC, and many more."],
  ["Am I eligible for EyePay Earn?", "Users from eligible regions with verified accounts can participate. Auto-compound rules apply by default."],
];

function CoinDot({ symbol, color }: { symbol: string; color: string }) {
  return <CryptoLogo symbol={symbol} color={color} className="w-7 h-7" />;
}

export default function Earn() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Interactive States
  const [investAmount, setInvestAmount] = useState("1000");
  const [selectedAsset, setSelectedAsset] = useState({ symbol: "USDT", color: "#26A17B", apr: 5.14 });
  const [investDuration, setInvestDuration] = useState("30"); // in days
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [autoSubscribe, setAutoSubscribe] = useState(true);

  // Calculator Math
  const parsedAmount = parseFloat(investAmount) || 0;
  const yearlyRate = selectedAsset.apr / 100;
  const estimatedPayout = (parsedAmount * yearlyRate * (parseInt(investDuration) / 365)).toFixed(4);

  const selectProduct = (asset: { symbol: string, color: string, apr: number }) => {
    setSelectedAsset(asset);
    toast({
      title: "Asset Selected",
      description: `Calculator configured to ${asset.symbol} with default ${asset.apr}% APR.`,
    });
  };

  const handleSubscribe = () => {
    if (parsedAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a collateral yield amount greater than 0.",
      });
      return;
    }
    setShowSubscribeModal(true);
  };

  const handleConfirmSubscription = () => {
    toast({
      title: "Subscription Confirmed",
      description: `Successfully locked $${parsedAmount} ${selectedAsset.symbol} in EyePay Earn yield ledger for ${investDuration} days at ${selectedAsset.apr}% APR.`,
    });
    setShowSubscribeModal(false);
  };

  const filteredPopular = popularProducts.filter(p =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent py-14">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-foreground">Earn Crypto,</h1>
            <h1 className="text-4xl font-extrabold text-primary mb-4">Grow Your Future</h1>
            <p className="text-muted-foreground mb-6">Start earning passive income on 300+ cryptocurrencies with flexible and locked products.</p>
            <div className="flex gap-3">
              <Button onClick={() => selectProduct({ symbol: "USDC", color: "#2775CA", apr: 6.34 })} className="font-semibold" data-testid="button-earn-login">Configure Calculator</Button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 text-white max-w-xs w-full border border-border/40 shadow-xl">
              <div className="text-xs text-blue-300 mb-1 font-semibold tracking-wider">EYEPAY YIELD</div>
              <div className="text-base font-bold">USDe Rewards Are Live</div>
              <p className="text-xs text-gray-300 mt-1">Holding collateral locks up to 10.51% APR.</p>
              <div className="mt-3 flex items-center justify-between">
                <CryptoLogo symbol="USDe" color="#1E63FF" className="w-8 h-8" />
                <div className="text-right">
                  <span className="text-green-400 font-bold font-mono text-sm">+10.51%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible product cards */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {flexibleProducts.map((p, i) => (
            <div
              key={i}
              onClick={() => selectProduct(p)}
              className={`glass-card rounded-xl p-5 hover:shadow-md transition-all cursor-pointer border ${selectedAsset.symbol === p.symbol ? "border-primary bg-primary/5" : "border-border/50"}`}
              data-testid={`earn-product-${p.symbol}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <CoinDot symbol={p.symbol} color={p.color} />
                <span className="font-bold text-foreground font-mono text-sm">{p.symbol}</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">{p.type}</div>
              <div className="text-[10px] text-muted-foreground mb-1">Max. APR</div>
              <div className="text-2xl font-extrabold text-primary font-mono">{p.apr}%</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search coins"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border/80 bg-background/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-44 text-foreground"
              data-testid="input-earn-search"
            />
          </div>
          <button onClick={() => toast({ title: "Filters Applied", description: "Duration indexes filtered." })} className="flex items-center gap-1 px-4 py-2 border border-border/60 rounded-xl text-xs hover:bg-muted text-muted-foreground bg-background/50" data-testid="filter-duration">All Durations <ChevronDown className="w-4 h-4" /></button>
          <button onClick={() => toast({ title: "Filters Applied", description: "All products active." })} className="flex items-center gap-1 px-4 py-2 border border-border/60 rounded-xl text-xs hover:bg-muted text-muted-foreground bg-background/50" data-testid="filter-products">All Products <ChevronDown className="w-4 h-4" /></button>
        </div>

        {/* Popular Products table */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-foreground">Popular Products</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Yield Arena", description: "Loading competitive yield structures..." }); }} className="text-sm text-primary hover:underline font-medium">Yield Arena</a>
          </div>
          <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/20 px-5 py-3 text-xs font-semibold text-muted-foreground border-b border-border/50">
              <div>Coins</div>
              <div className="text-right">Est. APR</div>
              <div className="text-right">Duration</div>
            </div>
            {filteredPopular.map((p, i) => (
              <div
                key={i}
                onClick={() => selectProduct({ symbol: p.symbol, color: p.color, apr: p.aprValue })}
                className={`grid grid-cols-3 items-center px-5 py-3.5 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${selectedAsset.symbol === p.symbol ? "bg-muted/20 font-bold" : ""}`}
                data-testid={`popular-product-${p.symbol}`}
              >
                <div className="flex items-center gap-2.5">
                  <CoinDot symbol={p.symbol} color={p.color} />
                  <span className="font-semibold text-sm text-foreground font-mono">{p.symbol}</span>
                </div>
                <div className="text-right text-green-500 font-semibold text-sm font-mono">{p.aprRange}</div>
                <div className="text-right flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  {p.duration} <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="glass-card rounded-2xl p-6 border border-border/50 shadow-md">
          <h3 className="font-bold text-xl mb-5 text-foreground">Calculate your crypto earnings</h3>
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <span className="text-muted-foreground">I have</span>
            <div className="flex items-center border border-border/80 bg-background/50 rounded-lg overflow-hidden">
              <input
                type="number"
                value={investAmount}
                onChange={e => setInvestAmount(e.target.value)}
                className="w-24 px-3 py-2 focus:outline-none font-bold text-foreground bg-transparent"
                data-testid="input-calc-amount"
              />
              <div className="flex items-center gap-1 px-3 py-2 bg-muted/40 border-l border-border font-semibold text-foreground">
                <CryptoLogo symbol={selectedAsset.symbol} color={selectedAsset.color} className="w-4 h-4" />
                <span className="font-mono text-xs">{selectedAsset.symbol}</span>
              </div>
            </div>
            <span className="text-muted-foreground">and I am interested in</span>
            <div className="flex gap-1">
              {[
                { label: "30 Days", val: "30" },
                { label: "90 Days", val: "90" },
                { label: "365 Days", val: "365" }
              ].map((d) => (
                <button
                  key={d.val}
                  onClick={() => setInvestDuration(d.val)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${investDuration === d.val ? "bg-primary text-white" : "bg-muted/40 text-muted-foreground hover:bg-muted/80"}`}
                  data-testid={`calc-type-${d.val}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <span className="text-muted-foreground">investment.</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Selected Offering Details</div>
              <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
                <div className="font-bold text-foreground">Simple Yield Account</div>
                <div className="text-xs text-muted-foreground">Low Risk escrow collateral</div>
                <div className="text-base font-extrabold text-green-500 mt-1 font-mono">{selectedAsset.apr}% APR</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-2">Principal Protection</div>
                <Button onClick={handleSubscribe} className="mt-3 w-full font-bold" data-testid="button-subscribe-earn">Subscribe Now</Button>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Estimated Compound Payout</div>
              <div className="text-3xl font-extrabold text-green-500 mb-2 font-mono">
                + {estimatedPayout} <span className="text-base text-muted-foreground">{selectedAsset.symbol}</span>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={autoSubscribe} onChange={(e) => setAutoSubscribe(e.target.checked)} className="accent-primary" /> Auto-Compounding</label>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl h-24 flex items-end px-4 pb-2 relative overflow-hidden">
                <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
                  <polygon points="0,55 75,50 150,35 225,20 300,5 300,60 0,60" fill="rgba(30,99,255,0.08)" />
                  <polyline points="0,55 75,50 150,35 225,20 300,5" fill="none" stroke="#1E63FF" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <div key={i} onClick={() => toast({ title: c.title, description: c.desc })} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group" data-testid={`earn-category-${i}`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="font-bold mb-1 text-foreground text-sm">{c.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl text-foreground">Frequently Asked Questions</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Earn FAQs", description: "Loading risk warnings and compound guidelines..." }); }} className="text-sm text-primary hover:underline font-medium">View all FAQs</a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map(([q, a], i) => (
            <Accordion type="single" collapsible key={i}>
              <AccordionItem value={`earn-faq-${i}`} className="border border-border/50 rounded-xl px-4 bg-background/20">
                <AccordionTrigger className="text-sm font-medium text-left text-foreground hover:text-primary" data-testid={`earn-faq-${i}`}>{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6 leading-relaxed">Digital asset prices are volatile. Asset locking in sandbox environment represents virtual escrow parameters and has no financial real-world value.</p>
      </section>

      {/* Subscribe Confirmation Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setShowSubscribeModal(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h3 className="font-bold text-base mb-4 text-foreground">Confirm Yield Subscription</h3>
            
            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Asset Pair</span>
                <span className="font-bold font-mono text-foreground">{selectedAsset.symbol} Simple Earn</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Lock Duration</span>
                <span className="font-bold text-foreground">{investDuration} Days</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Escrow Principal</span>
                <span className="font-bold text-foreground font-mono">{parsedAmount.toLocaleString()} {selectedAsset.symbol}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Accumulated Interest Rate</span>
                <span className="font-bold text-green-500 font-mono">{selectedAsset.apr}% APR</span>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2.5 rounded-lg border border-yellow-200/50 flex gap-2 items-start mt-2">
                <Shield className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-800 dark:text-yellow-200 leading-normal">Virtual Escrow Warning: By confirming, your simulated assets are committed to the EyePay Earn contract for interest compounding. Principal is locked.</p>
              </div>
            </div>

            <Button onClick={handleConfirmSubscription} className="w-full font-bold">Confirm Yield Subscription</Button>
          </div>
        </div>
      )}
    </div>
  );
}
