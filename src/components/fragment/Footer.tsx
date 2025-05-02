import { Github, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <a href="/">
           <Logo/>
          </a>
          <p className="text-sm mt-2">© 2025 Ridho Hidayat. All rights reserved.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#home" className="hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#docs" className="hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="#about" className="hover:text-foreground transition-colors">
            About
          </a>
          <a href="#service" className="hover:text-foreground transition-colors">
            Services
          </a>
          <a href="#contact" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex space-x-2">
          <Button size="icon" variant="ghost">
            <Github className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Twitter className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
