import { Music, Grid3x3, FileText, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import gridIconActive from "@/assets/grid-icon-active.png";
import gridIconIdle from "@/assets/grid-icon-idle.png";
import drumIconActive from "@/assets/drum-icon-active.png";
import drumIconIdle from "@/assets/drum-icon-idle.png";
import metronomeIconActive from "@/assets/metronome-icon-active.png";
import metronomeIconIdle from "@/assets/metronome-icon-idle.png";
import backingTrackIconActive from "@/assets/backing-track-icon-active.png";
import backingTrackIconIdle from "@/assets/backing-track-icon-idle.png";
import notationIconActive from "@/assets/notation-icon-active.png";
import notationIconIdle from "@/assets/notation-icon-idle.png";

interface BottomToolbarProps {
  displayMode: "grid" | "notation";
  onDisplayModeChange: (mode: "grid" | "notation") => void;
  drumSoundsEnabled: boolean;
  onDrumSoundsToggle: () => void;
  metronomeEnabled: boolean;
  onMetronomeToggle: () => void;
  backingTrackEnabled: boolean;
  onBackingTrackToggle: () => void;
  currentTime: number;
  duration: number;
  bpm: number;
  maxBpm: number;
  onBpmChange: (delta: number) => void;
  isLandscape?: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const BottomToolbar = ({
  displayMode,
  onDisplayModeChange,
  drumSoundsEnabled,
  onDrumSoundsToggle,
  metronomeEnabled,
  onMetronomeToggle,
  backingTrackEnabled,
  onBackingTrackToggle,
  currentTime,
  duration,
  bpm,
  maxBpm,
  onBpmChange,
  isLandscape = false
}: BottomToolbarProps) => {
  return (
    <div className={cn(
      "w-full h-[55px] bg-[#1f2733]/60 px-6 flex items-center justify-between rounded-3xl backdrop-blur-sm",
      isLandscape && "h-[40px] px-3 rounded-xl"
    )}>
      {/* Left Side Controls */}
      <div className={cn("flex items-center gap-4", isLandscape && "gap-2")}>
        {/* Grid/Notation Toggle */}
        <div className={cn("flex items-center gap-2", isLandscape && "gap-1")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDisplayModeChange("notation")}
            className={cn(
              "h-12 w-12 p-0 transition-all bg-transparent hover:bg-transparent",
              isLandscape && "h-8 w-8"
            )}
          >
            <img 
              src={displayMode === "notation" ? notationIconActive : notationIconIdle} 
              alt="Notation view" 
              className={cn("h-6 w-6", isLandscape && "h-5 w-5")} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDisplayModeChange("grid")}
            className={cn(
              "h-12 w-12 p-0 transition-all bg-transparent hover:bg-transparent",
              isLandscape && "h-8 w-8"
            )}
          >
            <img 
              src={displayMode === "grid" ? gridIconActive : gridIconIdle} 
              alt="Grid view" 
              className={cn("h-6 w-6", isLandscape && "h-5 w-5")} 
            />
          </Button>
        </div>

        <Separator orientation="vertical" className={cn("h-8 bg-[#3a4252]", isLandscape && "h-5")} />

        {/* Sound Toggles */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDrumSoundsToggle}
          className={cn(
            "h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent",
            isLandscape && "h-7 w-7"
          )}
          title="Drum Sounds"
        >
          <img 
            src={drumSoundsEnabled ? drumIconActive : drumIconIdle} 
            alt="Drum sounds" 
            className={cn("h-10 w-10", isLandscape && "h-7 w-7")} 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onMetronomeToggle}
          className={cn(
            "h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent",
            isLandscape && "h-7 w-7"
          )}
          title="Metronome"
        >
          <img 
            src={metronomeEnabled ? metronomeIconActive : metronomeIconIdle} 
            alt="Metronome" 
            className={cn("h-10 w-10", isLandscape && "h-7 w-7")} 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onBackingTrackToggle}
          className={cn(
            "h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent",
            isLandscape && "h-7 w-7"
          )}
          title="Backing Track"
        >
          <img 
            src={backingTrackEnabled ? backingTrackIconActive : backingTrackIconIdle} 
            alt="Backing track" 
            className={cn("h-10 w-10", isLandscape && "h-7 w-7")} 
          />
        </Button>
      </div>

      {/* Right Side Controls */}
      <div className={cn("flex items-center gap-6", isLandscape && "gap-3")}>
        {/* Timer */}
        <div className={cn("text-white font-mono text-lg", isLandscape && "text-sm")}>
          {formatTime(currentTime)}<span className="text-[#6b7280]">/{formatTime(duration)}</span>
        </div>

        {/* BPM Controller */}
        <div className={cn("flex items-center gap-3", isLandscape && "gap-1")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBpmChange(-1)}
            className={cn(
              "h-8 w-8 rounded-md bg-[#2a3240] hover:bg-[#353d4d] p-0",
              isLandscape && "h-6 w-6"
            )}
          >
            <Minus className={cn("h-4 w-4 text-white", isLandscape && "h-3 w-3")} />
          </Button>
          
          <div className={cn(
            "text-white font-mono text-lg min-w-[100px] text-center",
            isLandscape && "text-sm min-w-[70px]"
          )}>
            <span className={cn("text-2xl font-bold", isLandscape && "text-lg")}>{bpm}</span>
            <span className="text-[#6b7280]">/{maxBpm}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBpmChange(1)}
            className={cn(
              "h-8 w-8 rounded-md bg-[#2a3240] hover:bg-[#353d4d] p-0",
              isLandscape && "h-6 w-6"
            )}
          >
            <Plus className={cn("h-4 w-4 text-white", isLandscape && "h-3 w-3")} />
          </Button>
        </div>
      </div>
    </div>
  );
};
