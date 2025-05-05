import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const Node = ({ data }: any) => {
  return (
    <div className="h-12 w-12 bg-white dark:text-black flex items-center justify-center font-bold rounded-full border-2 border-neutral-900">
      <div className="flex-shrink-0">{data.label}</div>

      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />

      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right-source" />
      <Handle type="source" position={Position.Left} id="left-source" />
    </div>
  );
};

export default memo(Node);
