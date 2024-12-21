import { Database, Home, List } from "lucide-react";
import { Link } from "react-router-dom";

export default function MainMenu() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <span className="hidden font-bold sm:inline-block">
              Domain Checker
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="flex items-center text-sm hover:text-primary transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link to="/name-matches" className="flex items-center text-sm hover:text-primary transition-colors">
              <List className="w-4 h-4 mr-2" />
              Name Matches
            </Link>
            <Link to="/found-ones" className="flex items-center text-sm hover:text-primary transition-colors">
              <Database className="w-4 h-4 mr-2" />
              Found
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}