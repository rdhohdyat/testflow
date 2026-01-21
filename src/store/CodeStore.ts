import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

type ExecutionPath = {
  path: string[];
  passed: boolean;
  testCase: any;
};

export type TestResult = {
  params: any;
  result: any;
  passed: boolean;
  path: any[];
};

type CodeStore = {
  code: string;
  params: string[];
  cyclomaticComplexity: number;
  nodes: Node[];
  edges: Edge[];
  paths: ExecutionPath[];
  rawNodes: Node[]; 
  rawEdges: Edge[]; 
  triggerAnimation: number | null;
  nodeCount: number;
  edgeCount: number;
  coverage: number;
  executedTestCases: TestResult[];

  setCode: (code: string) => void;
  setParams: (params: string[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setPaths: (paths: ExecutionPath[]) => void;
  setTriggerAnimation: (timestamp: number | null) => void;
  setCyclomaticComplexity: (cyclomaticComplexity: number) => void;
  setNodeCount: (count: number) => void; 
  setEdgeCount: (count: number) => void;
  setCoverage: (coverage: number) => void; 
  addExecutedTestCase: (testCase: TestResult) => void;
};

export const useCodeStore = create<CodeStore>((set) => ({
  cyclomaticComplexity:
    Number(localStorage.getItem("cyclomaticComplexity")) || 0,
  code: localStorage.getItem("code") || "",
  params: JSON.parse(localStorage.getItem("params") || "[]"),
  nodes: JSON.parse(localStorage.getItem("nodes") || "[]"),
  edges: JSON.parse(localStorage.getItem("edges") || "[]"),
  paths: JSON.parse(localStorage.getItem("paths") || "[]"),
  rawNodes: [], 
  rawEdges: [], 
  triggerAnimation: null, 
  nodeCount: Number(localStorage.getItem("nodeCount")) || 0, 
  edgeCount: Number(localStorage.getItem("edgeCount")) || 0,
  coverage: Number(localStorage.getItem("coverage")) || 0,
  executedTestCases: JSON.parse(
    localStorage.getItem("executedTestCases") || "[]",
  ),

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

    const count = nodes.length;
    localStorage.setItem("nodeCount", count.toString());

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
    localStorage.setItem(
      "cyclomaticComplexity",
      cyclomaticComplexity.toString(),
    );
    set({ cyclomaticComplexity });
  },

  setCoverage: (coverage) => {
    localStorage.setItem("coverage", coverage.toString());
    set({ coverage });
  },

  addExecutedTestCase: (testCase) => {
    set((state) => {
      // Ambil array lama + item baru
      const updatedTestCases = [...state.executedTestCases, testCase];
      
      // Simpan array baru ke LocalStorage
      localStorage.setItem("executedTestCases", JSON.stringify(updatedTestCases));
      
      // Update state
      return { executedTestCases: updatedTestCases };
    });
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
