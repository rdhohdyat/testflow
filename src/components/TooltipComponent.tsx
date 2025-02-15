import React from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../components/ui/tooltip"

type TooltipProps = {
    children : React.ReactNode,
    information : string
}

const TooltipComponent = ({ children, information }: TooltipProps) => {
    return (
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            <p>{information}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}

export default TooltipComponent