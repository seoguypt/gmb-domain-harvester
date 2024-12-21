import { Link } from "react-router-dom";
import { Home, Globe, Users } from "lucide-react";

const MainMenu = () => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border-b mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Domain Checker</span>
          </Link>
          <Link
            to="/found"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Website Matches</span>
          </Link>
          <Link
            to="/name-matches"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Name Matches</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MainMenu;