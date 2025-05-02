import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";

function CodeEditor() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { code, setCode, setParams, setNodes, setEdges } = useCodeStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: code || `def check_even_odd(n):
  if n % 2 == 0:
    return "Even"
  else:
    return "Odd"`,
      language: "python",
      theme: "vs-light",
      fontSize: 15,
      automaticLayout: true,
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

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });

      if (!response.ok) throw new Error("Failed to fetch data from server");

      const data = await response.json();
      console.log("Response from server:", data);

      if (data.parameters) {
        setParams(data.parameters[0]?.params || []);
      }

      if (data.nodes && data.edges) {
        // Map nodes and edges to the required format
        const mappedNodes = data.nodes.map((node:any) => ({
          id: node.id,
          type: node.type || "default",
          position: node.position || { x: 0, y: 0 },
          data: { label: node.data?.label || "Node" },
        }));

        const mappedEdges = data.edges.map((edge:any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label || "",
          markerEnd: edge.markerEnd || { type: "arrowclosed", color: "#000000" },
          style: edge.style || { strokeWidth: 2, stroke: "#000000" },
        }));

        // Save mapped data to state
        setNodes(mappedNodes);
        setEdges(mappedEdges);

        toast({
          title: "Analysis Completed",
          description: `Nodes: ${mappedNodes.length}, Edges: ${mappedEdges.length}`,
        });
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: `Something went wrong: ${error.message}`,
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-full flex flex-col xl:justify-normal justify-between gap-4 p-4 xl:p-0">
      <h1 className="xl:text-lg font-bold">Type Your Python Code Here</h1>
      <div ref={editorRef} className="h-[150px] xl:h-full -ml-8 rounded-lg border-0 border-gray-300"></div>
      <div className="flex gap-2 border-t border-gray-300 pt-2">
        <Button variant="outline" onClick={() => monacoEditorRef.current?.setValue("")}>
          Clear Code
        </Button>
        <Button className="w-full" onClick={handleGenerateCFG}>
          Generate CFG
        </Button>
      </div>
    </div>
  );
}

export default CodeEditor;