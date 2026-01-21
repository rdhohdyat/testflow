import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { GitCompare, Info, Loader2, Sparkles } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/work");
    }, 1200);
  };

  // Variabel untuk animasi container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2, // Elemen muncul bergantian
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="container flex items-center justify-center px-6 mt-24 sm:mt-32 md:mt-44 overflow-hidden">
      <motion.div 
        className="flex flex-col w-full max-w-3xl gap-8 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Badge Animasi */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Eksplorasi Alur Program Secara Visual
          </span>
        </motion.div>

        {/* Judul Utama */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-neutral-900 dark:text-white"
        >
          Analisis & Visualisasikan <br /> 
          <span className="text-primary bg-clip-text">Control Flow Kode Anda</span>
        </motion.h1>

        {/* Deskripsi */}
        <motion.p 
          variants={itemVariants}
          className="text-base md:text-xl text-muted-foreground text-balance dark:text-neutral-300"
        >
          Ubah kode sumber Anda menjadi <span className="font-semibold text-neutral-900 dark:text-white underline decoration-primary/30">Control Flow Graph</span> secara instan. 
          Deteksi celah logika, optimalkan jalur eksekusi, dan pahami struktur program lebih mendalam.
        </motion.p>

        {/* Tombol Aksi */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-4"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLaunch}
                  size="lg"
                  className="flex items-center gap-2 px-8 h-12 text-base transition-all hover:scale-105 active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <GitCompare className="w-5 h-5" />
                  )}
                  {isLoading ? "Menyiapkan..." : "Mulai Analisis"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buka dashboard analyzer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <a href="#docs" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 w-full px-8 h-12 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Info className="w-5 h-5" />
              Pelajari Fitur
            </Button>
          </a>
        </motion.div>

        {/* Loading State Animation */}
        <div className="h-6"> {/* Reserve space to avoid layout shift */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-primary"
              >
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Sedang menginisialisasi sistem analyzer...
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;