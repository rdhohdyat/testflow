import { useState } from "react";
import { Plus, Folder, Calendar } from "lucide-react";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";

interface ProjectFormData {
  name: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface CreateProjectProps {
  onProjectCreated: () => void;
}

export default function CreateProject({
  onProjectCreated,
}: CreateProjectProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result: Project = await response.json();

      toast({
        title: "Created Project",
        description: `Success created project "${result.name}"`,
      });

      setFormData({
        name: "",
        description: "",
      });

      setOpen(false);

      // Refresh list
      onProjectCreated();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up a new control flow graph analysis project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              placeholder="Enter project name..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Brief description of your project..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Created</Label>
            <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md bg-neutral-50 dark:bg-neutral-900">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
