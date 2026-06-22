import { Link, useLocation } from "wouter";
import { Eye, Search, Globe, Moon, Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { label: "Buy Crypto", href: "/buy-crypto" },
    { label: "Markets", href: "/markets" },
    { label: "Trade", href: "#", hasDropdown: true },
    { label: "Futures", href: "/futures", hasDropdown: true },
    { label: "Earn", href: "/earn", hasDropdown: true },
    { label: "Square", href: "/square", hasDropdown: true },
    { label: "More", href: "/more", hasDropdown: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-[1400px] mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
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
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
            <Moon className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2 ml-2">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex font-semibold">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-semibold px-6">Sign Up</Button>
            </Link>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
