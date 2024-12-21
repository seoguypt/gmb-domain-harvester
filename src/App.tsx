import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Found from "@/pages/Found";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/found" element={<Found />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;