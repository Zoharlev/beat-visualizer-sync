import { useState, useEffect } from "react";

const LANDSCAPE_BREAKPOINT = 500; // height threshold for landscape mode

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  useEffect(() => {
    const checkLandscape = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const isLandscapeOrientation = width > height;
      const isShortHeight = height <= LANDSCAPE_BREAKPOINT;
      setIsLandscape(isLandscapeOrientation && isShortHeight);
    };

    checkLandscape();
    window.addEventListener("resize", checkLandscape);
    window.addEventListener("orientationchange", checkLandscape);

    return () => {
      window.removeEventListener("resize", checkLandscape);
      window.removeEventListener("orientationchange", checkLandscape);
    };
  }, []);

  return isLandscape;
}
