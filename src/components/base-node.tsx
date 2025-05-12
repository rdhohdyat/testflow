import { forwardRef, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const BaseNode = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-md border border-neutral-200 bg-white p-5 text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
      className,
      selected ? "border-neutral-500 shadow-lg dark:border-neutral-400" : "",
      "hover:ring-1",
    )}
    tabIndex={0}
    {...props}
  />
));

BaseNode.displayName = "BaseNode";
