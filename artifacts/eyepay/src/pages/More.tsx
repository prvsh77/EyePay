import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";
import { ChevronRight, Diamond, Send, Image, Users, Gift, Rocket, Zap, Pickaxe, Star, Wallet, Link, GraduationCap, Heart, Plane, LayoutGrid, Shield, Eye } from "lucide-react";

const products = [
  { icon: <Diamond className="w-5 h-5 text-primary" />, title: "VIP & Institutional", desc: "Your trusted digital asset platform for VIPs and institutions" },
  { icon: <Send className="w-5 h-5 text-primary" />, title: "Pay", desc: "Send, receive and spend crypto anytime, anywhere" },
  { icon: <Image className="w-5 h-5 text-primary" />, title: "NFT", desc: "Explore NFTs from creators worldwide" },
  { icon: <Users className="w-5 h-5 text-primary" />, title: "Affiliate", desc: "Earn up to 50% commission per trade from referrals" },
  { icon: <Gift className="w-5 h-5 text-primary" />, title: "Referral", desc: "Invite friends to earn either a commission rebate or a reward" },
  { icon: <Shield className="w-5 h-5 text-primary" />, title: "EyePay Junior", desc: "A parent-supervised crypto account for kids and teens" },
  { icon: <Rocket className="w-5 h-5 text-primary" />, title: "Launchpool", desc: "Discover and gain access to new token launches" },
  { icon: <Zap className="w-5 h-5 text-primary" />, title: "Megadrop", desc: "Lock your BNB and complete Web3 quests for boosted rewards" },
  { icon: <Pickaxe className="w-5 h-5 text-primary" />, title: "Mining Pool", desc: "Mine more rewards by connecting to the pool" },
  { icon: <Star className="w-5 h-5 text-primary" />, title: "Fan Token", desc: "Discover an all-new fandom and unlock fan experiences" },
  { icon: <Wallet className="w-5 h-5 text-primary" />, title: "EyePay Wallet", desc: "Access and Navigate Web3 Effortlessly" },
  { icon: <Link className="w-5 h-5 text-primary" />, title: "BNB Chain", desc: "The most popular blockchain to build your own dApp" },
  { icon: <GraduationCap className="w-5 h-5 text-primary" />, title: "EyePay Academy", desc: "Free crypto & blockchain education for all" },
  { icon: <Heart className="w-5 h-5 text-primary" />, title: "Charity", desc: "Blockchain empowers charity to be more transparent and traceable" },
  { icon: <Plane className="w-5 h-5 text-primary" />, title: "Travel Rule", desc: "Enhance transparency and combat financial crimes such as money laundering" },
  { icon: <LayoutGrid className="w-5 h-5 text-primary" />, title: "And More", desc: "Explore even more features built to empower you", isHighlighted: true },
];

export default function More() {
  const { toast } = useToast();

  const handleProductClick = (title: string) => {
    toast({
      title: `${title} Portal`,
      description: `Opening secure client gateway for ${title} sandbox module...`,
    });
  };

  return (
    <div className="bg-transparent text-foreground relative z-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-transparent to-transparent py-16">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-foreground">Explore More</h1>
            <h1 className="text-4xl font-extrabold text-primary mb-4">with EyePay</h1>
            <p className="text-muted-foreground text-lg">Discover all the products and services built to power your crypto journey.</p>
          </div>
          <div className="flex justify-center">
            {/* NFT Illustration */}
            <div className="relative w-44 h-44">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-md" />
              <div className="absolute inset-4 bg-gradient-to-br from-blue-300 to-purple-400 rounded-2xl opacity-60 transform rotate-6" />
              <div className="absolute inset-8 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold font-mono">NFT</span>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#F7931A] border-2 border-background shadow-lg" />
              <div className="absolute bottom-4 left-0 w-6 h-6 rounded-full bg-[#627EEA] border-2 border-background shadow-lg" />
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
              onClick={() => handleProductClick(p.title)}
              className={`glass-card rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between ${p.isHighlighted ? "border-primary/40 bg-primary/5" : ""}`}
              data-testid={`product-card-${i}`}
            >
              <div>
                <div className={`mb-3 ${p.isHighlighted ? "text-primary" : "text-foreground"}`}>{p.icon}</div>
                <div className={`font-bold text-sm mb-1.5 text-foreground ${p.isHighlighted ? "text-primary" : ""}`}>{p.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              </div>
              <ChevronRight className={`w-4 h-4 ${p.isHighlighted ? "text-primary" : "text-muted-foreground"} group-hover:translate-x-1 transition-transform mt-auto`} />
            </div>
          ))}
        </div>
      </section>

      {/* App download banner */}
      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-slate-900/40 dark:to-slate-900/10 border border-border/50 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 font-mono">EyePay App</div>
            <h2 className="text-2xl font-extrabold mb-2 text-foreground">Trade. Earn. Track.<br />All in one place.</h2>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">Manage your portfolio, track the market, and explore powerful tools — anytime, anywhere.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => handleProductClick("App Store Download")} className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow" data-testid="button-app-store">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-70 leading-none">GET IT ON</div>
                  <div className="font-bold text-xs leading-tight">App Store</div>
                </div>
              </button>
              <button onClick={() => handleProductClick("Google Play Download")} className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow" data-testid="button-google-play">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M3.18 23.76c.3.17.65.27 1.02.27.35 0 .68-.08.98-.23L16.9 12 5.18 0.2C4.88.05 4.55 0 4.2 0c-.37 0-.72.1-1.02.26V23.76zM19.13 10.35L16.9 12l2.22 1.65L21 12.75c.6-.35.6-.9 0-1.25l-1.87-1.15z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-70 leading-none">GET IT ON</div>
                  <div className="font-bold text-xs leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {[{ bg: "bg-slate-900", label: "$18,735.45" }, { bg: "bg-slate-950", label: "Markets" }].map((phone, i) => (
              <div key={i} className={`w-32 h-52 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white text-[10px] font-bold ${phone.bg} border border-white/5`}>
                <Eye className="w-6 h-6 mb-2 opacity-60 text-primary" />
                <span className="opacity-80 font-mono">{phone.label}</span>
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
        <div className="text-center py-12 glass-card border border-border/50 rounded-2xl">
          <h3 className="text-xl font-bold mb-2 text-foreground">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground mb-5 text-sm">We're here to help.</p>
          <Button variant="outline" onClick={() => handleProductClick("Help Center")} className="font-semibold px-6" data-testid="button-help-center">
            Visit Help Center <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
