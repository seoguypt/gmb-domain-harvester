import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainMenu } from "./components/MainMenu";
import Index from "./pages/Index";
import WebsiteMatches from "./pages/WebsiteMatches";
import FoundOnes from "./pages/FoundOnes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <MainMenu />
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/website-matches" element={<WebsiteMatches />} />
              <Route path="/found-ones" element={<FoundOnes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;