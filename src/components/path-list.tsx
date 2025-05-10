import { CircleCheck, CircleX } from "lucide-react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipComponent from "./tooltip-component";

function PathList() {
  const paths = useCodeStore((state) => state.paths);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          Execution Paths
          <TooltipComponent information="All execution paths from FlowGraph">
            <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">
              ?
            </span>
          </TooltipComponent>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          {paths.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md border bg-neutral-50 dark:bg-neutral-700 text-sm"
            >
              <div className="font-mono">{item.path.join(" → ")}</div>
              {item.passed ? (
                <CircleCheck className="text-green-500 h-4 w-4" />
              ) : (
                <CircleX className="text-red-500 h-4 w-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PathList;
