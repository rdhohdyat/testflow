import { Navbar } from "../components/navbar";
import { Code, GitFork, ListChecks, BarChart3 } from "lucide-react"; // Hapus Monitor & LayoutContent
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
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
  
  // PERBAIKAN: Tambahkan Generic <Node> dan <Edge>
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [initialRender, setInitialRender] = useState(true);

  // Efek untuk menghitung jumlah node dan edge
  useEffect(() => {
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    if (sourceNodes && sourceNodes.length > 0) {
      setNodeCount(sourceNodes.length);
      if (sourceEdges && sourceEdges.length > 0) {
        setEdgeCount(sourceEdges.length);
      }
    }
  }, [rawNodes, rawEdges, storeNodes, storeEdges, setNodeCount, setEdgeCount]);

  // Fungsi animasi rendering node dan edge
  const animateNodesAndEdges = useCallback(() => {
    setNodes([]);
    setEdges([]);
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    if (sourceNodes && sourceNodes.length > 0) {
      sourceNodes.forEach((node, index) => {
        setTimeout(() => {
          // @ts-ignore - Mengabaikan strict type check sementara untuk animasi
          setNodes((prevNodes) => [...prevNodes, { ...node }]);
        }, index * 200);
      });

      const nodesDelay = sourceNodes.length * 150;
      if (sourceEdges && sourceEdges.length > 0) {
        setTimeout(() => {
          sourceEdges.forEach((edge, index) => {
            setTimeout(() => {
              // @ts-ignore
              setEdges((prevEdges) => [...prevEdges, { ...edge }]);
            }, index * 200);
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

  useEffect(() => {
    if (initialRender && storeNodes.length > 0) {
      // @ts-ignore
      setNodes(storeNodes);
      // @ts-ignore
      setEdges(storeEdges);
      setInitialRender(false);
    }
  }, [initialRender, storeNodes, storeEdges, setNodes, setEdges]);

  // ... (Sisa kode return JSX sama seperti file asli)
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />
      {/* --- Paste sisa return JSX dari file asli di sini (tidak berubah) --- */}
      <div className="block px-4 pt-20 pb-10 xl:hidden">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <ServerStatus />
            <SaveAnalysisDialog />
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sticky top-20 z-10 bg-neutral-50 dark:bg-black p-1">
            <TabsTrigger value="editor" className="text-xs sm:text-sm">
              <Code className="w-4 h-4 mr-1" /> Editor
            </TabsTrigger>
            <TabsTrigger value="graph" className="text-xs sm:text-sm">
              <GitFork className="w-4 h-4 mr-1" /> Grafik
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1" /> Analisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-0 focus-visible:outline-none">
            <div className="border rounded-xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden h-[60vh]">
              <CodeEditor />
            </div>
          </TabsContent>

          <TabsContent value="graph" className="mt-0 focus-visible:outline-none">
            <div className="border rounded-xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden h-[60vh] flex flex-col">
              <div className="p-3 border-b flex justify-between items-center bg-neutral-50 dark:bg-neutral-800">
                <span className="text-xs font-semibold">Control Flow Graph</span>
                <Badge variant="secondary" className="text-[10px]">
                  {nodeCount} Node • {edgeCount} Sisi
                </Badge>
              </div>
              <div className="flex-1">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                >
                  <Background variant={BackgroundVariant.Dots} gap={12} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0 space-y-4 focus-visible:outline-none">
            <Card className="shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold">Metrik Kompleksitas</CardTitle>
                <CardDescription className="text-xs">
                  V(G) = E - N + 2 = {edgeCount - nodeCount + 2}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-neutral-500 uppercase">Nodes</p>
                    <p className="text-lg font-bold">{nodeCount}</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-neutral-500 uppercase">Edges</p>
                    <p className="text-lg font-bold">{edgeCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="metrics_sub" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="metrics_sub" className="text-xs">Daftar Jalur</TabsTrigger>
                <TabsTrigger value="testcase_sub" className="text-xs">Test Case</TabsTrigger>
              </TabsList>
              <TabsContent value="metrics_sub" className="space-y-4">
                <CoveragePath />
                <PathList />
              </TabsContent>
              <TabsContent value="testcase_sub">
                <TestCase />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden px-16 pt-20 pb-6 xl:block">
        <div className="flex items-center justify-between my-4">
          <ServerStatus />
          <SaveAnalysisDialog />
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[75vh] border rounded-2xl bg-white dark:bg-black shadow-lg"
        >
          {/* Panel Kiri: Editor */}
          <ResizablePanel minSize={20} defaultSize={25} className="border-r">
            <CodeEditor />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Panel Tengah: Grafik */}
          <ResizablePanel minSize={40} defaultSize={50} className="bg-white dark:bg-black">
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
                fitViewOptions={{ maxZoom: 0.8, minZoom: 0.5 }}
              >
                <Background variant={BackgroundVariant.Dots} gap={12} />
                <Controls />
              </ReactFlow>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Panel Kanan: Analisis */}
          <ResizablePanel minSize={20} defaultSize={25} className="border-l">
            <div className="flex flex-col h-full">
              <Tabs defaultValue="metrics" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-2 mx-4 mt-4">
                  <TabsTrigger value="metrics">
                    <ListChecks className="w-4 h-4 mr-1" /> Metrik
                  </TabsTrigger>
                  <TabsTrigger value="testcase">
                    <Code className="w-4 h-4 mr-1" /> Kasus Uji
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="flex-1 p-4 max-h-[70vh] overflow-y-auto space-y-4">
                  <Card>
                    <CardHeader className="pb-2 p-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        Kompleksitas Siklomatik
                        <TooltipComponent information="Jumlah minimum jalur yang harus diuji">
                          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full cursor-help">?</span>
                        </TooltipComponent>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        V(G) = {edgeCount} - {nodeCount} + 2 = {edgeCount - nodeCount + 2}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex flex-col bg-neutral-50 dark:bg-neutral-900 p-2 rounded">
                          <span className="text-neutral-500">Edges</span>
                          <span className="font-bold text-sm">{edgeCount}</span>
                        </div>
                        <div className="flex flex-col bg-neutral-50 dark:bg-neutral-900 p-2 rounded">
                          <span className="text-neutral-500">Nodes</span>
                          <span className="font-bold text-sm">{nodeCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <CoveragePath />
                  <PathList />
                </TabsContent>

                <TabsContent value="testcase" className="flex-1 p-4 max-h-[70vh] overflow-y-auto">
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