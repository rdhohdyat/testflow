import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";

function CodeEditor() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const {code, setCode} = useCodeStore()

  useEffect(() => {
    if (!editorRef.current) return;
  
    const editor = monaco.editor.create(editorRef.current, {
      value: `def check_even_odd(n):
  if n % 2 == 0:
    return "Even"
  else:
    return "Odd"`,
      language: "python",
      theme: "vs-light",
      automaticLayout: true,
    });
  
    monacoEditorRef.current = editor;
  
    return () => {
      editor.dispose();
    };
  }, [editorRef]);
  
  const handleGenerateCFG = async () => {
    if (monacoEditorRef.current) {
      const codeInput = monacoEditorRef.current.getValue();
  
      if (codeInput) {
        setCode(codeInput);
        toast({
          title: "Success create CFG!",
          description: `Code is:\n${codeInput}`,
        });
  
        try {
          const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: codeInput }),
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("Response dari server:", data);

            if(data.parameters){
              useCodeStore.getState().setParams(data.parameters[0].params)
            }
  
            if (data.nodes && data.edges) {
              useCodeStore.getState().setNodes(data.nodes);
              useCodeStore.getState().setEdges(data.edges);
              toast({
                title: "Analysis Completed",
                description: `Nodes: ${data.nodes.length}, Edges: ${data.edges.length}`,
              });
            } else {
              throw new Error("Invalid response structure");
            }
          } else {
            throw new Error("Failed to fetch data from server");
          }
        } catch (error) {
          toast({
            title: "Error",
            variant: "destructive",
            description: `Something went wrong: ${error.message}`,
          });
          console.error(error);
        }
      } else {
        toast({
          title: "Code is Empty",
          variant: "destructive",
          description: "Please enter valid Python code to analyze.",
        });
      }
    }
  };
  
  
  return (
    <div className="min-h-full flex flex-col xl:justify-normal justify-between gap-4 p-4 xl:p-0">
      <h1 className="xl:text-lg font-bold">Type Your Python Code Here</h1>
      <div
        ref={editorRef}
        className="h-[150px] xl:h-full -ml-8 rounded-lg border-0 border-gray-300"
      ></div>
      <div className="flex gap-2 border-t border-gray-300 pt-2">
        <Button
          variant="neutral"
          onClick={() => {
            if (monacoEditorRef.current) {
              monacoEditorRef.current.setValue("");
            }
          }}
        >
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
