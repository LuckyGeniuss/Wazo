"use client";

import { useState, useRef, useEffect } from "react";

interface InlineEditProps {
  value: number;
  onSave: (val: number) => Promise<void>;
  format?: (val: number) => string;
  className?: string;
  type?: "price" | "stock";
}

export function InlineEdit({ value, onSave, format, className = "", type = "stock" }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    if (localValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(localValue);
    } catch (error) {
      console.error("Помилка збереження:", error);
      setLocalValue(value);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleSave();
    }
  };

  const formatValue = (val: number) => {
    if (format) return format(val);
    if (type === "price") return `$${val.toFixed(2)}`;
    return val.toString();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(type === "price" ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isLoading}
        className={`w-24 px-2 py-1 text-sm border rounded focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 px-2 py-1 -ml-2 rounded inline-block ${className}`}
      title="Натисніть для редагування"
    >
      {formatValue(value)}
    </div>
  );
}
