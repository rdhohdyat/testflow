import { CircleCheck, CircleX } from "lucide-react";
import { useCodeStore } from "../store/CodeStore";

function PathList() {
  const paths = useCodeStore((state) => state.paths);

  return (
    <div className="space-y-2">
      {paths.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded-md border bg-neutral-50 dark:bg-neutral-700 text-sm"
        >
          <div className="font-mono">{item.path.join(" → ")}</div>
          {item.passed ? (
            <CircleCheck className="text-green-500 h-4 w-4" />
          ) : (
            <CircleX className="text-red-500 h-4 w-4" />
          )}
        </div>
      ))}
    </div>
  );
}

export default PathList;
