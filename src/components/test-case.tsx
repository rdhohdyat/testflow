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
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";

function TestCase() {
  const { params, code, paths, setPaths, setParams } = useCodeStore();

  const { toast } = useToast();

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);
  const [resultText, setResultText] = useState<number[]>([]);
  const [lastTestParams, setLastTestParams] = useState<Record<string, any>>({});

  const [loading, setIsLoading] = useState(false);

  const handleChange = (paramName: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  useEffect(() => {
    const storedParams = localStorage.getItem("params");

    console.log("Raw stored params:", storedParams);

    if (storedParams) {
      try {
        const parsed = JSON.parse(storedParams);
        console.log("Parsed params:", parsed);

        let fixedParams;

        // Check if parsed is an array of strings (parameter names only)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          typeof parsed[0] === "string"
        ) {
          // Convert array of strings to array of objects with name property
          fixedParams = parsed.map((paramName) => ({
            name: paramName, // Use full parameter name
            value: undefined, // Default value
          }));
        }
        // Check if parsed is already an array of objects with correct structure
        else if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          typeof parsed[0] === "object"
        ) {
          // If it's already in object format, check the structure
          fixedParams = parsed.map((param: any) => {
            // If it already has a "name" property, use it as is
            if (param.name !== undefined) {
              return param;
            }
            // Otherwise, try to extract the name from keys
            else {
              const keys = Object.keys(param);
              const nameKey = keys.find((k) => k !== "value");

              // Pastikan kita menggunakan nama parameter lengkap, bukan substring
              return {
                name: nameKey ? param[nameKey] : "unknown", // Use full parameter name
                value: param.value,
              };
            }
          });
        }
        // Fallback for other formats
        else {
          console.warn("Unexpected parameter format in localStorage");
          fixedParams = [];
        }

        console.log("Fixed params to set:", fixedParams);
        setParams(fixedParams);
      } catch (e) {
        console.error("Invalid params in localStorage:", e);
      }
    }
  }, [setParams]);

  const clearValues = () => {
    setInputValues({});
    setResultText([]);
  };

  const executeTestCase = async () => {
    try {
      setExecuting(true);

      const testParams: Record<string, any> = {};
      params.forEach((param) => {
        let value: any = inputValues[param.name];

        if (!isNaN(Number(value))) {
          value = Number(value);
        } else if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }

        testParams[param.name] = value;
      });

      console.log("Executing with parameters:", testParams);

      // Delay 1.5 detik
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      console.log("Response from server:", result);

      setResultText(result.actual_execution_path.line_numbers);
      setLastTestParams(testParams);
    } catch (error) {
      console.error("Error executing test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveTestCase = () => {
    const updatedPaths = paths.map((item) => {
      const isSame = JSON.stringify(item.path) === JSON.stringify(resultText);

      return {
        ...item,
        passed: isSame ? true : item.passed,
        testCase: lastTestParams,
      };
    });

    setPaths(updatedPaths);

    toast({
      title: "Test Case Saved",
      description:
        "The test case has been successfully added to your test suite.",
    });
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
              {executing ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Test Case"
              )}
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
              <p className="text-neutral-500 text-sm">
                No result, input parameter.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            {resultText.length > 0 && (
              <Button onClick={handleSaveTestCase} className="mt-2">
                Save Test Case
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default TestCase;
