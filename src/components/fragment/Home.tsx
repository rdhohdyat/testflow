import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Home = () => {
  return (
    <section className="container flex justify-center items-center mt-24 sm:mt-32 md:mt-44 px-6">
      <div className="w-full max-w-2xl text-center flex flex-col gap-6">
        <h1 className="font-bold text-4xl md:text-5xl leading-tight text-neutral-900 tracking-tight">
          Analyze and Visualize Your Code's Control Flow
        </h1>

        <p className="text-base md:text-lg text-muted-foreground text-balance">
          Easily transform your source code into <span className="text-neutral-900 font-medium">Control Flow Graphs</span>, 
          helping you detect logic issues, optimize paths, and understand structure — visually.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/work">
                  <Button className="w-full sm:w-auto">
                    Launch Analyzer
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start building your control flow graph</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <a href="#docs" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
