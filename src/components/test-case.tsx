import { useState, useEffect } from "react";
import { useCodeStore } from "../store/CodeStore";
import TooltipComponent from "./tooltip-component";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";

function TestCase() {
  const { params, code, paths, setPaths, setParams } = useCodeStore();

  const [inputValues, setInputValues] = useState({});
  const [executing, setExecuting] = useState(false);
  const [resultText, setResultText] = useState([]);

  const handleChange = (paramName, value) => {
    setInputValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  useEffect(() => {
    const storedParams = JSON.parse(localStorage.getItem("params"));
    if (storedParams) {
      const fixedParams = storedParams.map((param) => {
        const keys = Object.keys(param);
        const nameKey = keys.find((k) => k !== "value");
        return {
          name: param[nameKey],
          value: param.value,
        };
      });
      setParams(fixedParams);
    }
  }, []);

  const clearValues = () => {
    setInputValues({});
    setResultText([]);
  };

  const executeTestCase = async () => {
    try {
      setExecuting(true);

      // Convert form fields to parameters object
      const testParams = {};
      params.forEach((param) => {
        let value = inputValues[param.name];

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

      setResultText(result.actual_execution_path.line_numbers);

      const updatedPaths = paths.map((item) => {
        const isSame = JSON.stringify(item.path) === JSON.stringify(resultText);

        return {
          ...item,
          passed: isSame ? true : item.passed,
          testCase: testParams
        };
      });


      setPaths(updatedPaths)

    } catch (error) {
      console.error("Error executing test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <>
      <Card className="mb-4 overflow-y-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Input Test Case</CardTitle>
          <CardDescription>
            {params?.length > 0
              ? `Parameters: ${params.map((p) => p.name).join(", ")}`
              : "No parameters detected"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {params.map((param, index) => (
            <div key={index} className="space-y-1">
              <label className="text-sm font-medium" htmlFor={`param-${index}`}>
                {param.name}:
              </label>
              <Input
                id={`param-${index}`}
                type="text"
                placeholder={`Enter value for ${param.name}`}
                value={inputValues[param.name] || ""}
                onChange={(e) => handleChange(param.name, e.target.value)}
              />
            </div>
          ))}

          <div className="pt-2 space-y-2">
            <Button
              className="w-full"
              disabled={!params?.length || executing}
              onClick={executeTestCase}
            >
              {executing ? "Evaluating..." : "Evaluate Test Case"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearValues}
              disabled={!params?.length}
            >
              Clear Values
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Evaluation Result
            <TooltipComponent information="Results of the test cases used">
              <span className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
                ?
              </span>
            </TooltipComponent>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-neutral-50 border">
            {resultText.length > 0 ? (
              <div className="font-mono">{resultText.join(" → ")}</div>
            ) : (
              <p className="text-neutral-500 text-sm">No result, input parameter.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default TestCase;
