import { useIsMobile } from "@/hooks/use-mobile";
import { useIsLandscape } from "@/hooks/use-landscape";
import { RotateCw } from "lucide-react";

export const RotationPrompt = () => {
  const isMobile = useIsMobile();
  const isLandscape = useIsLandscape();

  // Show prompt only on mobile when NOT in landscape
  if (!isMobile || isLandscape) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-bounce mb-6">
        <RotateCw className="w-16 h-16 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Rotate Your Device</h2>
      <p className="text-muted-foreground text-lg">
        For the best experience, please rotate your device to landscape mode.
      </p>
    </div>
  );
};
