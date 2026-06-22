import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import BuyCrypto from "@/pages/BuyCrypto";
import Markets from "@/pages/Markets";
import Futures from "@/pages/Futures";
import Earn from "@/pages/Earn";
import Square from "@/pages/Square";
import More from "@/pages/More";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import Recipients from "@/pages/Recipients";
import Transactions from "@/pages/Transactions";
import AdminFraud from "@/pages/AdminFraud";
import Analytics from "@/pages/Analytics";
import Intelligence from "@/pages/Intelligence";
import Copilot from "@/pages/Copilot";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Decorative background blobs for glassmorphic visual style */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/8 dark:bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/8 dark:bg-purple-500/3 blur-[120px] pointer-events-none z-0" />
      
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route>
          <Navbar />
          <main className="flex-1 w-full bg-transparent z-10">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/buy-crypto" component={BuyCrypto} />
              <Route path="/markets" component={Markets} />
              <Route path="/futures" component={Futures} />
              <Route path="/earn" component={Earn} />
              <Route path="/square" component={Square} />
              <Route path="/more" component={More} />
              
              {/* Protected Routes */}
              <Route path="/dashboard">
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/wallet">
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              </Route>
              <Route path="/recipients">
                <ProtectedRoute>
                  <Recipients />
                </ProtectedRoute>
              </Route>
              <Route path="/transactions">
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/fraud">
                <ProtectedRoute>
                  <AdminFraud />
                </ProtectedRoute>
              </Route>
              <Route path="/analytics">
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              </Route>
              <Route path="/intelligence">
                <ProtectedRoute>
                  <Intelligence />
                </ProtectedRoute>
              </Route>
              <Route path="/copilot">
                <ProtectedRoute>
                  <Copilot />
                </ProtectedRoute>
              </Route>

              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
