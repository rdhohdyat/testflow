import { useMemo } from "react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import TooltipComponent from "./tooltip-component";

const CylomaticComplexity = () => {
  const { nodes, edges } = useCodeStore();

  const cyclomaticComplexity = useMemo(() => {
    const E = edges.length;

    const N = nodes.length;

    return E - N + 2;
  }, [edges, nodes]);
  
  return (
    
  );
};

export default CylomaticComplexity;
