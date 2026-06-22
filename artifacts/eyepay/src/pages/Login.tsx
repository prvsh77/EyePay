import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Shield, Zap, CheckCircle, Headphones, ChevronRight } from "lucide-react";

function CoinIllustration() {
  return (
    <div className="relative w-72 h-56 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E63FF]/10 to-blue-100 rounded-3xl" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-10 bg-white/50 rounded-full blur-md" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center">
        <Eye className="w-12 h-12 text-[#1E63FF]" />
      </div>
      <div className="absolute bottom-16 left-10 w-12 h-12 rounded-full bg-[#F7931A] border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">BTC</div>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 ml-16 w-10 h-10 rounded-full bg-[#627EEA] border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">ETH</div>
      <div className="absolute bottom-16 right-10 w-10 h-10 rounded-full bg-[#26A17B] border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">USDT</div>
      <svg className="absolute top-4 right-16" width="40" height="40" viewBox="0 0 40 40">
        <polyline points="0,35 8,28 16,30 24,18 32,12 40,5" fill="none" stroke="#1E63FF" strokeWidth="2" />
      </svg>
    </div>
  );
}

const features = [
  { icon: <Shield className="w-5 h-5 text-[#1E63FF]" />, title: "Secure", desc: "Bank-level security to protect you" },
  { icon: <Zap className="w-5 h-5 text-[#1E63FF]" />, title: "Fast", desc: "Quick and easy transactions" },
  { icon: <CheckCircle className="w-5 h-5 text-[#1E63FF]" />, title: "Trusted", desc: "Used by millions worldwide" },
  { icon: <Headphones className="w-5 h-5 text-[#1E63FF]" />, title: "24/7 Support", desc: "We're here anytime you need us" },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F0F2F5]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#1E63FF] text-white p-1.5 rounded-lg flex items-center justify-center">
            <Eye className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">EyePay</span>
        </Link>

        <div className="max-w-sm">
          <h1 className="text-4xl font-extrabold mb-1">Welcome back</h1>
          <h1 className="text-4xl font-extrabold text-[#1E63FF] mb-4">to EyePay</h1>
          <p className="text-muted-foreground mb-8">The world's leading cryptocurrency exchange.<br />Trade securely and grow your portfolio.</p>

          <CoinIllustration />

          <div className="grid grid-cols-2 gap-4 mt-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5" data-testid={`login-feature-${i}`}>
                {f.icon}
                <div>
                  <div className="font-bold text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2025 EyePay. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-1">Log in to your account</h2>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#1E63FF] font-semibold hover:underline" data-testid="link-signup">Sign up</Link>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email / Phone number</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#1E63FF]/30">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email or phone number"
                  className="flex-1 py-2.5 pr-3 text-sm focus:outline-none"
                  data-testid="input-login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#1E63FF]/30">
                <div className="px-3 py-2.5 text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 py-2.5 text-sm focus:outline-none"
                  data-testid="input-login-password"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="px-3 py-2.5 text-muted-foreground hover:text-foreground" data-testid="toggle-password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-[#1E63FF] font-medium hover:underline" data-testid="link-forgot-password">Forgot password?</a>
            </div>

            <Button className="w-full py-3 text-base font-bold" data-testid="button-login">Log In</Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-gray-50 transition-colors" data-testid="button-google-login">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-gray-50 transition-colors" data-testid="button-apple-login">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/></svg>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-gray-50 transition-colors" data-testid="button-qr-login">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg>
              </button>
            </div>

            {/* 2FA card */}
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-blue-50/50 mt-2">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#1E63FF]" />
                <div>
                  <div className="font-semibold text-sm">Protect your account</div>
                  <div className="text-xs text-muted-foreground">Enable 2FA to add an extra layer of security.</div>
                  <a href="#" className="text-xs text-[#1E63FF] font-medium hover:underline" data-testid="link-enable-2fa">Enable now</a>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
