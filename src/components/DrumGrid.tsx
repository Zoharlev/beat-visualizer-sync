import { memo, useCallback, useMemo } from "react";
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
  isLandscape?: boolean;
}

const drumLabels: {
  [key: string]: {
    name: string;
    symbol: string;
  };
} = {
  kick: { name: "Kick", symbol: "●" },
  snare: { name: "Snare", symbol: "×" },
  hihat: { name: "Hi-Hat", symbol: "○" },
  openhat: { name: "Open Hat", symbol: "◎" },
  tom: { name: "Tom", symbol: "◆" },
  "low tom": { name: "Low Tom", symbol: "◇" },
  "Low Tom": { name: "Low Tom", symbol: "◇" },
  "low tom-tom": { name: "Low Tom", symbol: "◇" },
  "Low Tom-tom": { name: "Low Tom", symbol: "◇" },
  crash: { name: "Crash", symbol: "⊗" },
  "HH Closed": { name: "Hi-Hat", symbol: "○" },
  "HH Open": { name: "Open Hat", symbol: "◎" },
  Kick: { name: "Kick", symbol: "●" },
  Snare: { name: "Snare", symbol: "×" },
  Tom: { name: "Tom", symbol: "◆" },
  "Crash Cymbal": { name: "Crash", symbol: "⊗" },
  ride: { name: "Ride", symbol: "⊙" },
  Ride: { name: "Ride", symbol: "⊙" },
  "Ride Cymbal": { name: "Ride", symbol: "⊙" },
  "Ghost Note": { name: "Ghost Note", symbol: "⚬" },
  "ghost note": { name: "Ghost Note", symbol: "⚬" },
  ghost: { name: "Ghost Note", symbol: "⚬" }
};

// Memoized Step Button for virtualization
interface StepButtonProps {
  stepIndex: number;
  active: boolean;
  isCurrentStep: boolean;
  symbol: string;
  isLandscape: boolean;
  onToggle: () => void;
}

const StepButton = memo(({ stepIndex, active, isCurrentStep, symbol, isLandscape, onToggle }: StepButtonProps) => (
  <button
    onClick={onToggle}
    className={cn(
      "flex-1 min-w-[38px] h-[38px] p-0 border-r border-grid-line last:border-r-0 transition-colors",
      "flex items-center justify-center",
      isCurrentStep && "bg-playhead/10",
      stepIndex % 2 === 0 && "border-r-2 border-primary/30",
      isLandscape && "min-w-[24px] h-full"
    )}
  >
    {active && (
      <div className={cn(
        "w-3 h-3 rounded-full bg-gradient-to-br from-note-active to-accent",
        "shadow-note flex items-center justify-center text-[8px] font-bold text-background",
        isCurrentStep && "animate-bounce",
        isLandscape && "w-2 h-2 text-[5px]"
      )}>
        {symbol}
      </div>
    )}
  </button>
));
StepButton.displayName = "StepButton";

// Memoized Drum Row
interface DrumRowProps {
  drumKey: string;
  steps: boolean[];
  startStep: number;
  visibleSteps: number;
  currentStep: number;
  isLandscape: boolean;
  onStepToggle: (drum: string, step: number) => void;
}

