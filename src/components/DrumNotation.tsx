import { Button } from "@/components/ui/button";
import { Trash2, Upload, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
interface DrumNotationProps {
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

// Drum positions on the staff (absolute Y coordinates aligned with staff lines)
// Supports both title-case (manual) and lowercase (CSV) naming conventions
const drumPositions: {
  [key: string]: {
    y: number;
    noteType: 'note' | 'x' | 'open';
  };
} = {
  // Kick drum (bottom staff line) - filled notehead
  'Kick': {
    y: 120,
    noteType: 'note'
  },
  'kick': {
    y: 120,
    noteType: 'note'
  },
  // Tom-tom (between snare and kick) - filled notehead
  'Tom': {
    y: 100,
    noteType: 'note'
  },
  'tom': {
    y: 100,
    noteType: 'note'
  },
  'tom-tom': {
    y: 100,
    noteType: 'note'
  },
  // Snare drum (middle staff line) - filled notehead
  'Snare': {
    y: 80,
    noteType: 'note'
  },
  'snare': {
    y: 80,
    noteType: 'note'
  },
  // Closed hi-hat (top staff line) - X notehead
  'HH Closed': {
    y: 40,
    noteType: 'x'
  },
  'Hi-Hat': {
    y: 40,
    noteType: 'x'
  },
  'hihat': {
    y: 40,
    noteType: 'x'
  },
  // Open hi-hat (top staff line) - X notehead with circle above
  'HH Open': {
    y: 40,
    noteType: 'open'
  },
  'Hi-Hat (Open)': {
    y: 40,
    noteType: 'open'
  },
  'openhat': {
    y: 40,
    noteType: 'open'
  },
  // Crash cymbal (above staff) - X notehead
  'Crash': {
    y: 20,
    noteType: 'x'
  },
  'crash': {
    y: 20,
    noteType: 'x'
  },
  'Crash Cymbal': {
    y: 20,
    noteType: 'x'
  },
  // Ride cymbal (above staff) - X notehead
  'Ride': {
    y: 20,
    noteType: 'x'
  },
  'ride': {
    y: 20,
    noteType: 'x'
  },
  'Ride Cymbal': {
    y: 20,
    noteType: 'x'
  }
};
// Constants
const STEP_WIDTH = 46;
const STAFF_LEFT_MARGIN = 40;
const BEATS_PER_BAR = 4;
const BUFFER_STEPS = 2;

// Static staff lines component - never changes
const StaticStaffLayer = React.memo(() => (
  <>
    {[0, 1, 2, 3, 4].map(line => (
      <line 
        key={line} 
        x1="0" 
        x2="2000" 
        y1={40 + line * 20} 
        y2={40 + line * 20} 
        stroke="currentColor" 
        strokeWidth="1" 
        className="text-grid-line" 
      />
    ))}
  </>
));
StaticStaffLayer.displayName = 'StaticStaffLayer';

// Scrolling grid layer - bar lines and beat numbers
const ScrollingGridLayer = React.memo<{
  gridLines: Array<{ step: number; x: number; isFirstBar: boolean }>;
  beatNumbers: Array<{ step: number; x: number; label: number }>;
}>(({ gridLines, beatNumbers }) => (
  <>
    {/* Bar lines */}
    {gridLines.map((line, i) => (
      <line 
        key={`bar-${i}`} 
        x1={line.x} 
        x2={line.x} 
        y1={40} 
        y2={120} 
        stroke="currentColor" 
        strokeWidth={line.isFirstBar ? "3" : "1.5"} 
        className="text-primary/40" 
      />
    ))}
    
    {/* Beat numbers */}
    {beatNumbers.map((num, i) => (
      <text 
        key={`beat-${i}`} 
        x={num.x} 
        y={25} 
        textAnchor="middle" 
        className="text-xs font-bold fill-primary"
      >
        {num.label}
      </text>
    ))}
  </>
), (prev, next) => 
  prev.gridLines.length === next.gridLines.length && 
  prev.beatNumbers.length === next.beatNumbers.length
);
ScrollingGridLayer.displayName = 'ScrollingGridLayer';

// Playhead indicator - only updates on step change
const PlayheadIndicator = React.memo<{
  currentStep: number;
  startStep: number;
  endStep: number;
  stepWidth: number;
}>(({ currentStep, startStep, endStep, stepWidth }) => {
  if (currentStep < startStep || currentStep >= endStep) return null;
  
  const x = STAFF_LEFT_MARGIN + 20 + (currentStep - startStep) * stepWidth;
  
  return (
    <line 
      x1={x} 
      x2={x} 
      y1={20} 
      y2={140} 
      stroke="currentColor" 
      strokeWidth="3" 
      className="text-playhead transition-transform duration-100" 
      style={{
        filter: "drop-shadow(0 0 8px hsl(var(--playhead) / 0.6))"
      }} 
    />
  );
}, (prev, next) => 
  prev.currentStep === next.currentStep && 
  prev.startStep === next.startStep && 
  prev.endStep === next.endStep
);
PlayheadIndicator.displayName = 'PlayheadIndicator';

// Notes layer - renders visible notes using symbols
const NotesLayer = React.memo<{
  visibleNotes: Array<{
    drum: string;
    step: number;
    x: number;
    y: number;
    noteType: 'note' | 'x' | 'open';
  }>;
  currentStep: number;
}>(({ visibleNotes, currentStep }) => (
  <>
    {visibleNotes.map((note) => {
      const isCurrentStep = note.step === currentStep;
      const symbolId = note.noteType === 'note' ? '#filledNote' : note.noteType === 'x' ? '#xNote' : '#openNote';
      
      return (
        <use 
          key={`${note.drum}-${note.step}`}
          href={symbolId}
          x={note.x}
          y={note.y}
          width="23"
          height="46"
          className={cn(
            "transition-colors",
            isCurrentStep ? "text-playhead" : "text-note-active"
          )}
        />
      );
    })}
  </>
), (prev, next) => 
  prev.visibleNotes === next.visibleNotes && 
  prev.currentStep === next.currentStep
);
NotesLayer.displayName = 'NotesLayer';

// Interaction layer - clickable areas
const InteractionLayer = React.memo<{
  visibleNotes: Array<{
    drum: string;
    step: number;
    x: number;
    y: number;
  }>;
  emptySpaces: Array<{
    drum: string;
    step: number;
    x: number;
    y: number;
  }>;
  onStepToggle: (drum: string, step: number) => void;
}>(({ visibleNotes, emptySpaces, onStepToggle }) => (
  <>
    {/* Clickable areas for existing notes */}
    {visibleNotes.map((note) => (
      <rect 
        key={`click-${note.drum}-${note.step}`}
        x={note.x - 15}
        y={note.y - 15}
        width="30"
        height="30"
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onStepToggle(note.drum, note.step)}
      />
    ))}
    
    {/* Clickable areas for empty spaces */}
    {emptySpaces.map((space) => (
      <circle 
        key={`empty-${space.drum}-${space.step}`}
        cx={space.x}
        cy={space.y}
        r="12"
        fill="transparent"
        className="cursor-pointer hover:fill-primary/10 transition-colors"
        onClick={() => onStepToggle(space.drum, space.step)}
      />
    ))}
  </>
), (prev, next) => 
  prev.visibleNotes === next.visibleNotes && 
  prev.emptySpaces === next.emptySpaces
);
InteractionLayer.displayName = 'InteractionLayer';

export const DrumNotation = React.memo(({
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
}: DrumNotationProps) => {
  const startStep = Math.max(0, scrollOffset);
  const endStep = Math.min(startStep + visibleStepsCount, pattern.length);

  // Calculate grid lines (bar lines) - positioned absolutely
  const gridLines = useMemo(() => {
    const lines = [];
    const totalBars = Math.ceil(pattern.length / BEATS_PER_BAR);
    
    for (let bar = 0; bar <= totalBars; bar++) {
      const absoluteStep = bar * BEATS_PER_BAR;
      const absoluteX = STAFF_LEFT_MARGIN + absoluteStep * STEP_WIDTH;
      lines.push({
        step: absoluteStep,
        x: absoluteX,
        isFirstBar: bar === 0
      });
    }
    return lines;
  }, [pattern.length]);

  // Calculate beat numbers - positioned absolutely
  const beatNumbers = useMemo(() => {
    const numbers = [];
    for (let step = 0; step < pattern.length; step++) {
      const posInBar = step % 8;
      if (posInBar % 2 === 0) {
        const beatNum = Math.floor(posInBar / 2) + 1;
        const absoluteX = STAFF_LEFT_MARGIN + 20 + step * STEP_WIDTH;
        numbers.push({ step, x: absoluteX, label: beatNum });
      }
    }
    return numbers;
  }, [pattern.length]);

  // Calculate visible notes with buffer
  const visibleNotes = useMemo(() => {
    const start = Math.max(0, scrollOffset - BUFFER_STEPS);
    const end = Math.min(pattern.length, scrollOffset + visibleStepsCount + BUFFER_STEPS);
    
    const notes: Array<{
      drum: string;
      step: number;
      x: number;
      y: number;
      noteType: 'note' | 'x' | 'open';
    }> = [];
    
    Object.entries(pattern).forEach(([drumKey, steps]) => {
      if (drumKey === 'length' || drumKey === 'subdivisions' || drumKey === 'offsets' || drumKey === 'sections') return;
      if (!Array.isArray(steps) || !drumPositions[drumKey]) return;
      
      for (let step = start; step < end; step++) {
        if (steps[step]) {
          notes.push({
            drum: drumKey,
            step,
            x: STAFF_LEFT_MARGIN + 20 + step * STEP_WIDTH,
            y: drumPositions[drumKey].y,
            noteType: drumPositions[drumKey].noteType
          });
        }
      }
    });
    
    return notes;
  }, [pattern, scrollOffset, visibleStepsCount]);

  // Calculate empty spaces for interaction
  const emptySpaces = useMemo(() => {
    const start = Math.max(0, scrollOffset - BUFFER_STEPS);
    const end = Math.min(pattern.length, scrollOffset + visibleStepsCount + BUFFER_STEPS);
    
    const spaces: Array<{
      drum: string;
      step: number;
      x: number;
      y: number;
    }> = [];
    
    Object.entries(drumPositions).forEach(([drumKey, drumInfo]) => {
      const steps = pattern[drumKey] as boolean[] | undefined;
      
      for (let step = start; step < end; step++) {
        if (!steps || !steps[step]) {
          spaces.push({
            drum: drumKey,
            step,
            x: STAFF_LEFT_MARGIN + 20 + step * STEP_WIDTH,
            y: drumInfo.y
          });
        }
      }
    });
    
    return spaces;
  }, [pattern, scrollOffset, visibleStepsCount]);

  // Calculate scroll transform
  const scrollTransform = `translateX(${-scrollOffset * STEP_WIDTH}px)`;

  return <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-end gap-2">
        <Button variant={isPlaying ? "default" : "ghost"} onClick={onTogglePlay} className={cn("h-12 px-6 rounded-[20px] text-xs", isPlaying ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/10 hover:bg-primary/20")}>
          {isPlaying ? "STOP" : "PREVIEW"}
        </Button>
        <Button variant="outline" onClick={onClearPattern} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
        {onLoadPattern && <Button onClick={onLoadPattern} variant="outline" className="flex items-center gap-2" disabled={isLoadingPattern}>
            {isLoadingPattern ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Load CSV
          </Button>}
        {onClearLoadedPattern && hasLoadedPattern && <Button onClick={onClearLoadedPattern} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear Loaded
          </Button>}
        <Button variant="outline" size="icon">
          <img src="/lovable-uploads/fbd529ea-6eab-43ce-8d5d-274c34542d99.png" alt="Menu" className="w-4 h-4" />
        </Button>
      </div>

      {/* Notation Container */}
      <div className="relative bg-card rounded-lg p-8 shadow-elevated">
        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <ellipse cx="10" cy="10" rx="7" ry="5" fill="currentColor" className="text-note-active" />
            </svg>
            <span>Kick / Snare / Tom</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" className="text-note-active" />
              <line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="2" className="text-note-active" />
            </svg>
            <span>Closed HH / Crash / Ride</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" className="text-note-active" />
              <line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="2" className="text-note-active" />
              <circle cx="10" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-note-active" />
            </svg>
            <span>Open HH</span>
          </div>
        </div>

        {/* Staff SVG */}
        <div className="relative overflow-hidden">
          <svg width="100%" height="200" className="overflow-visible">
            {/* SVG Symbol Definitions */}
            <defs>
              {/* Filled note symbol */}
              <symbol id="filledNote" viewBox="-10 -40 20 45">
                <ellipse cx="0" cy="0" rx="7" ry="5" fill="currentColor" />
                <line x1="7" y1="0" x2="7" y2="-30" stroke="currentColor" strokeWidth="2" />
              </symbol>
              
              {/* X note symbol (for closed hi-hat, crash, ride) */}
              <symbol id="xNote" viewBox="-10 -40 20 45">
                <line x1="-6" y1="-6" x2="6" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="-6" y1="6" x2="6" y2="-6" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="6" x2="0" y2="-30" stroke="currentColor" strokeWidth="2" />
              </symbol>
              
              {/* Open note symbol (X with circle above for open hi-hat) */}
              <symbol id="openNote" viewBox="-10 -40 20 45">
                <line x1="-6" y1="-6" x2="6" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="-6" y1="6" x2="6" y2="-6" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="6" x2="0" y2="-30" stroke="currentColor" strokeWidth="2" />
                <circle cx="0" cy="-18" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </symbol>
            </defs>
            
            {/* Layer 1: Static staff lines */}
            <StaticStaffLayer />
            
            {/* Layer 2: Scrolling grid (bar lines + beat numbers) */}
            <g style={{ transform: scrollTransform }}>
              <ScrollingGridLayer 
                gridLines={gridLines}
                beatNumbers={beatNumbers}
              />
            </g>
            
            {/* Layer 3: Notes */}
            <g style={{ transform: scrollTransform }}>
              <NotesLayer 
                visibleNotes={visibleNotes}
                currentStep={currentStep}
              />
            </g>
            
            {/* Layer 4: Playhead (fixed position, doesn't scroll) */}
            <PlayheadIndicator 
              currentStep={currentStep}
              startStep={startStep}
              endStep={endStep}
              stepWidth={STEP_WIDTH}
            />
            
            {/* Layer 5: Interaction layer */}
            <g style={{ transform: scrollTransform }}>
              <InteractionLayer 
                visibleNotes={visibleNotes}
                emptySpaces={emptySpaces}
                onStepToggle={onStepToggle}
              />
            </g>
          </svg>
        </div>

      </div>
    </div>;
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if these change
  return (
    prevProps.currentStep === nextProps.currentStep &&
    prevProps.scrollOffset === nextProps.scrollOffset &&
    prevProps.pattern === nextProps.pattern &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.hasLoadedPattern === nextProps.hasLoadedPattern &&
    prevProps.isLoadingPattern === nextProps.isLoadingPattern
  );
});
DrumNotation.displayName = 'DrumNotation';