import { Handle, Position } from "@xyflow/react";

// Decision Node (For if/else, loops, etc.)
export function DecisionNode({ data }) {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <div className="rotate-45 w-24 h-24 border-2 border-neutral-800 flex justify-center items-center bg-white shadow-sm">
        <div className="-rotate-45 w-24 text-center text-sm font-medium text-neutral-700">
          {data.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-neutral-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-neutral-800"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-neutral-800"
      />
    </div>
  );
}

// Start Node
export function StartNode({ data }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 rounded-full border-2 border-neutral-800 flex justify-center items-center bg-green-100 shadow-sm">
        <div className="font-medium text-neutral-800">{data.label || "Start"}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-neutral-800"
      />
    </div>
  );
}

// End Node
export function EndNode({ data }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 rounded-full border-2 border-neutral-800 flex justify-center items-center bg-red-100 shadow-sm">
        <div className="font-medium text-neutral-800">{data.label || "End"}</div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-neutral-800"
      />
    </div>
  );
}

// Process Node (For assignments, operations, etc.)
export function ProcessNode({ data }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-16 border-2 border-neutral-800 flex justify-center items-center bg-blue-50 shadow-sm">
        <div className="font-medium text-neutral-700 text-center px-2 text-sm">
          {data.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-neutral-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-neutral-800"
      />
    </div>
  );
}

// Default Node
export function DefaultNode({ data }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 border-2 border-neutral-800 rounded-md flex justify-center items-center bg-white shadow-sm">
        <div className="font-medium text-neutral-800 text-center px-2">
          {data.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-neutral-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-neutral-800"
      />
    </div>
  );
}

// Node types mapping for ReactFlow
export const nodeTypes = {
  decision: DecisionNode,
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  default: DefaultNode,
};