// Sample React component for the Test Case Execution feature
import { useState, useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

// Custom node component with improved styling
const CustomNode = ({ data }) => {
  // Determine node styling based on type
  const getNodeStyle = () => {
    const baseStyle = {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      width: "150px",
      fontSize: "12px",
      position: "relative",
    };

    // Add type-specific styling
    switch (data.node_type) {
      case "function":
        return {
          ...baseStyle,
          backgroundColor: "#E3F2FD", // Light blue
          borderColor: "#2196F3",
          fontWeight: "bold",
        };
      case "condition":
        return {
          ...baseStyle,
          backgroundColor: "#FFF9C4", // Light yellow
          borderColor: "#FFC107",
          borderRadius: "8px",
        };
      case "loop":
        return {
          ...baseStyle,
          backgroundColor: "#E8F5E9", // Light green
          borderColor: "#4CAF50",
          borderRadius: "8px",
        };
      case "try":
      case "except":
      case "finally":
        return {
          ...baseStyle,
          backgroundColor: "#F3E5F5", // Light purple
          borderColor: "#9C27B0",
          borderStyle: "dashed",
        };
      case "return":
        return {
          ...baseStyle,
          backgroundColor: "#FFEBEE", // Light red
          borderColor: "#F44336",
        };
      case "control":
        return {
          ...baseStyle,
          backgroundColor: "#ECEFF1", // Light gray
          borderColor: "#607D8B",
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
        };
      default:
        return baseStyle;
    }
  };

  // Check if this node is part of the current execution path
  const isExecuted = data.isExecuted;

  return (
    <div
      style={{
        ...getNodeStyle(),
        boxShadow: isExecuted ? "0 0 10px #ff6b6b" : "none",
        border: isExecuted ? "2px solid #ff6b6b" : getNodeStyle().border,
      }}
    >
      <div>
        <strong>{data.label}</strong>
      </div>
      <div style={{ fontSize: "10px", marginTop: "5px", color: "#666" }}>
        {data.tooltip}
      </div>
    </div>
  );
};

// Main component
const CFGVisualizer = () => {
  const [code, setCode] = useState("");
  const [parameters, setParameters] = useState({});
  const [paramFields, setParamFields] = useState([]);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionPath, setExecutionPath] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState(-1);

  // Node types for ReactFlow
  const nodeTypes = {
    custom: CustomNode,
  };

  // Analyze code function
  const analyzeCode = async () => {
    try {
      const response = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setAnalyzedData(data);

      // Extract function parameters for test case form
      if (data.parameters && data.parameters.length > 0) {
        // Just use the first function for simplicity
        const func = data.parameters[0];
        setParamFields(
          func.params.map((param) => ({
            name: param,
            value: "",
          }))
        );
      }

      // Update nodes and edges
      if (data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    } catch (error) {
      console.error("Error analyzing code:", error);
    }
  };

  // Execute test case
  const executeTestCase = async () => {
    try {
      setExecuting(true);

      // Convert form fields to parameters object
      const testParams = {};
      paramFields.forEach((param) => {
        let value = param.value;

        // Try to parse as number or boolean if possible
        if (!isNaN(Number(value))) {
          value = Number(value);
        } else if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }

        testParams[param.name] = value;
      });

      const response = await fetch("http://localhost:8000/test_execution/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          parameters: testParams,
        }),
      });

      const result = await response.json();

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        setExecutionPath(result.execution_path);
        setSelectedPathIndex(result.matched_path_index);

        // Update nodes to highlight execution path
        setNodes((nodes) =>
          nodes.map((node) => {
            if (
              node.data.lineno &&
              result.execution_path.includes(String(node.data.lineno))
            ) {
              return {
                ...node,
                data: {
                  ...node.data,
                  isExecuted: true,
                },
              };
            }
            return {
              ...node,
              data: {
                ...node.data,
                isExecuted: false,
              },
            };
          })
        );
      }
    } catch (error) {
      console.error("Error executing test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  // Handle parameter input change
  const handleParamChange = (index, value) => {
    const updatedParams = [...paramFields];
    updatedParams[index].value = value;
    setParamFields(updatedParams);
  };

  // Reset visualization
  const resetVisualization = () => {
    setExecutionPath([]);
    setSelectedPathIndex(-1);

    // Reset node highlighting
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isExecuted: false,
        },
      }))
    );
  };

  // Select a specific execution path from all possible paths
  const selectPath = (pathIndex) => {
    if (!analyzedData || !analyzedData.execution_paths) return;

    const path = analyzedData.execution_paths[pathIndex];
    setSelectedPathIndex(pathIndex);

    // Update nodes to highlight the selected path
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.data.lineno && path.includes(String(node.data.lineno))) {
          return {
            ...node,
            data: {
              ...node.data,
              isExecuted: true,
            },
          };
        }
        return {
          ...node,
          data: {
            ...node.data,
            isExecuted: false,
          },
        };
      })
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left panel: Code input and controls */}
      <div
        style={{
          width: "30%",
          padding: "15px",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Python CFG Analyzer</h2>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Python code here..."
          style={{
            height: "300px",
            marginBottom: "15px",
            padding: "10px",
            fontFamily: "monospace",
          }}
        />

        <button
          onClick={analyzeCode}
          style={{
            padding: "8px",
            marginBottom: "15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Analyze Code
        </button>

        {analyzedData && (
          <div>
            <h3>Cyclomatic Complexity</h3>
            <p>{analyzedData.cyclomatic_complexity}</p>

            {analyzedData.unreachable_code &&
              analyzedData.unreachable_code.length > 0 && (
                <div>
                  <h3>Unreachable Code</h3>
                  <ul>
                    {analyzedData.unreachable_code.map((item, i) => (
                      <li key={i}>
                        Line {item.line}: {item.code}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {paramFields.length > 0 && (
              <div>
                <h3>Test Execution</h3>
                {paramFields.map((param, i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                      {param.name}:
                    </label>
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleParamChange(i, e.target.value)}
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </div>
                ))}

                <button
                  onClick={executeTestCase}
                  disabled={executing}
                  style={{
                    padding: "8px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  {executing ? "Executing..." : "Run Test"}
                </button>

                <button
                  onClick={resetVisualization}
                  style={{
                    padding: "8px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </div>
            )}

            {analyzedData.execution_paths &&
              analyzedData.execution_paths.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>All Execution Paths</h3>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    {analyzedData.execution_paths.map((path, i) => (
                      <div
                        key={i}
                        onClick={() => selectPath(i)}
                        style={{
                          padding: "5px",
                          cursor: "pointer",
                          backgroundColor:
                            selectedPathIndex === i ? "#e3f2fd" : "transparent",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Path {i + 1}: {path.join(" → ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Right panel: Graph visualization */}
      <div style={{ flex: 1, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CFGVisualizer;
