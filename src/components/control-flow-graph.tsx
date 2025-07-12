import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";

import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";

function ControlFlowGraph() {
  const { nodes, edges } = useCodeStore();

  return (
    <div className="h-[300px] w-[400px]">
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
