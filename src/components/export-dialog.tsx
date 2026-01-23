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
import { Card, CardHeader, CardContent } from "./ui/card";
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
  Menu,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const generateFullPDF = () => {
    if (projectCodes.length === 0) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString("id-ID");

    // --- HALAMAN JUDUL ---
    doc.setFontSize(22);
    doc.text("LAPORAN PEMBUATAN TEST CASE KODE", 105, 80, { align: "center" });
    doc.setFontSize(16);
    doc.text(`Project: ${projectName}`, 105, 95, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${timestamp}`, 105, 280, { align: "center" });

    // --- ITERASI SETIAP DATA ANALISIS ---
    projectCodes.forEach((analysis, index) => {
      doc.addPage();

      // Header Halaman Analisis
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Analisis #${index + 1}: ${analysis.name || "Tanpa Nama"}`,
        14,
        20,
      );

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `ID: ${analysis.id} | Dibuat: ${new Date(analysis.created_at).toLocaleString("id-ID")}`,
        14,
        27,
      );

      // 1. Tabel Metrik
      autoTable(doc, {
        startY: 32,
        head: [["Parameter", "Hasil Analisis"]],
        body: [
          ["Cyclomatic Complexity (CC)", analysis.cyclomatic_complexity],
          ["Code Coverage", `${analysis.coverage_path?.toFixed(1) || 0}%`],
          ["Total Baris Kode", analysis.source_code.split("\n").length],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      // 2. Tabel Source Code
      doc.setFontSize(11);
      doc.text("Source Code:", 14, (doc as any).lastAutoTable.finalY + 10);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 13,
        body: [[analysis.source_code]],
        styles: { font: "courier", fontSize: 8 },
        theme: "plain",
        fillColor: [245, 245, 245],
      });

      // 3. Tabel Jalur Independen
      const currentPaths = parseData(analysis.path_list, "path");
      doc.text(
        `Jalur Independen (${currentPaths.length}):`,
        14,
        (doc as any).lastAutoTable.finalY + 10,
      );

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 13,
        head: [["No", "Urutan Jalur (Nodes)"]],
        body: currentPaths.map((p, i) => [i + 1, formatPath(p.path || p)]),
        styles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 10 } },
      });

      // 4. Tabel Hasil Test Case (Jika Ada)
      const testCases = currentPaths.filter((p: any) => p.testCase);
      if (testCases.length > 0) {
        doc.text(
          "Hasil Eksekusi Test Case:",
          14,
          (doc as any).lastAutoTable.finalY + 10,
        );

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 13,
          head: [["No", "Input", "Status"]],
          body: testCases.map((t, i) => [
            i + 1,
            JSON.stringify(t.testCase),
            t.passed ? "PASSED" : "FAILED",
          ]),
          headStyles: { fillColor: [39, 174, 96] },
          styles: { fontSize: 8 },
        });
      }
    });

    // Footer Nomor Halaman
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, 190, 285, { align: "right" });
    }

    doc.save(`Laporan_Project_${projectName.replace(/\s+/g, "_")}.pdf`);
  };

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

  const parseData = (data: any, type: string) => {
    if (!data) return [];
    let parsed = data;
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch {
        return [];
      }
    }
    return Array.isArray(parsed) ? parsed : [];
  };

