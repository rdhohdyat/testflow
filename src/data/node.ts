import { MarkerType } from "@xyflow/react";
import node from "../components/ui/node";

export const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 350, y: 30 },
    data: { label: "1" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 350, y: 120 },
    data: { label: "2" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 450, y: 210 },
    data: { label: "3" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 350, y: 230 },
    data: { label: "4-5" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 350, y: 320 },
    data: { label: "end" },
  },
];

export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
    style: { strokeWidth: 2, stroke: "#000000" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "false",
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
    style: { strokeWidth: 2, stroke: "#000000" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    sourceHandle: "right-source",
    targetHandle: "top",
    label: "true",
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
    style: { strokeWidth: 2, stroke: "#000000" },
  },
  {
    id: "e4-3",
    source: "4",
    target: "5",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
    style: { strokeWidth: 2, stroke: "#000000" },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    sourceHandle: "bottom",
    targetHandle: "right",
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
    style: { strokeWidth: 2, stroke: "#000000" },
  },
  // {
  //   id: "e5-1",
  //   source: "5",
  //   target: "1",
  //   sourceHandle: "left-source",
  //   targetHandle: "left",
  //   type: "smoothstep",
  //   markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
  //   pathOptions: { offset: 40 },
  //   style: { strokeWidth: 2, stroke: "#000000" },
  // },
];

export const nodeTypes = {
  custom: node,
};
