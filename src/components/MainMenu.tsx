import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Home, Search, List, Database } from "lucide-react";

export function MainMenu() {
  return (
    <div className="w-full border-b mb-4">
      <div className="max-w-6xl mx-auto py-2 px-4">
        <Menubar className="border-none">
          <MenubarMenu>
            <MenubarTrigger className="font-bold">
              <Home className="w-4 h-4 mr-2" />
              GMB Domain Harvester
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Domain Checker
                </Link>
              </MenubarItem>
              <MenubarItem>
                <Link to="/website-matches" className="flex items-center">
                  <List className="w-4 h-4 mr-2" />
                  Website Matches
                </Link>
              </MenubarItem>
              <MenubarItem>
                <Link to="/found-ones" className="flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Found
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}