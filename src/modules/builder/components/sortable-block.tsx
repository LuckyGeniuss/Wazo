import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorBlock } from "@/types/builder";
import { BlockRenderer } from "@/components/renderers/block-renderer";
import { GripVertical, X } from "lucide-react";

interface SortableBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SortableBlock({ block, isSelected, onSelect, onRemove }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: block.styles?.backgroundColor,
    color: block.styles?.color,
    background: block.styles?.gradient,
    padding: block.styles?.padding,
    margin: block.styles?.margin,
    borderRadius: block.styles?.borderRadius,
    boxShadow: block.styles?.boxShadow,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      className={`relative group cursor-pointer border-2 transition-all ${
        isSelected
          ? "border-blue-500 z-10"
          : "border-transparent hover:border-blue-200 hover:z-10"
      }`}
    >
      {/* Shape Divider Top */}
      {block.settings?.shapeDividerTop && (
        <div
          className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0"
          dangerouslySetInnerHTML={{ __html: block.settings.shapeDividerTop }}
        />
      )}

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      {/* Remove Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(block.id);
          }}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-20"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10 w-full h-full pointer-events-none">
        <BlockRenderer blocks={[block]} storeId={""} />
      </div>

      {/* Shape Divider Bottom */}
      {block.settings?.shapeDividerBottom && (
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0 rotate-180"
          dangerouslySetInnerHTML={{ __html: block.settings.shapeDividerBottom }}
        />
      )}
    </div>
  );
}
