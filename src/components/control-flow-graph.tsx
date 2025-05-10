import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";

import { Canvg } from "canvg";

import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

function ControlFlowGraph() {
  const { nodes, edges } = useCodeStore();

  const svgWrapperRef = useRef(null);

  const handleExportPNG = async () => {
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cfg-diagram.svg";
    a.click();
    
  };
  

  return (
    <div ref={svgWrapperRef} className="h-[300px] w-[300px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.5,
          maxZoom: 0.5,
          minZoom: 0.7,
        }}
      >
        <Background variant={BackgroundVariant.Lines} gap={12} />
        <Controls showInteractive={true} />
      </ReactFlow>
    </div>
  );
}

export default ControlFlowGraph;
