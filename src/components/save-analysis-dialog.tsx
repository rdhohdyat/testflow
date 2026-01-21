import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Save, Loader2 } from "lucide-react"; // Menambahkan icon Info
import { useCodeStore } from "../store/CodeStore";
import { useToast } from "../hooks/use-toast";

interface Project {
  id: number;
  name: string;
}

export function SaveAnalysisDialog() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [functionName, setFunctionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  
  const { 
    code, 
    paths, 
    cyclomaticComplexity, 
    coverage, 
    executedTestCases,
    nodes,
    edges 
  } = useCodeStore();

  // Fetch daftar project saat dialog dibuka
  useEffect(() => {
    if (open) {
      fetch("http://localhost:8000/projects/")
        .then((res) => res.json())
        .then((data) => setProjects(data))
        .catch((err) => console.error("Gagal memuat proyek", err));
    }
  }, [open]);

  const handleSave = async () => {
    if (!selectedProjectId || !functionName) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon pilih proyek dan masukkan nama fungsi.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      name: functionName,
      code: code,
      cyclomatic_complexity: cyclomaticComplexity,
      coverage_path: coverage,
      path_list: paths,
      test_cases: executedTestCases,
      nodes: nodes || [], 
      edges: edges || []
    };

    try {
      const response = await fetch(`http://localhost:8000/projects/${selectedProjectId}/save_analysis/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal menyimpan analisis");

      toast({
        title: "Berhasil",
        description: "Analisis berhasil disimpan ke proyek!",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data ke server.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="w-4 h-4" />
          Simpan Analisis
        </Button>
      </DialogTrigger>
      
      {/* Mengatur lebar dialog agar sedikit lebih lega */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Simpan Hasil Analisis</DialogTitle>
          <DialogDescription className="mt-1.5 text-sm text-neutral-500">
            Pilih proyek tujuan untuk menyimpan kode dan laporan pengujian ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bagian Form Input */}
          <div className="space-y-4">
            {/* Input Pilihan Proyek */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Proyek
              </Label>
              <div className="col-span-3">
                <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Pilih Proyek --" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length > 0 ? (
                      projects.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-center text-neutral-500">Belum ada proyek tersedia</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Input Nama Fungsi */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Nama Fungsi
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="Contoh: Cek Bilangan Genap"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 sm:justify-between">
          <div className="hidden sm:block text-xs text-neutral-400 self-center">
            *Data kode dan path akan disertakan
          </div>
          <Button type="submit" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto min-w-[100px]">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}