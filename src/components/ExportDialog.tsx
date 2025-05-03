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
  FileJson,
  FileText,
  Image,
  PieChart,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCodeStore } from "../store/CodeStore";
import { Progress } from "./ui/progress";

const ExportDialog = () => {
  const { code, nodes, edges, params } = useCodeStore();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeOptions, setIncludeOptions] = useState({
    code: true,
    graph: true,
    metrics: true,
    paths: true,
    testCases: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate metrics for summary
  const cyclomaticComplexity = edges.length - nodes.length + 2;
  const coverage = 58; // Example value
  const passedPaths = 2; // Example value
  const totalPaths = 3; // Example value

  const toggleIncludeOption = (option) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

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

      // Here you would implement the actual export functionality
      console.log("Exporting with format:", exportFormat);
      console.log("Include options:", includeOptions);

      // Create and trigger file download
      const fileName = `cfg-analysis-${new Date().toISOString().slice(0, 10)}`;
      const extension = exportFormat;
      
      // In a real implementation, you would generate the actual file content
      // and create a download link
      
      // Example mock download
      if (window.navigator.msSaveOrOpenBlob) {
        // For IE
        const blob = new Blob(["Mock export content"], { type: "text/plain" });
        window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${extension}`);
      } else {
        // For other browsers
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        
        // In reality, this would be the actual export data URL
        a.href = URL.createObjectURL(
          new Blob(["Mock export content"], { type: "text/plain" })
        );
        
        a.download = `${fileName}.${extension}`;
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
      <DialogContent className="sm:max-w-[600px]">
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
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="options">Export Options</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Code Analysis</h3>
                        <p className="text-sm text-neutral-500">
                          Python • {code?.split("\n").length || 0} lines
                        </p>
                      </div>
                      <PieChart className="h-5 w-5 text-neutral-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">CFG Visualization</h3>
                        <p className="text-sm text-neutral-500">
                          {nodes.length} nodes • {edges.length} edges
                        </p>
                      </div>
                      <BarChart2 className="h-5 w-5 text-neutral-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Cyclomatic Complexity</h3>
                        <span className="font-medium">{cyclomaticComplexity}</span>
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
                        <span className="font-medium text-green-600">{passedPaths}/{totalPaths}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-2">Selected Format</h3>
                <div className="flex items-center gap-2">
                  {exportFormat === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                  {exportFormat === "png" && <Image className="h-5 w-5 text-blue-500" />}
                  <span className="capitalize">{exportFormat} Report</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-3">Export Format</h3>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={setExportFormat}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-red-500" />
                        PDF Document
                      </Label>
                    </div>
                  </div>

                

                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="png" id="png" />
                      <Label htmlFor="png" className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-blue-500" />
                        PNG Image
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Include in Export</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="code"
                      checked={includeOptions.code}
                      onCheckedChange={() => toggleIncludeOption("code")}
                    />
                    <Label htmlFor="code" className="text-sm">Source Code</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="graph"
                      checked={includeOptions.graph}
                      onCheckedChange={() => toggleIncludeOption("graph")}
                    />
                    <Label htmlFor="graph" className="text-sm">Control Flow Graph</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="metrics"
                      checked={includeOptions.metrics}
                      onCheckedChange={() => toggleIncludeOption("metrics")}
                    />
                    <Label htmlFor="metrics" className="text-sm">Complexity Metrics</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paths"
                      checked={includeOptions.paths}
                      onCheckedChange={() => toggleIncludeOption("paths")}
                    />
                    <Label htmlFor="paths" className="text-sm">Execution Paths</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="testCases"
                      checked={includeOptions.testCases}
                      onCheckedChange={() => toggleIncludeOption("testCases")}
                    />
                    <Label htmlFor="testCases" className="text-sm">Test Cases</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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