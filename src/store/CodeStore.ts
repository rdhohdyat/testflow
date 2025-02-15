import { create } from "zustand";
import { Node, Edge } from "@xyflow/react"; // Pastikan reactflow sudah terinstal

type CodeStore = {
  code: string;
  params: string[];
  nodes: Node[];
  edges: Edge[];
  setCode: (code: string) => void;
  setParams: (params: string[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

export const useCodeStore = create<CodeStore>((set) => ({
  code: localStorage.getItem("code") || "",
  params: [],
  nodes: JSON.parse(localStorage.getItem("nodes") || "[]"),
  edges: JSON.parse(localStorage.getItem("edges") || "[]"),

  setCode: (code) => {
    localStorage.setItem("code", code);
    set({ code });
  },

  setParams: (params) => set({ params }),

  setNodes: (nodes) => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    set({ nodes });
  },

  setEdges: (edges) => {
    localStorage.setItem("edges", JSON.stringify(edges));
    set({ edges });
  },
}));
