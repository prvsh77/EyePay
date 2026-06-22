import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Shield, Zap, Globe, Headphones, CheckCircle, User, X } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";

function CoinIllustration() {
  return (
    <div className="relative w-72 h-56 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-100 dark:to-slate-800/40 rounded-3xl" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-10 bg-white/50 dark:bg-slate-900/50 rounded-full blur-md" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-background border border-border rounded-2xl shadow-xl flex items-center justify-center">
        <Eye className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute bottom-16 left-10 w-12 h-12 rounded-full bg-[#F7931A] border-2 border-background shadow-lg flex items-center justify-center text-white font-bold text-xs">BTC</div>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 ml-16 w-10 h-10 rounded-full bg-[#627EEA] border-2 border-background shadow-lg flex items-center justify-center text-white font-bold text-xs">ETH</div>
      <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-[#26A17B] border-2 border-background shadow-lg flex items-center justify-center text-white font-bold text-xs">T</div>
    </div>
  );
}

const features = [
  { icon: <Shield className="w-5 h-5 text-primary" />, title: "Secure", desc: "Bank-level security to protect you" },
  { icon: <Zap className="w-5 h-5 text-primary" />, title: "Fast", desc: "Quick and easy onboarding" },
  { icon: <Globe className="w-5 h-5 text-primary" />, title: "Global", desc: "Join millions of users worldwide" },
  { icon: <Headphones className="w-5 h-5 text-primary" />, title: "24/7 Support", desc: "We're here anytime you need us" },
];

const dialCodes = [
  { flag: "🇺🇸", code: "+1" },
  { flag: "🇬🇧", code: "+44" },
  { flag: "🇮🇳", code: "+91" },
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [dialCode, setDialCode] = useState("+1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQrScan, setShowQrScan] = useState(false);

  const { register, loginWithSocial } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Prefill email from redirect query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const passwordChecks = {
    length: password.length >= 8 && password.length <= 20,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password does not meet the security requirements.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({ name, email, password });
      toast({
        title: "Registration Successful",
        description: "Welcome to EyePay! Your virtual wallet is initialized.",
      });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      toast({
        title: "Connecting social token",
        description: `Creating account and initializing sandbox parameters with ${provider}...`,
      });
      await loginWithSocial(provider);
      toast({
        title: "Registration Complete",
        description: `Successfully signed up via ${provider}!`,
      });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Social Authentication Failed",
        description: err.message || "Failed to authenticate.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-muted/30 text-foreground relative z-10">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-background border-r border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex items-center justify-center">
            <Eye className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">EyePay</span>
        </Link>

        <div className="max-w-sm">
          <h1 className="text-4xl font-extrabold mb-1 text-foreground">Create your account</h1>
          <h1 className="text-4xl font-extrabold mb-1 text-foreground">and start your crypto</h1>
          <h1 className="text-4xl font-extrabold text-primary mb-4">journey</h1>
          <p className="text-muted-foreground mb-8">Join millions of traders on EyePay, the world's leading cryptocurrency exchange.</p>

          <CoinIllustration />

          <div className="grid grid-cols-2 gap-4 mt-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5" data-testid={`signup-feature-${i}`}>
                {f.icon}
                <div>
                  <div className="font-bold text-sm text-foreground">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2025 EyePay. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-border/50 shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-1 text-foreground">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline" data-testid="link-login">Log In</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl animate-shake" data-testid="signup-error">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Full Name</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 py-2.5 pr-3 text-sm focus:outline-none bg-transparent text-foreground"
                  data-testid="input-signup-name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Email address</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 py-2.5 pr-3 text-sm focus:outline-none bg-transparent text-foreground"
                  data-testid="input-signup-email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">
                Phone number <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center border border-border rounded-xl px-3 py-2.5 gap-1.5 cursor-pointer hover:bg-muted/30 transition-colors bg-background/50 text-foreground">
                  <span className="text-base">🇺🇸</span>
                  <select
                    value={dialCode}
                    onChange={e => setDialCode(e.target.value)}
                    className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer text-foreground dark:bg-slate-900"
                    data-testid="select-dial-code"
                  >
                    {dialCodes.map(d => <option key={d.code} value={d.code} className="dark:bg-slate-950">{d.code}</option>)}
                  </select>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground"
                  data-testid="input-signup-phone"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Password</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="flex-1 py-2.5 text-sm focus:outline-none bg-transparent text-foreground"
                  data-testid="input-signup-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 py-2.5 text-muted-foreground hover:text-foreground" data-testid="toggle-signup-password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password requirements */}
              <div className="flex gap-4 mt-2">
                {[
                  { ok: passwordChecks.length, label: "8-20 chars" },
                  { ok: passwordChecks.uppercase, label: "1 cap letter" },
                  { ok: passwordChecks.number, label: "1 number" },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-1" data-testid={`password-req-${i}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${req.ok ? "text-green-500" : "text-gray-300 dark:text-slate-700"}`} />
                    <span className={`text-xs ${req.ok ? "text-green-600" : "text-muted-foreground"}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">
                Referral ID <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input
                  type="text"
                  value={referral}
                  onChange={e => setReferral(e.target.value)}
                  placeholder="Enter referral ID"
                  className="flex-1 py-2.5 pr-3 text-sm focus:outline-none bg-transparent text-foreground"
                  data-testid="input-referral"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${agreed ? "bg-primary border-primary" : "border-border hover:border-gray-400"}`}
                data-testid="checkbox-terms"
              >
                {agreed && <svg viewBox="0 0 10 8" width="10" height="8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I agree to EyePay's{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Terms of Service", description: "Loading legal disclosures..." }); }} className="text-primary font-medium hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Privacy Policy", description: "Loading global data protection metrics..." }); }} className="text-primary font-medium hover:underline">Privacy Policy</a>
              </p>
            </div>

            <Button type="submit" className="w-full py-3 text-base font-bold" disabled={!agreed || loading || !isPasswordValid} data-testid="button-signup">
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background dark:bg-[#151f32] px-3 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">or continue with</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignup("google")}
                className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-muted/40 transition-colors bg-background/50 text-foreground"
                data-testid="button-google-signup"
                title="Sign Up with Google"
              >
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignup("apple")}
                className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-muted/40 transition-colors bg-background/50 text-foreground"
                data-testid="button-apple-signup"
                title="Sign Up with Apple"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/></svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  toast({
                    title: "QR Authenticator Code",
                    description: "Scanner loaded. Please scan using mobile app to signup.",
                  });
                }}
                className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-muted/40 transition-colors bg-background/50 text-foreground"
                data-testid="button-qr-signup"
                title="Sign Up with QR Code"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg>
              </button>
            </div>

            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                Your information is protected and encrypted
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
