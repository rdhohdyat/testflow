import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";
import { Code2, Trash2, GitCompare, Loader2 } from "lucide-react";

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
    setTriggerAnimation 
  } = useCodeStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const storedTheme = localStorage.getItem("vite-ui-theme");
    const isDark = storedTheme === "dark";

    const editor = monaco.editor.create(editorRef.current, {
      value:
        code ||
        `def check_even_odd(n):
  if n % 2 == 0:
    return "Even"
  else:
    return "Odd"`,
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

  // Helper function to add a minimum delay to show loading
  const withMinimumDelay = async (promise, minimumDelay = 1000) => {
    const startTime = Date.now();
    const [result] = await Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, minimumDelay)),
    ]);

    // Add additional delay if needed to reach minimum delay
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
        title: "Code is Empty",
        variant: "destructive",
        description: "Please enter valid Python code to analyze.",
      });
    }

    setCode(codeInput);
    setIsLoading(true);
    toast({
      title: "Analyzing Code",
      description: "Please wait while we generate the CFG...",
    });

    try {
      const response = await withMinimumDelay(
        fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeInput }),
        }),
        1500 // Minimum 1.5 seconds of loading state
      );

      if (!response.ok) throw new Error("Failed to fetch data from server");

      const data = await response.json();
      console.log("Response from server:", data);

      if (data.execution_paths) {
        const paths = data.execution_paths.map((path) => ({
          path,
          passed: false,
          test_case: null,
        }));

        setPaths(paths || []);
      }

      if (data.parameters) {
        setParams(data.parameters[0]?.params || []);
      }

      if (data.nodes && data.edges) {
        // Map nodes and edges
        const mappedNodes = data.nodes.map((node: any) => ({
          id: node.id,
          type: node.type || "default",
          position: node.position || { x: 0, y: 0 },
          data: { label: node.data.label },
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

        // Set di store - ini akan menyimpan ke localStorage dan juga menyiapkan data untuk animasi
        setNodes(mappedNodes);
        setEdges(mappedEdges);
        
        // After successful data loading, trigger animation dengan delay kecil
        setTimeout(() => {
          setTriggerAnimation(Date.now());
        }, 100);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: `Something went wrong`,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      toast({
        title: "Analysis Completed",
        description: `Successfully processed CFG`,
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-full flex flex-col gap-4 p-4 xl:p-2 rounded-lg dark:bg-black">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-neutral-700 dark:text-white" />
          <h1 className="font-semibold text-neutral-800 dark:text-white">
            Code Editor
          </h1>
        </div>
        <div className="text-xs text-neutral-500 dark:text-white">
          Enter your python code
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
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
        <Button
          className="w-full"
          onClick={handleGenerateCFG}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <GitCompare className="h-4 w-4 mr-2" />
              Generate CFG
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CodeEditor;