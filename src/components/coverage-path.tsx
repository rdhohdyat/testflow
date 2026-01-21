import { useEffect } from "react";
import { Progress } from "./ui/progress";
import { useCodeStore } from "../store/CodeStore";
import TooltipComponent from "./tooltip-component";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CoveragePath = () => {
  // 1. Ambil paths dan setter setCoverage dari store
  const { paths, setCoverage } = useCodeStore();

  // 2. Hitung logika coverage lokal
  const totalPassed = paths ? paths.filter((item) => item.passed).length : 0;
  const totalPaths = paths ? paths.length : 0;
  
  // Hindari NaN jika totalPaths 0
  const totalCoverage = totalPaths > 0 ? (totalPassed / totalPaths) * 100 : 0;

  // 3. SINKRONISASI: Simpan hasil hitungan ke Store setiap kali nilai berubah
  useEffect(() => {
    setCoverage(totalCoverage);
  }, [totalCoverage, setCoverage]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            Coverage
            <TooltipComponent information="Code coverage from analyzed paths">
              <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded cursor-help">
                ?
              </span>
            </TooltipComponent>
          </div>
          <span className={`text-sm font-normal ${totalCoverage === 100 ? 'text-neutral-900 font-bold' : ''}`}>
            {totalCoverage.toFixed(0)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <Progress 
            value={totalCoverage} 
            className={`h-2 mb-4 ${totalCoverage === 100 ? '[&>div]:bg-neutral-900' : ''}`} 
        />
      </CardContent>
    </Card>
  );
};

export default CoveragePath;