import { Link } from "react-router-dom";
import { Home, Search, List, Database } from "lucide-react";

export function MainMenu() {
  return (
    <div className="w-full border-b mb-4">
      <div className="max-w-6xl mx-auto py-2 px-4">
        <nav className="flex items-center gap-6">
          <Link to="/" className="flex items-center font-bold">
            <Home className="w-4 h-4 mr-2" />
            GMB Domain Harvester
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center text-sm hover:text-primary transition-colors">
              <Search className="w-4 h-4 mr-2" />
              Domain Checker
            </Link>
            <Link to="/website-matches" className="flex items-center text-sm hover:text-primary transition-colors">
              <List className="w-4 h-4 mr-2" />
              Website Matches
            </Link>
            <Link to="/found-ones" className="flex items-center text-sm hover:text-primary transition-colors">
              <Database className="w-4 h-4 mr-2" />
              Found
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}