const formatPath = (p: any) => {
  // 1. Jika data adalah Array (misal: [1, 2, 3])
  if (Array.isArray(p)) return p.join(", ");
  
  // 2. Jika data adalah String (misal: "1 !' 2 !' 3")
  if (typeof p === "string") {
    // Regex ini akan mencari tanda seru (!) dan karakter kutipan (') 
    // lalu menggantinya dengan koma dan spasi yang rapi
    return p.replace(/[!']/g, "").replace(/\s+/g, " ").split(" ").join(", ");
  }
  
  // 3. Jika data di dalam objek (misal: { path: [1,2,3] })
  if (p && typeof p === 'object' && p.path) {
    return Array.isArray(p.path) ? p.path.join(", ") : String(p.path);
  }
  
  return "-";
};

  const paths = currentData ? parseData(currentData.path_list, "path") : [];
  const nodes = currentData ? parseData(currentData.nodes_list, "graph") : [];
  const edges = currentData ? parseData(currentData.edges_list, "graph") : [];
  const executedPaths = paths.filter(
    (item: any) => item.testCase !== undefined && item.testCase !== null,
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-neutral-100/50 dark:bg-neutral-900 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3 h-3" /> Pilih Versi
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col p-2 gap-1">
          {projectCodes.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              Belum ada riwayat.
            </div>
          ) : (
            [...projectCodes].reverse().map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedAnalysisId(item.id);
                  setShowSidebar(false);
                }}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-all border",
                  selectedAnalysisId === item.id
                    ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100 dark:bg-neutral-800 dark:border-blue-900"
                    : "border-transparent hover:bg-white hover:border-neutral-200 dark:hover:bg-neutral-800",
                )}
              >
                <span
                  className={cn(
                    "font-semibold text-sm truncate w-full",
                    selectedAnalysisId === item.id
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-neutral-700 dark:text-neutral-300",
                  )}
                >
                  {item.name || `Analisis #${item.id}`}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </span>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-7xl w-[98vw] h-[98vh] sm:h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-3 border-b bg-neutral-50 dark:bg-neutral-900 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <DialogTitle className="text-base sm:text-lg">
                Project: {projectName}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden relative">
          {/* SIDEBAR */}
          <div
            className={cn(
              "absolute inset-0 z-50 bg-white dark:bg-neutral-950 sm:relative sm:z-0 sm:flex sm:w-1/5 sm:border-r transition-transform duration-300",
              showSidebar
                ? "translate-x-0"
                : "-translate-x-full sm:translate-x-0",
            )}
          >
            <SidebarContent />
            <Button
              className="absolute bottom-4 right-4 sm:hidden"
              onClick={() => setShowSidebar(false)}
            >
              Tutup
            </Button>
          </div>

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col bg-neutral-50/50 dark:bg-neutral-950 min-w-0">
            {currentData ? (
              <ScrollArea className="h-full">
                {/* --- MOBILE VIEW: PAKAI TABS --- */}
                <div className="sm:hidden p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-4 h-auto p-1">
                      <TabsTrigger value="overview" className="p-2">
                        <Activity className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="graph" className="p-2">
                        <Share2 className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="code" className="p-2">
                        <FileCode className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="paths" className="p-2">
                        <GitBranch className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="tests" className="p-2">
                        <Terminal className="w-4 h-4" />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <MetricCard
                        label="CC"
                        value={currentData.cyclomatic_complexity}
                        sub="Logika"
                      />
                      <MetricCard
                        label="Coverage"
                        value={`${currentData.coverage_path || 0}%`}
                        sub="Jalur"
                        isGood
                      />
                    </TabsContent>

                    <TabsContent
                      value="graph"
                      className="h-[400px] border rounded-lg bg-white overflow-hidden"
                    >
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                      >
                        <Background />
                      </ReactFlow>
                    </TabsContent>

                    <TabsContent value="code">
                      <SyntaxHighlighter
                        language="python"
                        style={vscDarkPlus}
                        customStyle={{ fontSize: "11px" }}
                      >
                        {currentData.source_code}
                      </SyntaxHighlighter>
                    </TabsContent>

                    <TabsContent value="paths" className="space-y-2">
                      {paths.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="p-2 border rounded text-[10px] bg-white"
                        >
                          {formatPath(Array.isArray(p) ? p : p.path)}
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="tests" className="space-y-2">
                      {executedPaths.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="p-2 border rounded text-[10px] bg-white flex justify-between"
                        >
                          <span>Case #{i + 1}</span>
                          <Badge variant={p.passed ? "default" : "destructive"}>
                            {p.passed ? "Pass" : "Fail"}
                          </Badge>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* --- DESKTOP VIEW: TANPA TAB (SEMUA TAMPIL) --- */}
                <div className="hidden sm:grid grid-cols-12 gap-6 p-6">
                  {/* Row 1: Metrics & Info */}
                  <div className="col-span-12 grid grid-cols-4 gap-4">
                    <MetricCard
                      label="Cyclomatic Complexity"
                      value={currentData.cyclomatic_complexity}
                      sub="McCabe Metric"
                    />
                    <MetricCard
                      label="Code Coverage"
                      value={`${currentData.coverage_path || 0}%`}
                      sub="Path Testing"
                      isGood={currentData.coverage_path === 100}
                    />
                    <Card className="col-span-2">
                      <CardHeader className="py-3 px-4 border-b font-semibold text-sm">
                        Informasi Analisis
                      </CardHeader>
                      <CardContent className="p-0">
                        <StatRow label="Versi Nama" value={currentData.name} />
                        <StatRow
                          label="Disimpan pada"
                          value={new Date(
                            currentData.created_at,
                          ).toLocaleString()}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 2: Graph & Source Code */}
                  <div className="col-span-8 space-y-4">
                    <Card className="overflow-hidden">
                      <div className="bg-neutral-100 p-2 text-xs font-semibold border-b flex items-center gap-2">
                        <Share2 className="w-3 h-3" /> Control Flow Graph
                      </div>
                      <div className="h-[450px] bg-white">
                        <ReactFlow
                          nodes={nodes}
                          edges={edges}
                          nodeTypes={nodeTypes}
                          fitView
                        >
                          <Background variant={BackgroundVariant.Dots} />
                          <Controls />
                        </ReactFlow>
                      </div>
                    </Card>
                    <Card className="overflow-hidden">
                      <div className="bg-neutral-100 p-2 text-xs font-semibold border-b flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileCode className="w-3 h-3" /> Source Code
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyCode}
                        >
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        language="python"
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{ margin: 0, height: "300px" }}
                      >
                        {currentData.source_code}
                      </SyntaxHighlighter>
                    </Card>
                  </div>

                  {/* Row 2 Side: Paths & Test Cases */}
                  <div className="col-span-4 space-y-4">
                    <Card className="max-h-[380px] flex flex-col">
                      <div className="bg-neutral-100 p-2 text-xs font-semibold border-b">
                        <GitBranch className="w-3 h-3 inline mr-1" />{" "}
                        Independent Paths ({paths.length})
                      </div>
                      <ScrollArea className="flex-1 p-3">
                        {paths.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="mb-2 p-2 bg-neutral-50 border rounded text-[11px] font-mono"
                          >
                            <span className="text-blue-600 font-bold mr-1">
                              #{i + 1}
                            </span>{" "}
                            {formatPath(Array.isArray(item) ? item : item.path)}
                          </div>
                        ))}
                      </ScrollArea>
                    </Card>

                    <Card className="max-h-[380px] flex flex-col">
                      <div className="bg-neutral-100 p-2 text-xs font-semibold border-b">
                        <Terminal className="w-3 h-3 inline mr-1" /> Test
                        Execution ({executedPaths.length})
                      </div>
                      <ScrollArea className="flex-1 p-3">
                        {executedPaths.map((item: any, i: number) => (
                          <div
                            key={i}
                            className={cn(
                              "mb-2 p-2 border rounded text-[11px]",
                              item.passed
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200",
                            )}
                          >
                            <div className="flex justify-between font-bold mb-1">
                              <span>Case #{i + 1}</span>
                              <span
                                className={
                                  item.passed
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {item.passed ? "PASSED" : "FAILED"}
                              </span>
                            </div>
                            <code className="text-[10px] opacity-70">
                              In: {JSON.stringify(item.testCase)}
                            </code>
                          </div>
                        ))}
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <Activity className="w-16 h-16 mb-4" />
                <p>Pilih riwayat analisis untuk melihat detail laporan</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-neutral-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={generateFullPDF}>
            <Download className="w-4 h-4 mr-2" /> Download Laporan (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helpers
const MetricCard = ({ label, value, sub, isGood }: any) => (
  <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
    <CardContent className="p-4">
      <p className="text-xs text-neutral-500 font-medium">{label}</p>
      <p
        className={cn(
          "text-3xl font-bold my-1",
          isGood ? "text-green-600" : "text-blue-600",
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-neutral-400">{sub}</p>
    </CardContent>
  </Card>
);

const StatRow = ({ label, value }: any) => (
  <div className="flex justify-between p-3 text-[12px] border-b last:border-0">
    <span className="text-neutral-500">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
