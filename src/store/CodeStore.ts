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
  rawNodes: Node[];  // Untuk menyimpan nodes asli sebelum animasi
  rawEdges: Edge[];  // Untuk menyimpan edges asli sebelum animasi
  triggerAnimation: number | null; // Timestamp untuk memicu animasi
  
  setCode: (code: string) => void;
  setParams: (params: string[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPaths: (paths: ExecutionPath[]) => void;
  setTriggerAnimation: (timestamp: number | null) => void;
};

export const useCodeStore = create<CodeStore>((set) => ({
  code: localStorage.getItem("code") || "",
  params: JSON.parse(localStorage.getItem("params") || "[]"),
  nodes: JSON.parse(localStorage.getItem("nodes") || "[]"),
  edges: JSON.parse(localStorage.getItem("edges") || "[]"),
  paths: JSON.parse(localStorage.getItem("paths") || "[]"),
  rawNodes: [], // Tidak perlu disimpan di localStorage
  rawEdges: [], // Tidak perlu disimpan di localStorage
  triggerAnimation: null, // Tidak perlu disimpan di localStorage

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
    
    // Simpan nodes asli untuk animasi dan kosongkan nodes yang visible
    set({ 
      nodes: [], // Kosongkan untuk persiapan animasi
      rawNodes: nodes // Simpan data asli untuk animasi
    });
  },

  setEdges: (edges) => {
    // Simpan di localStorage
    localStorage.setItem("edges", JSON.stringify(edges));
    
    // Simpan edges asli untuk animasi dan kosongkan edges yang visible
    set({ 
      edges: [], // Kosongkan untuk persiapan animasi
      rawEdges: edges // Simpan data asli untuk animasi
    });
  },

  setPaths: (paths) => {
    localStorage.setItem("paths", JSON.stringify(paths));
    set({ paths });
  },
  
  setTriggerAnimation: (timestamp) => {
    // Tidak perlu disimpan di localStorage karena hanya trigger sementara
    set({ triggerAnimation: timestamp });
  }
}));