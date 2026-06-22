import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Headphones, RefreshCw, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const popularCoins = [
  { name: "Bitcoin", symbol: "BTC", price: "$65,847.18", change: "+0.08%", up: true, color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", price: "$3,492.21", change: "+1.12%", up: true, color: "#627EEA" },
  { name: "Tether", symbol: "USDT", price: "$1.00", change: "+0.01%", up: true, color: "#26A17B" },
  { name: "BNB", symbol: "BNB", price: "$604.08", change: "+0.61%", up: true, color: "#F3BA2F" },
  { name: "Solana", symbol: "SOL", price: "$142.36", change: "+2.35%", up: true, color: "#9945FF" },
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
  ["Can I buy crypto without verification?", "Some methods allow small purchases without full KYC, but full verification enables higher limits."],
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

function CoinDot({ color }: { color: string }) {
  return <span className="inline-block w-7 h-7 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />;
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

  const estBtc = (parseFloat(amount || "0") / 65847.18).toFixed(6);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EEF3FF] to-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Buy Crypto<br />in Seconds</h1>
            <p className="text-muted-foreground mb-6 text-lg">Secure, fast and simple way to buy Bitcoin and 200+ cryptocurrencies.</p>
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: <Shield className="w-5 h-5 text-[#1E63FF]" />, label: "Secure Transactions" },
                { icon: <Zap className="w-5 h-5 text-[#1E63FF]" />, label: "Instant Delivery" },
                { icon: <Headphones className="w-5 h-5 text-[#1E63FF]" />, label: "24/7 Support" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium">
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-border p-6 w-72">
              <div className="text-sm font-bold text-[#1E63FF] mb-3">EyePay — Buy Crypto</div>
              <div className="text-xs text-muted-foreground mb-1">You spend</div>
              <div className="text-3xl font-extrabold mb-1">100 <span className="text-lg font-semibold text-muted-foreground">USD</span></div>
              <div className="text-xs text-muted-foreground mb-1 mt-3">You get</div>
              <div className="text-2xl font-bold">0.001524 <span className="text-base font-semibold text-muted-foreground">BTC</span></div>
              <Button className="w-full mt-5 font-semibold">Buy BTC</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Buy/Sell/Convert + Popular */}
      <section className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex border-b border-border mb-5">
            {(["buy", "sell", "convert"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`capitalize px-5 py-2 text-sm font-semibold transition-colors ${tab === t ? "border-b-2 border-[#1E63FF] text-[#1E63FF]" : "text-muted-foreground"}`}
                data-testid={`tab-${t}`}
              >{t}</button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium">You spend</label>
              <div className="flex mt-1 border border-border rounded-xl overflow-hidden">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 px-4 py-3 text-2xl font-bold focus:outline-none"
                  data-testid="input-spend-amount"
                />
                <button className="flex items-center gap-1 px-4 bg-gray-50 border-l border-border text-sm font-semibold">
                  <span>🇺🇸</span> USD <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">You get (est.)</label>
              <div className="flex mt-1 border border-border rounded-xl overflow-hidden bg-gray-50">
                <div className="flex-1 px-4 py-3 text-2xl font-bold text-foreground/80">{estBtc}</div>
                <button className="flex items-center gap-1 px-4 border-l border-border text-sm font-semibold bg-gray-50">
                  <span className="w-5 h-5 rounded-full bg-[#F7931A] inline-block" /> BTC <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">1 BTC = $65,847.18 USD <RefreshCw className="inline w-3 h-3 ml-1" /></div>
            </div>
            <Button className="w-full py-3 text-base font-bold" data-testid="button-buy-btc">Buy BTC</Button>
            <p className="text-center text-xs text-muted-foreground">Secure payments powered by EyePay</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Popular Cryptocurrencies</h3>
            <a href="/markets" className="text-sm text-[#1E63FF] hover:underline font-medium">View all</a>
          </div>
          <div className="space-y-1">
            {popularCoins.map((coin) => (
              <div key={coin.symbol} className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" data-testid={`coin-row-${coin.symbol}`}>
                <CoinDot color={coin.color} />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-sm">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                </div>
                <div className="mr-6">
                  <MiniChart up={coin.up} />
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{coin.price}</div>
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
          <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View all conversions</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversions.map((c, i) => (
            <div key={i} className="flex items-center gap-3 border border-border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer" data-testid={`conversion-${c.from}-${c.to}`}>
              <div className="flex -space-x-1.5">
                <span className="w-8 h-8 rounded-full border-2 border-white shadow-sm inline-block" style={{ background: c.fromColor }} />
                <span className="w-8 h-8 rounded-full border-2 border-white shadow-sm inline-block" style={{ background: c.toColor }} />
              </div>
              <div>
                <div className="font-semibold text-sm">{c.from} to {c.to}</div>
                <div className="text-xs text-muted-foreground">{c.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bitcoin Markets + Conversion Table */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-border rounded-2xl p-6">
          <h3 className="font-bold text-xl mb-4">Bitcoin Markets</h3>
          <div className="flex items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F7931A] inline-block" />
                <span className="font-semibold">BTC/USD</span>
              </div>
              <div className="text-2xl font-extrabold mt-1">$65,847.18</div>
              <div className="text-green-500 text-sm font-medium">+0.08% (24h)</div>
            </div>
            <div className="flex gap-6 ml-auto text-sm">
              {[
                { label: "Market Cap", value: "$1.32T" },
                { label: "Volume", value: "$27.46B" },
                { label: "Circulating", value: "20.04M BTC" },
                { label: "Dominance", value: "51.28%" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                  <div className="font-bold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#1E63FF]/5 to-transparent rounded-xl h-28 flex items-end px-4 pb-2">
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
        <div className="border border-border rounded-2xl p-6">
          <div className="flex gap-3 mb-4">
            <button className="flex-1 py-2 text-sm font-semibold bg-gray-100 rounded-lg" data-testid="tab-btc-to-usd">BTC to USD</button>
            <button className="flex-1 py-2 text-sm font-semibold text-muted-foreground hover:bg-gray-50 rounded-lg" data-testid="tab-usd-to-btc">USD to BTC</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left pb-2">Amount</th>
                <th className="text-right pb-2">USD</th>
              </tr>
            </thead>
            <tbody>
              {conversionTable.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-gray-50" data-testid={`conversion-row-${i}`}>
                  <td className="py-2.5 font-medium">{row.amount}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{row.usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className="block text-center text-xs text-[#1E63FF] mt-3 hover:underline font-medium">View full conversion table</a>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">FAQs around Buying Crypto</h3>
          <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View all FAQs</a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map(([q, a], i) => (
            <Accordion type="single" collapsible key={i}>
              <AccordionItem value={`faq-${i}`} className="border border-border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium text-left" data-testid={`faq-${i}`}>{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </section>

      {/* Security CTA */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#1E63FF]" />
            <div>
              <div className="font-bold">Your security is our priority</div>
              <div className="text-sm text-muted-foreground">All transactions are encrypted and 100% secure</div>
            </div>
          </div>
          <Button className="px-8 font-bold" data-testid="button-start-buying">Start Buying Now</Button>
        </div>
      </section>
    </div>
  );
}
