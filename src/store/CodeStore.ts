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
  cyclomaticComplexity: number;
  nodes: Node[];
  edges: Edge[];
  paths: ExecutionPath[];
  rawNodes: Node[]; // Untuk menyimpan nodes asli sebelum animasi
  rawEdges: Edge[]; // Untuk menyimpan edges asli sebelum animasi
  triggerAnimation: number | null; // Timestamp untuk memicu animasi
  nodeCount: number; // Menambahkan nodeCount
  edgeCount: number; // Menambahkan edgeCount

  setCode: (code: string) => void;
  setParams: (params: string[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPaths: (paths: ExecutionPath[]) => void;
  setTriggerAnimation: (timestamp: number | null) => void;
  setCyclomaticComplexity: (cyclomaticComplexity: number) => void;
  setNodeCount: (count: number) => void; // Menambahkan setter untuk nodeCount
  setEdgeCount: (count: number) => void; // Menambahkan setter untuk edgeCount
};

export const useCodeStore = create<CodeStore>((set) => ({
  cyclomaticComplexity: Number(localStorage.getItem("cyclomaticComplexity")) || 0,
  code: localStorage.getItem("code") || "",
  params: JSON.parse(localStorage.getItem("params") || "[]"),
  nodes: JSON.parse(localStorage.getItem("nodes") || "[]"),
  edges: JSON.parse(localStorage.getItem("edges") || "[]"),
  paths: JSON.parse(localStorage.getItem("paths") || "[]"),
  rawNodes: [], // Tidak perlu disimpan di localStorage
  rawEdges: [], // Tidak perlu disimpan di localStorage
  triggerAnimation: null, // Tidak perlu disimpan di localStorage
  nodeCount: Number(localStorage.getItem("nodeCount")) || 0, // Inisialisasi nodeCount
  edgeCount: Number(localStorage.getItem("edgeCount")) || 0, // Inisialisasi edgeCount

  setCode: (code) => {
    localStorage.setItem("code", code);
    set({ code });
  },

  setParams: (params) => {
    localStorage.setItem("params", JSON.stringify(params));
    set({ params });
  },

  setNodes: (nodes) => {
    // Simpan di localStorage
    localStorage.setItem("nodes", JSON.stringify(nodes));

    // Update nodeCount
    const count = nodes.length;
    localStorage.setItem("nodeCount", count.toString());

    // Simpan nodes asli untuk animasi dan kosongkan nodes yang visible
    set({
      nodes: [], // Kosongkan untuk persiapan animasi
      rawNodes: nodes, // Simpan data asli untuk animasi
      nodeCount: count, // Update nodeCount state
    });
  },

  setEdges: (edges) => {
    // Simpan di localStorage
    localStorage.setItem("edges", JSON.stringify(edges));

    // Update edgeCount
    const count = edges.length;
    localStorage.setItem("edgeCount", count.toString());

    // Simpan edges asli untuk animasi dan kosongkan edges yang visible
    set({
      edges: [], // Kosongkan untuk persiapan animasi
      rawEdges: edges, // Simpan data asli untuk animasi
      edgeCount: count, // Update edgeCount state
    });
  },

  setPaths: (paths) => {
    localStorage.setItem("paths", JSON.stringify(paths));
    set({ paths });
  },

  setTriggerAnimation: (timestamp) => {
    if (timestamp) {
      localStorage.setItem("triggerAnimation", JSON.stringify(timestamp));
    } else {
      localStorage.removeItem("triggerAnimation");
    }
    set({ triggerAnimation: timestamp });
  },

  setCyclomaticComplexity: (cyclomaticComplexity) => {
    localStorage.setItem("cyclomaticComplexity", cyclomaticComplexity.toString());
    set({ cyclomaticComplexity });
  },

  setNodeCount: (count) => {
    localStorage.setItem("nodeCount", count.toString());
    set({ nodeCount: count });
  },

  setEdgeCount: (count) => {
    localStorage.setItem("edgeCount", count.toString());
    set({ edgeCount: count });
  },
}));