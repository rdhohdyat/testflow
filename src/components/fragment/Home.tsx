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
    <section className="container flex items-center justify-center px-6 mt-24 sm:mt-32 md:mt-44">
      <div className="flex flex-col w-full max-w-2xl gap-6 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl text-neutral-900 dark:text-white">
          Analyze and Visualize Your Code's Control Flow
        </h1>

        <p className="text-base md:text-lg text-muted-foreground text-balance dark:text-white">
          Easily transform your source code into <span className="font-medium text-neutral-900 dark:text-white">Control Flow Graphs</span>, 
          helping you detect logic issues, optimize paths, and understand structure — visually.
        </p>

        <div className="flex flex-row justify-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLaunch}
                  className="flex items-center w-auto gap-2"
                  disabled={isLoading}
                >
                  <GitCompare className="w-4 h-4" />
                  {isLoading ? "Launching..." : "Launch Analyzer"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start building your control flow graph</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <a href="#docs" className="w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Info className="w-4 h-4" />
              Learn More
            </Button>
          </a>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="mt-2 text-sm text-muted-foreground"
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
