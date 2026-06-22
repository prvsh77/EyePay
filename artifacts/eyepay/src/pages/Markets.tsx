import { useState } from "react";
import { Search, Star, TrendingUp, BarChart2, Settings2 } from "lucide-react";

const coins = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: "$65,416.01", sub: "$65,416.01", change: "-0.66%", up: false, volume: "$25.37B", cap: "$1.32T", color: "#F7931A" },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: "$1,767.61", sub: "$1,767.61", change: "-1.80%", up: false, volume: "$11.42B", cap: "$214.29B", color: "#627EEA" },
  { rank: 3, name: "TetherUS", symbol: "USDT", price: "$1.00", sub: "$1.00", change: "+0.00%", up: true, volume: "$60.67B", cap: "$186.39B", color: "#26A17B" },
  { rank: 4, name: "BNB", symbol: "BNB", price: "$607.18", sub: "$607.18", change: "-0.11%", up: false, volume: "$1.19B", cap: "$81.71B", color: "#F3BA2F" },
  { rank: 5, name: "XRP", symbol: "XRP", price: "$1.21", sub: "$1.21", change: "-1.43%", up: false, volume: "$1.59B", cap: "$75.58B", color: "#00AAE4" },
  { rank: 6, name: "USD Coin", symbol: "USDC", price: "$1.00", sub: "$1.00", change: "-0.02%", up: false, volume: "$9.87B", cap: "$74.90B", color: "#2775CA" },
  { rank: 7, name: "Solana", symbol: "SOL", price: "$73.43", sub: "$73.43", change: "-0.85%", up: false, volume: "$2.02B", cap: "$42.94B", color: "#9945FF" },
  { rank: 8, name: "TRON", symbol: "TRX", price: "$0.3209", sub: "$0.3209", change: "+1.13%", up: true, volume: "$482.54M", cap: "$30.47B", color: "#EB0029" },
  { rank: 9, name: "Stellar Lumens", symbol: "XLM", price: "$0.2258", sub: "$0.2258", change: "+1.80%", up: true, volume: "$465.29M", cap: "$11.32B", color: "#14B6E7" },
  { rank: 10, name: "USDS", symbol: "USDS", price: "$1.00", sub: "$1.00", change: "+0.00%", up: true, volume: "$75.64M", cap: "$10.27B", color: "#2775CA" },
  { rank: 11, name: "Zcash", symbol: "ZEC", price: "$496.37", sub: "$496.37", change: "-1.28%", up: false, volume: "$706.40M", cap: "$8.29B", color: "#F4B728" },
  { rank: 12, name: "Wrapped Bitcoin", symbol: "WBTC", price: "$65,354.08", sub: "$65,354.08", change: "-0.58%", up: false, volume: "$149.05M", cap: "$7.67B", color: "#F7931A" },
  { rank: 13, name: "Wrapped Beacon ETH", symbol: "WBETH", price: "$1,950.82", sub: "$1,950.82", change: "-1.26%", up: false, volume: "$5.28M", cap: "$6.55B", color: "#627EEA" },
  { rank: 14, name: "Cardano", symbol: "ADA", price: "$0.1694", sub: "$0.1694", change: "-3.31%", up: false, volume: "$465.77M", cap: "$6.23B", color: "#0033AD" },
  { rank: 15, name: "ChainLink", symbol: "LINK", price: "$8.24", sub: "$8.24", change: "-0.81%", up: false, volume: "$215.40M", cap: "$6.04B", color: "#2A5ADA" },
  { rank: 16, name: "World Liberty Financial USD", symbol: "USDT", price: "$1.00", sub: "$1.00", change: "+0.03%", up: true, volume: "$1.82B", cap: "$4.60B", color: "#26A17B" },
  { rank: 17, name: "USD Ethena", symbol: "USDE", price: "$0.9998", sub: "$0.9998", change: "-0.02%", up: false, volume: "$111.74M", cap: "$4.50B", color: "#8B5CF6" },
  { rank: 18, name: "Toncoin", symbol: "TON", price: "$1.66", sub: "$1.66", change: "+0.61%", up: true, volume: "$44.50M", cap: "$4.48B", color: "#0098EA" },
  { rank: 19, name: "Bitcoin Cash", symbol: "BCH", price: "$215.20", sub: "$215.20", change: "-1.78%", up: false, volume: "$180.29M", cap: "$4.35B", color: "#8DC351" },
  { rank: 20, name: "Hedera Hashgraph", symbol: "HBAR", price: "$0.08152", sub: "$0.08152", change: "+0.52%", up: true, volume: "$66.62M", cap: "$4.10B", color: "#00BCD4" },
];

const hotCoins = [
  { symbol: "BNB", price: "$607.18", change: "-0.11%", up: false, color: "#F3BA2F" },
  { symbol: "BTC", price: "$65,416.01", change: "-0.66%", up: false, color: "#F7931A" },
  { symbol: "ETH", price: "$1,767.61", change: "-1.80%", up: false, color: "#627EEA" },
];

const tabs = ["Favorites", "Cryptos", "Spot", "Futures", "DeFi", "Alpha", "New", "Zones"];
const ecosystemFilters = ["All", "BTC Ecosystem", "ETH Ecosystem", "Solana Ecosystem", "Meme", "AI", "Layer 1/Layer 2", "Payments", "Gaming", "DeFi", "More"];

