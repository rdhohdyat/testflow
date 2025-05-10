import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";
import { Code2, Trash2, GitCompare } from "lucide-react";

function CodeEditor() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const { code, setPaths, setCode, setParams, setNodes, setEdges } =
    useCodeStore();

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
    toast({
      title: "Analyzing Code",
      description: "Please wait while we generate the CFG...",
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });

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

        setNodes(mappedNodes);
        setEdges(mappedEdges);

        toast({
          title: "Analysis Completed",
          description: `Successfully processed ${mappedNodes.length} nodes and ${mappedEdges.length} edges.`,
          variant: "default",
        });
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
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
        <Button className="w-full" onClick={handleGenerateCFG}>
          <GitCompare className="h-4 w-4" />
          Generate CFG
        </Button>
      </div>
    </div>
  );
}

export default CodeEditor;
