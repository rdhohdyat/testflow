import { useState, useEffect } from "react";
import { useCodeStore } from "../store/CodeStore";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import TooltipComponent from "./tooltip-component";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";

// Icons
import {
  Loader2,
  CheckCircle,
  Play,
  Trash2,
  Save,
  Info,
} from "lucide-react";

// --- Utility Functions (Outside Component) ---

// Algoritma untuk membandingkan kemiripan path
// @ts-ignore
const calculateLCS = (a, b) => {
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

// Helper untuk parsing parameter dari LocalStorage
// @ts-ignore
const parseStoredParams = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    // Case 1: Array of strings ["a", "b"]
    if (typeof parsed[0] === "string") {
      return parsed.map((name) => ({ name, value: undefined }));
    }

    // Case 2: Array of objects [{name: "a", value: 1}]
    if (typeof parsed[0] === "object") {
      return parsed.map((param) => {
        if (param.name) return param;
        // Fallback untuk struktur aneh
        const nameKey = Object.keys(param).find((k) => k !== "value");
        return {
          name: nameKey ? param[nameKey] : "unknown",
          value: param.value,
        };
      });
    }
    return [];
  } catch (e) {
    console.error("Error parsing stored params:", e);
    return [];
  }
};

// --- Main Component ---

function TestCase() {
  // Store
  const { params, code, paths, setPaths, setParams } = useCodeStore();

  // Local State
  const [inputValues, setInputValues] = useState({});
  const [resultText, setResultText] = useState([]);
  const [lastTestParams, setLastTestParams] = useState({});
  
  // UI State
  const [executing, setExecuting] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Refactored from isTestCaseSave
  const [isSaving, setIsSaving] = useState(false); // Refactored from isSavingTestCase
  const [setShowSuccessAnim] = useState(false);

  // --- Effects ---

  // Load params from localStorage on mount
  useEffect(() => {
    const storedParams = localStorage.getItem("params");
    if (storedParams) {
      const formattedParams = parseStoredParams(storedParams);
      if (formattedParams.length > 0) {
        setParams(formattedParams);
      }
    }
  }, [setParams]);

  // --- Handlers ---
// @ts-ignore
  const handleInputChange = (paramName, value) => {
    setInputValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const handleClear = () => {
    setInputValues({});
    setResultText([]);
    setIsSaved(false);
  };

  const prepareParamsForExecution = () => {
    const testParams = {};
    params.forEach((param) => {
      // @ts-ignore
      let value = inputValues[param.name];
      // Auto-convert types
      if (!isNaN(Number(value)) && value !== "") value = Number(value);
      else if (value === "true") value = true;
      else if (value === "false") value = false;
      // @ts-ignore
      testParams[param.name] = value;
    });
    return testParams;
  };

  const executeTestCase = async () => {
    try {
      setExecuting(true);
      setIsSaved(false);

      const testParams = prepareParamsForExecution();

      // UI Delay Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("http://localhost:8000/test_execution/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          parameters: testParams,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      setResultText(result.actual_execution_path?.line_numbers || []);
      setLastTestParams(testParams);
    } catch (error) {
      console.error("Gagal menjalankan test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveResult = async () => {
    setIsSaving(true);
    
    // Logic Similarity Check
    const SIMILARITY_THRESHOLD = 0.9;
    
    // Identifikasi path yang mirip/sama dengan hasil eksekusi
    const similarPathsIndices = new Set();
    
    paths.forEach((p, index) => {
      const lcs = calculateLCS(resultText, p.path);
      const similarity = lcs / p.path.length;
      if (similarity >= SIMILARITY_THRESHOLD) {
        similarPathsIndices.add(index);
      }
    });

    const updatedPaths = paths.map((item, index) => {
      if (similarPathsIndices.has(index)) {
        return {
          ...item,
          passed: true,
          testCase: lastTestParams,
        };
      }
      return item;
    });

    // Simulasi Save Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setPaths(updatedPaths);
    setIsSaved(true);
    setIsSaving(false);

    // Trigger Animation
    // @ts-ignore
    setShowSuccessAnim(true);
    // @ts-ignore
    setTimeout(() => setShowSuccessAnim(false), 2000);
  };

  // Validation
  const hasRequiredParams = params.length > 0 && 
  // @ts-ignore
    params.every(p => inputValues[p.name] !== undefined && inputValues[p.name] !== "");

  // --- Render ---

  return (
    <div className="space-y-4">
      {/* CARD 1: Input Parameters */}
      <Card className="border-2 border-neutral-100 shadow-sm">
        <CardHeader className="pb-2 bg-neutral-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold">Parameter Test Case</CardTitle>
              <CardDescription className="text-sm mt-1">
                {params?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {params.map((p) => (
                      // @ts-ignore
                      <Badge key={p.name} variant="outline" className="bg-neutral-100">
                        {
                        // @ts-ignore
                        p.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  "Tidak ada parameter terdeteksi"
                )}
              </CardDescription>
            </div>
            <TooltipComponent information="Parameter yang dibutuhkan fungsi">
              <Info className="h-5 w-5 text-neutral-400" />
            </TooltipComponent>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <AnimatePresence>
            {params.map((param, index) => (
              <motion.div
              // @ts-ignore
                key={param.name || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <label
                  className="text-sm font-medium flex items-center gap-1"
                  htmlFor={`param-${index}`}
                >
                  {
                  // @ts-ignore
                  param.name}:
                  {
                  // @ts-ignore
                  !inputValues[param.name] && (
                    <span className="text-xs text-red-500">*</span>
                  )}
                </label>
                <Input
                  id={`param-${index}`}
                  type="text"
                  // @ts-ignore
                  placeholder={`Nilai untuk ${param.name}`}
                  // @ts-ignore
                  value={inputValues[param.name] || ""}
                  // @ts-ignore
                  onChange={(e) => handleInputChange(param.name, e.target.value)}
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
                Mengevaluasi...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Jalankan Tes
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!params?.length || executing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </CardFooter>
      </Card>

      {/* CARD 2: Execution Result */}
      <Card className="border-2 border-neutral-100 shadow-sm">
        <CardHeader className="pb-2 bg-neutral-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              Jalur Eksekusi
              <TooltipComponent information="Urutan baris kode yang dieksekusi">
                <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full cursor-help">
                  ?
                </span>
              </TooltipComponent>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <AnimatePresence mode="wait">
            {resultText.length > 0 ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-md bg-neutral-50 border border-neutral-200"
              >
                <div className="font-mono text-sm break-all">
                  {resultText.join(" → ")}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-md bg-neutral-50 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center"
              >
                <p className="text-neutral-500 text-sm">
                  Masukkan parameter dan jalankan tes untuk melihat hasil.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button & Animation */}
          <AnimatePresence>
            {resultText.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end mt-4"
              >
                <Button
                  variant={isSaved ? "outline" : "default"}
                  onClick={handleSaveResult}
                  disabled={isSaved || isSaving}
                  className="relative overflow-hidden w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Menyimpan...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tersimpan
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Test Case
                    </>
                  )}
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