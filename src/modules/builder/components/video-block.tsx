import React from "react";
import { VideoBlock as VideoBlockType } from "@/types/builder";

interface VideoBlockProps {
  block: VideoBlockType;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
    
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(block.content.src);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
