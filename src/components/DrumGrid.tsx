import { Button } from "@/components/ui/button";
import { Trash2, Volume2, VolumeX, Settings, Upload, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
interface DrumGridProps {
  pattern: {
    [key: string]: boolean[] | number | string[] | number[];
    length: number;
    subdivisions?: string[];
    offsets?: number[];
  };
  currentStep: number;
  scrollOffset: number;
  visibleStepsCount?: number;
  onStepToggle: (drum: string, step: number) => void;
  onClearPattern: () => void;
  metronomeEnabled: boolean;
  onMetronomeToggle: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
  onLoadPattern?: () => void;
  isLoadingPattern?: boolean;
  onClearLoadedPattern?: () => void;
  hasLoadedPattern?: boolean;
}
const drumLabels: {
  [key: string]: {
    name: string;
    symbol: string;
  };
} = {
  kick: {
    name: "Kick",
    symbol: "●"
  },
  snare: {
    name: "Snare",
    symbol: "×"
  },
  hihat: {
    name: "Hi-Hat",
    symbol: "○"
  },
  openhat: {
    name: "Open Hat",
    symbol: "◎"
  },
  tom: {
    name: "Tom",
    symbol: "◆"
  },
  "low tom": {
    name: "Low Tom",
    symbol: "◇"
  },
  "Low Tom": {
    name: "Low Tom",
    symbol: "◇"
  },
  "low tom-tom": {
    name: "Low Tom",
    symbol: "◇"
  },
  "Low Tom-tom": {
    name: "Low Tom",
    symbol: "◇"
  },
  crash: {
    name: "Crash",
    symbol: "⊗"
  },
  "HH Closed": {
    name: "Hi-Hat",
    symbol: "○"
  },
  "HH Open": {
    name: "Open Hat",
    symbol: "◎"
  },
  Kick: {
    name: "Kick",
    symbol: "●"
  },
  Snare: {
    name: "Snare",
    symbol: "×"
  },
  Tom: {
    name: "Tom",
    symbol: "◆"
  },
  "Crash Cymbal": {
    name: "Crash",
    symbol: "⊗"
  },
  ride: {
    name: "Ride",
    symbol: "⊙"
  },
  Ride: {
    name: "Ride",
    symbol: "⊙"
  },
  "Ride Cymbal": {
    name: "Ride",
    symbol: "⊙"
  },
  "Ghost Note": {
    name: "Ghost Note",
    symbol: "⚬"
  },
  "ghost note": {
    name: "Ghost Note",
    symbol: "⚬"
  },
  ghost: {
    name: "Ghost Note",
    symbol: "⚬"
  }
};
export const DrumGrid = ({
  pattern,
  currentStep,
  scrollOffset = 0,
  visibleStepsCount = 20,
  onStepToggle,
  onClearPattern,
  metronomeEnabled,
  onMetronomeToggle,
  onTogglePlay,
  isPlaying,
  onLoadPattern,
  isLoadingPattern,
  onClearLoadedPattern,
  hasLoadedPattern
}: DrumGridProps) => {
  // Calculate visible window based on scroll offset
  const maxStart = Math.max(0, pattern.length - visibleStepsCount);
  const startStep = Math.min(Math.max(0, scrollOffset), maxStart);
  const endStep = Math.min(startStep + visibleStepsCount, pattern.length);
  const visibleSteps = endStep - startStep;

  // Calculate playhead position within the current visible window
  const playheadIndex = Math.min(Math.max(currentStep - startStep, 0), Math.max(visibleSteps - 1, 0));
  return <div className="space-y-6">
      {/* Drum Grid Container */}
      <div className="drum-grid-container">
        <div className="relative bg-card rounded-lg p-3 sm:p-6 shadow-elevated overflow-hidden max-w-full">
        {/* Step Position Indicator */}
        <div className="hidden text-xs text-muted-foreground text-center mb-2">
          Step {currentStep + 1} / {pattern.length}
        </div>

        {/* Playhead - Fixed position */}
        <div className="absolute top-0 bottom-0 w-1 bg-playhead z-20 pointer-events-none" style={{
          left: `calc(5rem + 1.5rem + ((100% - 5rem - 3rem) * ${visibleSteps > 0 ? playheadIndex / visibleSteps : 0}))`,
          boxShadow: "0 0 20px hsl(var(--playhead) / 0.6)",
          transition: "left 75ms ease-out"
        }} />

        {/* Scrolling Content Container */}
        <div className="transition-transform duration-75 ease-linear" style={{
          transform: 'none'
        }}>
          {/* Beat Numbers */}
        <div className="flex mb-4 flex-col gap-1">
          <div className="flex">
            <div className="w-20 text-xs text-muted-foreground/50">Step#</div>
            {Array.from({
                length: visibleSteps
              }, (_, i) => {
                const stepIndex = startStep + i;
                return <div key={`step-${stepIndex}`} className="flex-1 min-w-[38px] text-center text-[10px] font-mono text-muted-foreground/40">
                  {stepIndex}
                </div>;
              })}
          </div>
          <div className="flex">
            <div className="w-20 text-xs text-muted-foreground/50">Count</div>
            {Array.from({
                length: visibleSteps
              }, (_, i) => {
                const stepIndex = startStep + i;
                let displayText = "";
                let textStyle = "text-muted-foreground/60";

                // If we have subdivision data from the CSV, use it
                if (pattern.subdivisions && pattern.subdivisions[stepIndex]) {
                  const count = pattern.subdivisions[stepIndex];
                  displayText = count;

                  // Style based on count type
                  if (count === '1' || count === '2' || count === '3' || count === '4') {
                    textStyle = "text-primary font-bold";
                  } else if (count === '&') {
                    textStyle = "text-accent font-medium";
                  } else if (count === 'e' || count === 'a') {
                    textStyle = "text-muted-foreground/70 font-medium";
                  }
                } else {
                  // Fallback to 16-step bar: 1 e & a 2 e & a 3 e & a 4 e & a
                  const posInBar = stepIndex % 16;
                  const beatPosition = posInBar % 4;
                  if (beatPosition === 0) {
                    // Main beats: 1, 2, 3, 4
                    displayText = String(Math.floor(posInBar / 4) + 1);
                    textStyle = "text-primary font-bold";
                  } else if (beatPosition === 1) {
                    // 16th note "e"
                    displayText = "e";
                    textStyle = "text-muted-foreground/70 font-medium";
                  } else if (beatPosition === 2) {
                    // 8th note "&"
                    displayText = "&";
                    textStyle = "text-accent font-medium";
                  } else if (beatPosition === 3) {
                    // 16th note "a"
                    displayText = "a";
                    textStyle = "text-muted-foreground/70 font-medium";
                  }
                }
                return <div key={stepIndex} className={cn("flex-1 min-w-[38px] text-center text-sm font-mono", textStyle)}>
                  {displayText}
                </div>;
              })}
          </div>
        </div>

        {/* Drum Rows */}
        {Object.entries(pattern).filter(([key]) => key !== 'length' && key !== 'subdivisions' && key !== 'offsets' && key !== 'sections').sort(([keyA], [keyB]) => {
            // Define bottom order: High Tom (5th from bottom), Low Tom (4th from bottom), Snare (3rd from bottom), Ghost Note (2nd from bottom), Kick (bottom)
            const keyALower = keyA.toLowerCase();
            const keyBLower = keyB.toLowerCase();
            if (keyALower === 'kick') return 1;
            if (keyBLower === 'kick') return -1;
            if (keyALower.includes('ghost')) return 1;
            if (keyBLower.includes('ghost')) return -1;
            if (keyALower === 'snare') return 1;
            if (keyBLower === 'snare') return -1;
            if (keyALower.includes('low tom')) return 1;
            if (keyBLower.includes('low tom')) return -1;
            if (keyALower === 'tom' || keyALower.includes('high tom')) return 1;
            if (keyBLower === 'tom' || keyBLower.includes('high tom')) return -1;
            return 0;
          }).map(([drumKey, steps]) => {
            if (!Array.isArray(steps)) return null;
            const drumInfo = drumLabels[drumKey] || {
              name: drumKey,
              symbol: drumKey === 'Kick' ? '●' : drumKey === 'Snare' ? '×' : drumKey === 'Hi-Hat' ? '○' : drumKey === 'Tom' ? '◆' : '●'
            };
            return <div key={drumKey} className="flex items-center group">
              {/* Drum Label */}
              <div className="w-20 flex-shrink-0 flex items-center pr-4 gap-0">
                <span className="text-lg font-mono text-accent w-4 flex-shrink-0 text-left">{drumInfo.symbol}</span>
                <span className="text-foreground flex-1 truncate text-xs text-left font-normal">{drumInfo.name}</span>
              </div>

              {/* Grid Line */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 border-t border-grid-line"></div>
                
                {/* Step Buttons */}
                <div className="flex relative z-10">
                  {Array.from({
                    length: visibleSteps
                  }, (_, i) => {
                    const stepIndex = startStep + i;
                    const active = (steps as boolean[])[stepIndex];
                    return <button key={stepIndex} onClick={() => onStepToggle(drumKey, stepIndex)} className={cn("flex-1 min-w-[38px] h-[38px] p-0 border-r border-grid-line last:border-r-0 transition-all duration-200", "flex items-center justify-center group-hover:bg-muted/20", stepIndex === currentStep && "bg-playhead/10", stepIndex % 2 === 0 && "border-r-2 border-primary/30")}>
                        {active && <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br from-note-active to-accent", "shadow-note transition-transform duration-200 hover:scale-110", "flex items-center justify-center text-[8px] font-bold text-background", stepIndex === currentStep && active && "animate-bounce")}>
                            {drumInfo.symbol}
                          </div>}
                      </button>;
                  })}
                </div>
              </div>
            </div>;
          })}

          {/* Grid Enhancement */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical beat lines */}
            {Array.from({
              length: Math.ceil(visibleSteps / 2)
            }, (_, i) => <div key={i} className="absolute top-0 bottom-0 border-l border-primary/20" style={{
              left: `${88 + i * (100 - 88 / visibleSteps) / (visibleSteps / 2)}%`
            }} />)}
          </div>
        </div>

        {/* Fade edges for visual continuity */}
        {scrollOffset > 0 && <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />}
        {endStep < pattern.length && <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />}
        </div>
      </div>

      
    </div>;
};