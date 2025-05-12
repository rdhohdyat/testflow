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
  Code as CodeIcon, 
  GitGraph, 
  FileDown, 
  ChevronRight,
  BarChart,
  Shield,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useCodeStore } from "../store/CodeStore";
import { Progress } from "./ui/progress";
import ControlFlowGraph from "./control-flow-graph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ExportDialog = () => {
  const { code, nodes, edges, paths } = useCodeStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  // Calculate metrics for summary
  const cyclomaticComplexity = edges.length - nodes.length + 2;
  const complexityRating = cyclomaticComplexity <= 5 
    ? "Low" 
    : cyclomaticComplexity <= 10 
      ? "Moderate" 
      : "High";
  
  const complexityColor = cyclomaticComplexity <= 5 
    ? "text-green-600" 
    : cyclomaticComplexity <= 10 
      ? "text-yellow-600" 
      : "text-red-600";

  const coverage = 58; // Example value
  const passedPaths = paths?.filter(p => p.passed)?.length || 2; // Use actual paths if available
  const totalPaths = paths?.length || 3; // Use actual paths if available
  
  const executionTime = "1.25s"; // Example value
  
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
        window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${exportFormat}`);
      } else {
        // For other browsers
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // In reality, this would be the actual export data URL
        a.href = URL.createObjectURL(
          new Blob(["Mock export content"], { type: "text/plain" })
        );

        a.download = `${fileName}.${exportFormat}`;
        a.click();

        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }
    }, 1500);
  };

  // Calculate code metrics
  const lineCount = code?.split("\n").length || 0;
  const commentCount = code?.split("\n").filter(line => line.trim().startsWith("#")).length || 0;
  const codeQuality = (passedPaths / totalPaths) * 100;
  
  // Get quality level and color
  const getQualityLevel = (percentage) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600" };
    if (percentage >= 75) return { level: "Good", color: "text-emerald-600" };
    if (percentage >= 50) return { level: "Average", color: "text-yellow-600" };
    return { level: "Needs Improvement", color: "text-red-600" };
  };
  
  const qualityInfo = getQualityLevel(codeQuality);

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
          <DialogDescription>
            Generate a comprehensive report of your code analysis with the visualization and metrics shown below.
          </DialogDescription>
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
              {`cfg-analysis-${new Date().toISOString().slice(0, 10)}.${exportFormat}`}
            </Badge>
          </div>
        ) : isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <Progress value={75} className="w-[80%]" />
            <div className="text-center">
              <p className="text-lg font-medium">Generating your export...</p>
              <p className="text-neutral-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Analysis Summary</h2>
                <p className="text-sm text-muted-foreground">Comprehensive overview of code and control flow analysis</p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" /> Analysis: {executionTime}
              </Badge>
            </div>

            <Tabs defaultValue="visualization" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="visualization">
                  <GitGraph className="h-4 w-4 mr-2" />
                  Visualization
                </TabsTrigger>
                <TabsTrigger value="code">
                  <CodeIcon className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="metrics">
                  <BarChart className="h-4 w-4 mr-2" />
                  Metrics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualization" className="space-y-4">
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
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                            {nodes.length} Nodes
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                            {edges.length} Edges
                          </Badge>
                        </div>
                      </div>
                      <div className="min-h-[300px] flex items-center justify-center">
                        <ControlFlowGraph />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CodeIcon className="h-4 w-4 text-primary" />
                      Source Code
                    </CardTitle>
                    <CardDescription>
                      Original source code with {lineCount} lines ({commentCount} comments)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 border dark:border-neutral-700">
                      <pre className="text-sm font-mono overflow-auto max-h-[400px]">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
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
                            <p className="text-sm font-medium">Cyclomatic Complexity</p>
                            <p className="text-xs text-muted-foreground">
                              Measures the number of linearly independent paths
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-semibold ${complexityColor}`}>{cyclomaticComplexity}</p>
                            <Badge variant={cyclomaticComplexity <= 5 ? "outline" : "secondary"} className={complexityColor}>
                              {complexityRating}
                            </Badge>
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
                            <p className="text-lg font-semibold">{coverage}%</p>
                            <div className="w-32 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${coverage}%` }}
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
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Code Quality</p>
                            <p className="text-xs text-muted-foreground">
                              Based on passed path ratio
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-semibold ${qualityInfo.color}`}>
                              {passedPaths}/{totalPaths} <span className="text-sm">Paths</span>
                            </p>
                            <Badge variant="outline" className={qualityInfo.color}>
                              {qualityInfo.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <h3 className="font-medium">Export Format</h3>
                <Select 
                  defaultValue={exportFormat} 
                  onValueChange={setExportFormat}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-red-500 mr-2" />
                        PDF Report
                      </div>
                    </SelectItem>
                    <SelectItem value="html">
                      <div className="flex items-center">
                        <CodeIcon className="h-4 w-4 text-blue-500 mr-2" />
                        HTML Report
                      </div>
                    </SelectItem>
                    <SelectItem value="json">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-green-500 mr-2" />
                        JSON Data
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <Card className="bg-neutral-50 dark:bg-neutral-800 border p-2 px-3 flex items-center gap-2">
                  {exportFormat === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                  {exportFormat === "html" && <CodeIcon className="h-5 w-5 text-blue-500" />}
                  {exportFormat === "json" && <BarChart className="h-5 w-5 text-green-500" />}
                  <span className="text-sm font-medium capitalize">{exportFormat} Format</span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </Card>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
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