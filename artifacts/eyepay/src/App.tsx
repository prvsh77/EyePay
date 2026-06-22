import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route>
          <Navbar />
          <main className="flex-1 w-full bg-white">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/buy-crypto" component={BuyCrypto} />
              <Route path="/markets" component={Markets} />
              <Route path="/futures" component={Futures} />
              <Route path="/earn" component={Earn} />
              <Route path="/square" component={Square} />
              <Route path="/more" component={More} />
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
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
