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
import { SaveAnalysisDialog } from "../components/save-analysis-dialog";

function WorkFlowPage() {
  const {
    rawEdges,
    rawNodes,
    nodes: storeNodes,
    edges: storeEdges,
    triggerAnimation,
    setNodeCount,
    setEdgeCount,
    nodeCount,
    edgeCount,
  } = useCodeStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [initialRender, setInitialRender] = useState(true);

 // Calculate and update node and edge counts
  useEffect(() => {
    // Only update counts when we have source data
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    if (sourceNodes && sourceNodes.length > 0) {
      // Update node count
      setNodeCount(sourceNodes.length);

      // PERBAIKAN: Jangan filter edge "True" atau "False".
      // Semua edge adalah bagian dari struktur graph yang valid untuk perhitungan complexity.
      if (sourceEdges && sourceEdges.length > 0) {
        setEdgeCount(sourceEdges.length);

        console.log("Updated nodeCount:", sourceNodes.length);
        console.log("Updated edgeCount:", sourceEdges.length);
      }
    }
  }, [rawNodes, rawEdges, storeNodes, storeEdges, setNodeCount, setEdgeCount]);

  // Fungsi untuk menambahkan node secara bertahap dengan animasi
  const animateNodesAndEdges = useCallback(() => {
    // Reset state
    setNodes([]);
    setEdges([]);
    // Tentukan sumber data - gunakan rawNodes jika tersedia, jika tidak gunakan storeNodes
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    // Tambahkan nodes secara bertahap
    if (sourceNodes && sourceNodes.length > 0) {
      sourceNodes.forEach((node, index) => {
        setTimeout(() => {
          setNodes((prevNodes) => [...prevNodes, { ...node }]);
        }, index * 200); // Delay 150ms per node
      });

      // Tambahkan edges setelah semua node selesai di-render
      const nodesDelay = sourceNodes.length * 150;
      if (sourceEdges && sourceEdges.length > 0) {
        setTimeout(() => {
          sourceEdges.forEach((edge, index) => {
            setTimeout(() => {
              setEdges((prevEdges) => [...prevEdges, { ...edge }]);
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
      setInitialRender(false);
    }
  }, [initialRender, storeNodes, storeEdges, setNodes, setEdges]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />

      <div className="hidden px-16 pt-20 pb-6 xl:block">
        <div className="flex items-center justify-between my-4">
          <ServerStatus />

          <SaveAnalysisDialog />
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[75vh] border rounded-2xl bg-white dark:bg-black shadow-lg"
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
                  <GitFork className="w-5 h-5 text-neutral-700" />
                  <h2 className="font-semibold">Grafik Alur Kontrol</h2>
                </div>
                <Badge variant="secondary">
                  {nodeCount} Node • {edgeCount} Sisi
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
                  minZoom: 0.5,
                }}
              >
                <Background variant={BackgroundVariant.Dots} gap={12} />
                <Controls />
              </ReactFlow>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Panel Analisis */}
          <ResizablePanel minSize={20} defaultSize={25} className="border-l">
            <div className="flex flex-col h-full">
              <Tabs defaultValue="metrics" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-2 mx-4 mt-4">
                  <TabsTrigger value="metrics">
                    <div className="flex items-center gap-1">
                      <ListChecks className="w-4 h-4" />
                      <span>Metrik</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="testcase">
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      <span>Kasus Uji</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="metrics"
                  className="flex-1 p-4 max-h-[70vh] overflow-y-auto space-y-4"
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        Kompleksitas Siklomatik
                        <TooltipComponent information="Jumlah minimum jalur yang harus diuji">
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
                          <span className="text-neutral-500">Sisi (Edges)</span>
                          <span className="font-medium">{edgeCount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-neutral-500">Simpul (Nodes)</span>
                          <span className="font-medium">{nodeCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* coverage path component */}
                  <CoveragePath />

                  {/* path analysis component */}
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