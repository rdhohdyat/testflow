import {
  ReactFlow,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import { nodeTypes } from "../data/node";

import "@xyflow/react/dist/style.css";
import { useCodeStore } from "../store/CodeStore";

const FlowGraph = () => {
  const { nodes, edges } = useCodeStore();
  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
};

export default FlowGraph;
