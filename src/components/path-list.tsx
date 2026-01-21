import { useState, useEffect, useCallback } from "react";
import { CircleCheck, CircleX, Terminal } from "lucide-react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipComponent from "./tooltip-component";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";

// Helper aman untuk format path
const formatPath = (p: any) => {
    if (Array.isArray(p)) return p.join(" → ");
    if (typeof p === "string") return p;
    return "-";
};

function PathList() {
  const paths = useCodeStore((state) => state.paths);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [initialRender, setInitialRender] = useState(true);

  const { triggerAnimation } = useCodeStore();

  const animatePaths = useCallback(() => {
    setVisibleItems([]);
    if (paths && paths.length > 0) {
      paths.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prevItems) => [...prevItems, index]);
        }, index * 100);
      });
    }
  }, [paths]);

  useEffect(() => {
    if (triggerAnimation) {
      animatePaths();
      setInitialRender(false);
    }
  }, [triggerAnimation, animatePaths]);

  useEffect(() => {
    if (initialRender && paths.length > 0) {
      setVisibleItems(paths.map((_, index) => index));
      setInitialRender(false);
    }
  }, [initialRender, paths]);

  // Statistik
  const totalPaths = paths ? paths.length : 0;
  const passedPaths = paths ? paths.filter((item: any) => item.passed).length : 0;
  const failedPaths = paths ? paths.filter((item: any) => item.passed === false && item.testCase).length : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b bg-neutral-50/50">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            Jalur Eksekusi
            <TooltipComponent information="Semua jalur eksekusi dari FlowGraph">
              <span className="text-xs bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded cursor-help">?</span>
            </TooltipComponent>
          </div>
          <Badge variant="outline">{totalPaths} Jalur</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col gap-3 p-3">
        {/* List Jalur (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {paths && paths.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-2 p-2.5 rounded-md border text-xs transition-all duration-300 ${
                  visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                } ${item.passed ? "bg-green-50 border-green-200" : "bg-white border-neutral-200"}`}
              >
                <div className="font-mono text-neutral-600 truncate mr-2">
                    {formatPath(item.path || item)}
                </div>
                {item.passed ? (
                  <CircleCheck className="flex-shrink-0 w-4 h-4 text-green-500" />
                ) : (
                  <CircleX className="flex-shrink-0 w-4 h-4 text-neutral-300" />
                )}
              </div>
            ))}
        </div>

        {/* Tombol Sheet (Fixed di Bawah) */}
        <Sheet>
          {/* PENTING: asChild wajib ada agar Button berfungsi sebagai trigger */}
          <SheetTrigger asChild>
            <Button className="w-full gap-2">
                <Terminal className="w-4 h-4" />
                Lihat Test Case
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-full md:w-[500px] flex flex-col" side="right">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle>Detail Test Case</SheetTitle>
              <SheetDescription>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {passedPaths} Lolos
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    {failedPaths} Gagal
                  </Badge>
                </div>
              </SheetDescription>
            </SheetHeader>

            {/* Konten Scrollable di dalam Sheet */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {paths && paths.length > 0 ? (
                paths.map((item: any, index: number) => {
                    const isTested = item.testCase !== undefined && item.testCase !== null;
                    if (!isTested) return null; // Hanya tampilkan yang sudah diuji

                    return (
                        <Card key={index} className={`border ${item.passed ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}>
                            <CardHeader className="py-2 px-3 border-b bg-white/50">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-xs">Test Case #{index + 1}</span>
                                    {item.passed ? 
                                        <Badge className="h-5 text-[10px] bg-green-500">Lolos</Badge> : 
                                        <Badge className="h-5 text-[10px] bg-red-500">Gagal</Badge>
                                    }
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 space-y-2 text-xs">
                                <div>
                                    <span className="font-semibold text-neutral-500">Input:</span>
                                    <pre className="mt-1 p-2 bg-white rounded border overflow-x-auto">
                                        {JSON.stringify(item.testCase, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <span className="font-semibold text-neutral-500">Jalur:</span>
                                    <div className="mt-1 font-mono text-neutral-700 bg-white px-2 py-1 rounded border">
                                        {formatPath(item.path)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
              ) : (
                <div className="text-center py-10 text-neutral-400">Belum ada data</div>
              )}
            </div>

            <SheetFooter className="pt-4 border-t">
              {/* PENTING: asChild wajib ada di sini juga */}
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Tutup</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default PathList;