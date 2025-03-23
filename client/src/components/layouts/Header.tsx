import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, MenuIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fetch user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST'
      });
      
      if (res.ok) {
        // Clear user from state
        setUser(null);
        // Redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <span className="text-primary font-bold text-xl md:text-2xl cursor-pointer">TrafficXchange</span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard">
                <a className={`${isActive('/dashboard') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/dashboard/statistics">
                <a className={`${isActive('/dashboard/statistics') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Statistics
                </a>
              </Link>
              <Link href="/dashboard/settings">
                <a className={`${isActive('/dashboard/settings') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Settings
                </a>
              </Link>
              <Link href="/dashboard/help">
                <a className={`${isActive('/dashboard/help') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Help
                </a>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                  <div className="py-4 flex flex-col h-full">
                    <div className="mb-6 flex items-center justify-between">
                      <Link href="/dashboard">
                        <span className="text-primary font-bold text-xl cursor-pointer">TrafficXchange</span>
                      </Link>
                      <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </SheetClose>
                    </div>
                    <div className="space-y-4 flex flex-col flex-1">
                      <SheetClose asChild>
                        <Link href="/dashboard">
                          <a className={`${isActive('/dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} px-3 py-2 rounded-md text-base font-medium`}>
                            Dashboard
                          </a>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/dashboard/statistics">
                          <a className={`${isActive('/dashboard/statistics') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} px-3 py-2 rounded-md text-base font-medium`}>
                            Statistics
                          </a>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/dashboard/settings">
                          <a className={`${isActive('/dashboard/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} px-3 py-2 rounded-md text-base font-medium`}>
                            Settings
                          </a>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/dashboard/help">
                          <a className={`${isActive('/dashboard/help') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} px-3 py-2 rounded-md text-base font-medium`}>
                            Help
                          </a>
                        </Link>
                      </SheetClose>
                      
                      {/* Mobile profile section */}
                      <div className="border-t pt-4 mt-auto">
                        <div className="flex items-center px-3">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary">
                              <span className="text-xs font-medium leading-none text-white">
                                {user?.username.substring(0, 2).toUpperCase() || "XX"}
                              </span>
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user?.username || "User"}</div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <SheetClose asChild>
                            <Link href="/dashboard/profile">
                              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                Profile
                              </a>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              Logout
                            </button>
                          </SheetClose>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Notification bell - visible on all screen sizes */}
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>

            {/* User dropdown - hidden on mobile */}
            <div className="hidden sm:ml-3 sm:relative sm:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="sr-only">Open user menu</span>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary">
                      <span className="text-xs font-medium leading-none text-white">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
