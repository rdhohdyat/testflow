import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TooltipComponentProps {
  children: React.ReactNode;
  information: string;
}

const TooltipComponent = ({ children, information }: TooltipComponentProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-neutral-900 dark:bg-white dark:text-black text-neutral-50 border-0 p-2 text-xs max-w-xs">
          <p>{information}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;