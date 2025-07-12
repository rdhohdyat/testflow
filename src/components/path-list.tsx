import { useState, useEffect, useCallback } from "react";
import { CircleCheck, CircleX} from "lucide-react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipComponent from "./tooltip-component";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "./ui/sheet";


function PathList() {
  const paths = useCodeStore((state) => state.paths);
  const [visibleItems, setVisibleItems] = useState([]);
  const [initialRender, setInitialRender] = useState(true);

  const { triggerAnimation } = useCodeStore();

  const animatePaths = useCallback(() => {
    // Reset state
    setVisibleItems([]);

    // Tambahkan paths secara bertahap
    if (paths && paths.length > 0) {
      paths.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prevItems) => [...prevItems, index]);
        }, index * 1500); // Delay 200ms per path item
      });
    }
  }, [paths]);

  // Effect untuk animasi saat triggerAnimation aktif
  useEffect(() => {
    if (triggerAnimation) {
      animatePaths();
      setInitialRender(false);
    }
  }, [triggerAnimation, animatePaths]);

  // Handle initial render - load tanpa animasi
  useEffect(() => {
    if (initialRender && paths.length > 0) {
      setVisibleItems(paths.map((_, index) => index));
      setInitialRender(false);
    }
  }, [initialRender, paths]);

  // Calculate stats for display
  const totalPaths = paths ? paths.length : 0;
  const passedPaths = paths ? paths.filter(item => item.passed).length : 0;
  const failedPaths = totalPaths - passedPaths;

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
          {paths &&
            paths.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-2 p-2 rounded-md border bg-neutral-50 dark:bg-neutral-700 text-sm transition-all duration-300 ${
                  visibleItems.includes(index) ? "opacity-100 " : "opacity-0"
                }`}
              >
                <div className="font-mono">{item.path.join(" → ")}</div>
                {item.passed ? (
                  <CircleCheck className="flex-shrink-0 text-green-500 h-4 w-4" />
                ) : (
                  <CircleX className="flex-shrink-0 text-red-500 h-4 w-4" />
                )}
              </div>
            ))}
        </div>
        <Sheet>
          <SheetTrigger>
            <Button>Show Test Case</Button>
          </SheetTrigger>
          <SheetContent className="w-full md:w-3/4 lg:w-2/3" side="right">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>All Test Cases</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300">
                    {passedPaths} Passed
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300">
                    {failedPaths} Failed
                  </Badge>
                </div>
              </SheetTitle>
              <SheetDescription>
                Overview of all test cases and their execution paths
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {paths && paths.length > 0 ? (
                paths.map((item, index) => (
                  <Card key={index} className={`border ${
                    item.passed ? "border-l-4 border-l-green-400" : "border-l-4 border-l-red-400"
                  }`}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Test Case #{index + 1}</span>
                        {item.passed ? (
                          <Badge className="bg-green-500">Passed</Badge>
                        ) : (
                          <Badge className="bg-red-500">Failed</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Execution Path:</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md font-mono text-xs">
                          {item.path.join(" → ")}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Test Case Input:</h4>
                        <pre className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-auto max-h-32 text-xs">
                          {JSON.stringify(item.testCase, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No test cases available
                </div>
              )}
            </div>
            
            <SheetFooter className="pt-6">
              <SheetClose asChild>
                <Button>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default PathList;