import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const flexibleProducts = [
  { symbol: "USDC", color: "#2775CA", apr: "6.34%", type: "Flexible" },
  { symbol: "USDT", color: "#26A17B", apr: "5.14%", type: "Flexible" },
  { symbol: "U", color: "#8B5CF6", apr: "8.56%", type: "Flexible" },
  { symbol: "USD1", color: "#F59E0B", apr: "10.51%", type: "Flexible" },
];

const popularProducts = [
  { symbol: "USDC", color: "#2775CA", aprRange: "3.36% ~ 6.34%", duration: "Flexible" },
  { symbol: "USDT", color: "#26A17B", aprRange: "2.42% ~ 5.14%", duration: "Flexible" },
  { symbol: "USD1", color: "#F59E0B", aprRange: "10.51% Max", duration: "Flexible" },
  { symbol: "BNB", color: "#F3BA2F", aprRange: "0.16% ~ 56.58%", duration: "Flexible / Locked" },
  { symbol: "BTC", color: "#F7931A", aprRange: "0.24% ~ 101.86%", duration: "Flexible / Locked" },
  { symbol: "ETH", color: "#627EEA", aprRange: "1.26% ~ 219.47%", duration: "Flexible / Locked" },
  { symbol: "SOL", color: "#9945FF", aprRange: "1.80% ~ 98.31%", duration: "Flexible / Locked" },
  { symbol: "XUSD", color: "#14B6E7", aprRange: "2.29%", duration: "Flexible" },
  { symbol: "FDUSD", color: "#1E63FF", aprRange: "0.80%", duration: "Flexible" },
  { symbol: "EURI", color: "#3498DB", aprRange: "1.41%", duration: "Flexible" },
];

const categories = [
  { icon: "🏦", title: "Overview", desc: "One-stop portal for all Earn products" },
  { icon: "💰", title: "Simple Earn", desc: "Earn passive income on 300+ crypto assets with flexible and locked terms" },
  { icon: "📈", title: "Advanced Earn", desc: "Maximize your returns with our advanced yield investment products" },
  { icon: "🏠", title: "Loans", desc: "Access quick and easy loans with our competitive rates" },
];

const faqs = [
  ["What is EyePay Earn?", "EyePay Earn is a one-stop portal for all earning products, including Simple Earn, Advanced Earn, and Loans."],
  ["How does EyePay Earn work?", "You deposit supported cryptocurrencies and earn interest based on the product type and duration you select."],
  ["Which cryptocurrencies are supported?", "EyePay Earn supports 300+ cryptocurrencies including BTC, ETH, BNB, USDT, USDC, and many more."],
  ["Am I eligible for EyePay Earn?", "Users from eligible regions with verified accounts can participate. Some products may have additional requirements."],
  ["How do I start earning?", "Log in, navigate to Earn, choose a product, select the cryptocurrency and amount, then subscribe."],
  ["Why does the value of my earnings go up and down?", "Earnings value changes with cryptocurrency market prices. The underlying crypto amount remains as earned."],
  ["How do I know if this email about EyePay Earn is legitimate?", "Always verify emails at eyepay.com/security. EyePay will never ask for your password via email."],
  ["Where can I find more information?", "Visit our Help Center at support.eyepay.com for comprehensive guides and FAQs about Earn products."],
];

function CoinDot({ color }: { color: string }) {
  return <span className="w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0 inline-block" style={{ background: color }} />;
}

