import { Link } from "wouter";
import { Shield, Zap, Globe, Headphones, TrendingUp, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const coins = [
  { name: "Bitcoin", symbol: "BTC", price: "$65,348.00", change: "-0.84%", up: false, color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", price: "$1,765.36", change: "-1.66%", up: false, color: "#627EEA" },
  { name: "BNB", symbol: "BNB", price: "$604.08", change: "-0.56%", up: false, color: "#F3BA2F" },
  { name: "XRP", symbol: "XRP", price: "$1.20", change: "-1.87%", up: false, color: "#00AAE4" },
  { name: "Aster", symbol: "ASTER", price: "$0.729", change: "+10.96%", up: true, color: "#E6007A" },
];

const newCoins = [
  { name: "Solana", symbol: "SOL", price: "$73.43", change: "-0.85%", up: false, color: "#9945FF" },
  { name: "Cardano", symbol: "ADA", price: "$0.45", change: "+2.13%", up: true, color: "#0033AD" },
  { name: "Dogecoin", symbol: "DOGE", price: "$0.123", change: "+5.67%", up: true, color: "#C2A633" },
  { name: "Polkadot", symbol: "DOT", price: "$6.82", change: "-1.20%", up: false, color: "#E6007A" },
  { name: "Avalanche", symbol: "AVAX", price: "$35.10", change: "+3.44%", up: true, color: "#E84142" },
];

const news = [
  "Market News: Federal Reserve Holds Rates at 3.50%–3.75% for Fourth Consecutive Meeting — Gold Drops $40, Dollar...",
  "AI TRENDS | Fed Adds Productivity, Capital Investment Language to Latest Rate Statement",
  "STOCKS | Nasdaq Falls 0.47% After Federal Reserve Interest Rate Decision",
  "Strive CEO Says Bitcoin Is His Minimum Return Benchmark for the Next 10 to 15 Years",
];

function CoinDot({ color }: { color: string }) {
  return <span className="inline-block w-6 h-6 rounded-full border-2 border-white" style={{ background: color }} />;
}

export default function Home() {
  const [tab, setTab] = useState<"popular" | "new">("popular");
  const [email, setEmail] = useState("");

  const displayed = tab === "popular" ? coins : newCoins;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-5xl font-extrabold text-[#1E63FF] leading-tight mb-1">321,716,515</h1>
          <h2 className="text-4xl font-extrabold text-foreground leading-tight mb-2">USERS<br />TRUST US</h2>
          <p className="text-lg font-semibold text-muted-foreground mb-6">The World's Leading Cryptocurrency Exchange</p>

          <div className="flex gap-8 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-muted-foreground">⚜</span>
              <div>
                <div className="font-bold text-base">No.1</div>
                <div className="text-xs text-muted-foreground">Customer Assets</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-muted-foreground">⚜</span>
              <div>
                <div className="font-bold text-base">No.1</div>
                <div className="text-xs text-muted-foreground">Trading Volume</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="text"
              placeholder="Email/Phone number"
              className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-email-hero"
            />
            <Link href="/signup">
              <Button className="px-6 font-semibold" data-testid="button-signup-hero">Sign Up</Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors" data-testid="button-google">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors" data-testid="button-apple">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/><path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
            </button>
            <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors" data-testid="button-qr">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>
            </button>
          </div>
        </div>

        {/* Coin ticker panel */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab("popular")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "popular" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              data-testid="tab-popular"
            >Popular</button>
            <button
              onClick={() => setTab("new")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "new" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              data-testid="tab-new-listing"
            >New Listing</button>
            <a href="/markets" className="flex items-center px-4 text-xs text-primary font-medium hover:underline">View All 350+ Coins</a>
          </div>
          <div>
            {displayed.map((coin) => (
              <div key={coin.symbol} className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0" data-testid={`row-coin-${coin.symbol}`}>
                <CoinDot color={coin.color} />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-sm">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{coin.price}</div>
                  <div className={`text-xs font-medium ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</div>
                </div>
              </div>
            ))}
          </div>
          {/* News */}
          <div className="border-t border-border px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">News</span>
              <a href="#" className="text-xs text-primary hover:underline">View All News</a>
            </div>
            <ul className="space-y-2">
              {news.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors line-clamp-1" data-testid={`news-item-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SAFU section */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">FUNDS ARE</h2>
            <h2 className="text-3xl font-extrabold text-[#1E63FF] mb-4">SAFU</h2>
            <p className="text-muted-foreground max-w-md">The Security of User Assets Fund (SAFU) was established in 2018 to protect your funds in rare emergencies. Your security is our priority.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-border">
              <div className="text-sm text-muted-foreground mb-1">As of February 2026, the SAFU fund wallet comprises a reserve of</div>
              <div className="text-2xl font-extrabold text-[#1E63FF]">15,000 BTC</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">SAFU Wallet: 1BAu…qkD</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-border">
                <div className="text-2xl font-extrabold text-[#1E63FF]">7,488,223</div>
                <div className="text-sm text-muted-foreground mt-1">Users helped</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-border">
                <div className="text-2xl font-extrabold text-[#1E63FF]">$229,433,449</div>
                <div className="text-sm text-muted-foreground mt-1">Funds recovered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="max-w-[1400px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "How to get started with EyePay", label: "TUTORIAL" },
            { title: "Understanding crypto markets", label: "EDUCATION" },
            { title: "Trading strategies for beginners", label: "TIPS" },
          ].map((v, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-video-${i}`}>
              <div className="bg-gradient-to-br from-[#1E63FF]/20 to-[#1E63FF]/5 h-48 flex items-center justify-center relative">
                <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-[#1E63FF] ml-1"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="absolute top-3 left-3 text-xs bg-[#1E63FF] text-white px-2 py-0.5 rounded font-semibold">{v.label}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features row */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Shield className="w-7 h-7 text-[#1E63FF]" />, title: "Secure", desc: "Bank-level security to protect you" },
            { icon: <Zap className="w-7 h-7 text-[#1E63FF]" />, title: "Fast", desc: "Quick and easy onboarding" },
            { icon: <Globe className="w-7 h-7 text-[#1E63FF]" />, title: "Global", desc: "Join millions of users worldwide" },
            { icon: <Headphones className="w-7 h-7 text-[#1E63FF]" />, title: "24/7 Support", desc: "We're here anytime you need us" },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4" data-testid={`feature-${f.title.replace(/\s/g,"-").toLowerCase()}`}>
              {f.icon}
              <div className="font-bold">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
