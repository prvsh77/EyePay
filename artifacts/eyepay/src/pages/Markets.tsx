import { useState, useEffect } from "react";
import { Search, Star, TrendingUp, BarChart2, Settings2, X, Info } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CryptoLogo } from "../components/CryptoLogo";

const coins = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: 65416.01, change: "-0.66%", up: false, volume: "$25.37B", cap: "$1.32T", color: "#F7931A" },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: 1767.61, change: "-1.80%", up: false, volume: "$11.42B", cap: "$214.29B", color: "#627EEA" },
  { rank: 3, name: "TetherUS", symbol: "USDT", price: 1.00, change: "+0.00%", up: true, volume: "$60.67B", cap: "$186.39B", color: "#26A17B" },
  { rank: 4, name: "BNB", symbol: "BNB", price: 607.18, change: "-0.11%", up: false, volume: "$1.19B", cap: "$81.71B", color: "#F3BA2F" },
  { rank: 5, name: "XRP", symbol: "XRP", price: 1.21, change: "-1.43%", up: false, volume: "$1.59B", cap: "$75.58B", color: "#00AAE4" },
  { rank: 6, name: "USD Coin", symbol: "USDC", price: 1.00, change: "-0.02%", up: false, volume: "$9.87B", cap: "$74.90B", color: "#2775CA" },
  { rank: 7, name: "Solana", symbol: "SOL", price: 73.43, change: "-0.85%", up: false, volume: "$2.02B", cap: "$42.94B", color: "#9945FF" },
  { rank: 8, name: "TRON", symbol: "TRX", price: 0.3209, change: "+1.13%", up: true, volume: "$482.54M", cap: "$30.47B", color: "#EB0029" },
  { rank: 9, name: "Stellar Lumens", symbol: "XLM", price: 0.2258, change: "+1.80%", up: true, volume: "$465.29M", cap: "$11.32B", color: "#14B6E7" },
  { rank: 10, name: "USDS", symbol: "USDS", price: 1.00, change: "+0.00%", up: true, volume: "$75.64M", cap: "$10.27B", color: "#2775CA" },
  { rank: 11, name: "Zcash", symbol: "ZEC", price: 496.37, change: "-1.28%", up: false, volume: "$706.40M", cap: "$8.29B", color: "#F4B728" },
  { rank: 12, name: "Wrapped Bitcoin", symbol: "WBTC", price: 65354.08, change: "-0.58%", up: false, volume: "$149.05M", cap: "$7.67B", color: "#F7931A" },
  { rank: 13, name: "Wrapped Beacon ETH", symbol: "WBETH", price: 1950.82, change: "-1.26%", up: false, volume: "$5.28M", cap: "$6.55B", color: "#627EEA" },
  { rank: 14, name: "Cardano", symbol: "ADA", price: 0.1694, change: "-3.31%", up: false, volume: "$465.77M", cap: "$6.23B", color: "#0033AD" },
  { rank: 15, name: "ChainLink", symbol: "LINK", price: 8.24, change: "-0.81%", up: false, volume: "$215.40M", cap: "$6.04B", color: "#2A5ADA" },
  { rank: 16, name: "World Liberty Financial USD", symbol: "USDT", price: 1.00, change: "+0.03%", up: true, volume: "$1.82B", cap: "#26A17B" },
  { rank: 17, name: "USD Ethena", symbol: "USDE", price: 0.9998, change: "-0.02%", up: false, volume: "$111.74M", cap: "$4.50B", color: "#8B5CF6" },
  { rank: 18, name: "Toncoin", symbol: "TON", price: 1.66, change: "+0.61%", up: true, volume: "$44.50M", cap: "$4.48B", color: "#0098EA" },
  { rank: 19, name: "Bitcoin Cash", symbol: "BCH", price: 215.20, change: "-1.78%", up: false, volume: "$180.29M", cap: "$4.35B", color: "#8DC351" },
  { rank: 20, name: "Hedera Hashgraph", symbol: "HBAR", price: 0.08152, change: "+0.52%", up: true, volume: "$66.62M", cap: "$4.10B", color: "#00BCD4" },
];

