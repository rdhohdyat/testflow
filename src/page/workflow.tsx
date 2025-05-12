import { Navbar } from "../components/navbar";
import { Code, GitFork, ListChecks } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import CodeEditor from "../components/code-editor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";
import { useCallback, useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import ServerStatus from "../components/server-status";
import PathList from "../components/path-list";
import TestCase from "../components/test-case";
import CoveragePath from "../components/coverage-path";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import TooltipComponent from "../components/tooltip-component";

function WorkFlowPage() {
  const {
    rawEdges,
    rawNodes,
    nodes: storeNodes,
    edges: storeEdges,
    triggerAnimation,
  } = useCodeStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [initialRender, setInitialRender] = useState(true);

  // Fungsi untuk menambahkan node secara bertahap dengan animasi
  const animateNodesAndEdges = useCallback(() => {
    // Reset state
    setNodes([]);
    setEdges([]);
    setNodeCount(0);
    setEdgeCount(0);

    // Tentukan sumber data - gunakan rawNodes jika tersedia, jika tidak gunakan storeNodes
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    // Tambahkan nodes secara bertahap
    if (sourceNodes && sourceNodes.length > 0) {
      sourceNodes.forEach((node, index) => {
        setTimeout(() => {
          setNodes((prevNodes) => [...prevNodes, { ...node }]);
          setNodeCount(index + 1);
        }, index * 200); // Delay 150ms per node
      });

      // Tambahkan edges setelah semua node selesai di-render
      const nodesDelay = sourceNodes.length * 150;
      if (sourceEdges && sourceEdges.length > 0) {
        setTimeout(() => {
          sourceEdges.forEach((edge, index) => {
            setTimeout(() => {
              setEdges((prevEdges) => [...prevEdges, { ...edge }]);
              setEdgeCount(index + 1);
            }, index * 200); // Delay 100ms per edge
          });
        }, nodesDelay);
      }
    }
  }, [rawNodes, rawEdges, storeNodes, storeEdges, setNodes, setEdges]);

  useEffect(() => {
    if (triggerAnimation) {
      animateNodesAndEdges();
      setInitialRender(false);
    }
  }, [triggerAnimation, animateNodesAndEdges]);

  // Handle initial render - load dari localStorage tanpa animasi
  useEffect(() => {
    if (initialRender && storeNodes.length > 0) {
      setNodes(storeNodes);
      setEdges(storeEdges);
      setNodeCount(storeNodes.length);
      setEdgeCount(storeEdges.length);
      setInitialRender(false);
    }
  }, [initialRender, storeNodes, storeEdges, setNodes, setEdges]);

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
                  {nodeCount} Nodes • {edgeCount} Edges
                </Badge>
              </div>
            </div>
            <div className="h-[65vh]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                fitViewOptions={{
                  maxZoom: 0.8,
                  minZoom: 0.6,
                }}
              >
                <Background variant={BackgroundVariant.Dots} gap={12} />
                <Controls />
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
                        E - N + 2 = {edgeCount - nodeCount + 2}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-neutral-500">Edges</span>
                          <span className="font-medium">{edgeCount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-neutral-500">Nodes</span>
                          <span className="font-medium">{nodeCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <CoveragePath />
                  <PathList />
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
    </div>
  );
}

export default WorkFlowPage;
