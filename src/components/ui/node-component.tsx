import { Handle, Position } from "@xyflow/react";

// Perbaikan: definisikan tipe prop
interface NodeDataProps {
  data: {
    label?: string;
    [key: string]: any;
  }
}

export function DecisionNode({ data }: NodeDataProps) {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <div className="rotate-45 w-24 h-24 border-2 border-neutral-800 flex justify-center items-center bg-white shadow-sm">
        <div className="-rotate-45 w-24 text-center text-sm font-medium text-neutral-700">
          {data.label}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-800" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-800" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-neutral-800" />
    </div>
  );
}

export function StartNode({ data }: NodeDataProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 rounded-full border-2 border-neutral-800 flex justify-center items-center bg-green-100 shadow-sm">
        <div className="font-medium text-neutral-800">{data.label || "Start"}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-800" />
    </div>
  );
}

export function EndNode({ data }: NodeDataProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 rounded-full border-2 border-neutral-800 flex justify-center items-center bg-red-100 shadow-sm">
        <div className="font-medium text-neutral-800">{data.label || "End"}</div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-800" />
    </div>
  );
}

export function ProcessNode({ data }: NodeDataProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-16 border-2 border-neutral-800 flex justify-center items-center bg-blue-50 shadow-sm">
        <div className="font-medium text-neutral-700 text-center px-2 text-sm">
          {data.label}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-800" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-800" />
    </div>
  );
}

export function DefaultNode({ data }: NodeDataProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-16 border-2 border-neutral-800 rounded-md flex justify-center items-center bg-white shadow-sm">
        <div className="font-medium text-neutral-800 text-center px-2">
          {data.label}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-800" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-800" />
    </div>
  );
}

export const nodeTypes = {
  decision: DecisionNode,
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  default: DefaultNode,
};