import { Button } from "./ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import ExportDialog from "./ExportDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#service" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";

  const renderNavLinks = (isMobile = false) => (
    <>
      {!isWorkPage &&
        NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`text-neutral-700 hover:text-neutral-900 transition-colors ${
              isMobile ? "py-2" : "text-sm"
            } px-4`}
          >
            {link.label}
          </a>
        ))}

      {!isWorkPage && (
        <Button
          onClick={() => navigate("/work")}
          className={`${isMobile ? "w-full mt-2" : ""}`}
          variant="default"
        >
          Get Started
        </Button>
      )}

      {isWorkPage && (
        <ExportDialog/>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b">
      <div className="flex justify-between items-center xl:px-20 px-6 py-4 max-w-7xl mx-auto">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center space-x-1">
          <Link 
            to="/" 
            className="text-neutral-700 hover:text-neutral-900 transition-colors px-4 py-2 text-sm"
          >
            Home
          </Link>
          <a
            href={isWorkPage ? "/" : "#docs"}
            className="text-neutral-700 hover:text-neutral-900 transition-colors px-4 py-2 text-sm"
          >
            Docs
          </a>
          {renderNavLinks(false)}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="xl:hidden" variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-xl font-medium">CodeFlow</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col mt-6 gap-3">
              <Link
                to="/"
                className="text-neutral-700 hover:text-neutral-900 transition-colors  px-4 py-2"
              >
                Home
              </Link>
              <a
                href={isWorkPage ? "/" : "#docs"}
                className="text-neutral-700 hover:text-neutral-900 transition-colors  px-4 py-2"
              >
                Docs
              </a>
              {renderNavLinks(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};