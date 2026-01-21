import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function CreateProject({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        toast({ title: "Berhasil", description: "Proyek baru telah dibuat" });
        setName("");
        setDescription("");
        setOpen(false);
        onProjectCreated();
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive", description: "Gagal membuat proyek" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Proyek Testing Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Proyek Testing Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Testing</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Testing" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsikan proyek testing ini..." />
          </div>
          <Button className="w-full" onClick={handleCreate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Testing"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}