function CoinDot({ color }: { color: string }) {
  return <span className="inline-block w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ background: color }} />;
}

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

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EEF3FF] to-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Crypto Markets</h1>
            <p className="text-muted-foreground text-lg">Explore price, 24h volume, and market capitalization of 350+ cryptocurrencies.</p>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-3">
              <div className="flex -space-x-2">
                {[{ color: "#F7931A" }, { color: "#627EEA" }, { color: "#26A17B" }].map((c, i) => (
                  <span key={i} className="w-10 h-10 rounded-full border-2 border-white shadow inline-block" style={{ background: c.color }} />
                ))}
              </div>
              <BarChart2 className="w-16 h-16 text-[#1E63FF] opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Search + Hot/New/Gainers/Volume */}
      <section className="max-w-[1400px] mx-auto px-4 py-6 border-b border-border">
        <div className="flex gap-3 items-center mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search coins, pairs, categories..."
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-market-search"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🔥", label: "Hot", coins: hotCoins },
            { icon: "🆕", label: "New", coins: [{ symbol: "SPCXB", price: "$197.13", change: "-5.77%", up: false, color: "#FF6B6B" }, { symbol: "CRCLB", price: "$84.35", change: "+3.60%", up: true, color: "#4ECDC4" }, { symbol: "NVDAB", price: "$205.99", change: "-1.70%", up: false, color: "#45B7D1" }] },
            { icon: "📈", label: "Top Gainer", coins: [{ symbol: "SYN", price: "$0.0744", change: "+58.30%", up: true, color: "#F472B6" }, { symbol: "MITO", price: "$0.03033", change: "+41.73%", up: true, color: "#34D399" }, { symbol: "XPL", price: "$0.1191", change: "+28.20%", up: true, color: "#A78BFA" }] },
            { icon: "📊", label: "Top Volume", coins: [{ symbol: "BTC", price: "$65.41K", change: "-0.66%", up: false, color: "#F7931A" }, { symbol: "ETH", price: "$1.76K", change: "-1.80%", up: false, color: "#627EEA" }, { symbol: "SOL", price: "$73.43", change: "-0.85%", up: false, color: "#9945FF" }] },
          ].map((section, si) => (
            <div key={si} className="border border-border rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{section.icon}</span>
                <span className="font-semibold text-sm">{section.label}</span>
                <a href="#" className="ml-auto text-xs text-[#1E63FF] hover:underline">More</a>
              </div>
              <div className="space-y-1.5">
                {section.coins.map((c, ci) => (
                  <div key={ci} className="flex items-center gap-2" data-testid={`hot-coin-${c.symbol}-${si}`}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs font-medium flex-1">{c.symbol}</span>
                    <span className="text-xs font-medium">{c.price}</span>
                    <span className={`text-xs font-medium ${c.up ? "text-green-500" : "text-red-500"}`}>{c.change}</span>
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
        <div className="flex items-center gap-1 border-b border-border mb-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${activeTab === t ? "border-b-2 border-[#1E63FF] text-[#1E63FF]" : "text-muted-foreground hover:text-foreground"}`}
              data-testid={`markets-tab-${t.toLowerCase()}`}
            >
              {t}
              {t === "DeFi" && <span className="text-xs bg-green-500 text-white px-1 py-0.5 rounded font-bold">New</span>}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pb-1">
            <button className="p-1.5 rounded-lg hover:bg-gray-100" data-testid="button-market-search"><Search className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100" data-testid="button-market-settings"><Settings2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Ecosystem filter pills */}
        <div className="flex gap-2 overflow-x-auto py-3 mb-2">
          {ecosystemFilters.map(f => (
            <button
              key={f}
              onClick={() => setEcosystemFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${ecosystemFilter === f ? "bg-[#1E63FF] text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"}`}
              data-testid={`filter-${f.replace(/\s/g, "-").toLowerCase()}`}
            >{f}</button>
          ))}
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-base">Top Tokens by Market Capitalization</h3>
          <p className="text-xs text-muted-foreground mt-0.5">A comprehensive snapshot of all cryptocurrencies available on EyePay. This page displays the latest prices, 24-hour trading volume, price changes, and market capitalizations for all cryptocurrencies...</p>
          <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View More</a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left py-3 w-8">#</th>
                <th className="text-left py-3">Name</th>
                <th className="text-right py-3">Price</th>
                <th className="text-right py-3">24h</th>
                <th className="text-right py-3 hidden md:table-cell">24h Volume</th>
                <th className="text-right py-3 hidden lg:table-cell">Market Cap</th>
                <th className="text-right py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin) => (
                <tr key={coin.rank} className="border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer" data-testid={`market-row-${coin.symbol}`}>
                  <td className="py-3 text-muted-foreground text-xs">{coin.rank}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <CoinDot color={coin.color} />
                      <div>
                        <div className="font-semibold text-sm">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-semibold">{coin.price}</div>
                    <div className="text-xs text-muted-foreground">{coin.sub}</div>
                  </td>
                  <td className={`py-3 text-right font-medium text-sm ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</td>
                  <td className="py-3 text-right text-muted-foreground hidden md:table-cell text-sm">{coin.volume}</td>
                  <td className="py-3 text-right text-muted-foreground hidden lg:table-cell text-sm">{coin.cap}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <MiniChart up={coin.up} />
                      <button className="text-muted-foreground hover:text-yellow-400 transition-colors" data-testid={`star-${coin.symbol}`}>
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <button className="border border-border rounded-xl px-8 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors" data-testid="button-load-more">Load More</button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Data is updated in real-time. Prices shown in USD.</p>
      </section>
    </div>
  );
}
