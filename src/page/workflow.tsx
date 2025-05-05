import { useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { CircleCheck, CircleX, Code, GitFork, ListChecks } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import CodeEditor from "../components/CodeEditor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../components/ui/drawer";
import TooltipComponent from "../components/TooltipComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import ServerStatus from "../components/ServerStatus";


function WorkFlowPage() {
  const { params, setParams, edges, setEdges, nodes, setNodes } = useCodeStore();

  const paths = [
    { id: 1, path: [1, 2, 3], status: "failed", coverage: 40 },
    { id: 2, path: [1, 2, 4, 5], status: "passed", coverage: 60 },
    { id: 3, path: [1, 3, 5, 6], status: "passed", coverage: 75 },
  ];

  const cyclomaticComplexity = useMemo(() => {
    const E = edges.length;
    const N = nodes.length;
    return E - N + 2;
  }, [edges, nodes]);

  const totalCoverage = useMemo(() => {
    return paths.reduce((acc, path) => acc + path.coverage, 0) / paths.length;
  }, [paths]);

  return (
    <div className="bg-neutral-50 min-h-screen dark:bg-black">
      <Navbar />

      <div className="hidden xl:block px-16 pt-20 pb-6">
        <div className="flex items-center justify-between my-4">
         <ServerStatus/>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[75vh] border rounded-lg bg-white dark:bg-black shadow-sm">
          <ResizablePanel minSize={20} defaultSize={25} className="border-r">
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={40} defaultSize={50} className="bg-white dark:bg-black">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitFork className="h-5 w-5 text-neutral-700" />
                  <h2 className="font-semibold">Control Flow Graph</h2>
                </div>
                <Badge variant="secondary">
                  {nodes.length} Nodes • {edges.length} Edges
                </Badge>
              </div>
            </div>
            <div className="h-[65vh]">
              <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.5, 
                  maxZoom: 1,   
                  minZoom: 0.7,
                }}
              >
                <Background variant={BackgroundVariant.Lines} gap={12} />
                <Controls showInteractive={true} />
              
              </ReactFlow>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Analysis Panel */}
          <ResizablePanel minSize={20} defaultSize={25} className="border-l">
            <div className="h-full flex flex-col">
              <Tabs defaultValue="metrics" className="h-full flex flex-col">
                <TabsList className="grid grid-cols-2 mx-4 mt-4">
                  <TabsTrigger value="metrics">
                    <div className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      <span>Metrics</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="testcase">
                    <div className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      <span>Test Cases</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="flex-1 p-4 max-h-[70vh] overflow-y-auto space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        Cyclomatic Complexity
                        <TooltipComponent information="Minimum number of paths to be tested">
                          <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">?</span>
                        </TooltipComponent>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        E - N + 2 = {cyclomaticComplexity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-neutral-500">Edges</span>
                          <span className="font-medium">{edges.length}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-neutral-500">Nodes</span>
                          <span className="font-medium">{nodes.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          Coverage
                          <TooltipComponent information="Code coverage from analyzed paths">
                            <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">?</span>
                          </TooltipComponent>
                        </div>
                        <span className="text-sm font-normal">{totalCoverage.toFixed(0)}%</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <Progress value={totalCoverage} className="h-2 mb-4" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        Execution Paths
                        <TooltipComponent information="All execution paths from FlowGraph">
                          <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">?</span>
                        </TooltipComponent>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {paths.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-md border bg-neutral-50 dark:bg-neutral-700 text-sm"
                        >
                          <div className="font-mono">{item.path.join(" → ")}</div>
                          {item.status === "passed" ? (
                            <CircleCheck className="text-green-500 h-4 w-4" />
                          ) : (
                            <CircleX className="text-red-500 h-4 w-4" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="testcase" className="flex-1 p-4 max-h-[70vh] overflow-y-auto">
                  <Card className="mb-4 overflow-y-auto">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Input Test Case</CardTitle>
                      <CardDescription>
                        {params?.length > 0 ? `Parameters: ${params?.join(", ")}` : "No parameters detected"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {params?.length > 0 ? (
                        params?.map((param, index) => (
                          <div key={index} className="space-y-1">
                            <label className="text-sm font-medium" htmlFor={`param-${index}`}>
                              {param}:
                            </label>
                            <Input
                              id={`param-${index}`}
                              type="text"
                              placeholder={`Enter value for ${param}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-neutral-500">
                          Generate CFG first to detect parameters
                        </div>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button className="w-full" disabled={!params?.length}>
                          Evaluate Test Case
                        </Button>
                        <Button variant="outline" className="w-full" disabled={!params?.length}>
                          Clear Values
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        Evaluation Result
                        <TooltipComponent information="Results of the test cases used">
                          <span className="text-xs bg-neutral-100 px-1 py-0.5 rounded">?</span>
                        </TooltipComponent>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-md bg-neutral-50 border text-center">
                        <p className="text-neutral-500 text-sm">No test case evaluated yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Version */}
      <div className="xl:hidden container pt-20 pb-6 px-4">
        <h1 className="text-xl font-bold mb-4 text-neutral-900">Python CFG Analyzer</h1>
        
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="code">
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Editor</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="graph">
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>Graph</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <div className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                <span>Analysis</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code">
            <Card>
              <CardContent className="p-0">
                <CodeEditor />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="graph">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <div>Control Flow Graph</div>
                  <Badge variant="secondary">
                    {nodes.length} Nodes • {edges.length} Edges
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[60vh]">
                  <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                    <Controls  />
                  </ReactFlow>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Cyclomatic Complexity</CardTitle>
                  <CardDescription>
                    {edges.length} - {nodes.length} + 2 = {cyclomaticComplexity}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Execution Paths</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[200px] overflow-y-auto space-y-2">
                  {paths.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-md border  bg-neutral-50 text-sm"
                    >
                      <div className="font-mono dark:text-neutral-900">{item.path.join(" → ")}</div>
                      {item.status === "passed" ? (
                        <CircleCheck className="text-green-500 h-4 w-4" />
                      ) : (
                        <CircleX className="text-red-500 h-4 w-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="w-full">Input Test Case</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <h2 className="text-lg font-semibold">
                      {params?.length > 0 
                        ? `Input Test Case (${params.join(", ")})` 
                        : "Input Test Case"}
                    </h2>
                    <div className="space-y-3 mt-4">
                      {params?.length > 0 ? (
                        params?.map((param, index) => (
                          <div key={index} className="space-y-1">
                            <label className="text-sm font-medium">
                              {param}:
                            </label>
                            <Input placeholder={`Enter value for ${param}`} />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-neutral-500">
                          Generate CFG first to detect parameters
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 p-4 border rounded-md bg-neutral-50">
                      <h3 className="text-sm font-medium mb-1">
                        Evaluation Result:
                      </h3>
                      <p className="text-sm text-neutral-500">
                        No test case evaluated yet
                      </p>
                    </div>
                  </DrawerHeader>
                  <DrawerFooter className="gap-2">
                    <Button disabled={!params?.length}>Evaluate Test Case</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default WorkFlowPage;