import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Monitor, BarChart2, Bot, Users, TrendingUp, BookOpen, Headphones, X, Check, Award } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/use-auth";

const ticker = [
  { symbol: "BTCUSDT", type: "Perpetual", change: "-0.25%", up: false, price: "65,534.40" },
  { symbol: "ETHUSDT", type: "Perpetual", change: "-1.36%", up: false, price: "1,771.27" },
  { symbol: "BNBUSDT", type: "Perpetual", change: "-0.31%", up: false, price: "608.91" },
  { symbol: "SOLUSDT", type: "Perpetual", change: "-0.31%", up: false, price: "73.51" },
  { symbol: "XRPUSDT", type: "Perpetual", change: "-0.93%", up: false, price: "1.2099" },
];

const markets = [
  { icon: <BarChart2 className="w-5 h-5 text-primary" />, title: "USD-M Futures", desc: "Perpetual or Quarterly Contracts settled in USDT and USDC.", label: "Trade Now" },
  { icon: <BarChart2 className="w-5 h-5 text-primary" />, title: "COIN-M Futures", desc: "Perpetual or Quarterly Contracts settled in Cryptocurrency.", label: "Trade Now" },
  { icon: <BarChart2 className="w-5 h-5 text-primary" />, title: "EyePay Options", desc: "Crypto Options made simple with Classic or Easy mode and settled in USDT.", label: "Trade Now", badge: "New" },
  { icon: <Bot className="w-5 h-5 text-primary" />, title: "Trading Bots", desc: "Trade like a pro with our best-in-class strategic bots.", label: "Trade Now" },
  { icon: <Users className="w-5 h-5 text-primary" />, title: "Copy Trading", desc: "Boost your earnings by copying top performing traders.", label: "Trade Now", badge: "New" },
  { icon: <TrendingUp className="w-5 h-5 text-primary" />, title: "Smart Money", desc: "Follow the highest performing traders and benefit from their success.", label: "Trade Now" },
];

const moversData = [
  {
    label: "USD-M Futures",
    volume: "776,123.168 BTC",
    rows: [
      { symbol: "AGTUSDT", price: "0.0277700", change: "+108.4%" },
      { symbol: "SYMUSDT", price: "0.0724900", change: "+55.3%" },
      { symbol: "DCOMPUSDT", price: "0.0322590", change: "+48.0%" },
    ],
  },
  {
    label: "COIN-M Futures",
    volume: "16,951.31 BTC",
    rows: [
      { symbol: "XLMUSD CM", price: "0.22500", change: "+2.4%" },
      { symbol: "UNUSD CM", price: "3.274", change: "+2.3%" },
      { symbol: "FILUSDT CM", price: "0.811", change: "+2.0%" },
    ],
  },
  {
    label: "EyePay Options",
    volume: "10,227.53 BTC",
    rows: [
      { symbol: "BNB-260519-570-P", price: "6.10", change: "+1425.0%" },
      { symbol: "BTC-270326-92000-P", price: "8,365.00", change: "+543.0%" },
      { symbol: "BTC-270326-93000-P", price: "20,300.00", change: "+383.3%" },
    ],
  },
];

const initialPortfolios = [
  { name: "自在赚钱", handle: "@user1", pnl: "$52,857.68", roi: "+77.08%", mdd: "121,344.24", ratio: "1.91%", color: "#F7931A" },
  { name: "ArtLee", handle: "@artlee", pnl: "$44,535.61", roi: "+46.68%", mdd: "140,937.11", ratio: "0.97%", color: "#1E63FF" },
  { name: "BullRunVision", handle: "@bullrun", pnl: "$43,886.00", roi: "+66.56%", mdd: "71,692.12", ratio: "9.54%", color: "#9945FF" },
];

