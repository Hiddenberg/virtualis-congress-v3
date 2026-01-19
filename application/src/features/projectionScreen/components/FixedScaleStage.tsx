"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FixedScaleStageProps {
   baseWidth: number;
   baseHeight: number;
   className?: string;
   children: React.ReactNode;
   /**
    * When true, the stage is centered and letterboxed to preserve aspect ratio.
    * When false, it fills the container and may be clipped.
    */
   contain?: boolean;
}

export default function FixedScaleStage(props: FixedScaleStageProps) {
   const {
      baseWidth,
      baseHeight,
      children,
      className = "",
      contain = true,
   } = props;

   const containerRef = useRef<HTMLDivElement | null>(null);
   const [size, setSize] = useState<{ w: number; h: number }>({
      w: 0,
      h: 0,
   });

   useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;

      const resize = () => {
         setSize({
            w: el.clientWidth,
            h: el.clientHeight,
         });
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      return () => ro.disconnect();
   }, []);

   const scale = useMemo(() => {
      if (size.w === 0 || size.h === 0) return 1;
      const sx = size.w / baseWidth;
      const sy = size.h / baseHeight;
      return contain ? Math.min(sx, sy) : Math.max(sx, sy);
   }, [size, baseWidth, baseHeight, contain]);

   const stageStyle: React.CSSProperties = useMemo(
      () => ({
         width: baseWidth,
         height: baseHeight,
         transform: `scale(${scale})`,
         transformOrigin: "top left",
      }),
      [baseWidth, baseHeight, scale],
   );

   // Center stage inside container
   const offsetStyle: React.CSSProperties = useMemo(
      () => ({
         width: Math.round(baseWidth * scale),
         height: Math.round(baseHeight * scale),
      }),
      [baseWidth, baseHeight, scale],
   );

   return (
      <div
         ref={containerRef}
         className={`relative w-full min-h-dvh overflow-hidden ${className}`}
      >
         <div
            className="!top-1/2 !left-1/2 !absolute !-translate-x-1/2 !-translate-y-1/2"
            style={offsetStyle}
         >
            <div style={stageStyle}>{children}</div>
         </div>
      </div>
   );
}
