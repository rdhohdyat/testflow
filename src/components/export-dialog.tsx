import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
} from "./ui/card";
import {
  FileCode,
  Activity,
  GitBranch,
  Terminal,
  Download,
  FileText,
  Clock,
  ChevronRight,
  LayoutList,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";

// 1. IMPORT REACT FLOW
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "../data/node";

// 2. IMPORT SYNTAX HIGHLIGHTER
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SavedAnalysis {
  id: number;
  name: string;
  source_code: string;
  path_list: any;
  cyclomatic_complexity: number;
  coverage_path: number;
  test_cases: any;
  created_at: string;
  nodes_list: any;
  edges_list: any;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectCodes: SavedAnalysis[];
}

export default function ExportDialog({
  open,
  onOpenChange,
  projectName,
  projectCodes,
}: ExportDialogProps) {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && projectCodes.length > 0) {
      setSelectedAnalysisId(projectCodes[projectCodes.length - 1].id);
    }
  }, [open, projectCodes]);

  const currentData = projectCodes.find((c) => c.id === selectedAnalysisId);

  const handleCopyCode = () => {
    if (currentData?.source_code) {
      navigator.clipboard.writeText(currentData.source_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const parseData = (data: any, type: "array" | "path" | "graph") => {
    if (!data) return [];
    let parsed = data;
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch {
        return [];
      }
    }
    
    // Perbaikan: Jangan filter/map di sini agar object path {path:[], testCase:{}} tidak hilang
    if (type === "path") {
       return Array.isArray(parsed) ? parsed : [];
    }

    return Array.isArray(parsed) ? parsed : [];
  };

  const formatPath = (p: any) => {
    if (Array.isArray(p)) return p.join(" → ");
    if (typeof p === "string") return p;
    return "-";
  };

  const paths = currentData ? parseData(currentData.path_list, "path") : [];
  const nodes = currentData ? parseData(currentData.nodes_list, "graph") : [];
  const edges = currentData ? parseData(currentData.edges_list, "graph") : [];

  // Filter paths yang memiliki testCase untuk tab "Test Cases"
  const executedPaths = paths.filter((item: any) => item.testCase !== undefined && item.testCase !== null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-neutral-50/50 dark:bg-neutral-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle>Laporan Project: {projectName}</DialogTitle>
              <DialogDescription>
                Total Versi Analisis: {projectCodes.length}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <div className="w-1/4 min-w-[260px] border-r bg-neutral-50/30 dark:bg-neutral-900/30 flex flex-col">
            <div className="p-3 border-b bg-neutral-100/50 dark:bg-neutral-900">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" /> Pilih Versi
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col p-2 gap-1">
                {projectCodes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    Belum ada riwayat analisis.
                  </div>
                ) : (
                  [...projectCodes].reverse().map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAnalysisId(item.id)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all border group relative",
                        selectedAnalysisId === item.id
                          ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100 dark:bg-neutral-800 dark:border-blue-900 z-10"
                          : "border-transparent hover:bg-white hover:border-neutral-200 dark:hover:bg-neutral-800",
                      )}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span
                          className={cn(
                            "font-semibold text-sm truncate pr-2",
                            selectedAnalysisId === item.id
                              ? "text-blue-700 dark:text-blue-400"
                              : "text-neutral-700 dark:text-neutral-300",
                          )}
                        >
                          {item.name || `Analisis #${item.id}`}
                        </span>
                        {selectedAnalysisId === item.id && (
                          <ChevronRight className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center justify-between w-full mt-1">
                        <span>
                          {new Date(item.created_at).toLocaleString("id-ID", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-neutral-100 border border-neutral-200 text-neutral-500">
                          CC: {item.cyclomatic_complexity}
                        </Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-950 min-w-0">
            {currentData ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 pt-2 border-b">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger value="overview" className="tab-trigger"><Activity className="w-4 h-4 mr-2" /> Ringkasan</TabsTrigger>
                    <TabsTrigger value="graph" className="tab-trigger"><Share2 className="w-4 h-4 mr-2" /> Visualisasi</TabsTrigger>
                    <TabsTrigger value="code" className="tab-trigger"><FileCode className="w-4 h-4 mr-2" /> Kode</TabsTrigger>
                    <TabsTrigger value="paths" className="tab-trigger"><GitBranch className="w-4 h-4 mr-2" /> Jalur ({paths.length})</TabsTrigger>
                    <TabsTrigger value="tests" className="tab-trigger"><Terminal className="w-4 h-4 mr-2" /> Test Cases ({executedPaths.length})</TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1">
                  {/* TAB: RINGKASAN */}
                  <TabsContent value="overview" className="p-6 mt-0 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard label="Kompleksitas (CC)" value={currentData.cyclomatic_complexity} sub="Indikator kerumitan logika" />
                      <MetricCard label="Coverage Path" value={`${currentData.coverage_path ? currentData.coverage_path.toFixed(0) : 0}%`} sub="Persentase jalur teruji" isGood={currentData.coverage_path === 100} />
                    </div>
                    <div className="border rounded-lg divide-y bg-neutral-50/30">
                      <StatRow label="Nama Analisis" value={currentData.name} />
                      <StatRow label="Tanggal Disimpan" value={new Date(currentData.created_at).toLocaleString()} />
                      <StatRow label="Panjang Kode" value={`${currentData.source_code.split("\n").length} Baris`} />
                    </div>
                  </TabsContent>

                  {/* TAB: VISUALISASI GRAPH */}
                  <TabsContent value="graph" className="h-[600px] w-full mt-0 relative border-b">
                    {nodes.length > 0 ? (
                       <div className="h-full w-full bg-neutral-50 dark:bg-black">
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={true}
                            fitView
                            fitViewOptions={{ padding: 0.2 }}
                          >
                            <Background variant={BackgroundVariant.Dots} gap={12} />
                            <Controls />
                          </ReactFlow>
                       </div>
                    ) : (
                       <EmptyState text="Data visualisasi tidak tersedia untuk versi ini." />
                    )}
                  </TabsContent>

                  {/* TAB: KODE */}
                  <TabsContent value="code" className="p-6 mt-0">
                    <div className="relative group rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
                      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 hover:bg-neutral-700 text-white"
                          onClick={handleCopyCode}
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        language="python"
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        customStyle={{
                          margin: 0,
                          padding: "1.5rem",
                          fontSize: "0.875rem",
                          lineHeight: "1.6",
                          backgroundColor: "#1e1e1e",
                          minHeight: "300px",
                        }}
                        wrapLines={true}
                      >
                        {currentData.source_code}
                      </SyntaxHighlighter>
                    </div>
                  </TabsContent>

                  {/* TAB: PATHS */}
                  <TabsContent value="paths" className="p-6 mt-0 space-y-3">
                    {paths.length > 0 ? (
                      paths.map((item: any, i: number) => {
                        // Handle jika item adalah array atau object
                        const pathArr = Array.isArray(item) ? item : item.path;
                        return (
                          <div key={i} className="p-3 border rounded-lg bg-white dark:bg-neutral-900 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Path #{i + 1}</Badge>
                            </div>
                            <div className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded border text-xs font-mono text-neutral-600 break-all">
                              {formatPath(pathArr)}
                            </div>
                          </div>
                        );
                      })
                    ) : <EmptyState text="Tidak ada data jalur." />}
                  </TabsContent>

                  {/* TAB: TEST CASES (Mengambil dari paths yang memiliki testCase) */}
                  <TabsContent value="tests" className="p-6 mt-0 space-y-4">
                    {executedPaths.length > 0 ? (
                      executedPaths.map((item: any, index: number) => {
                        return (
                          <Card key={index} className={`border ${item.passed ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}>
                            <CardHeader className="py-2 px-3 border-b bg-white/50 dark:bg-neutral-900/50 flex flex-row items-center justify-between space-y-0">
                              <span className="font-bold text-xs text-neutral-700 dark:text-neutral-300">
                                Test Case #{index + 1}
                              </span>
                              {item.passed ? (
                                <Badge className="h-5 text-[10px] bg-green-500 hover:bg-green-600">Lolos</Badge>
                              ) : (
                                <Badge className="h-5 text-[10px] bg-red-500 hover:bg-red-600">Gagal</Badge>
                              )}
                            </CardHeader>
                            <CardContent className="p-3 space-y-3 text-xs">
                              {/* Input */}
                              <div className="grid grid-cols-[50px_1fr] gap-2">
                                <span className="font-semibold text-neutral-500 mt-1">Input:</span>
                                <pre className="p-2 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 overflow-x-auto font-mono text-neutral-700 dark:text-neutral-300">
                                  {JSON.stringify(item.testCase, null, 2)}
                                </pre>
                              </div>

                              {/* Jalur */}
                              <div className="grid grid-cols-[50px_1fr] gap-2">
                                <span className="font-semibold text-neutral-500 mt-1">Jalur:</span>
                                <div className="p-2 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-neutral-600 dark:text-neutral-400 break-all">
                                  {formatPath(item.path)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <EmptyState text="Tidak ada riwayat pengujian pada jalur ini." />
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                <Activity className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Pilih data di sidebar untuk melihat detail.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
          <Button>
            <Download className="w-4 h-4" />
            Cetak PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MetricCard = ({ label, value, sub, isGood }: any) => (
  <div className="p-5 border rounded-xl bg-neutral-50/50 dark:bg-neutral-900">
    <div className="text-sm text-neutral-500 font-medium mb-1">{label}</div>
    <div className={`text-4xl font-bold ${isGood ? "text-green-600" : "text-neutral-800 dark:text-neutral-200"}`}>{value}</div>
    <div className="text-xs text-neutral-400 mt-2">{sub}</div>
  </div>
);

const StatRow = ({ label, value }: any) => (
  <div className="flex justify-between p-3 text-sm">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-neutral-400 border-2 border-dashed rounded-xl">
    <LayoutList className="w-8 h-8 mb-2 opacity-20" />
    <p>{text}</p>
  </div>
);