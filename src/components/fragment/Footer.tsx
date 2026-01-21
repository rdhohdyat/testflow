import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900/30 text-muted-foreground py-12 px-6 border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Bagian Logo & Copyright */}
        <div className="text-center md:text-left">
          <a href="/" className="inline-block mb-3">
            <Logo />
          </a>
          <p className="text-sm opacity-80">
            © 2025 Ridho Hidayat. Dibuat untuk tugas Proyek Akhir.
          </p>
        </div>

        {/* Navigasi Sederhana */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="#home" className="hover:text-primary transition-colors">
            Beranda
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            Tentang
          </a>
          <a href="#service" className="hover:text-primary transition-colors">
            Fitur
          </a>
          <a href="#docs" className="hover:text-primary transition-colors">
            Cara Kerja
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        {/* Media Sosial & Kontak */}
        <div className="flex items-center gap-3">
          <a href="https://github.com/rdhohdyat" target="_blank" rel="noreferrer">
            <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
            <Twitter className="h-5 w-5" />
          </Button>
          <a href="mailto:email@kamu.com">
            <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
              <Mail className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;