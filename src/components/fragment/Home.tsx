import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // <- untuk animasi
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { GitCompare, Info } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/work");
    }, 1000);
  };

  return (
    <section className="container flex justify-center items-center mt-24 sm:mt-32 md:mt-44 px-6">
      <div className="w-full max-w-2xl text-center flex flex-col gap-6">
        <h1 className="font-bold text-4xl md:text-5xl leading-tight text-neutral-900 dark:text-white tracking-tight">
          Analyze and Visualize Your Code's Control Flow
        </h1>

        <p className="text-base md:text-lg text-muted-foreground text-balance dark:text-white">
          Easily transform your source code into <span className="text-neutral-900 dark:text-white font-medium">Control Flow Graphs</span>, 
          helping you detect logic issues, optimize paths, and understand structure — visually.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLaunch}
                  className="w-full sm:w-auto flex items-center gap-2"
                  disabled={isLoading}
                >
                  <GitCompare className="h-4 w-4" />
                  {isLoading ? "Launching..." : "Launch Analyzer"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start building your control flow graph</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <a href="#docs" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Info className="w-4 h-4" />
              Learn More
            </Button>
          </a>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="text-sm text-muted-foreground mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              Preparing analyzer...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Home;