export default function Futures() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Interactive States
  const [showArenaRegister, setShowArenaRegister] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<typeof initialPortfolios[0] | null>(null);
  const [showTradingSandbox, setShowTradingSandbox] = useState(false);
  const [copiersCount, setCopiersCount] = useState<Record<string, boolean>>({});
  
  // Copy form states
  const [copyAmount, setCopyAmount] = useState("500");
  const [copyLeverage, setCopyLeverage] = useState("5");
  
  // Trade Terminal States
  const [positionSide, setPositionSide] = useState<"LONG" | "SHORT">("LONG");
  const [tradeAmount, setTradeAmount] = useState("100");
  const [tradeLeverage, setTradeLeverage] = useState("10");
  const [positions, setPositions] = useState<Array<{
    symbol: string;
    side: "LONG" | "SHORT";
    leverage: number;
    margin: number;
    entry: number;
    pnl: number;
  }>>([]);

  const handleRegisterArena = () => {
    setShowArenaRegister(true);
    toast({
      title: "Masters Arena Tournament",
      description: "Allocated simulated entry credentials.",
    });
  };

  const handleConfirmCopy = () => {
    if (!selectedTrader) return;
    setCopiersCount({
      ...copiersCount,
      [selectedTrader.handle]: true
    });
    toast({
      title: "Copying Strategy",
      description: `Allocated $${copyAmount} USDT for copying ${selectedTrader.name} at ${copyLeverage}x leverage limit.`,
    });
    setSelectedTrader(null);
  };

  const handlePlaceTrade = () => {
    const entryPrice = 65534.40;
    const margin = parseFloat(tradeAmount) || 10;
    const leverage = parseInt(tradeLeverage) || 10;
    
    const newPos = {
      symbol: "BTCUSDT Perpetual",
      side: positionSide,
      leverage,
      margin,
      entry: entryPrice,
      pnl: 0
    };
    
    setPositions([newPos, ...positions]);
    toast({
      title: "Position Opened",
      description: `Entered ${positionSide} position on BTCUSDT with $${margin} margin at ${leverage}x leverage.`,
    });
  };

  const handleClosePosition = (index: number) => {
    setPositions(positions.filter((_, idx) => idx !== index));
    toast({
      title: "Position Closed",
      description: "Simulated position has been closed and margins returned to collateral.",
    });
  };

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-1">Trade Crypto</h1>
            <h1 className="text-4xl font-extrabold text-primary mb-4">Futures</h1>
            <p className="text-muted-foreground mb-6">Advanced tools. Deep liquidity. Low fees.<br />Trade futures with confidence.</p>
            <div className="flex gap-3">
              <Button onClick={() => setShowTradingSandbox(true)} className="px-6 font-bold" data-testid="button-register">Open Trading Terminal</Button>
              <Button variant="outline" onClick={handleRegisterArena} className="px-6 font-bold" data-testid="button-login-futures">Masters Arena</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 text-white w-64 border border-border/40 shadow-xl">
              <div className="text-xs text-gray-400 mb-1">BTC/USDT Perpetual</div>
              <div className="text-2xl font-extrabold text-green-400">65,534.40</div>
              <div className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                <span>▲ +0.25%</span>
                <span className="text-gray-400 font-normal">| Funding: 0.0100%</span>
              </div>
              <div className="mt-3 h-16 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-lg flex items-end p-1">
                <svg viewBox="0 0 100 30" className="w-full h-12" preserveAspectRatio="none">
                  <polyline points="0,25 20,22 40,24 60,15 80,18 100,5" fill="none" stroke="#22c55e" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 mt-2">24h Volume: 28.45B USDT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live ticker */}
      <section className="border-y border-border/40 bg-muted/20 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex gap-8 overflow-x-auto">
          {ticker.map((t, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-3" data-testid={`ticker-${t.symbol}`}>
              <div>
                <div className="text-xs text-muted-foreground font-mono">{t.symbol}</div>
                <div className="font-bold text-sm text-foreground">{t.price}</div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${t.change.startsWith("+") ? "bg-green-100 dark:bg-green-950/40 text-green-600" : "bg-red-100 dark:bg-red-950/40 text-red-600"}`}>{t.change}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#0A0E27] via-[#1E2D6B] to-[#0A0E27] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white border border-blue-900/40 shadow-xl">
          <div>
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">Futures Masters Arena</div>
            <div className="text-xl font-bold">4th Round is Live!</div>
            <p className="text-xs text-blue-200 mt-1 max-w-lg">Join the Futures Trading Sprint and share up to 4 Million USDT Prize Pool!</p>
            <Button onClick={handleRegisterArena} className="mt-4 bg-primary hover:bg-primary-foreground/90 text-white font-semibold" data-testid="button-join-now">Join Tournament</Button>
          </div>
          <div className="text-center md:mr-10">
            <div className="text-5xl font-extrabold text-yellow-400 animate-pulse">4M</div>
            <div className="text-xs font-bold text-yellow-300 uppercase tracking-wider">USDT Pool</div>
          </div>
        </div>
      </section>

      {/* Our Markets */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-foreground">Our Markets</h2>
          <div className="flex gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTradingSandbox(true); }} className="text-sm text-primary hover:underline font-medium">View All Markets</a>
            <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Rules & Safety", description: "Perpetual leverages cap at 125x. Liquidations trigger under margin requirements." }); }} className="text-sm text-primary hover:underline font-medium">Rules</a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((m, i) => (
            <div key={i} className="glass-card rounded-xl p-5 border border-border/50 hover:shadow-md transition-shadow flex flex-col justify-between" data-testid={`market-card-${i}`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {m.icon}
                  <span className="font-bold text-foreground">{m.title}</span>
                  {m.badge && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-semibold">{m.badge}</span>}
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{m.desc}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowTradingSandbox(true)} className="font-semibold w-full mt-2" data-testid={`button-trade-${i}`}>{m.label}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Top Lead Portfolios */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Top Lead Portfolios</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Lead Traders Index", description: "Loading ROI leaderboard indexes..." }); }} className="text-sm text-primary hover:underline font-medium">View All Lead Traders</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialPortfolios.map((trader, ti) => (
            <div key={ti} className="glass-card rounded-xl p-5 border border-border/50 hover:shadow-md transition-shadow" data-testid={`trader-card-${ti}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: trader.color }}>{trader.name[0]}</div>
                <div>
                  <div className="font-bold text-sm text-foreground">{trader.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{trader.handle}</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">70D PNL (USDT)</div>
                <div className="text-lg font-extrabold text-green-500">{trader.pnl}</div>
                <div className="text-xs text-green-500 font-semibold">ROI: {trader.roi}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground border-t border-border/40 pt-3 mb-4 font-mono">
                <div><div className="font-semibold text-foreground">{trader.mdd}</div><div>MDD</div></div>
                <div><div className="font-semibold text-foreground">{trader.ratio}</div><div>Sharpe</div></div>
                <div><div className="font-semibold text-foreground">{copiersCount[trader.handle] ? "1,201" : "1,200"}</div><div>Followers</div></div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-semibold text-xs"
                  onClick={() => setShowTradingSandbox(true)}
                  data-testid={`button-mock-${ti}`}
                >
                  Trade
                </Button>
                <Button
                  size="sm"
                  className="flex-1 font-semibold text-xs"
                  onClick={() => setSelectedTrader(trader)}
                  data-testid={`button-copy-${ti}`}
                >
                  {copiersCount[trader.handle] ? "Copying" : "Copy"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Movers Table */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moversData.map((section, si) => (
            <div key={si} className="glass-card rounded-xl overflow-hidden border border-border/50" data-testid={`movers-section-${si}`}>
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <div className="font-bold text-xs text-foreground uppercase tracking-wider">{section.label}</div>
                <div className="text-[10px] text-muted-foreground font-mono">Vol: {section.volume}</div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-[10px] font-semibold bg-muted/10">
                    <th className="text-left px-4 py-2">Symbol</th>
                    <th className="text-right px-4 py-2">Last Price</th>
                    <th className="text-right px-4 py-2 pr-4">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-border/30 last:border-b-0 hover:bg-muted/30 cursor-pointer" onClick={() => setShowTradingSandbox(true)} data-testid={`mover-row-${si}-${ri}`}>
                      <td className="px-4 py-2.5 font-medium text-foreground font-mono">{row.symbol}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{row.price}</td>
                      <td className="px-4 py-2.5 text-right pr-4 text-green-500 font-semibold font-mono">{row.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* Copy Settings Modal */}
      {selectedTrader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setSelectedTrader(null)}>
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: selectedTrader.color }}>{selectedTrader.name[0]}</div>
              <div>
                <h3 className="font-bold text-sm">Copy {selectedTrader.name}</h3>
                <span className="text-xs text-muted-foreground font-mono">PNL: {selectedTrader.pnl} | ROI: {selectedTrader.roi}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Copy Investment (USDT)</label>
                <input
                  type="number"
                  value={copyAmount}
                  onChange={e => setCopyAmount(e.target.value)}
                  className="w-full mt-1 border border-border/80 bg-background/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold">Max Leverage Limiter</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range" min="1" max="50"
                    value={copyLeverage}
                    onChange={e => setCopyLeverage(e.target.value)}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <span className="font-bold text-sm font-mono w-10 text-right">{copyLeverage}x</span>
                </div>
              </div>
              
              <Button onClick={handleConfirmCopy} className="w-full font-semibold">Confirm Copy Settings</Button>
            </div>
          </div>
        </div>
      )}

      {/* Masters Arena Registration Dialog */}
      {showArenaRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative text-center">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setShowArenaRegister(false)}>
              <X className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Welcome to Masters Arena!</h3>
            <p className="text-xs text-muted-foreground mb-4">Your virtual trading account has been registered for Round 4. You receive a simulated collateral pool of $10,000 USDT to compete.</p>
            <Button onClick={() => { setShowArenaRegister(false); setShowTradingSandbox(true); }} className="w-full font-semibold">Proceed to Trading Room</Button>
          </div>
        </div>
      )}

      {/* FUTURES TRADING TERMINAL SIDEBAR/OVERLAY */}
      {showTradingSandbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs text-foreground p-0 sm:p-4">
          <div className="w-full max-w-xl h-full sm:h-[90vh] glass-card rounded-none sm:rounded-2xl flex flex-col relative border border-border/60 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm">EyePay Sandbox Terminal (BTCUSDT)</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowTradingSandbox(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Long / Short toggle */}
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-xl">
                <button
                  onClick={() => setPositionSide("LONG")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${positionSide === "LONG" ? "bg-green-500 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Buy / Long
                </button>
                <button
                  onClick={() => setPositionSide("SHORT")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${positionSide === "SHORT" ? "bg-red-500 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Sell / Short
                </button>
              </div>

              {/* Order Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Order Type</span>
                  <span className="text-primary font-mono cursor-pointer">Market Order</span>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Collateral Margin (USDT)</label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(e.target.value)}
                    className="w-full mt-1 border border-border/80 bg-background/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                    <span>Leverage Factor</span>
                    <span className="font-mono text-foreground">{tradeLeverage}x</span>
                  </div>
                  <input
                    type="range" min="1" max="125"
                    value={tradeLeverage}
                    onChange={e => setTradeLeverage(e.target.value)}
                    className="w-full accent-primary mt-1 cursor-pointer"
                  />
                </div>

                <div className="bg-muted/10 rounded-xl p-3 border border-border/40 text-xs space-y-1.5 font-mono text-muted-foreground">
                  <div className="flex justify-between"><span>Liquidation Est.</span><span className="text-foreground">${positionSide === "LONG" ? "59,429.11" : "71,324.90"}</span></div>
                  <div className="flex justify-between"><span>Max Position Size</span><span className="text-foreground">${(parseFloat(tradeAmount) * parseFloat(tradeLeverage)).toLocaleString()} USDT</span></div>
                </div>

                <Button
                  onClick={handlePlaceTrade}
                  className={`w-full py-2.5 font-bold ${positionSide === "LONG" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  Place {positionSide} Position
                </Button>
              </div>

              {/* Positions List */}
              <div className="border-t border-border/40 pt-4">
                <h4 className="font-bold text-xs text-foreground mb-3">Open Positions ({positions.length})</h4>
                {positions.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border/50 rounded-xl">No active contract positions. Place trades above.</div>
                ) : (
                  <div className="space-y-2">
                    {positions.map((pos, idx) => (
                      <div key={idx} className="bg-muted/30 border border-border/40 rounded-xl p-3 flex flex-col justify-between text-xs">
                        <div className="flex justify-between mb-1.5 items-center">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${pos.side === "LONG" ? "bg-green-100 dark:bg-green-950/40 text-green-600" : "bg-red-100 dark:bg-red-950/40 text-red-600"}`}>{pos.side}</span>
                            <span className="font-semibold text-foreground font-mono">{pos.symbol}</span>
                          </div>
                          <span className="font-bold text-green-500 font-mono">+${(pos.margin * 0.043).toFixed(2)} USDT</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground font-mono mb-2">
                          <div>Size: ${(pos.margin * pos.leverage).toFixed(2)}</div>
                          <div>Entry: ${pos.entry}</div>
                          <div>Margin: ${pos.margin}</div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleClosePosition(idx)} className="h-7 text-[10px] font-bold">Close Contract</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
