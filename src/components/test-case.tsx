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
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Loader2, CheckCircle, Play, Trash2, Save, ArrowRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TestCase() {
  const { params, code, paths, setPaths, setParams } = useCodeStore();

  const [inputValues, setInputValues] = useState({});
  const [executing, setExecuting] = useState(false);
  const [resultText, setResultText] = useState([]);
  const [lastTestParams, setLastTestParams] = useState({});
  const [isTestCaseSave, setIsTestCaseSave] = useState(false);
  const [isSavingTestCase, setIsSavingTestCase] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleChange = (paramName, value) => {
    setInputValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  useEffect(() => {
    const storedParams = localStorage.getItem("params");

    if (storedParams) {
      try {
        const parsed = JSON.parse(storedParams);
        let fixedParams;

        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          fixedParams = parsed.map((paramName) => ({
            name: paramName,
            value: undefined,
          }));
        } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
          fixedParams = parsed.map((param) => {
            if (param.name !== undefined) {
              return param;
            } else {
              const keys = Object.keys(param);
              const nameKey = keys.find((k) => k !== "value");
              return {
                name: nameKey ? param[nameKey] : "unknown",
                value: param.value,
              };
            }
          });
        } else {
          console.warn("Unexpected parameter format in localStorage");
          fixedParams = [];
        }

        setParams(fixedParams);
      } catch (e) {
        console.error("Invalid params in localStorage:", e);
      }
    }
  }, [setParams]);

  const clearValues = () => {
    setInputValues({});
    setResultText([]);
    setIsTestCaseSave(false);
  };

  const executeTestCase = async () => {
    try {
      setExecuting(true);
      setIsTestCaseSave(false);

      const testParams = {};
      params.forEach((param) => {
        let value = inputValues[param.name];

        if (!isNaN(Number(value))) {
          value = Number(value);
        } else if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }

        testParams[param.name] = value;
      });

      // Simulate delay
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

      setResultText(result.actual_execution_path.line_numbers);
      setLastTestParams(testParams);
    } catch (error) {
      console.error("Error executing test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveTestCase = async () => {
    setIsSavingTestCase(true);

    const longestCommonSubsequence = (a, b) => {
      const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
      );

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }

      return dp[a.length][b.length];
    };

    const threshold = 0.9;
    const similarPaths = paths.filter(({ path }) => {
      const lcs = longestCommonSubsequence(resultText, path);
      const similarity = lcs / path.length;
      return similarity >= threshold;
    });

    const updatedPaths = paths.map((item) => {
      const isSimilar = similarPaths.some(
        (p) => JSON.stringify(p.path) === JSON.stringify(item.path)
      );

      return {
        ...item,
        passed: isSimilar ? true : item.passed,
        testCase: isSimilar ? lastTestParams : item.testCase,
      };
    });

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPaths(updatedPaths);
    setIsTestCaseSave(true);
    setIsSavingTestCase(false);
    
    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  // Removed path visualizer as requested

  const hasRequiredParams = params.length > 0 && Object.keys(inputValues).length >= params.length;

  return (
    <div className="space-y-4">
      <Card className="border-2 border-neutral-100 shadow-sm">
        <CardHeader className="pb-2 bg-neutral-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold">Test Case Parameters</CardTitle>
              <CardDescription className="text-sm">
                {params?.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {params.map((p) => (
                      <Badge key={p.name} variant="outline" className="bg-neutral-100">
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  "No parameters detected"
                )}
              </CardDescription>
            </div>
            <Info className="h-5 w-5 text-neutral-400" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <AnimatePresence>
            {params.map((param, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <label className="text-sm font-medium flex items-center gap-1" htmlFor={`param-${index}`}>
                  {param.name}:
                  {!inputValues[param.name] && (
                    <span className="text-xs text-red-500">*</span>
                  )}
                </label>
                <Input
                  id={`param-${index}`}
                  type="text"
                  placeholder={`Enter value for ${param.name}`}
                  value={inputValues[param.name] || ""}
                  onChange={(e) => handleChange(param.name, e.target.value)}
                 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex gap-2 border-t pt-4 bg-neutral-50 rounded-b-lg">
          <Button
            className="flex-1"
            disabled={!params?.length || executing || !hasRequiredParams}
            onClick={executeTestCase}
          >
            {executing ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Evaluating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={clearValues}
            disabled={!params?.length}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-2 border-neutral-100 shadow-sm">
        <CardHeader className="pb-2 bg-neutral-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              Execution Path
              <TooltipComponent information="Shows the line numbers executed in sequence">
                <span className="text-xs bg-neutral -100 px-2 py-0.5 rounded-full">
                  ?
                </span>
              </TooltipComponent>
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <AnimatePresence>
            {resultText.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-md bg-neutral-50 border border-neutral-200"
              >
                <div className="font-mono text-sm">{resultText.join(" → ")}</div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-md bg-neutral-50 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center"
              >
                <p className="text-neutral-500 text-sm">
                  Enter parameter and run test.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {resultText.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end mt-4"
              >
                <Button
                  variant={isTestCaseSave ? "outline" : "default"}
                  onClick={handleSaveTestCase}
                  disabled={isTestCaseSave || isSavingTestCase}
                  className="relative"
                >
                  {isSavingTestCase ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : isTestCaseSave ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Test Case
                    </>
                  )}
                  
                  {/* Success animation overlay */}
                  <AnimatePresence>
                    {showSuccessAnimation && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-green-100 bg-opacity-80 rounded-md p-1">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestCase;