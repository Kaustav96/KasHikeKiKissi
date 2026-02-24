import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { SealProvider } from "@/context/SealContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Invite from "@/pages/Invite";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/invite/:slug" component={Invite} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MusicProvider>
          <SealProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </SealProvider>
        </MusicProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
