import React from "react";
import { ButtonBlock as ButtonBlockType } from "@/types/builder";
import Link from "next/link";

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  return (
    <div className="p-4 text-center">
      <Link
        href={block.content.href}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
      >
        {block.content.text}
      </Link>
    </div>
  );
}
