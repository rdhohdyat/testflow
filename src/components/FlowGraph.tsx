import {
  ReactFlow,
  Background,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import node from "./ui/node";

import "@xyflow/react/dist/style.css";

const FlowGraph = () => {
  const initialNodes = [
    {
      id: "1",
      type: "custom",
      position: { x: 200, y: 50 },
      data: { label: "start" },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 200, y: 150 },
      data: { label: "1" },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 200, y: 250 },
      data: { label: "2" },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 200, y: 350 },
      data: { label: "3" },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 300, y: 450 },
      data: { label: "4" },
    },
    {
      id: "6",
      type: "custom",
      position: { x: 300, y: 550 },
      data: { label: "5" },
    },
    {
      id: "7",
      type: "custom",
      position: { x: 200, y: 650 },
      data: { label: "end" },
    },
  ];

  const initialEdges = [
    {
      id: "start-1",
      source: "1",
      target: "2",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },
      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    {
      id: "e1-2",
      source: "2",
      target: "3",
      type: "straight",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },
      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    {
      id: "e2-3",
      source: "3",
      target: "4",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },
      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      type: "straight",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },

      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      type: "straight",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },

      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
    {
      id: "e6-4",
      source: "6",
      target: "4",
      type: "step",
      sourceHandle: "bottom",
      targetHandle: "left",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },

      style: {
        strokeWidth: 2,
        stroke: "#000000",
        offset: 20,
      },
    },
    {
      id: "e3-end",
      source: "4",
      target: "7",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
      },
      style: {
        strokeWidth: 2,
        stroke: "#000000",
      },
    },
  ];

  const nodeTypes = {
    custom: node,
  };

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
};

export default FlowGraph;
