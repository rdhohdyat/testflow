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
          <DownloadCloud className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Export Analysis
          </DialogTitle>
        </DialogHeader>

        {isCompleted ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center">Export Complete</h3>
            <p className="text-neutral-500 text-center">
              Your analysis has been exported successfully.
            </p>
            <Badge variant="outline" className="mt-4 px-3 py-1 text-sm">
              {`cfg-analysis`}
            </Badge>
          </div>
        ) : isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <Progress value={75} className="w-[80%]" />
            <div className="text-center">
              <p className="text-lg font-medium">Generating your export...</p>
              <p className="text-neutral-500 mt-2">
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
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GitGraph className="h-4 w-4 text-primary" />
                    Control Flow Graph
                  </CardTitle>
                  <CardDescription>
                    Visual representation of the program's control flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {nodeCount} Nodes
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                        >
                          {edgeCount} Edges
                        </Badge>
                      </div>
                    </div>
                    <div className="min-h-[300px] flex items-center justify-center">
                      <div className="h-[300px] w-[400px]">
                        <ReactFlow
                          nodes={nodes}
                          edges={edges}
                          nodeTypes={nodeTypes}
                          fitView
                          fitViewOptions={{
                            padding: 0.5,
                            maxZoom: 0.5,
                            minZoom: 0.7,
                          }}
                        >
                          <Background
                            variant={BackgroundVariant.Lines}
                            gap={12}
                          />
                          <Controls showInteractive={true} />
                        </ReactFlow>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CodeIcon className="h-4 w-4 text-primary" />
                    Source Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 border dark:border-neutral-700">
                    <pre className="text-sm font-mono overflow-auto max-h-[400px]">
                      <code>{code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    Complexity Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
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

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Code Coverage</p>
                        <p className="text-xs text-muted-foreground">
                          Percentage of code covered by tests
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{percentage}%</p>
                        <div className="w-32 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1">
                          <div
                            className="h-full bg-neutral-800 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Path Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
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
                              className="flex items-center justify-between gap-2 p-2 rounded-md border bg-neutral-50 dark:bg-neutral-700 text-sm transition-all duration-300"
                            >
                              <div className="font-mono">
                                {item.path.join(" → ")}
                              </div>
                              {item.passed ? (
                                <CircleCheck className="flex-shrink-0 text-green-500 h-4 w-4" />
                              ) : (
                                <CircleX className="flex-shrink-0 text-red-500 h-4 w-4" />
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
          <Button onClick={() => toPDF()} disabled={isLoading || isCompleted} className="gap-2">
            <DownloadCloud className="h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
