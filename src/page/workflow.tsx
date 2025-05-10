import { useMemo } from "react";
import { Navbar } from "../components/navbar";
import { Code, GitFork, ListChecks } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import CodeEditor from "../components/code-editor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import TooltipComponent from "../components/tooltip-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import ServerStatus from "../components/server-status";
import PathList from "../components/path-list";
import TestCase from "../components/test-case";

function WorkFlowPage() {
  const { edges, nodes, paths } = useCodeStore();

  const cyclomaticComplexity = useMemo(() => {
    const E = edges.length;

    const N = nodes.length;

    return E - N + 2;
  }, [edges, nodes]);

  const totalPassed = paths.filter((item) => item.passed).length;
  const totalPaths = paths.length;
  const percentage = (totalPassed / totalPaths) * 100;

  const totalCoverage = percentage;

  return (
    <div className="bg-neutral-50 min-h-screen dark:bg-black">
      <Navbar />

      <div className="hidden xl:block px-16 pt-20 pb-6">
        <div className="flex items-center justify-between my-4">
          <ServerStatus />
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[75vh] border rounded-lg bg-white dark:bg-black shadow-sm"
        >
          <ResizablePanel minSize={20} defaultSize={25} className="border-r">
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            minSize={40}
            defaultSize={50}
            className="bg-white dark:bg-black"
          >
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

                <TabsContent
                  value="metrics"
                  className="flex-1 p-4 max-h-[70vh] overflow-y-auto space-y-4"
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        Cyclomatic Complexity
                        <TooltipComponent information="Minimum number of paths to be tested">
                          <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">
                            ?
                          </span>
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
                            <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">
                              ?
                            </span>
                          </TooltipComponent>
                        </div>
                        <span className="text-sm font-normal">
                          {totalCoverage.toFixed(0)}%
                        </span>
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
                          <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">
                            ?
                          </span>
                        </TooltipComponent>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <PathList />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="testcase"
                  className="flex-1 p-4 max-h-[70vh] overflow-y-auto"
                >
                  <TestCase />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* mobile version nanti disini */}
    </div>
  );
}

export default WorkFlowPage;
