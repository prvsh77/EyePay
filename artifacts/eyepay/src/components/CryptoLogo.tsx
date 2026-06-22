import { useState } from "react";

interface CryptoLogoProps {
  symbol: string;
  name?: string;
  color?: string;
  className?: string;
}

export function CryptoLogo({ symbol, name = "", color = "#aaa", className = "w-6 h-6" }: CryptoLogoProps) {
  const [error, setError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const cleanSymbol = symbol.split("/")[0].split("-")[0].split(" ")[0].toLowerCase();

  if (error) {
    return (
      <span 
        className={`${className} rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex-shrink-0 inline-flex items-center justify-center text-[9px] font-bold text-white uppercase font-mono`} 
        style={{ backgroundColor: color }}
        title={name || symbol}
      >
        {symbol.slice(0, 2)}
      </span>
    );
  }

  // We load community-maintained direct PNG files from spothq repository
  const primaryUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${cleanSymbol}.png`;

  return (
    <img
      src={fallbackUrl || primaryUrl}
      alt={name || symbol}
      title={name || symbol}
      className={`${className} rounded-full object-cover border-2 border-white dark:border-slate-900 flex-shrink-0 bg-muted/40`}
      onError={() => {
        if (!fallbackUrl) {
          // If GitHub raw fails, try logokit
          setFallbackUrl(`https://img.logokit.com/token/${symbol.toUpperCase()}`);
        } else {
          // If both fail, render fallback circle
          setError(true);
        }
      }}
    />
  );
}
export default CryptoLogo;
