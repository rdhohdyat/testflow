import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
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
import TooltipComponent from "../components/TooltipComponent";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";
import { useMemo } from "react";

function WorkFlowPage() {
  const { params, setParams, edges, setEdges, nodes, setNodes } = useCodeStore();

  const paths = [[1, 2, 3], [1, 2, 4, 5]]

  const cyclomaticComplexity = useMemo(() => {
    const E = edges.length; // Gunakan edges dari store
    const N = nodes.length; // Gunakan nodes dari store
    return E - N + 2;
  }, [edges, nodes]);

  return (
    <>
      <Navbar />
      <div className="xl:mt-24 mt-20 flex flex-col xl:flex-row gap-5 justify-between h-[85vh] xl:h-[80vh] p-5 relative">
        <div className="w-full hidden xl:w-[600px] xl:h-full  bg-white absolute xl:relative bottom-0 left-0 right-0 xl:flex flex-col justify-between z-50">
          <CodeEditor />
        </div>

        <div className="flex h-full justify-center items-center bg-main/10 w-full rounded-lg bg-white border-2 border-black shadow-[1px_3px_0_0_rgba(0,0,0,1)] p-6 text-center">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
          >
            <Background variant={BackgroundVariant.Lines} />
            <Controls />
          </ReactFlow>
        </div>

        <div className="w-full xl:w-[700px] xl:flex flex-col justify-between hidden  ">
          <TooltipComponent information="minimum number of paths to be tested">
            <div className="border-b border-black pb-2 text-start">
              <h2 className="text-lg font-bold">Cyclomatic Complexity</h2>
              <p>Node : {nodes.length}</p>
              <p>Edge : {edges.length}</p>
              <p className="text-lg font-semibold">{edges.length} - {nodes.length} + 2 = {cyclomaticComplexity}</p>
            </div>
          </TooltipComponent>
          <TooltipComponent information="All execution paths from FlowGraph">
            <div className="mt-2 text-start">
              <h1 className="text-lg font-bold">All Path of CFG</h1>
              <div className="flex flex-col gap-2 text-lg h-[200px] overflow-y-scroll no-scroll">
                {paths.map((items, index) => (
                  <div key={index} className="flex items-center gap-2 justify-between">
                    <div className="font-semibold">
                      {items.join(" → ")}
                    </div>
                    {index == 1 ? (
                      <CircleCheck className="text-green-500" />
                    ) : (
                      <CircleX className="text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TooltipComponent>

          <div className="border-t border-black">
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold">
                  Input Test Case {params?.join(", ")}
                </h1>
                {params?.map((param, index) => (
                  <input
                    key={index}
                    className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-main"
                    type="text"
                    placeholder={`Enter test case for ${param}`}
                  />
                ))}
              </div>
              <Button>Evaluate Test Case</Button>
              <Button variant="neutral">Clear Test Case</Button>
            </div>
            <TooltipComponent information="Results of the test cases used">
              <div className="mt-5 border-t border-black pt-2 text-start">
                <h2 className="font-bold">Evaluation Result:</h2>
                <p className="text-sm text-gray-600">
                No test case evaluated yet
              </p>
                {/* <p className=" text-gray-600">
                  5 pass through path 2
                </p> */}
              </div>
            </TooltipComponent>
          </div>
        </div>

        <div className="w-full   bg-white absolute xl:hidden bottom-0 left-0 right-0">
          <Tabs defaultValue="account">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="account">
                Enter Code
              </TabsTrigger>
              <TabsTrigger className="w-full" value="password">
                Analyze
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <CodeEditor />
            </TabsContent>
            <TabsContent value="password">
              <div className="p-5">
                <h1 className="text-lg font-bold text-center">
                  All Path of CFG
                </h1>
                <div className="flex flex-col gap-2 text-lg items-center">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="font-semibold">
                      {"1 -> 2 -> 3 -> 4 -> 5 -> 6"}
                    </div>
                  ))}
                </div>
              </div>

              <Drawer>
                <DrawerTrigger className="p-4 w-full">
                  <Button className="w-full">Input Test Case</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <div>
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-lg font-bold">
                            Input Test Case {"(a, b)"}
                          </h1>
                          <input
                            className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-main"
                            type="text"
                            placeholder="Enter test case a"
                          />
                          <input
                            className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-main"
                            type="text"
                            placeholder="Enter test case b"
                          />
                        </div>
                      </div>
                      <div className="mt-5 border-t border-black pt-2">
                        <h2 className="text-sm font-semibold">
                          Evaluation Result:
                        </h2>
                        {/* No test case evaluated yet. */}
                        <p className="text-sm text-gray-600">
                          2 , 3 pass through the path to 4
                        </p>
                      </div>
                    </div>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Evaluate Test Case</Button>
                    <DrawerClose>
                      <Button variant="neutral" className="w-full">
                        Clear Test Case
                      </Button>
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

export default WorkFlowPage;
