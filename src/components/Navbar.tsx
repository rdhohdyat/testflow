import { Button } from "./ui/button";
import { useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react";
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

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Docs", href: "#docs" },
  { label: "Services", href: "#service" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const location = useLocation();
  const isWorkPage = location.pathname === "/work" || "/dashboard";

  const renderNavLinks = (isMobile = false) => (
    <>
      {!isWorkPage &&
        NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`text-neutral-700 hover:text-neutral-900 dark:text-neutral-100 transition-colors ${
              isMobile ? "py-2" : "text-sm"
            } px-4`}
          >
            {link.label}
          </a>
        ))}

      <ModeToggle />

      {isWorkPage && <ExportDialog />}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm dark:bg-black">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <Logo />

        <div className="items-center hidden space-x-1 xl:flex">
          <Link
            to="/"
            className="px-4 py-2 text-sm transition-colors text-neutral-700 dark:text-neutral-100 hover:text-neutral-900"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm transition-colors text-neutral-700 dark:text-neutral-100 hover:text-neutral-900"
          >
            Dashboard
          </Link>
          {renderNavLinks(false)}
        </div>

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
            <div className="flex flex-col gap-3 mt-6">
              <Link
                to="/"
                className="px-4 py-2 transition-colors text-neutral-700 hover:text-neutral-900"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 transition-colors text-neutral-700 hover:text-neutral-900"
              >
                Dashboard
              </Link>
              {renderNavLinks(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