export default function Earn() {
  const [investAmount, setInvestAmount] = useState("1000");
  const [investType, setInvestType] = useState<"flexible" | "locked">("flexible");

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EEF3FF] to-white py-14">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Earn Crypto,</h1>
            <h1 className="text-4xl font-extrabold text-[#1E63FF] mb-4">Grow Your Future</h1>
            <p className="text-muted-foreground mb-6">Start earning passive income on 300+ cryptocurrencies with flexible and locked products.</p>
            <div className="flex gap-3">
              <Button className="font-semibold" data-testid="button-earn-login">Log In / Sign Up</Button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gray-900 rounded-2xl p-5 text-white max-w-xs w-full">
              <div className="text-xs text-blue-300 mb-1 font-medium">EyePay Earn</div>
              <div className="text-base font-bold">USDe Rewards Are Here</div>
              <p className="text-xs text-gray-300 mt-1">Simply Holding to Earn Rewards</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">$</div>
                <svg viewBox="0 0 60 24" width="60" height="24">
                  <polyline points="0,20 15,16 30,10 45,6 60,2" fill="none" stroke="#22c55e" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible product cards */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {flexibleProducts.map((p, i) => (
            <div key={i} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer" data-testid={`earn-product-${p.symbol}`}>
              <div className="flex items-center gap-2 mb-3">
                <CoinDot color={p.color} />
                <span className="font-bold">{p.symbol}</span>
              </div>
              <div className="text-xs text-muted-foreground">{p.type}</div>
              <div className="text-xs text-muted-foreground mb-1">Max. APR</div>
              <div className="text-2xl font-extrabold text-[#1E63FF]">{p.apr}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="Search coins" className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-44" data-testid="input-earn-search" />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 border border-border rounded-xl text-sm hover:bg-gray-50" data-testid="filter-duration">All Durations <ChevronDown className="w-4 h-4" /></button>
          <button className="flex items-center gap-1 px-4 py-2 border border-border rounded-xl text-sm hover:bg-gray-50" data-testid="filter-products">All Products <ChevronDown className="w-4 h-4" /></button>
        </div>

        {/* Popular Products table */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Popular Products</h3>
            <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">Yield Arena</a>
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
              <div>Coins</div>
              <div className="text-right">Est. APR</div>
              <div className="text-right">Duration</div>
            </div>
            {popularProducts.map((p, i) => (
              <div key={i} className="grid grid-cols-3 items-center px-5 py-3.5 border-b border-border/50 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer" data-testid={`popular-product-${p.symbol}`}>
                <div className="flex items-center gap-2.5">
                  <CoinDot color={p.color} />
                  <span className="font-semibold text-sm">{p.symbol}</span>
                </div>
                <div className="text-right text-green-500 font-semibold text-sm">{p.aprRange}</div>
                <div className="text-right flex items-center justify-end gap-1 text-sm text-muted-foreground">
                  {p.duration} <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium" data-testid="link-view-more-earn">View More</a>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="border border-border rounded-2xl p-6">
          <h3 className="font-bold text-xl mb-5">Calculate your crypto earnings</h3>
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <span className="text-muted-foreground">I have</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <input
                type="number"
                value={investAmount}
                onChange={e => setInvestAmount(e.target.value)}
                className="w-24 px-3 py-2 focus:outline-none font-bold"
                data-testid="input-calc-amount"
              />
              <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-l border-border font-semibold">
                <span className="w-4 h-4 rounded-full bg-[#26A17B] inline-block" /> USDT <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-muted-foreground">and I am interested in</span>
            <div className="flex gap-1">
              {(["flexible", "locked"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setInvestType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${investType === t ? "bg-[#1E63FF] text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"}`}
                  data-testid={`calc-type-${t}`}
                >{t}</button>
              ))}
            </div>
            <span className="text-muted-foreground">investment.</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-2">Products on offer</div>
              <div className="border border-border rounded-xl p-4 bg-gray-50">
                <div className="font-bold">Simple Earn</div>
                <div className="text-xs text-muted-foreground">Low Risk</div>
                <div className="text-sm font-semibold text-green-600 mt-1">1.14% ~ 4%</div>
                <div className="text-xs text-muted-foreground">APR Breakdown</div>
                <Button className="mt-3 w-full" size="sm" data-testid="button-subscribe-earn">Subscribe Now</Button>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Estimated Earnings</div>
              <div className="text-3xl font-extrabold text-green-500 mb-2">
                + {(parseFloat(investAmount || "0") * 0.0314 * 3).toFixed(5)} USDT
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked className="accent-[#1E63FF]" /> Auto-Compounding</label>
                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked className="accent-[#1E63FF]" /> Auto-Subscribe</label>
              </div>
              <div className="bg-gradient-to-r from-[#1E63FF]/5 to-transparent rounded-xl h-24 flex items-end px-4 pb-2 relative">
                <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
                  <polygon points="0,55 75,50 150,35 225,20 300,5 300,60 0,60" fill="rgba(30,99,255,0.15)" />
                  <polyline points="0,55 75,50 150,35 225,20 300,5" fill="none" stroke="#1E63FF" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-muted-foreground px-4">
                  {["1 year", "2 years", "3 years", "5 years"].map((y, i) => (
                    <span key={i} className={i === 2 ? "text-[#1E63FF] font-bold" : ""}>{y}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group" data-testid={`earn-category-${i}`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="font-bold mb-1">{c.title}</div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-[#1E63FF] transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">Frequently Asked Questions</h3>
          <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View all FAQs</a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map(([q, a], i) => (
            <Accordion type="single" collapsible key={i}>
              <AccordionItem value={`earn-faq-${i}`} className="border border-border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium text-left" data-testid={`earn-faq-${i}`}>{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">Digital asset prices can be volatile. The value of your investment may go down or up and you may not get back the amount invested. Not financial advice. For more information, see our Terms of Use and Risk Warning.</p>
      </section>
    </div>
  );
}
