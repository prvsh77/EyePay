export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  currency: string;
  createdAt: string;
}

export interface Recipient {
  id: number;
  userId: number;
  name: string;
  email: string;
  walletAddress: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  walletId: number;
  type: "deposit" | "withdrawal" | "send" | "receive";
  amount: string;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string | null;
  recipientId: number | null;
  riskScore: number;
  destinationCountry: string;
  createdAt: string;
}

export interface FraudAlert {
  id: number;
  transactionId: number;
  riskScore: number;
  status: "pending" | "approved" | "rejected";
  reasons: string; // JSON string representing array of string reasons
  createdAt: string;
  transaction: {
    id: number;
    amount: string;
    currency: string;
    status: string;
    description: string | null;
    createdAt: string;
    destinationCountry: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  wallet?: Wallet;
}
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("eyepay_token");

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    register: (body: any) =>
      request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body: any) =>
      request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    getMe: () =>
      request<{ user: User; wallet: Wallet | null }>("/api/auth/me"),
  },
  recipients: {
    list: () => request<Recipient[]>("/api/recipients"),
    create: (body: any) =>
      request<Recipient>("/api/recipients", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: number, body: any) =>
      request<Recipient>(`/api/recipients/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/api/recipients/${id}`, {
        method: "DELETE",
      }),
  },
  wallets: {
    get: () => request<Wallet>("/api/wallets"),
    deposit: (body: { amount: number; currency?: string }) =>
      request<Wallet>("/api/wallets/deposit", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    withdraw: (body: { amount: number; currency?: string }) =>
      request<Wallet>("/api/wallets/withdraw", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  transactions: {
    list: () => request<Transaction[]>("/api/transactions"),
    transfer: (body: {
      recipientId: number;
      amount: number;
      currency?: string;
      description?: string;
      destinationCountry?: string;
    }) =>
      request<Transaction>("/api/transactions/transfer", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  admin: {
    listFraudAlerts: () => request<FraudAlert[]>("/api/admin/fraud-alerts"),
    actionFraudAlert: (id: number, action: "approve" | "reject") =>
      request<{ id: number; transactionId: number; action: string; status: string }>(
        `/api/admin/fraud-alerts/${id}/action`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        }
      ),
  },
  analytics: {
    get: () => request<AnalyticsData>("/api/analytics"),
  },
  insights: {
    get: () => request<InsightsData>("/api/insights"),
  },
  copilot: {
    chat: (message: string) => request<{ reply: string }>("/api/copilot/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
    getHistory: () => request<{ id: number; role: "user" | "assistant"; message: string; createdAt: string }[]>("/api/copilot/history"),
    clearHistory: () => request<{ message: string }>("/api/copilot/history", {
      method: "DELETE",
    }),
  },
};

export interface InsightItem {
  type: "trend" | "growth" | "recipient" | "unusual" | "risk";
  title: string;
  description: string;
  metric: string;
  impact: "positive" | "neutral" | "negative" | "warning";
}

export interface UnusualActivityItem {
  id: number;
  amount: number;
  recipient: string;
  riskScore: number;
  reason: string;
  date: string;
}

export interface RecommendationItem {
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

export interface InsightsData {
  healthScore: number;
  insights: InsightItem[];
  unusualActivity: UnusualActivityItem[];
  recommendations: RecommendationItem[];
}

export interface AnalyticsData {
  totalVolume: number;
  volumeByType: {
    type: "deposit" | "withdrawal" | "send" | "receive";
    totalAmount: number;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    volume: number;
    count: number;
  }[];
  countryDistribution: {
    country: string;
    volume: number;
    count: number;
  }[];
  fraudStats: {
    totalFlagged: number;
    avgRiskScore: number;
    pendingAlertsCount: number;
    statusCounts: { status: string; count: number }[];
  };
  topRecipients: {
    recipientId: number | null;
    name: string;
    email: string;
    volume: number;
    count: number;
  }[];
}
