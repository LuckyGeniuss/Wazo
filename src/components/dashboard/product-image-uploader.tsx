"use client";

import { useState, useRef } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, GripVertical, Loader2, Image as ImageIcon, Edit2, Check } from "lucide-react";

export interface ImageItem {
  id: string;
  url: string;
  alt?: string;
}

interface ProductImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  storeId: string;
}

function SortableImageItem({
  image,
  onEdit,
  onDelete,
  isEditing,
  editAlt,
  setEditAlt,
  saveEdit,
}: {
  image: ImageItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isEditing: string | null;
  editAlt: string;
  setEditAlt: (value: string) => void;
  saveEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:border-gray-300 transition-colors"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Image Preview */}
      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={image.url}
          alt={image.alt || "Product image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Alt Text */}
      <div className="flex-1 min-w-0">
        {isEditing === image.id ? (
          <div className="flex items-center gap-2">
            <Input
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              className="h-8 px-2 py-1"
              placeholder="Опис зображення (alt)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveEdit();
                }
              }}
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={saveEdit}
              className="h-8 w-8 p-0"
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 truncate flex-1">
              {image.alt || "Немає опису"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(image.id)}
              className="h-7 w-7 p-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDelete(image.id)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function ProductImageUploader({
  images,
  onChange,
  storeId,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(images, oldIndex, newIndex));
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`Файл "₴{file.name}" не є зображенням`);
          return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/upload?storeId=${storeId}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.url) {
          return {
            id: crypto.randomUUID(),
            url: data.url,
            alt: file.name.replace(/\.[^/.]+$/, "") || "Product image",
          } as ImageItem;
        } else {
          toast.error(data.error || "Помилка завантаження");
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const newImages = results.filter((img): img is ImageItem => img !== null);

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast.success(`Завантажено ${newImages.length} зображень`);
      }
    } catch (error) {
      toast.error("Помилка завантаження зображень");
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const handleEdit = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      setEditingId(id);
      setEditAlt(image.alt || "");
    }
  };

  const saveEdit = () => {
    if (editingId) {
      onChange(
        images.map((img) =>
          img.id === editingId ? { ...img, alt: editAlt } : img
        )
      );
      setEditingId(null);
      setEditAlt("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Зображення товару</Label>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading ? "Завантаження..." : "Завантажити фото"}
        </Button>
      </div>

      {images.length === 0 ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">
            Перетягніть фото сюди або натисніть для завантаження
          </p>
          <p className="text-xs text-gray-500">
            Підтримуються формати: JPG, PNG, WebP
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {images.map((image) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={editingId === image.id ? editingId : null}
                  editAlt={editAlt}
                  setEditAlt={setEditAlt}
                  saveEdit={saveEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          Перетягніть зображення для зміни порядку. Натисніть на іконку редагування, щоб змінити опис (alt).
        </p>
      )}
    </div>
  );
}
