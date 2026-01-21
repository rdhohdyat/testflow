import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";
import { Code2, Trash2, GitCompare, Loader2 } from "lucide-react";
// import path from "path"; // Sepertinya tidak digunakan, bisa dihapus jika perlu

function CodeEditor() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    code,
    setPaths,
    setCode,
    setParams,
    setNodes,
    setEdges,
    setCyclomaticComplexity,
    setTriggerAnimation,
    setEdgeCount, // Tidak digunakan di logic generate, tapi diambil dari store
    setNodeCount,
  } = useCodeStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const storedTheme = localStorage.getItem("vite-ui-theme");
    const isDark = storedTheme === "dark";

    const editor = monaco.editor.create(editorRef.current, {
      value:
        code ||
        `def cek_ganjil_genap(n):
  if n % 2 == 0:
    return "Genap"
  else:
    return "Ganjil"`,
      language: "python",
      theme: isDark ? "vs-dark" : "vs-light",
      fontSize: 13,
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      roundedSelection: true,
    });

    monacoEditorRef.current = editor;

    return () => editor.dispose();
  }, []);

  // Fungsi pembantu untuk menambahkan penundaan minimum agar loading terlihat
  const withMinimumDelay = async (promise: any, minimumDelay = 1000) => {
    const startTime = Date.now();
    const [result] = await Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, minimumDelay)),
    ]);

    // Tambahkan penundaan jika waktu eksekusi kurang dari minimum delay
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minimumDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumDelay - elapsedTime)
      );
    }

    return result;
  };

  const handleGenerateCFG = async () => {
    const editor = monacoEditorRef.current;
    if (!editor) return;

    const codeInput = editor.getValue();
    if (!codeInput.trim()) {
      return toast({
        title: "Kode Kosong",
        variant: "destructive",
        description: "Mohon masukkan kode Python yang valid untuk dianalisis.",
      });
    }

    setCode(codeInput);
    setIsLoading(true);
    toast({
      title: "Menganalisis Kode",
      description: "Mohon tunggu, sedang membuat CFG...",
    });

    try {
      const response = await withMinimumDelay(
        fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeInput }),
        }),
        1500
      );

      if (!response.ok) throw new Error("Gagal mengambil data dari server");

      const data = await response.json();
      console.log("Respon dari server:", data);

      if (data.execution_paths) {
        const paths = data.execution_paths.map((path: any) => ({
          path,
          passed: false,
          test_case: null,
        }));

        setPaths(paths || []);
      }

      if (data.cyclomatic_complexity) {
        setCyclomaticComplexity(data.cyclomatic_complexity);
      }

      if (data.parameters) {
        setParams(data.parameters[0]?.params || []);
      }

      if (data.nodes && data.edges) {
        // Memetakan nodes dan edges
        const mappedNodes = data.nodes.map((node: any) => ({
          id: node.id,
          type: node.type || "default",
          position: node.position || { x: 0, y: 0 },
          data: {
            label: node.data.label,
            tooltip: node.data.tooltip,
            node_type: node.data.node_type,
          },
        }));

        const mappedEdges = data.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.label == "loop back" ? "step" : "straight",
          sourceHandle: edge.label == "loop back" ? "left-source" : "",
          targetHandle: edge.label == "loop back" ? "left" : "",
          animated: edge.label == "loop back" ? true : false,
          label: edge.label || "",
          markerEnd: edge.markerEnd || {
            type: "arrowclosed",
            color: "#000000",
          },
          style: edge.style || { strokeWidth: 2, stroke: "#000000" },
        }));

        setNodeCount(mappedNodes.length);
        setNodes(mappedNodes);
        setEdges(mappedEdges);

        setTimeout(() => {
          setTriggerAnimation(Date.now());
        }, 100);

        toast({
          title: "Analisis Selesai",
          description: `Berhasil memproses CFG`,
          variant: "default",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Terjadi Kesalahan",
        variant: "destructive",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full gap-4 p-4 rounded-lg xl:p-2 dark:bg-black">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-neutral-700 dark:text-white" />
          <h1 className="font-semibold text-neutral-800 dark:text-white">
            Editor Kode
          </h1>
        </div>
        <div className="text-xs text-neutral-500 dark:text-white">
          Masukkan kode python Anda
        </div>
      </div>

      <div ref={editorRef} className="h-[200px] xl:h-[60vh] -ml-6"></div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => monacoEditorRef.current?.setValue("")}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Hapus
        </Button>
        <Button
          className="w-full"
          onClick={handleGenerateCFG}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4 mr-2" />
              Buat CFG
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CodeEditor;