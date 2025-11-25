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
    <div className="w-full bg-[#2C3440] px-6 py-4 flex items-center justify-between rounded-t-3xl">
      {/* Left: Song Name */}
      <div className="flex-1">
        <h1 className="text-foreground text-lg font-medium">{songName}</h1>
      </div>

      {/* Center: Current Section */}
      <div className="flex-1 flex justify-center">
        <div className={cn(
          "px-6 py-2 rounded-full text-sm font-medium",
          "bg-primary text-primary-foreground"
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
          className="h-12 w-12 rounded-full bg-background/10 hover:bg-background/20"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-foreground" />
          ) : (
            <Play className="h-6 w-6 text-foreground" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="h-12 w-12 rounded-full bg-background/10 hover:bg-background/20"
        >
          <RotateCcw className="h-6 w-6 text-foreground" />
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
