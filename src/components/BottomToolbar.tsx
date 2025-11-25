import { Button } from "@/components/ui/button";
import { Music2, Grid3x3, Volume2, VolumeX, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomToolbarProps {
  displayMode: 'grid' | 'notation';
  onDisplayModeChange: (mode: 'grid' | 'notation') => void;
  drumSoundsMuted: boolean;
  onDrumSoundsToggle: () => void;
  metronomeEnabled: boolean;
  onMetronomeToggle: () => void;
  backingTrackEnabled: boolean;
  onBackingTrackToggle: () => void;
  currentTime: string;
  totalTime: string;
  currentBpm: number;
  maxBpm: number;
  onBpmDecrease: () => void;
  onBpmIncrease: () => void;
}

export const BottomToolbar = ({
  displayMode,
  onDisplayModeChange,
  drumSoundsMuted,
  onDrumSoundsToggle,
  metronomeEnabled,
  onMetronomeToggle,
  backingTrackEnabled,
  onBackingTrackToggle,
  currentTime,
  totalTime,
  currentBpm,
  maxBpm,
  onBpmDecrease,
  onBpmIncrease
}: BottomToolbarProps) => {
  return (
    <div className="w-full h-[60px] bg-[#1f2733] px-6 flex items-center justify-between rounded-3xl">
      {/* Left Side: View Toggles and Sound Controls */}
      <div className="flex items-center gap-3">
        {/* Notation View Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDisplayModeChange('notation')}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-200",
            displayMode === 'notation' 
              ? "bg-[#6764db] hover:bg-[#6764db]/90" 
              : "bg-[#2a3441] hover:bg-[#343d4d]"
          )}
        >
          <Music2 className={cn(
            "h-6 w-6",
            displayMode === 'notation' ? "text-white" : "text-muted-foreground"
          )} />
        </Button>

        {/* Grid View Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDisplayModeChange('grid')}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-200",
            displayMode === 'grid' 
              ? "bg-[#6764db] hover:bg-[#6764db]/90" 
              : "bg-[#2a3441] hover:bg-[#343d4d]"
          )}
        >
          <Grid3x3 className={cn(
            "h-6 w-6",
            displayMode === 'grid' ? "text-white" : "text-muted-foreground"
          )} />
        </Button>

        {/* Vertical Separator */}
        <div className="h-8 w-[1px] bg-border/50 mx-2" />

        {/* Drum Sound Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDrumSoundsToggle}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-200",
            !drumSoundsMuted 
              ? "bg-[#6764db] hover:bg-[#6764db]/90" 
              : "bg-[#2a3441] hover:bg-[#343d4d]"
          )}
        >
          {!drumSoundsMuted ? (
            <Volume2 className="h-6 w-6 text-white" />
          ) : (
            <VolumeX className="h-6 w-6 text-muted-foreground" />
          )}
        </Button>

        {/* Metronome Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMetronomeToggle}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-200",
            metronomeEnabled 
              ? "bg-[#6764db] hover:bg-[#6764db]/90" 
              : "bg-[#2a3441] hover:bg-[#343d4d]"
          )}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={cn(
              "h-6 w-6",
              metronomeEnabled ? "text-white" : "text-muted-foreground"
            )}
          >
            <path d="M12 3L4 21h16L12 3z" />
            <path d="M12 3v10" />
            <circle cx="12" cy="17" r="1" />
          </svg>
        </Button>

        {/* Music/Backing Track Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackingTrackToggle}
          className={cn(
            "h-12 w-12 rounded-full transition-all duration-200",
            backingTrackEnabled 
              ? "bg-[#6764db] hover:bg-[#6764db]/90" 
              : "bg-[#2a3441] hover:bg-[#343d4d]"
          )}
        >
          <Music className={cn(
            "h-6 w-6",
            backingTrackEnabled ? "text-white" : "text-muted-foreground"
          )} />
        </Button>
      </div>

      {/* Right Side: Timer and BPM Controller */}
      <div className="flex items-center gap-6">
        {/* Timer Display */}
        <div className="flex items-center gap-1 text-foreground font-mono text-lg">
          <span>{currentTime}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{totalTime}</span>
        </div>

        {/* BPM Controller */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBpmDecrease}
            className="h-8 w-8 rounded-md bg-[#2a3441] hover:bg-[#343d4d]"
          >
            <span className="text-foreground text-xl font-light">−</span>
          </Button>
          
          <div className="flex items-center gap-1 font-mono text-lg">
            <span className="text-foreground font-semibold">{currentBpm}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{maxBpm}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onBpmIncrease}
            className="h-8 w-8 rounded-md bg-[#2a3441] hover:bg-[#343d4d]"
          >
            <span className="text-foreground text-xl font-light">+</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
