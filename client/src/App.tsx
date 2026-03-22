import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EnhancedGovDashboard from "./pages/Dashboard/EnhancedGovDashboard";
import EnhancedEntDashboard from "./pages/Dashboard/EnhancedEntDashboard";
import EnhancedIdeaDetails from "./pages/Dashboard/EnhancedIdeaDetails";
import ChallengeDetails from "./pages/Dashboard/ChallengeDetails";
import NotFound from "./pages/NotFound";

import { FloatingHomeButton } from "./components/FloatingHomeButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingHomeButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Basic Implementation) */}
            <Route path="/dashboard/government" element={<EnhancedGovDashboard />} />
            <Route path="/dashboard/entrepreneur" element={<EnhancedEntDashboard />} />
            <Route path="/idea/:id" element={<EnhancedIdeaDetails />} />
            <Route path="/challenge/:id" element={<ChallengeDetails />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