const extraCoins = [
  { rank: 21, name: "Polkadot", symbol: "DOT", price: 6.82, change: "-1.20%", up: false, volume: "$110.2M", cap: "$3.98B", color: "#E6007A" },
  { rank: 22, name: "Litecoin", symbol: "LTC", price: 81.35, change: "+1.92%", up: true, volume: "$280.4M", cap: "$3.45B", color: "#345D9D" },
  { rank: 23, name: "NEAR Protocol", symbol: "NEAR", price: 5.42, change: "+4.11%", up: true, volume: "$195.6M", cap: "$3.12B", color: "#000000" },
  { rank: 24, name: "Uniswap", symbol: "UNI", price: 7.68, change: "-0.95%", up: false, volume: "$140.2M", cap: "$2.98B", color: "#FF007A" },
  { rank: 25, name: "Pepe", symbol: "PEPE", price: 0.000012, change: "+12.4%", up: true, volume: "$820.5M", cap: "$2.45B", color: "#00FF00" },
];

const hotCoins = [
  { symbol: "BNB", price: "$607.18", change: "-0.11%", up: false, color: "#F3BA2F" },
  { symbol: "BTC", price: "$65,416.01", change: "-0.66%", up: false, color: "#F7931A" },
  { symbol: "ETH", price: "$1,767.61", change: "-1.80%", up: false, color: "#627EEA" },
];

const tabs = ["Favorites", "Cryptos", "Spot", "Futures", "DeFi", "Alpha", "New", "Zones"];
const ecosystemFilters = ["All", "BTC Ecosystem", "ETH Ecosystem", "Solana Ecosystem", "Meme", "AI", "Payments"];

