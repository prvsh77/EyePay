import { Button } from "@/components/ui/button";
import { Shield, Zap, Monitor, BarChart2, Bot, Users, TrendingUp, BookOpen, Headphones } from "lucide-react";

const ticker = [
  { symbol: "BTCUSDT", type: "Perpetual", change: "-0.25%", up: false, price: "65,534.40" },
  { symbol: "ETHUSDT", type: "Perpetual", change: "-1.36%", up: false, price: "1,771.27" },
  { symbol: "BNBUSDT", type: "Perpetual", change: "-0.31%", up: false, price: "608.91" },
  { symbol: "SOLUSDT", type: "Perpetual", change: "-0.31%", up: false, price: "73.51" },
  { symbol: "XRPUSDT", type: "Perpetual", change: "-0.93%", up: false, price: "1.2099" },
];

const markets = [
  { icon: <BarChart2 className="w-5 h-5 text-[#1E63FF]" />, title: "USD-M Futures", desc: "Perpetual or Quarterly Contracts settled in USDT and USDC.", label: "Trade Now" },
  { icon: <BarChart2 className="w-5 h-5 text-[#1E63FF]" />, title: "COIN-M Futures", desc: "Perpetual or Quarterly Contracts settled in Cryptocurrency.", label: "Trade Now" },
  { icon: <BarChart2 className="w-5 h-5 text-[#1E63FF]" />, title: "Binance Options", desc: "Crypto Options made simple with Classic or Easy mode and settled in USDT.", label: "Trade Now", badge: "New" },
  { icon: <Bot className="w-5 h-5 text-[#1E63FF]" />, title: "Trading Bots", desc: "Trade like a pro with our best-in-class strategic bots.", label: "Trade Now" },
  { icon: <Users className="w-5 h-5 text-[#1E63FF]" />, title: "Copy Trading", desc: "Boost your earnings by copying top performing traders.", label: "Trade Now", badge: "New" },
  { icon: <TrendingUp className="w-5 h-5 text-[#1E63FF]" />, title: "Smart Money", desc: "Follow the highest performing traders and benefit from their success.", label: "Trade Now" },
];

const whyFeatures = [
  { icon: <BarChart2 className="w-6 h-6 text-[#1E63FF]" />, title: "Unparalleled Products", desc: "Access 250+ Futures & Options contracts with a wide range of tools and margin modes." },
  { icon: <Zap className="w-6 h-6 text-[#1E63FF]" />, title: "Ultra Low Fees", desc: "Enjoy the lowest transaction fees and tightest bid-ask spreads in the market." },
  { icon: <Monitor className="w-6 h-6 text-[#1E63FF]" />, title: "Industry-Leading Execution", desc: "High-performance matching engine ensures fast execution and deep liquidity." },
  { icon: <Shield className="w-6 h-6 text-[#1E63FF]" />, title: "Trade Anywhere", desc: "Seamless trading experience across web, app, and API platforms." },
];

const moversData = [
  {
    label: "USD-M Futures",
    volume: "776,123.168BTC",
    rows: [
      { symbol: "AGTUSDT", price: "0.0277700", change: "+108.4%" },
      { symbol: "SYMUSDT", price: "0.0724900", change: "+55.3%" },
      { symbol: "DCOMPUSDT", price: "0.0322590", change: "+48.0%" },
    ],
  },
  {
    label: "COIN-M Futures",
    volume: "16,951.31BTC",
    rows: [
      { symbol: "XLMUSD CM", price: "0.22500", change: "+2.4%" },
      { symbol: "UNUSD CM", price: "3.274", change: "+2.3%" },
      { symbol: "FILUSDT CM", price: "0.811", change: "+2.0%" },
    ],
  },
  {
    label: "Binance Options",
    volume: "10,227.53BTC",
    rows: [
      { symbol: "BNB-260519-570-P", price: "6.10", change: "+1425.0%" },
      { symbol: "BTC-270326-92000-P", price: "8,365.00", change: "+543.0%" },
      { symbol: "BTC-270326-93000-P", price: "20,300.00", change: "+383.3%" },
    ],
  },
];

const topPortfolios = [
  { name: "自在赚钱", handle: "@user1", pnl: "$52,857.68", roi: "+77.08%", mdd: "121,344.24", ratio: "1.91%", color: "#F7931A" },
  { name: "ArtLee", handle: "@artlee", pnl: "$44,535.61", roi: "+46.68%", mdd: "140,937.11", ratio: "0.97%", color: "#1E63FF" },
  { name: "BullRunVision", handle: "@bullrun", pnl: "$43,886.00", roi: "+66.56%", mdd: "71,692.12", ratio: "9.54%", color: "#9945FF" },
];

