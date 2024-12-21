import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainMenu from "./components/MainMenu";
import Index from "./pages/Index";
import NameMatches from "./pages/NameMatches";
import FoundOnes from "./pages/FoundOnes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <MainMenu />
          <main className="container py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/name-matches" element={<NameMatches />} />
              <Route path="/found-ones" element={<FoundOnes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;