function MiniChart({ up }: { up: boolean }) {
  const points = up ? "0,18 10,15 20,16 30,12 40,10 50,8" : "0,8 10,11 20,10 30,14 40,15 50,18";
  return (
    <svg width="50" height="26" viewBox="0 0 50 26">
      <polyline points={points} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Markets() {
  const [activeTab, setActiveTab] = useState("Cryptos");
  const [ecosystemFilter, setEcosystemFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCoins, setVisibleCoins] = useState(coins);
  
  // Star Watchlist State
  const [starredCoins, setStarredCoins] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("eyepay_starred_coins") || "[]");
    } catch {
      return [];
    }
  });

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [showPriceIndicators, setShowPriceIndicators] = useState(true);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    localStorage.setItem("eyepay_starred_coins", JSON.stringify(starredCoins));
  }, [starredCoins]);

  const toggleStar = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering row navigation
    const updated = starredCoins.includes(symbol)
      ? starredCoins.filter(s => s !== symbol)
      : [...starredCoins, symbol];
    setStarredCoins(updated);
    toast({
      title: starredCoins.includes(symbol) ? "Removed Watchlist" : "Added Watchlist",
      description: `${symbol} watchlist index updated successfully.`,
    });
  };

  const handleLoadMore = () => {
    if (visibleCoins.length >= coins.length + extraCoins.length) {
      toast({
        title: "All Coins Loaded",
        description: "Viewing complete sandbox currency roster.",
      });
      return;
    }
    setVisibleCoins([...visibleCoins, ...extraCoins]);
    toast({
      title: "Roster Appended",
      description: "Loaded 5 additional tokens from index.",
    });
  };

  const handleRowClick = (symbol: string) => {
    setLocation(`/buy-crypto?coin=${symbol}`);
  };

  // Conversion calculations
  const currencySymbol = displayCurrency === "USD" ? "$" : displayCurrency === "EUR" ? "€" : "₹";
  const rateMultiplier = displayCurrency === "USD" ? 1 : displayCurrency === "EUR" ? 0.92 : 83.4;

  const formatPrice = (val: number) => {
    const scaled = val * rateMultiplier;
    return `${currencySymbol}${scaled.toLocaleString(undefined, {
      minimumFractionDigits: val < 0.1 ? 5 : 2,
      maximumFractionDigits: val < 0.1 ? 6 : 2
    })}`;
  };

  const handleDisplaySettingUpdate = (curr: string) => {
    setDisplayCurrency(curr);
    toast({
      title: "Display Preferences",
      description: `Default currency scaled to ${curr}.`,
    });
  };

  // Filtering
  const filtered = visibleCoins.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = activeTab === "Favorites"
    ? filtered.filter(c => starredCoins.includes(c.symbol))
    : filtered;

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent py-12">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-foreground">Crypto Markets</h1>
            <p className="text-muted-foreground text-lg">Explore price, 24h volume, and market capitalization of 350+ cryptocurrencies.</p>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-3">
              <div className="flex -space-x-2">
                {[{ symbol: "BTC", color: "#F7931A" }, { symbol: "ETH", color: "#627EEA" }, { symbol: "USDT", color: "#26A17B" }].map((c, i) => (
                  <CryptoLogo key={i} symbol={c.symbol} color={c.color} className="w-10 h-10 border-2 border-background shadow" />
                ))}
              </div>
              <BarChart2 className="w-16 h-16 text-primary opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Search + Hot/New/Gainers/Volume */}
      <section className="max-w-[1400px] mx-auto px-4 py-6 border-b border-border/50">
        <div className="flex gap-3 items-center mb-5 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search coins, pairs, categories..."
              className="w-full pl-9 pr-4 py-2.5 border border-border/80 bg-background/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              data-testid="input-market-search"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="gap-1 text-xs">
            <Settings2 className="w-3.5 h-3.5" /> Market Preferences
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🔥", label: "Hot", coins: hotCoins },
            { icon: "🆕", label: "New", coins: [{ symbol: "SPCXB", price: "$197.13", change: "-5.77%", up: false, color: "#FF6B6B" }, { symbol: "CRCLB", price: "$84.35", change: "+3.60%", up: true, color: "#4ECDC4" }, { symbol: "NVDAB", price: "$205.99", change: "-1.70%", up: false, color: "#45B7D1" }] },
            { icon: "📈", label: "Top Gainer", coins: [{ symbol: "SYN", price: "$0.0744", change: "+58.30%", up: true, color: "#F472B6" }, { symbol: "MITO", price: "$0.03033", change: "+41.73%", up: true, color: "#34D399" }, { symbol: "XPL", price: "$0.1191", change: "+28.20%", up: true, color: "#A78BFA" }] },
            { icon: "📊", label: "Top Volume", coins: [{ symbol: "BTC", price: "$65.41K", change: "-0.66%", up: false, color: "#F7931A" }, { symbol: "ETH", price: "$1.76K", change: "-1.80%", up: false, color: "#627EEA" }, { symbol: "SOL", price: "$73.43", change: "-0.85%", up: false, color: "#9945FF" }] },
          ].map((section, si) => (
            <div key={si} className="glass-card rounded-xl p-3 border border-border/40">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{section.icon}</span>
                <span className="font-semibold text-xs text-foreground">{section.label}</span>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Section Deep Dive", description: `Loading expanded rankings for ${section.label}...` }); }} className="ml-auto text-[10px] text-primary hover:underline">More</a>
              </div>
              <div className="space-y-1.5">
                {section.coins.map((c, ci) => (
                  <div key={ci} className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => handleRowClick(c.symbol)} data-testid={`hot-coin-${c.symbol}-${si}`}>
                    <CryptoLogo symbol={c.symbol} color={c.color} className="w-4.5 h-4.5" />
                    <span className="text-[10px] font-medium flex-1 text-foreground font-mono">{c.symbol}</span>
                    <span className="text-[10px] text-muted-foreground">{c.price}</span>
                    <span className={`text-[10px] font-medium ${c.up ? "text-green-500" : "text-red-500"}`}>{c.change}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main table */}
      <section className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Tab row */}
        <div className="flex items-center gap-1 border-b border-border/50 mb-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${activeTab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
              data-testid={`markets-tab-${t.toLowerCase()}`}
            >
              {t}
              {t === "DeFi" && <span className="text-[10px] bg-green-500 text-white px-1 py-0.5 rounded font-bold">New</span>}
              {t === "Favorites" && <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold">{starredCoins.length}</span>}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pb-1">
            <button onClick={() => toast({ title: "Market Search", description: "Search index optimized." })} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-market-search"><Search className="w-4 h-4" /></button>
            <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-market-settings"><Settings2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Ecosystem filter pills */}
        <div className="flex gap-2 overflow-x-auto py-3 mb-2">
          {ecosystemFilters.map(f => (
            <button
              key={f}
              onClick={() => setEcosystemFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${ecosystemFilter === f ? "bg-primary text-white shadow-sm" : "bg-muted/40 text-muted-foreground hover:bg-muted/80"}`}
              data-testid={`filter-${f.replace(/\s/g, "-").toLowerCase()}`}
            >{f}</button>
          ))}
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-base text-foreground">Top Tokens by Market Capitalization</h3>
          <p className="text-xs text-muted-foreground mt-0.5">A comprehensive snapshot of digital assets. Star items to add to Favorites.</p>
        </div>

        <div className="overflow-x-auto glass-card rounded-2xl border border-border/50 shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-xs bg-muted/20">
                <th className="text-left py-3 px-4 w-8">#</th>
                <th className="text-left py-3">Name</th>
                <th className="text-right py-3">Price</th>
                <th className="text-right py-3">24h</th>
                <th className="text-right py-3 hidden md:table-cell">24h Volume</th>
                <th className="text-right py-3 hidden lg:table-cell">Market Cap</th>
                <th className="text-right py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    <Info className="w-5 h-5 mx-auto mb-2 text-muted-foreground/60" />
                    No assets in {activeTab} yet. Star assets below to populate!
                  </td>
                </tr>
              ) : (
                displayed.map((coin) => (
                  <tr
                    key={coin.rank}
                    onClick={() => handleRowClick(coin.symbol)}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    data-testid={`market-row-${coin.symbol}`}
                  >
                    <td className="py-3 px-4 text-muted-foreground text-xs">{coin.rank}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CryptoLogo symbol={coin.symbol} name={coin.name} color={coin.color} className="w-7 h-7" />
                        <div>
                          <div className="font-semibold text-sm text-foreground">{coin.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="font-semibold text-foreground">{formatPrice(coin.price)}</div>
                      {showPriceIndicators && (
                        <div className="text-[10px] text-muted-foreground">USD {coin.price.toLocaleString()}</div>
                      )}
                    </td>
                    <td className={`py-3 text-right font-medium text-sm ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</td>
                    <td className="py-3 text-right text-muted-foreground hidden md:table-cell text-xs">{coin.volume}</td>
                    <td className="py-3 text-right text-muted-foreground hidden lg:table-cell text-xs">{coin.cap}</td>
                    <td className="py-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <MiniChart up={coin.up} />
                        <button
                          onClick={(e) => toggleStar(coin.symbol, e)}
                          className={`text-muted-foreground hover:text-yellow-400 p-1 rounded transition-colors`}
                          data-testid={`star-${coin.symbol}`}
                        >
                          <Star className={`w-4 h-4 ${starredCoins.includes(coin.symbol) ? "text-yellow-400 fill-current" : ""}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="border border-border/80 rounded-xl px-8 py-2.5 text-sm font-medium hover:bg-muted/40 bg-background/50 transition-colors"
            data-testid="button-load-more"
          >
            Load More Assets
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">Data is updated in real-time under sandbox environment rules. Prices shown scale by display configurations.</p>
      </section>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setShowSettings(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h3 className="font-bold text-lg mb-4">Market Display Options</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Pricing Denomination</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["USD", "EUR", "INR"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => handleDisplaySettingUpdate(curr)}
                      className={`text-sm py-2 rounded-xl border text-center font-medium transition-colors ${
                        displayCurrency === curr
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Secondary Price Feed</span>
                  <span className="text-xs text-muted-foreground">Show underlying USD values below price conversions</span>
                </div>
                <input
                  type="checkbox"
                  checked={showPriceIndicators}
                  onChange={(e) => setShowPriceIndicators(e.target.checked)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
