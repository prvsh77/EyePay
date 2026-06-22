import { Button } from "@/components/ui/button";
import { ChevronRight, Diamond, Send, Image, Users, Gift, Rocket, Zap, Pickaxe, Star, Wallet, Link, GraduationCap, Heart, Plane, LayoutGrid, Shield, Eye } from "lucide-react";

const products = [
  { icon: <Diamond className="w-5 h-5" />, title: "VIP & Institutional", desc: "Your trusted digital asset platform for VIPs and institutions" },
  { icon: <Send className="w-5 h-5" />, title: "Pay", desc: "Send, receive and spend crypto anytime, anywhere" },
  { icon: <Image className="w-5 h-5" />, title: "NFT", desc: "Explore NFTs from creators worldwide" },
  { icon: <Users className="w-5 h-5" />, title: "Affiliate", desc: "Earn up to 50% commission per trade from referrals" },
  { icon: <Gift className="w-5 h-5" />, title: "Referral", desc: "Invite friends to earn either a commission rebate or a one-time reward" },
  { icon: <Shield className="w-5 h-5" />, title: "EyePay Junior", desc: "A parent-supervised crypto account for kids and teens" },
  { icon: <Rocket className="w-5 h-5" />, title: "Launchpool", desc: "Discover and gain access to new token launches" },
  { icon: <Zap className="w-5 h-5" />, title: "Megadrop", desc: "Lock your BNB and complete Web3 quests for boosted airdrop rewards" },
  { icon: <Pickaxe className="w-5 h-5" />, title: "Mining Pool", desc: "Mine more rewards by connecting to the pool" },
  { icon: <Star className="w-5 h-5" />, title: "Fan Token", desc: "Discover an all-new fandom and unlock unlimited fan experiences" },
  { icon: <Wallet className="w-5 h-5" />, title: "EyePay Wallet", desc: "Access and Navigate Web3 Effortlessly" },
  { icon: <Link className="w-5 h-5" />, title: "BNB Chain", desc: "The most popular blockchain to build your own dApp" },
  { icon: <GraduationCap className="w-5 h-5" />, title: "EyePay Academy", desc: "Free crypto & blockchain education for all" },
  { icon: <Heart className="w-5 h-5" />, title: "Charity", desc: "Blockchain empowers charity to be more transparent, efficient, and traceable" },
  { icon: <Plane className="w-5 h-5" />, title: "Travel Rule", desc: "Enhance transparency and combat financial crimes such as money laundering and terrorism financing" },
  { icon: <LayoutGrid className="w-5 h-5" />, title: "And More", desc: "Explore even more features built to empower you", isHighlighted: true },
];

export default function More() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EEF3FF] to-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Explore More</h1>
            <h1 className="text-4xl font-extrabold text-[#1E63FF] mb-4">with EyePay</h1>
            <p className="text-muted-foreground text-lg">Discover all the products and services built to power your crypto journey.</p>
          </div>
          <div className="flex justify-center">
            {/* 3D NFT cube illustration */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-300 rounded-2xl opacity-40 transform rotate-12" />
              <div className="absolute inset-4 bg-gradient-to-br from-blue-300 to-purple-400 rounded-2xl opacity-60 transform rotate-6" />
              <div className="absolute inset-8 bg-gradient-to-br from-[#1E63FF] to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">NFT</span>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#F7931A] border-2 border-white shadow-lg" />
              <div className="absolute bottom-4 left-0 w-6 h-6 rounded-full bg-[#627EEA] border-2 border-white shadow-lg" />
              <div className="absolute top-12 left-0 w-5 h-5 rounded-full bg-gray-300 border-2 border-white shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div
              key={i}
              className={`border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group ${p.isHighlighted ? "border-[#1E63FF]/40 bg-blue-50/50" : "border-border hover:border-gray-300"}`}
              data-testid={`product-card-${i}`}
            >
              <div className={`mb-3 ${p.isHighlighted ? "text-[#1E63FF]" : "text-foreground"}`}>{p.icon}</div>
              <div className={`font-bold text-sm mb-1.5 ${p.isHighlighted ? "text-[#1E63FF]" : ""}`}>{p.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              <ChevronRight className={`w-4 h-4 ${p.isHighlighted ? "text-[#1E63FF]" : "text-muted-foreground"} group-hover:translate-x-1 transition-transform`} />
            </div>
          ))}
        </div>
      </section>

      {/* App download banner */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-[#EEF3FF] to-[#E0E8FF] rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs font-semibold text-[#1E63FF] uppercase tracking-wide mb-2">EyePay App</div>
            <h2 className="text-2xl font-extrabold mb-2">Trade. Earn. Track.<br />All in one place.</h2>
            <p className="text-muted-foreground text-sm mb-5">Manage your portfolio, track the market, and explore powerful tools — anytime, anywhere.</p>
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors" data-testid="button-app-store">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/></svg>
                <div className="text-left">
                  <div className="text-xs opacity-70 leading-none">GET IT ON</div>
                  <div className="font-bold text-sm leading-tight">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors" data-testid="button-google-play">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M3.18 23.76c.3.17.65.27 1.02.27.35 0 .68-.08.98-.23L16.9 12 5.18 0.2C4.88.05 4.55 0 4.2 0c-.37 0-.72.1-1.02.26V23.76zM19.13 10.35L16.9 12l2.22 1.65L21 12.75c.6-.35.6-.9 0-1.25l-1.87-1.15z"/></svg>
                <div className="text-left">
                  <div className="text-xs opacity-70 leading-none">GET IT ON</div>
                  <div className="font-bold text-sm leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {[{ bg: "#1E2D6B", label: "$18,735.45" }, { bg: "#0F1B40", label: "Markets" }].map((phone, i) => (
              <div key={i} className="w-32 h-52 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white text-xs font-bold" style={{ background: phone.bg }}>
                <Eye className="w-6 h-6 mb-2 opacity-60" />
                <span className="opacity-80">{phone.label}</span>
                <div className="w-16 h-8 mt-3">
                  <svg viewBox="0 0 60 30" className="w-full h-full">
                    <polyline points="0,25 10,20 20,22 30,15 40,12 50,8 60,5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="max-w-[1400px] mx-auto px-4 pb-16">
        <div className="text-center py-12 border border-border rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground mb-5">We're here to help.</p>
          <Button variant="outline" className="font-semibold px-6" data-testid="button-help-center">
            Visit Help Center <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
