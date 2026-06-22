import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, type User, type Wallet } from "../lib/api";

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  loading: boolean;
  login: (body: any) => Promise<void>;
  register: (body: any) => Promise<void>;
  logout: () => void;
  refreshWallet: () => Promise<void>;
  setWallet: (wallet: Wallet | null) => void;
  loginWithSocial: (provider: "google" | "apple") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem("eyepay_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.auth.getMe();
      setUser(data.user);
      setWallet(data.wallet);
    } catch (err) {
      console.error("Failed to load authenticated profile:", err);
      // If token is invalid/expired, wipe it
      localStorage.removeItem("eyepay_token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMe();
  }, []);

  async function login(body: any) {
    setLoading(true);
    try {
      const data = await api.auth.login(body);
      localStorage.setItem("eyepay_token", data.token);
      setUser(data.user);
      // If server returned wallet info during login, set it, otherwise fetch
      if (data.wallet) {
        setWallet(data.wallet);
      } else {
        const profile = await api.auth.getMe();
        setWallet(profile.wallet);
      }
    } finally {
      setLoading(false);
    }
  }

  async function register(body: any) {
    setLoading(true);
    try {
      const data = await api.auth.register(body);
      localStorage.setItem("eyepay_token", data.token);
      setUser(data.user);
      if (data.wallet) {
        setWallet(data.wallet);
      } else {
        const profile = await api.auth.getMe();
        setWallet(profile.wallet);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loginWithSocial(provider: "google" | "apple") {
    setLoading(true);
    const email = `${provider}-user@eyepay.com`;
    const password = `social-password-123-${provider}`;
    const name = `${provider[0].toUpperCase()}${provider.slice(1)} Demo User`;
    try {
      // Try login first
      await login({ email, password });
    } catch (err) {
      // If login fails, try to register
      try {
        await register({ name, email, password });
      } catch (regErr) {
        console.error("Failed to complete social mock login/register:", regErr);
        throw regErr;
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("eyepay_token");
    setUser(null);
    setWallet(null);
  }

  async function refreshWallet() {
    try {
      const data = await api.wallets.get();
      setWallet(data);
    } catch (err) {
      console.error("Failed to refresh wallet details:", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        loading,
        login,
        register,
        logout,
        refreshWallet,
        setWallet,
        loginWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
