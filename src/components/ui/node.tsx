import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const Node = ({ data }: any) => {
  return (
    <div className="h-12 w-12 bg-white flex items-center justify-center font-bold rounded-full border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
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
