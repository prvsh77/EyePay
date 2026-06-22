import { Link, useLocation } from "wouter";
import { Shield, Zap, Globe, Headphones, TrendingUp, TrendingDown, Star, X, Play, Pause, Volume2, Maximize, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";

const coins = [
  { name: "Bitcoin", symbol: "BTC", price: "$65,348.00", change: "-0.84%", up: false, color: "#F7931A", cap: "$1.28T", vol: "$24.5B", supply: "19.7M BTC" },
  { name: "Ethereum", symbol: "ETH", price: "$1,765.36", change: "-1.66%", up: false, color: "#627EEA", cap: "$212.5B", vol: "$11.2B", supply: "120.1M ETH" },
  { name: "BNB", symbol: "BNB", price: "$604.08", change: "-0.56%", up: false, color: "#F3BA2F", cap: "$88.6B", vol: "$1.1B", supply: "147.5M BNB" },
  { name: "XRP", symbol: "XRP", price: "$1.20", change: "-1.87%", up: false, color: "#00AAE4", cap: "$66.4B", vol: "$1.5B", supply: "55.3M XRP" },
  { name: "Aster", symbol: "ASTER", price: "$0.729", change: "+10.96%", up: true, color: "#E6007A", cap: "$729M", vol: "$45.2M", supply: "1.0B ASTER" },
];

const newCoins = [
  { name: "Solana", symbol: "SOL", price: "$73.43", change: "-0.85%", up: false, color: "#9945FF", cap: "$32.4B", vol: "$1.8B", supply: "440.5M SOL" },
  { name: "Cardano", symbol: "ADA", price: "$0.45", change: "+2.13%", up: true, color: "#0033AD", cap: "$16.2B", vol: "$420.5M", supply: "35.6B ADA" },
  { name: "Dogecoin", symbol: "DOGE", price: "$0.123", change: "+5.67%", up: true, color: "#C2A633", cap: "$17.5B", vol: "$850.2M", supply: "144.3B DOGE" },
  { name: "Polkadot", symbol: "DOT", price: "$6.82", change: "-1.20%", up: false, color: "#E6007A", cap: "$8.8B", vol: "$180.5M", supply: "1.2B DOT" },
  { name: "Avalanche", symbol: "AVAX", price: "$35.10", change: "+3.44%", up: true, color: "#E84142", cap: "$13.5B", vol: "$310.2M", supply: "385.2M AVAX" },
];

const news = [
  {
    title: "Market News: Federal Reserve Holds Rates at 3.50%–3.75% for Fourth Consecutive Meeting — Gold Drops $40, Dollar...",
    content: "The Federal Reserve concluded its two-day policy meeting today, deciding to hold the benchmark interest rate target range steady at 3.50%–3.75%. The decision reflects ongoing caution regarding sticky inflation metrics. Gold futures responded by sliding $40 per ounce, while the U.S. Dollar Index rebounded strongly against major global currencies.",
    time: "2h ago"
  },
  {
    title: "AI TRENDS | Fed Adds Productivity, Capital Investment Language to Latest Rate Statement",
    content: "In a subtle but meaningful shift, the Federal Open Market Committee added new syntax highlighting the role of productivity gains and AI capital investments in shielding the broader labor market from elevated borrowing costs. Analysts suggest this signals growing central bank acceptance of technology-driven supply side expansions.",
    time: "4h ago"
  },
  {
    title: "STOCKS | Nasdaq Falls 0.47% After Federal Reserve Interest Rate Decision",
    content: "Tech equities closed lower on Wednesday as investors digested the Fed's hawkish hold strategy. The tech-heavy Nasdaq Composite dropped 0.47%, led by declines in hardware and semiconductor manufacturers, while conservative yield assets saw moderate institutional inflows.",
    time: "5h ago"
  },
  {
    title: "Strive CEO Says Bitcoin Is His Minimum Return Benchmark for the Next 10 to 15 Years",
    content: "Strive's executive leadership outlined a bold treasury strategy, stating that Bitcoin now represents the firm's minimum hurdle rate for capital investment benchmarking. Citing systemic currency debasement and decentralization advantages, the CEO emphasized a multi-decade accumulation cycle.",
    time: "8h ago"
  },
];

import { CryptoLogo } from "../components/CryptoLogo";

function CoinDot({ symbol, name, color }: { symbol: string; name?: string; color: string }) {
  return <CryptoLogo symbol={symbol} name={name} color={color} className="w-6 h-6" />;
}

export default function Home() {
  const [tab, setTab] = useState<"popular" | "new">("popular");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { loginWithSocial } = useAuth();

  // Dialog / Modal States
  const [showQr, setShowQr] = useState(false);
  const [selectedNews, setSelectedNews] = useState<typeof news[0] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; label: string } | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<typeof coins[0] | null>(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  const displayed = tab === "popular" ? coins : newCoins;

  const handleSignupRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setLocation(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      setLocation("/signup");
    }
  };

  const handleSocialClick = async (provider: "google" | "apple") => {
    try {
      toast({
        title: "Connecting Social Account",
        description: `Logging in securely via ${provider}...`,
      });
      await loginWithSocial(provider);
      toast({
        title: "Social Log In Successful",
        description: "Welcome to EyePay! Your sandbox wallet is initialized.",
      });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: err.message || "Failed to log in.",
      });
    }
  };

  const handleFeatureClick = (title: string) => {
    toast({
      title: `${title} Active`,
      description: `This premium service is secured by EyePay guard.`,
    });
  };

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-primary leading-tight mb-1">321,716,515</h1>
          <h2 className="text-4xl font-extrabold text-foreground leading-tight mb-2">USERS<br />TRUST US</h2>
          <p className="text-lg font-semibold text-muted-foreground mb-6">The World's Leading Cryptocurrency Exchange</p>

          <div className="flex gap-8 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">👑</span>
              <div>
                <div className="font-bold text-base text-foreground">No.1</div>
                <div className="text-xs text-muted-foreground">Customer Assets</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">⚡</span>
              <div>
                <div className="font-bold text-base text-foreground">No.1</div>
                <div className="text-xs text-muted-foreground">Trading Volume</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignupRedirect} className="flex gap-3 mb-4">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="text"
              placeholder="Email/Phone number"
              className="flex-1 border border-border/80 bg-background/50 backdrop-blur rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              data-testid="input-email-hero"
            />
            <Button type="submit" className="px-6 font-semibold" data-testid="button-signup-hero">Sign Up</Button>
          </form>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => handleSocialClick("google")}
              className="w-10 h-10 rounded-lg border border-border/80 bg-background/40 hover:bg-muted/80 flex items-center justify-center transition-colors shadow-sm"
              data-testid="button-google"
              title="Log In with Google"
            >
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button
              onClick={() => handleSocialClick("apple")}
              className="w-10 h-10 rounded-lg border border-border/80 bg-background/40 hover:bg-muted/80 flex items-center justify-center text-foreground transition-colors shadow-sm"
              data-testid="button-apple"
              title="Log In with Apple"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/><path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
            </button>
            <button
              onClick={() => setShowQr(true)}
              className="w-10 h-10 rounded-lg border border-border/80 bg-background/40 hover:bg-muted/80 flex items-center justify-center text-foreground transition-colors shadow-sm"
              data-testid="button-qr"
              title="Show QR Code to Download"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>
            </button>
          </div>
        </div>

        {/* Coin ticker panel */}
        <div className="glass-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
          <div className="flex border-b border-border/50 bg-muted/20">
            <button
              onClick={() => setTab("popular")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "popular" ? "text-primary border-b-2 border-primary bg-background/40" : "text-muted-foreground hover:bg-background/20"}`}
              data-testid="tab-popular"
            >Popular</button>
            <button
              onClick={() => setTab("new")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "new" ? "text-primary border-b-2 border-primary bg-background/40" : "text-muted-foreground hover:bg-background/20"}`}
              data-testid="tab-new-listing"
            >New Listing</button>
            <Link href="/markets" className="flex items-center px-4 text-xs text-primary font-medium hover:underline">View All 350+</Link>
          </div>
          <div>
            {displayed.map((coin) => (
              <div
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin)}
                className="flex items-center px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/40 last:border-b-0"
                data-testid={`row-coin-${coin.symbol}`}
              >
                <CoinDot symbol={coin.symbol} name={coin.name} color={coin.color} />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-sm text-foreground">{coin.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{coin.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-foreground">{coin.price}</div>
                  <div className={`text-xs font-medium ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</div>
                </div>
              </div>
            ))}
          </div>
          {/* News */}
          <div className="border-t border-border/50 px-5 py-4 bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-foreground">News</span>
              <a href="#" onClick={(e) => { e.preventDefault(); handleFeatureClick("News Portal"); }} className="text-xs text-primary hover:underline">View All News</a>
            </div>
            <ul className="space-y-2">
              {news.map((item, i) => (
                <li
                  key={i}
                  onClick={() => setSelectedNews(item)}
                  className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors line-clamp-1 flex items-center justify-between gap-2"
                  data-testid={`news-item-${i}`}
                >
                  <span>• {item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/60">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SAFU section */}
      <section className="bg-muted/30 dark:bg-muted/5 border-y border-border/40 py-14">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">FUNDS ARE</h2>
            <h2 className="text-3xl font-extrabold text-primary mb-4">SAFU</h2>
            <p className="text-muted-foreground max-w-md">The Security of User Assets Fund (SAFU) was established in 2018 to protect your funds in rare emergencies. Your security is our priority.</p>
          </div>
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5 border border-border/50 shadow bg-background/40">
              <div className="text-sm text-muted-foreground mb-1">As of February 2026, the SAFU fund wallet comprises a reserve of</div>
              <div className="text-2xl font-extrabold text-primary">15,000 BTC</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">SAFU Wallet: 1BAu…qkD</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-5 border border-border/50 shadow bg-background/40">
                <div className="text-2xl font-extrabold text-primary">7,488,223</div>
                <div className="text-sm text-muted-foreground mt-1">Users helped</div>
              </div>
              <div className="glass-card rounded-xl p-5 border border-border/50 shadow bg-background/40">
                <div className="text-2xl font-extrabold text-primary">$229,433,449</div>
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
            <div
              key={i}
              onClick={() => setSelectedVideo(v)}
              className="rounded-2xl overflow-hidden border border-border/50 bg-background/50 hover:shadow-lg transition-shadow cursor-pointer group"
              data-testid={`card-video-${i}`}
            >
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-48 flex items-center justify-center relative">
                <div className="w-14 h-14 bg-background/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-primary ml-1 fill-current" />
                </div>
                <span className="absolute top-3 left-3 text-xs bg-primary text-white px-2 py-0.5 rounded font-semibold">{v.label}</span>
              </div>
              <div className="p-4 bg-background/80 backdrop-blur">
                <p className="font-semibold text-sm text-foreground">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features row */}
      <section className="bg-muted/30 dark:bg-muted/5 border-t border-border/40 py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Shield className="w-7 h-7 text-primary" />, title: "Secure", desc: "Bank-level security to protect you" },
            { icon: <Zap className="w-7 h-7 text-primary" />, title: "Fast", desc: "Quick and easy onboarding" },
            { icon: <Globe className="w-7 h-7 text-primary" />, title: "Global", desc: "Join millions of users worldwide" },
            { icon: <Headphones className="w-7 h-7 text-primary" />, title: "24/7 Support", desc: "We're here anytime you need us" },
          ].map((f, i) => (
            <div
              key={i}
              onClick={() => handleFeatureClick(f.title)}
              className="flex flex-col items-center gap-2 p-4 cursor-pointer hover:bg-muted/20 rounded-xl transition-colors"
              data-testid={`feature-${f.title.replace(/\s/g,"-").toLowerCase()}`}
            >
              {f.icon}
              <div className="font-bold text-foreground">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QR MODAL */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setShowQr(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h3 className="font-bold text-lg text-center mb-4 text-foreground">Download EyePay App</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-2xl shadow border border-border flex items-center justify-center">
                {/* Mock QR graphic */}
                <div className="w-40 h-40 grid grid-cols-5 gap-1 bg-white p-2">
                  {Array.from({ length: 25 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded ${
                        (idx % 2 === 0 && idx % 3 !== 0) || idx === 0 || idx === 4 || idx === 20 || idx === 24
                          ? "bg-slate-900"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Scan the QR code with your mobile camera to securely download the Android or iOS client.</p>
              <div className="flex gap-2 w-full mt-2">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => handleFeatureClick("Google Play Download")}>Google Play</Button>
                <Button variant="outline" className="flex-1 text-xs" onClick={() => handleFeatureClick("App Store Download")}>App Store</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setSelectedNews(null)}>
              <X className="h-5 w-5" />
            </Button>
            <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{selectedNews.time}</span>
            <h3 className="font-bold text-xl my-4 text-foreground leading-snug">{selectedNews.title}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>{selectedNews.content}</p>
              <p className="text-xs border-t border-border/40 pt-4">Source: EyePay Research & Market Intelligence. The content above is for informational purposes only and should not be construed as investment or financial advice.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden relative border border-border/60">
            <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-semibold tracking-wider font-mono">{selectedVideo.label}</span>
              <h4 className="font-bold text-sm truncate flex-1 mx-3">{selectedVideo.title}</h4>
              <Button variant="ghost" size="icon" onClick={() => { setSelectedVideo(null); setIsPlaying(false); }}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mock Player Screen */}
            <div className="bg-slate-950 aspect-video flex flex-col justify-between p-4 relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                {isPlaying ? (
                  <div className="text-center text-white/50 text-xs flex flex-col items-center gap-2 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Streaming video tutorial content...</span>
                  </div>
                ) : (
                  <Button onClick={() => setIsPlaying(true)} variant="outline" className="rounded-full bg-white text-slate-900 border-none hover:bg-slate-200 p-4 shadow-xl scale-110">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </Button>
                )}
              </div>
              
              <div className="mt-auto z-10 w-full bg-black/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer mb-2" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setProgress(Math.floor((clickX / rect.width) * 100));
                }}>
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <span>{Math.floor((progress * 180) / 100)}s / 3:00</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <Maximize className="w-4 h-4 cursor-pointer" onClick={() => handleFeatureClick("Fullscreen Player")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COIN STATS MODAL */}
      {selectedCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-md glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setSelectedCoin(null)}>
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <CoinDot symbol={selectedCoin.symbol} name={selectedCoin.name} color={selectedCoin.color} />
              <div>
                <h3 className="font-bold text-lg leading-none">{selectedCoin.name}</h3>
                <span className="text-xs text-muted-foreground font-mono">{selectedCoin.symbol}/USD</span>
              </div>
              <span className={`ml-auto font-semibold px-2 py-0.5 rounded text-xs ${selectedCoin.up ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {selectedCoin.change}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-4 mb-4">
              <div>
                <span className="text-xs text-muted-foreground">Price</span>
                <div className="font-bold text-base text-foreground">{selectedCoin.price}</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Market Cap</span>
                <div className="font-bold text-base text-foreground">{selectedCoin.cap}</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">24h Volume</span>
                <div className="font-bold text-base text-foreground">{selectedCoin.vol}</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Circulating Supply</span>
                <div className="font-bold text-base text-foreground font-mono">{selectedCoin.supply}</div>
              </div>
            </div>
            
            <div className="h-28 flex items-end pb-1 border border-border/40 rounded-xl px-2 mb-4 bg-muted/10 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/60">Simulated 24h Ticker Trend</div>
              <svg viewBox="0 0 100 30" className="w-full h-16" preserveAspectRatio="none">
                <polyline
                  points={selectedCoin.up ? "0,25 20,20 40,22 60,15 80,12 100,5" : "0,5 20,12 40,10 60,18 80,15 100,25"}
                  fill="none"
                  stroke={selectedCoin.up ? "#22c55e" : "#ef4444"}
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <Button
                className="flex-1 font-semibold"
                onClick={() => {
                  setSelectedCoin(null);
                  setLocation(`/buy-crypto?coin=${selectedCoin.symbol}`);
                }}
              >
                Buy {selectedCoin.symbol}
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-semibold"
                onClick={() => handleFeatureClick(`Set price alert for ${selectedCoin.symbol}`)}
              >
                Price Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
