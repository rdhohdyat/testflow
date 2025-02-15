import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"


const Home = () => {
  return (
    <div className="container flex justify-center items-center gap-2 mt-24 sm:mt-32 md:mt-44 px-4">
      <div className="w-full max-w-[600px] text-center flex flex-col gap-6">
        <h1 className="font-bold text-5xl  xl:text-7xl text-black leading-snug">
          Visualize and Analyze Your Code's
        </h1>
        <p className="text-sm sm:text-md md:text-lg xl:text-xl">
          Create and Explore{" "}
          <span className="text-main font-bold">Control Flow Graph</span> in
          just a few clicks.
        </p>

        <div className="flex flex-col xl:flex-row gap-3 justify-center">
          <Link to="/work">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                <Button>Start using TestFlow</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to enter the code analysis page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <a href="#docs">
            <Button variant="neutral">Learn more about TestFlow</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
