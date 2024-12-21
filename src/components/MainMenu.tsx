import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const MainMenu = () => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border-b mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <NavigationMenu className="py-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Menu className="w-4 h-4 mr-2" />
                Menu
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[200px]">
                  <Link
                    to="/"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Home</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Domain Checker
                    </p>
                  </Link>
                  <Link
                    to="/found"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Website Matches</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Found Website Matches
                    </p>
                  </Link>
                  <Link
                    to="/name-matches"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Name Matches</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Found Name Matches
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default MainMenu;