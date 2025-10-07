import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  DownloadCloud,
  CheckCircle,
  Code as CodeIcon,
  GitGraph,
  FileDown,
  BarChart,
  Shield,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { useCodeStore } from "../store/CodeStore";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";

import { nodeTypes } from "../data/node";
import { usePDF } from "react-to-pdf";

const ExportDialog = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { code, nodes, edges, paths, nodeCount, edgeCount } = useCodeStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalPassed = paths.filter((item) => item.passed).length;
  const totalPaths = paths.length;
  const percentage = (totalPassed / totalPaths) * 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <DownloadCloud className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileDown className="w-5 h-5 text-primary" />
            Export Analysis
          </DialogTitle>
        </DialogHeader>

        {isCompleted ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center">Export Complete</h3>
            <p className="text-center text-neutral-500">
              Your analysis has been exported successfully.
            </p>
            <Badge variant="outline" className="px-3 py-1 mt-4 text-sm">
              {`cfg-analysis`}
            </Badge>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <Progress value={75} className="w-[80%]" />
            <div className="text-center">
              <p className="text-lg font-medium">Generating your export...</p>
              <p className="mt-2 text-neutral-500">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 ">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Analysis Summary</h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive overview of code and control flow analysis
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="col-span-12">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CodeIcon className="w-4 h-4 text-primary" />
                    Source Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700">
                    <pre className="text-sm font-mono overflow-auto max-h-[400px]">
                      <code>{code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart className="w-4 h-4 text-primary" />
                    Complexity Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Cyclomatic Complexity
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Measures the number of linearly independent paths
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold`}>
                          {edgeCount - nodeCount + 2}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Code Coverage</p>
                        <p className="text-xs text-muted-foreground">
                          Percentage of code covered by tests
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{percentage}%</p>
                        <div className="w-32 h-2 mt-1 rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full bg-neutral-800"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-primary" />
                    Path Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Execution Paths</p>
                        <p className="text-xs text-muted-foreground">
                          Total number of possible execution paths
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{totalPaths}</p>
                      </div>
                    </div>

                    <Separator />
                    <div>
                      <div className="space-y-2">
                        {paths &&
                          paths.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-2 p-2 text-sm transition-all duration-300 border rounded-md bg-neutral-50 dark:bg-neutral-700"
                            >
                              <div className="font-mono">
                                {item.path.join(" → ")}
                              </div>
                              {item.passed ? (
                                <CircleCheck className="flex-shrink-0 w-4 h-4 text-green-500" />
                              ) : (
                                <CircleX className="flex-shrink-0 w-4 h-4 text-red-500" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => toPDF()}
            disabled={isLoading || isCompleted}
            className="gap-2"
          >
            <DownloadCloud className="w-4 h-4" />
            {isLoading ? "Exporting..." : "Export Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
