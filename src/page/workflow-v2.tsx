import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { CircleCheck, CircleX } from "lucide-react";
import { useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import CodeEditor from "../components/CodeEditor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../components/ui/drawer";
import "@xyflow/react/dist/style.css";
import { initialEdges, initialNodes, nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";

function WorkFlowPage2() {
  const { params } = useCodeStore();
  const [edge, setEdge] = useState(0);
  const [node, setNode] = useState(0);

  const paths = [[1, 2, 3], [1, 2, 4, 5], [1, 2, 4, 6, 7]];

  const cyclomaticComplexity = useMemo(() => {
    const E = initialEdges.length;
    const N = initialNodes.length;

    setEdge(E);
    setNode(N);

    return E - N + 2;
  }, [initialEdges, initialNodes]);

  return (
    <>
      <Navbar />
      <div className="xl:mt-24 mt-20 grid grid-cols-1 xl:grid-cols-3 gap-5 h-[85vh] xl:h-[80vh] p-5 relative">
        
        {/* Code Editor */}
        <div className="hidden xl:flex flex-col bg-white p-4 rounded-lg border border-gray-300 shadow-md">
          <CodeEditor />
        </div>

        {/* Graph Visualization */}
        <div className="flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-md p-6">
          <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes={nodeTypes}>
            <Background variant={BackgroundVariant.Lines} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Analysis Section */}
        <div className="hidden xl:flex flex-col gap-4 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          {/* Cyclomatic Complexity */}
          <div className="border-b border-gray-300 pb-4">
            <h2 className="text-lg font-bold">Cyclomatic Complexity</h2>
            <p>Node: {node}</p>
            <p>Edge: {edge}</p>
            <p className="text-lg font-semibold">{edge} - {node} + 2 = {cyclomaticComplexity}</p>
          </div>

          {/* Path Analysis */}
          <div>
            <h1 className="text-lg font-bold">All Path of CFG</h1>
            <div className="flex flex-col gap-2 mt-2 text-lg h-[200px] overflow-y-scroll">
              {paths.map((items, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="font-semibold">{items.join(" -> ")}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Case Input */}
          <div className="border-t border-gray-300 pt-4">
            <h1 className="text-lg font-bold">Input Test Case {params.join(", ")}</h1>
            <div className="flex flex-col gap-2">
              {params.map((param, index) => (
                <input
                  key={index}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-main"
                  type="text"
                  placeholder={`Enter test case for ${param}`}
                />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button>Evaluate</Button>
              <Button variant="neutral">Clear</Button>
            </div>
            <div className="mt-5 border-t border-gray-300 pt-2">
              <h2 className="text-sm font-semibold">Evaluation Result:</h2>
              <p className="text-sm text-gray-500">No test case evaluated yet</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Tabs for Code & Analysis */}
        <div className="w-full bg-white absolute xl:hidden bottom-0 left-0 right-0">
          <Tabs defaultValue="code">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="code">Enter Code</TabsTrigger>
              <TabsTrigger className="w-full" value="analysis">Analyze</TabsTrigger>
            </TabsList>

            <TabsContent value="code">
              <CodeEditor />
            </TabsContent>

            <TabsContent value="analysis">
              <div className="p-5">
                <h1 className="text-lg font-bold text-center">All Path of CFG</h1>
                <div className="flex flex-col gap-2 text-lg items-center">
                  {paths.map((items, index) => (
                    <div key={index} className="font-semibold">{items.join(" -> ")}</div>
                  ))}
                </div>
              </div>

              {/* Test Case Input in Drawer */}
              <Drawer>
                <DrawerTrigger className="p-4 w-full">
                  <Button className="w-full">Input Test Case</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <h1 className="text-lg font-bold">Input Test Case {"(a, b)"}</h1>
                    <input className="w-full border border-gray-300 rounded p-2" type="text" placeholder="Enter test case a" />
                    <input className="w-full border border-gray-300 rounded p-2" type="text" placeholder="Enter test case b" />
                    <div className="mt-5 border-t border-gray-300 pt-2">
                      <h2 className="text-sm font-semibold">Evaluation Result:</h2>
                      <p className="text-sm text-gray-500">2, 3 pass through the path to 4</p>
                    </div>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Evaluate</Button>
                    <DrawerClose>
                      <Button variant="neutral" className="w-full">Clear Test Case</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default WorkFlowPage2;
