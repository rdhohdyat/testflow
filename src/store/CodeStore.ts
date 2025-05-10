import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

type ExecutionPath = {
  path: string[];
  passed: boolean;
  testCase: any;
};

type CodeStore = {
  code: string;
  params: string[];
  nodes: Node[];
  edges: Edge[];
  paths: ExecutionPath[];
  setCode: (code: string) => void;
  setParams: (params: string[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPaths: (paths: ExecutionPath[]) => void;
};

export const useCodeStore = create<CodeStore>((set) => ({
  code: localStorage.getItem("code") || "",
  params: JSON.parse(localStorage.getItem("params") || "[]"),
  nodes: JSON.parse(localStorage.getItem("nodes") || "[]"),
  edges: JSON.parse(localStorage.getItem("edges") || "[]"),
  paths: JSON.parse(localStorage.getItem("paths") || "[]"),

  setCode: (code) => {
    localStorage.setItem("code", code);
    set({ code });
  },

  setParams: (params) => {
    localStorage.setItem("params", JSON.stringify(params));
    set({ params });
  },

  setNodes: (nodes) => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    set({ nodes });
  },

  setEdges: (edges) => {
    localStorage.setItem("edges", JSON.stringify(edges));
    set({ edges });
  },

  setPaths: (paths) => {
    localStorage.setItem("paths", JSON.stringify(paths));
    set({ paths });
  },
}));
