import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Found from "@/pages/Found";
import NameMatches from "@/pages/NameMatches";
import MainMenu from "@/components/MainMenu";

function App() {
  return (
    <Router>
      <MainMenu />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/found" element={<Found />} />
        <Route path="/name-matches" element={<NameMatches />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;