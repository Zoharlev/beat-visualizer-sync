import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  songName: string;
  currentSection: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onClose?: () => void;
}

export const Toolbar = ({
  songName,
  currentSection,
  isPlaying,
  onPlayPause,
  onRestart,
  onClose
}: ToolbarProps) => {
  return (
    <div className="w-full h-[55px] bg-[#1f2733] px-6 flex items-center justify-between rounded-3xl">
      {/* Left: Song Name */}
      <div className="flex-1">
        <h1 className="text-foreground text-lg font-medium">{songName}</h1>
      </div>

      {/* Center: Current Section */}
      <div className="flex-1 flex justify-center">
        <div className={cn(
          "px-6 py-2 rounded-full text-sm font-medium",
          "bg-[#6764db] text-white"
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
          className="h-12 w-12 rounded-full p-0 bg-transparent group relative"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-foreground" />
          ) : (
            <>
              <img src="/icons/play-button-idle.png" alt="Play" className="h-10 w-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-200" />
              <img src="/icons/play-button-active.png" alt="Play Active" className="h-10 w-10 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200" />
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="h-12 w-12 rounded-full p-0 bg-transparent group relative"
        >
          <img src="/icons/restart-button-idle.png" alt="Restart" className="h-10 w-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-200" />
          <img src="/icons/restart-button-active.png" alt="Restart Active" className="h-10 w-10 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200" />
        </Button>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-background/10 hover:bg-background/20"
          >
            <X className="h-6 w-6 text-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};
