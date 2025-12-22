"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string | null;
  thumbnail?: string | null;
  title?: string;
}

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Disable right-click context menu
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for downloading/screenshots
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return false;
      }
      // Prevent PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }
    };

    videoElement.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeyboardShortcuts);

    return () => {
      videoElement.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeyboardShortcuts);
    };
  }, []);

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 mb-2">No video available</div>
          <p className="text-sm text-slate-500">
            Video will appear here once uploaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="aspect-video bg-black rounded-lg overflow-hidden relative select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          controls
          controlsList="nodownload"
          disablePictureInPicture
          poster={thumbnail || undefined}
          className="w-full h-full"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to prevent some screenshot tools */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: "normal" }}
        />
      </div>
      {title && <h3 className="text-lg font-semibold mt-4">{title}</h3>}
    </div>
  );
}