const DrumRow = memo(({ drumKey, steps, startStep, visibleSteps, currentStep, isLandscape, onStepToggle }: DrumRowProps) => {
  const drumInfo = drumLabels[drumKey] || {
    name: drumKey,
    symbol: drumKey === 'Kick' ? '●' : drumKey === 'Snare' ? '×' : drumKey === 'Hi-Hat' ? '○' : drumKey === 'Tom' ? '◆' : '●'
  };

  const handleToggle = useCallback((stepIndex: number) => {
    onStepToggle(drumKey, stepIndex);
  }, [drumKey, onStepToggle]);

  return (
    <div className={cn("flex items-center group", isLandscape && "flex-1 min-h-0")}>
      {/* Drum Label */}
      <div className={cn("w-20 flex-shrink-0 flex items-center pr-4 gap-0", isLandscape && "w-12 pr-1")}>
        <span className={cn("text-lg font-mono text-accent w-4 flex-shrink-0 text-left", isLandscape && "text-[10px] w-3")}>
          {drumInfo.symbol}
        </span>
        <span className={cn("text-foreground flex-1 truncate text-xs text-left font-normal", isLandscape && "text-[8px] leading-tight")}>
          {drumInfo.name}
        </span>
      </div>

      {/* Grid Line */}
      <div className="flex-1 relative h-full">
        <div className="absolute inset-0 border-t border-grid-line"></div>
        
        {/* Step Buttons */}
        <div className={cn("flex relative z-10 h-full", isLandscape && "items-center")}>
          {Array.from({ length: visibleSteps }, (_, i) => {
            const stepIndex = startStep + i;
            const active = steps[stepIndex] || false;
            return (
              <StepButton
                key={stepIndex}
                stepIndex={stepIndex}
                active={active}
                isCurrentStep={stepIndex === currentStep}
                symbol={drumInfo.symbol}
                isLandscape={isLandscape}
                onToggle={() => handleToggle(stepIndex)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});
DrumRow.displayName = "DrumRow";

// Main DrumGrid component
export const DrumGrid = memo(({
  pattern,
  currentStep,
  scrollOffset = 0,
  visibleStepsCount = 20,
  onStepToggle,
  isLandscape = false
}: DrumGridProps) => {
  // Memoized calculations
  const { startStep, endStep, visibleSteps, playheadIndex } = useMemo(() => {
    const maxStart = Math.max(0, pattern.length - visibleStepsCount);
    const start = Math.min(Math.max(0, scrollOffset), maxStart);
    const end = Math.min(start + visibleStepsCount, pattern.length);
    const visible = end - start;
    const playhead = Math.min(Math.max(currentStep - start, 0), Math.max(visible - 1, 0));
    return { startStep: start, endStep: end, visibleSteps: visible, playheadIndex: playhead };
  }, [pattern.length, visibleStepsCount, scrollOffset, currentStep]);

  // Memoized sorted drum rows
  const sortedDrumRows = useMemo(() => {
    return Object.entries(pattern)
      .filter(([key]) => key !== 'length' && key !== 'subdivisions' && key !== 'offsets' && key !== 'sections')
      .sort(([keyA], [keyB]) => {
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
      });
  }, [pattern]);

  // Memoized subdivision display helper
  const getSubdivisionStyle = useCallback((stepIndex: number) => {
    let displayText = "";
    let textStyle = "text-muted-foreground/60";

    if (pattern.subdivisions && pattern.subdivisions[stepIndex]) {
      const count = pattern.subdivisions[stepIndex];
      displayText = count;
      if (count === '1' || count === '2' || count === '3' || count === '4') {
        textStyle = "text-primary font-bold";
      } else if (count === '&') {
        textStyle = "text-accent font-medium";
      } else if (count === 'e' || count === 'a') {
        textStyle = "text-muted-foreground/70 font-medium";
      }
    } else {
      const posInBar = stepIndex % 16;
      const beatPosition = posInBar % 4;
      if (beatPosition === 0) {
        displayText = String(Math.floor(posInBar / 4) + 1);
        textStyle = "text-primary font-bold";
      } else if (beatPosition === 1) {
        displayText = "e";
        textStyle = "text-muted-foreground/70 font-medium";
      } else if (beatPosition === 2) {
        displayText = "&";
        textStyle = "text-accent font-medium";
      } else if (beatPosition === 3) {
        displayText = "a";
        textStyle = "text-muted-foreground/70 font-medium";
      }
    }
    return { displayText, textStyle };
  }, [pattern.subdivisions]);

  return (
    <div className={cn("space-y-6", isLandscape && "h-full flex flex-col space-y-0")}>
      {/* Drum Grid Container */}
      <div className={cn("drum-grid-container", isLandscape && "flex-1 overflow-hidden")}>
        <div className={cn(
          "relative bg-card rounded-lg p-3 sm:p-6 shadow-elevated overflow-hidden max-w-full",
          isLandscape && "h-full p-1 flex flex-col"
        )}>
          {/* Playhead - Fixed position */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-playhead z-20 pointer-events-none"
            style={{
              left: `calc(5rem + 1.5rem + ((100% - 5rem - 3rem) * ${visibleSteps > 0 ? playheadIndex / visibleSteps : 0}))`,
              boxShadow: "0 0 20px hsl(var(--playhead) / 0.6)",
              transition: "left 75ms ease-out"
            }}
          />

          {/* Beat Numbers */}
          <div className={cn("flex mb-4 flex-col gap-1", isLandscape && "mb-0 gap-0 flex-shrink-0")}>
            <div className="flex">
              <div className={cn("w-20 text-xs text-muted-foreground/50", isLandscape && "w-12 text-[8px]")}>Step#</div>
              {Array.from({ length: visibleSteps }, (_, i) => {
                const stepIndex = startStep + i;
                return (
                  <div
                    key={`step-${stepIndex}`}
                    className={cn("flex-1 min-w-[38px] text-center text-[10px] font-mono text-muted-foreground/40", isLandscape && "min-w-[24px] text-[7px]")}
                  >
                    {stepIndex}
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <div className={cn("w-20 text-xs text-muted-foreground/50", isLandscape && "w-12 text-[8px]")}>Count</div>
              {Array.from({ length: visibleSteps }, (_, i) => {
                const stepIndex = startStep + i;
                const { displayText, textStyle } = getSubdivisionStyle(stepIndex);
                return (
                  <div
                    key={stepIndex}
                    className={cn("flex-1 min-w-[38px] text-center text-sm font-mono", textStyle, isLandscape && "min-w-[24px] text-[9px] leading-tight")}
                  >
                    {displayText}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drum Rows */}
          <div className={cn("", isLandscape && "flex-1 flex flex-col justify-evenly")}>
            {sortedDrumRows.map(([drumKey, steps]) => {
              if (!Array.isArray(steps)) return null;
              return (
                <DrumRow
                  key={drumKey}
                  drumKey={drumKey}
                  steps={steps as boolean[]}
                  startStep={startStep}
                  visibleSteps={visibleSteps}
                  currentStep={currentStep}
                  isLandscape={isLandscape}
                  onStepToggle={onStepToggle}
                />
              );
            })}
          </div>

          {/* Grid Enhancement */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: Math.ceil(visibleSteps / 2) }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-primary/20"
                style={{ left: `${88 + i * (100 - 88 / visibleSteps) / (visibleSteps / 2)}%` }}
              />
            ))}
          </div>

          {/* Fade edges for visual continuity */}
          {scrollOffset > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
          )}
          {endStep < pattern.length && (
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
          )}
        </div>
      </div>
    </div>
  );
});
DrumGrid.displayName = "DrumGrid";
