import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface QuizEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: { id: string; title: string; description?: string } | null;
  onSave: (data: { title: string; description?: string }) => void;
  isSaving?: boolean;
}

export default function QuizEditDialog({
  open,
  onOpenChange,
  quiz,
  onSave,
  isSaving = false,
}: QuizEditDialogProps) {
  const [title, setTitle] = useState(quiz?.title || "");
  const [description, setDescription] = useState(quiz?.description || "");

  useEffect(() => {
    setTitle(quiz?.title || "");
    setDescription(quiz?.description || "");
  }, [quiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
          <DialogDescription>
            Update the quiz title and description below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="Quiz title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              placeholder="Quiz description (optional)"
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
