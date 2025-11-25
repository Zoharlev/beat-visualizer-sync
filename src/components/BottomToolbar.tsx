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
}: BottomToolbarProps) => {
  return (
    <div className="w-full h-[70px] bg-[#1f2733] px-6 flex items-center justify-between rounded-3xl">
      {/* Left Side Controls */}
      <div className="flex items-center gap-4">
        {/* Grid/Notation Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDisplayModeChange("notation")}
            className={cn(
              "h-12 w-12 rounded-full p-0 transition-all",
              displayMode === "notation" 
                ? "bg-[#6764db] hover:bg-[#6764db]/90" 
                : "bg-[#2a3240] hover:bg-[#353d4d]"
            )}
          >
            <Music className="h-6 w-6 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDisplayModeChange("grid")}
            className="h-12 w-12 p-0 transition-all bg-transparent hover:bg-transparent"
          >
            <img 
              src={displayMode === "grid" ? gridIconActive : gridIconIdle} 
              alt="Grid view" 
              className="h-6 w-6" 
            />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-[#3a4252]" />

        {/* Sound Toggles */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDrumSoundsToggle}
          className="h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent"
          title="Drum Sounds"
        >
          <img 
            src={drumSoundsEnabled ? drumIconActive : drumIconIdle} 
            alt="Drum sounds" 
            className="h-10 w-10" 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onMetronomeToggle}
          className="h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent"
          title="Metronome"
        >
          <img 
            src={metronomeEnabled ? metronomeIconActive : metronomeIconIdle} 
            alt="Metronome" 
            className="h-10 w-10" 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onBackingTrackToggle}
          className="h-10 w-10 p-0 transition-all bg-transparent hover:bg-transparent"
          title="Backing Track"
        >
          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18V5l12-2v13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" strokeWidth="2"/>
            <circle cx="18" cy="16" r="3" strokeWidth="2"/>
          </svg>
        </Button>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6">
        {/* Timer */}
        <div className="text-white font-mono text-lg">
          {formatTime(currentTime)}<span className="text-[#6b7280]">/{formatTime(duration)}</span>
        </div>

        {/* BPM Controller */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBpmChange(-1)}
            className="h-8 w-8 rounded-md bg-[#2a3240] hover:bg-[#353d4d] p-0"
          >
            <Minus className="h-4 w-4 text-white" />
          </Button>
          
          <div className="text-white font-mono text-lg min-w-[100px] text-center">
            <span className="text-2xl font-bold">{bpm}</span>
            <span className="text-[#6b7280]">/{maxBpm}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBpmChange(1)}
            className="h-8 w-8 rounded-md bg-[#2a3240] hover:bg-[#353d4d] p-0"
          >
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
