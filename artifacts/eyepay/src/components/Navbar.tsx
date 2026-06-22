import { Link, useLocation } from "wouter";
import { Eye, Search, Globe, Moon, Sun, Menu, LogOut, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/use-auth";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    setMounted(true);
  }, []);

  const publicLinks = [
    { label: "Buy Crypto", href: "/buy-crypto" },
    { label: "Markets", href: "/markets" },
    { label: "Trade", href: "#", hasDropdown: true },
    { label: "Futures", href: "/futures", hasDropdown: true },
    { label: "Earn", href: "/earn", hasDropdown: true },
    { label: "Square", href: "/square", hasDropdown: true },
    { label: "More", href: "/more", hasDropdown: true },
  ];

  const privateLinks = [
    { label: "Dashboard", href: "/dashboard", hasDropdown: false },
    { label: "Wallet", href: "/wallet", hasDropdown: false },
    { label: "Recipients", href: "/recipients", hasDropdown: false },
    { label: "Transactions", href: "/transactions", hasDropdown: false },
    { label: "Analytics", href: "/analytics", hasDropdown: false },
    { label: "AI Intelligence", href: "/intelligence", hasDropdown: false },
    { label: "AI Copilot", href: "/copilot", hasDropdown: false },
    { label: "Admin Panel", href: "/admin/fraud", hasDropdown: false },
  ];

  const navLinks = user ? privateLinks : publicLinks;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: "Theme Changed",
      description: `Switched to ${theme === "dark" ? "light" : "dark"} mode successfully!`,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search Query",
        description: `Searching for: "${searchQuery}"`,
      });
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const selectGlobeSetting = (lang: string, curr: string) => {
    setSelectedLanguage(lang);
    setSelectedCurrency(curr);
    toast({
      title: "Settings Updated",
      description: `Language: ${lang} | Currency: ${curr}`,
    });
    setShowGlobe(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass-panel">
      <div className="container flex h-16 items-center max-w-[1400px] mx-auto px-4">
        <Link href={user ? "/dashboard" : "/"} className="mr-6 flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex items-center justify-center">
            <Eye className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">EyePay</span>
        </Link>
        <div className="hidden md:flex gap-1 md:gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              } py-5 px-2 flex items-center`}
            >
              {link.label}
              {link.hasDropdown && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 opacity-50"
                >
                  <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
            className="hidden sm:flex text-muted-foreground"
            data-testid="button-navbar-search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGlobe(true)}
            className="hidden sm:flex text-muted-foreground"
            data-testid="button-navbar-globe"
          >
            <Globe className="h-5 w-5" />
            <span className="text-[10px] ml-0.5 opacity-80">{selectedCurrency}</span>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground"
              data-testid="button-navbar-theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          
          <div className="flex items-center space-x-2 ml-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm font-semibold text-muted-foreground mr-2">
                  Hello, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="font-semibold flex items-center gap-1.5"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex font-semibold">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-semibold px-6">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)} className="md:hidden ml-2">
            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Glassmorphic Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setShowSearch(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h3 className="font-bold text-lg mb-4">Search EyePay</h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search markets, products, help guides..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <Button type="submit" className="font-semibold">Search</Button>
            </form>
          </div>
        </div>
      )}

      {/* Glassmorphic Globe (Settings Picker) Modal */}
      {showGlobe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-6 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setShowGlobe(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h3 className="font-bold text-lg mb-5">Language & Currency Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Preferred Language</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["English", "Español", "Deutsch", "简体中文"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => selectGlobeSetting(lang, selectedCurrency)}
                      className={`text-sm px-4 py-2.5 rounded-xl border text-left font-medium transition-colors ${
                        selectedLanguage === lang
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Display Currency</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["USD", "EUR", "GBP", "INR", "JPY", "AUD"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => selectGlobeSetting(selectedLanguage, curr)}
                      className={`text-sm px-3 py-2 rounded-xl border text-center font-medium transition-colors ${
                        selectedCurrency === curr
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Links Drawer */}
      {showMenu && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur px-4 py-4 space-y-2 flex flex-col absolute w-full left-0 z-40 shadow-lg">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              onClick={() => setShowMenu(false)}
              className={`text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-muted transition-colors ${
                location === link.href ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowMenu(false);
                setShowGlobe(true);
              }}
              className="justify-start gap-2"
            >
              <Globe className="h-4 w-4" /> Language / {selectedCurrency}
            </Button>
            {user ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setShowMenu(false);
                  logout();
                }}
                className="justify-start gap-2"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setShowMenu(false)}>
                  <Button variant="ghost" className="w-full justify-center">Log In</Button>
                </Link>
                <Link href="/signup" onClick={() => setShowMenu(false)}>
                  <Button className="w-full justify-center">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;

