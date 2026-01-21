import { useEffect, useState } from "react";
import {
  FolderOpen,
  Search,
  Trash2,
  Loader2,
  Eye,
  Calendar,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import CreateProject from "../components/create-project";
import { useToast } from "../hooks/use-toast";
import  ExportDialog  from "../components/export-dialog";

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk Dialog Viewer
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);

  const { toast } = useToast();

  const getAllProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/projects/");
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Hapus project ini beserta semua riwayatnya?")) return;

    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus");
      
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Project dihapus" });
    } catch (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  // --- FUNGSI UTAMA: VIEW & EXPORT ---
  const handleViewReport = async (projectId: number, projectName: string) => {
    setIsFetchingDetails(projectId);
    try {
      // Fetch data lengkap project termasuk semua code history
      const response = await fetch(`http://localhost:8000/projects/${projectId}/export/`);
      if (!response.ok) throw new Error("Gagal mengambil data");
      
      const data = await response.json();
      
      // Data 'codes' adalah array riwayat analisis
      const history = data.project.codes || [];

      if (history.length > 0) {
        setProjectCodes(history);
        setSelectedProjectName(projectName);
        setShowExportDialog(true);
      } else {
        toast({ 
            title: "Belum Ada Data", 
            description: "Project ini belum memiliki analisis yang disimpan.", 
            variant: "default" 
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data project.", variant: "destructive" });
    } finally {
      setIsFetchingDetails(null);
    }
  };

  useEffect(() => {
    getAllProject();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950">
      <Navbar />

      <div className="max-w-4xl px-6 pt-24 pb-12 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Project & Laporan
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Lihat Daftar Project Testing
            </p>
          </div>
          <CreateProject onProjectCreated={getAllProject} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute w-4 h-4 text-neutral-400 left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Cari project..."
            className="pl-10 bg-white border-neutral-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List Project */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card 
                key={project.id}
                className="flex flex-col items-start justify-between p-4 transition-all duration-200 border bg-white hover:border-blue-300 md:flex-row md:items-center group"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      {project.description && (
                        <span className="hidden sm:inline-block truncate max-w-[200px]">
                          • {project.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-full gap-2 md:w-auto">
                  {/* TOMBOL UTAMA: Lihat & Export */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 gap-2 text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-700 md:flex-none"
                    onClick={() => handleViewReport(project.id, project.name)}
                    disabled={isFetchingDetails === project.id}
                  >
                    {isFetchingDetails === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    Lihat & Export
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-red-500 hover:bg-red-50"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-16 text-center border-2 border-dashed rounded-xl border-neutral-200">
              <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-6 h-6 text-neutral-400" />
              </div>
              <h3 className="font-medium text-neutral-900">Belum ada project</h3>
              <p className="text-sm text-neutral-500 mt-1">Buat project baru untuk memulai.</p>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL (Menampilkan History Analisis) */}
      {showExportDialog && (
        <ExportDialog 
            open={showExportDialog} 
            onOpenChange={setShowExportDialog} 
            projectName={selectedProjectName}
            projectCodes={projectCodes} // Kirim seluruh array history
        />
      )}
    </div>
  );
}

export default DashboardPage;