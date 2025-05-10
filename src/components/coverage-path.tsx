import { Progress } from "./ui/progress";
import { useCodeStore } from "../store/CodeStore";
import TooltipComponent from "./tooltip-component";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CoveragePath = () => {
  const { paths } = useCodeStore();

  const totalPassed = paths.filter((item) => item.passed).length;
  const totalPaths = paths.length;
  const percentage = (totalPassed / totalPaths) * 100;

  const totalCoverage = percentage;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            Coverage
            <TooltipComponent information="Code coverage from analyzed paths">
              <span className="text-xs bg-neutral-100 dark:text-black px-1 py-0.5 rounded">
                ?
              </span>
            </TooltipComponent>
          </div>
          <span className="text-sm font-normal">
            {totalCoverage.toFixed(0)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <Progress value={totalCoverage} className="h-2 mb-4" />
      </CardContent>
    </Card>
  );
};

export default CoveragePath;
