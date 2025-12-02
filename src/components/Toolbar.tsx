import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  songName: string;
  currentSection: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onClose: () => void;
  isLandscape?: boolean;
}

export const Toolbar = ({
  songName,
  currentSection,
  isPlaying,
  onPlayPause,
  onRestart,
  onClose,
  isLandscape = false
}: ToolbarProps) => {
  return (
    <div className={cn(
      "w-full h-[55px] bg-[#1f2733]/60 px-6 flex items-center justify-between rounded-3xl backdrop-blur-sm",
      isLandscape && "h-[40px] px-3 rounded-xl"
    )}>
      {/* Left: Song Name */}
      <div className="flex-1">
        <h1 className={cn(
          "text-foreground text-lg font-medium",
          isLandscape && "text-sm"
        )}>{songName}</h1>
      </div>

      {/* Center: Current Section */}
      <div className="flex-1 flex justify-center">
        <div className={cn(
          "px-6 py-2 rounded-full text-sm font-medium",
          "bg-[#6764db] text-white",
          isLandscape && "px-3 py-1 text-xs"
        )}>
          {currentSection || "Loading..."}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className={cn(
            "h-12 w-12 rounded-full p-0 bg-transparent group relative",
            isLandscape && "h-8 w-8"
          )}
        >
          {isPlaying ? (
            <>
              <img src="/icons/pause-button-idle.png" alt="Pause" className={cn("h-10 w-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
              <img src="/icons/pause-button-active.png" alt="Pause Active" className={cn("h-10 w-10 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
            </>
          ) : (
            <>
              <img src="/icons/play-button-idle.png" alt="Play" className={cn("h-10 w-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
              <img src="/icons/play-button-active.png" alt="Play Active" className={cn("h-10 w-10 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className={cn(
            "h-12 w-12 rounded-full p-0 bg-transparent group relative",
            isLandscape && "h-8 w-8"
          )}
        >
          <img src="/icons/restart-button-idle.png" alt="Restart" className={cn("h-10 w-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
          <img src="/icons/restart-button-active.png" alt="Restart Active" className={cn("h-10 w-10 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200", isLandscape && "h-7 w-7")} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={cn(
            "h-12 w-12 rounded-full p-0 bg-transparent",
            isLandscape && "h-8 w-8"
          )}
        >
          <img src="/icons/close-button.png" alt="Close" className={cn("h-10 w-10", isLandscape && "h-7 w-7")} />
        </Button>
      </div>
    </div>
  );
};
