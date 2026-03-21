"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/category";

interface CreateCategoryModalProps {
  storeId: string;
  children: React.ReactNode;
}

export function CreateCategoryModal({ storeId, children }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await createCategory(storeId, {
        name,
      });
      setOpen(false);
      setName("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Створити категорію</DialogTitle>
          <DialogDescription>
            Додайте нову категорію для організації товарів
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Назва</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Наприклад: Електроніка"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Створення..." : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
