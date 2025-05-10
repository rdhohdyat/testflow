import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  DownloadCloud,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useCodeStore } from "../store/CodeStore";
import { Progress } from "./ui/progress";
import ControlFlowGraph from "./control-flow-graph";

const ExportDialog = () => {
  const { code, nodes, edges } = useCodeStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  

  // Calculate metrics for summary
  const cyclomaticComplexity = edges.length - nodes.length + 2;
  const coverage = 58; // Example value
  const passedPaths = 2; // Example value
  const totalPaths = 3; // Example value

  const handleExport = () => {
    setIsLoading(true);

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);

      // Reset completion state after 2 seconds
      setTimeout(() => {
        setIsCompleted(false);
      }, 2000);

      // Create and trigger file download
      const fileName = `cfg-analysis-${new Date().toISOString().slice(0, 10)}`;

      // Example mock download
      if (window.navigator.msSaveOrOpenBlob) {
        // For IE
        const blob = new Blob(["Mock export content"], { type: "text/plain" });
        window.navigator.msSaveOrOpenBlob(blob, `${fileName}.pdf`);
      } else {
        // For other browsers
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // In reality, this would be the actual export data URL
        a.href = URL.createObjectURL(
          new Blob(["Mock export content"], { type: "text/plain" })
        );

        a.download = `${fileName}.pdf`;
        a.click();

        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <DownloadCloud className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-scroll h-[95vh]">
        <DialogHeader>
          <DialogTitle>Export Analysis</DialogTitle>
          <DialogDescription>
            Generate a report of your code analysis with the options below.
          </DialogDescription>
        </DialogHeader>

        {isCompleted ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center">Export Complete</h3>
            <p className="text-neutral-500 text-center">
              Your analysis has been exported successfully.
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <Progress value={75} className="w-[80%]" />
            <p className="text-neutral-500">Generating your export...</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">CFG Visualization</h3>
                      <p className="text-sm text-neutral-500">
                        {nodes.length} nodes • {edges.length} edges
                      </p>

                      <ControlFlowGraph />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Code Analysis</h3>
                      <p className="text-sm text-neutral-500">
                        Python • {code?.split("\n").length || 0} lines
                      </p>
                      <div className="mt-2 rounded bg-neutral-100 p-2 text-sm font-mono overflow-auto">
                        <pre>
                          <code>{code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Cyclomatic Complexity</h3>
                      <span className="font-medium">
                        {cyclomaticComplexity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <h3 className="font-medium">Code Coverage</h3>
                      <span className="font-medium">{coverage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Execution Paths</h3>
                      <span className="font-medium">{totalPaths}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <h3 className="font-medium">Passed Paths</h3>
                      <span className="font-medium text-green-600">
                        {passedPaths}/{totalPaths}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-2">Selected Format</h3>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                <span className="capitalize">PDF Report</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isLoading || isCompleted}
            className="gap-2"
          >
            <DownloadCloud className="h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
