import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Home, LayoutDashboard, Globe, Github, GitBranch } from "lucide-react";
import { Button } from "./ui/button";
import ExportDialog from "./export-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Logo from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { cn } from "../lib/utils"; // Pastikan utilitas cn tersedia

const NAV_LINKS = [
  { label: "Tentang", href: "#about" },
  { label: "Cara Kerja", href: "#docs" },
  { label: "Fitur", href: "#service" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi scroll untuk efek glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWorkPage = location.pathname === "/work";
  const isDashboard = location.pathname === "/project";
  const isLandingPage = location.pathname === "/";

  const renderNavLinks = (isMobile = false) => (
    <div className={cn(
      "flex items-center gap-1",
      isMobile ? "flex-col items-start w-full gap-2" : "flex-row"
    )}>
      {isLandingPage && NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors px-4 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
            isMobile && "w-full text-base py-3"
          )}
        >
          {link.label}
        </a>
      ))}
      
      <div className={cn("flex items-center gap-2", isMobile && "mt-4 w-full justify-between px-2")}>
        <ModeToggle />
      </div>
    </div>
  );

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-3 shadow-sm" 
        : "bg-white dark:bg-black py-4"
    )}>
      <div className="flex items-center justify-between px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Navigation Group */}
          <div className="items-center hidden gap-1 xl:flex">
            <Link to="/">
              <Button 
                variant={isLandingPage ? "secondary" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <Home className="w-4 h-4" /> Beranda
              </Button>
            </Link>
            
            <Link to="/project">
              <Button 
                variant={isDashboard ? "secondary" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Project
              </Button>
            </Link>

             <Link to="/work">
              <Button 
                variant={isWorkPage ? "secondary" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <GitBranch className="w-4 h-4" /> Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side Desktop */}
        <div className="items-center hidden gap-4 xl:flex">
          {renderNavLinks(false)}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="xl:hidden" variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader className="text-left">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col gap-2 mt-8">
              <Link to="/">
                <Button variant={isLandingPage ? "secondary" : "ghost"} className="justify-start w-full gap-3">
                  <Home className="w-5 h-5" /> Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant={isDashboard ? "secondary" : "ghost"} className="justify-start w-full gap-3">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Button>
              </Link>
              
              <div className="my-4 border-t border-neutral-100 dark:border-neutral-800" />
              
              <div className="px-2 mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-400">
                Menu Utama
              </div>
              {renderNavLinks(true)}
            </div>
            
            <div className="absolute bottom-8 left-6 right-6">
              <Button variant="outline" className="w-full gap-2 text-xs">
                <Github className="w-4 h-4" /> Project Repo
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};