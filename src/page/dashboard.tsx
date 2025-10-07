import { useEffect, useState } from "react";
import {
  Code,
  FolderOpen,
  Activity,
  GitFork,
  FileText,
  MoreHorizontal,
  Search,
  Filter,
  Trash,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import CreateProject from "../components/create-project";

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProject = async () => {
    try {
      const response = await fetch("http://localhost:8000/projects/");
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      getAllProject();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    getAllProject();
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      change: "+3",
      changeType: "positive",
      icon: FolderOpen,
    },
    {
      title: "Avg Complexity",
      value: "18.5",
      change: "-2.1",
      changeType: "positive",
      icon: GitFork,
    },
    {
      title: "Code Coverage",
      value: "84%",
      change: "+5%",
      changeType: "positive",
      icon: Activity,
    },
    {
      title: "Files Analyzed",
      value: "156",
      change: "+12",
      changeType: "positive",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />

      <div className="container px-6 pt-24 pb-6 mx-auto md:px-36">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Control Flow Graph Analysis Projects
            </p>
          </div>
          <CreateProject onProjectCreated={getAllProject} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="gap-6 lg:grid-cols-3">
          {/* Projects Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    Your latest control flow analysis projects
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-neutral-500" />
                    <Input
                      placeholder="Search projects..."
                      className="w-64 pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-neutral-500">
                            {/* {project.filesCount} files */}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        {project.created_at}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Code className="w-4 h-4 mr-2" />
                            Open Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Export Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:!bg-red-200 hover:!text-red-600"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {projects.length < 1 && (
                  <div>
                    <h1 className="mt-6 text-2xl font-semibold text-center uppercase">
                      Belum ada project
                    </h1>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