export default function Futures() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EEF3FF] to-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-1">Trade Crypto</h1>
            <h1 className="text-4xl font-extrabold text-[#1E63FF] mb-4">Futures</h1>
            <p className="text-muted-foreground mb-6">Advanced tools. Deep liquidity. Low fees.<br />Trade futures with confidence.</p>
            <div className="flex gap-3">
              <Button className="px-6 font-bold" data-testid="button-register">Register Now</Button>
              <Button variant="outline" className="px-6 font-bold" data-testid="button-login-futures">Log In</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-900 rounded-2xl p-5 text-white w-64">
              <div className="text-xs text-gray-400 mb-1">BTC/USDT Perpetual</div>
              <div className="text-2xl font-extrabold text-green-400">65,534.40</div>
              <div className="text-xs text-green-400">+0.25%</div>
              <div className="mt-3 h-16 bg-gradient-to-r from-red-500/30 to-green-500/30 rounded-lg" />
              <div className="text-xs text-gray-400 mt-2">24h Volume: 28.45B USDT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live ticker */}
      <section className="border-y border-border bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex gap-8 overflow-x-auto">
          {ticker.map((t, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-3" data-testid={`ticker-${t.symbol}`}>
              <div>
                <div className="text-xs text-muted-foreground">{t.symbol}</div>
                <div className="font-bold text-sm">{t.price}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.up ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{t.change}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#0A0E27] via-[#1E2D6B] to-[#0A0E27] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div>
            <div className="text-sm font-medium text-blue-300 mb-1">Futures Masters Arena</div>
            <div className="text-xl font-bold">4th Round is Live!</div>
            <p className="text-sm text-blue-200 mt-1">Join the Futures Trading Sprint and share up to 4 Million USDT Prize Pool!</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-testid="button-join-now">Join Now</Button>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-yellow-400">4M</div>
            <div className="text-lg font-bold text-yellow-300">USDT</div>
          </div>
        </div>
      </section>

      {/* Our Markets */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Our Markets</h2>
          <div className="flex gap-3">
            <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View All Markets</a>
            <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">FAQ</a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((m, i) => (
            <div key={i} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow" data-testid={`market-card-${i}`}>
              <div className="flex items-center gap-2 mb-2">
                {m.icon}
                <span className="font-bold">{m.title}</span>
                {m.badge && <span className="text-xs bg-[#1E63FF] text-white px-2 py-0.5 rounded font-semibold">{m.badge}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
              <Button variant="outline" size="sm" className="font-semibold" data-testid={`button-trade-${i}`}>{m.label}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trade */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Why Trade Futures on EyePay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFeatures.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-border" data-testid={`why-feature-${i}`}>
                <div className="mb-3">{f.icon}</div>
                <div className="font-bold mb-1">{f.title}</div>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 3 Movers */}
      <section className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top 3 Movers (24h Volume)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moversData.map((section, si) => (
            <div key={si} className="border border-border rounded-xl overflow-hidden" data-testid={`movers-section-${si}`}>
              <div className="bg-gray-50 px-4 py-3 border-b border-border">
                <div className="font-bold text-sm">{section.label}</div>
                <div className="text-xs text-muted-foreground">Vol: {section.volume}</div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left px-4 py-2">Symbol</th>
                    <th className="text-right px-4 py-2">Last Price</th>
                    <th className="text-right px-4 py-2">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-border/50 hover:bg-gray-50" data-testid={`mover-row-${si}-${ri}`}>
                      <td className="px-4 py-2.5 font-medium">{row.symbol}</td>
                      <td className="px-4 py-2.5 text-right">{row.price}</td>
                      <td className="px-4 py-2.5 text-right text-green-500 font-medium">{row.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2">
                <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View More</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Lead Portfolios */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Lead Portfolios</h2>
          <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View All Lead Traders</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPortfolios.map((trader, ti) => (
            <div key={ti} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow" data-testid={`trader-card-${ti}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: trader.color }}>{trader.name[0]}</div>
                <div>
                  <div className="font-bold text-sm">{trader.name}</div>
                  <div className="text-xs text-muted-foreground">{trader.handle}</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-muted-foreground">70 PNL (USDT)</div>
                <div className="text-xl font-extrabold text-green-500">{trader.pnl}</div>
                <div className="text-xs text-green-500 font-medium">ROI: {trader.roi}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground border-t border-border pt-3 mb-4">
                <div><div className="font-medium text-foreground">{trader.mdd}</div><div>MDD</div></div>
                <div><div className="font-medium text-foreground">{trader.ratio}</div><div>Sharpe Ratio</div></div>
                <div><div className="font-medium text-foreground">1,200</div><div>Followers</div></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 font-semibold" data-testid={`button-mock-${ti}`}>Mock</Button>
                <Button size="sm" className="flex-1 font-semibold" data-testid={`button-copy-${ti}`}>Copy</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer features */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Headphones className="w-7 h-7 text-[#1E63FF] mx-auto" />, title: "24/7 Support", desc: "Always here to help" },
            { icon: <Shield className="w-7 h-7 text-[#1E63FF] mx-auto" />, title: "Risk Management", desc: "Advanced tools to manage your risk" },
            { icon: <Monitor className="w-7 h-7 text-[#1E63FF] mx-auto" />, title: "Secure & Reliable", desc: "Bank-grade security" },
            { icon: <BookOpen className="w-7 h-7 text-[#1E63FF] mx-auto" />, title: "Learn & Grow", desc: "Resources to improve your trading" },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4" data-testid={`footer-feature-${i}`}>
              {f.icon}
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
