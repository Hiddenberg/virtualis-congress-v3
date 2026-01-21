"use client";

import { useEffect, useRef } from "react";
import { usePresentationDrawing } from "../contexts/PresentationDrawingContext";

interface LocalLineSegment {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}

export default function PresentationDrawingOverlay({ previewLine }: { previewLine?: LocalLineSegment }) {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const contextRef = useRef<CanvasRenderingContext2D | null>(null);
   const { lines } = usePresentationDrawing();

   useEffect(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      contextRef.current = canvas.getContext("2d");

      const resize = () => {
         const rect = canvas.getBoundingClientRect();
         canvas.width = rect.width;
         canvas.height = rect.height;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      return () => {
         ro.disconnect();
      };
   }, []);

   // Render lines whenever they change
   useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#ef4444"; // red-500
      ctx.lineWidth = 3;
      for (const line of lines) {
         const x1 = line.x1 * canvas.width;
         const y1 = line.y1 * canvas.height;
         const x2 = line.x2 * canvas.width;
         const y2 = line.y2 * canvas.height;
         ctx.beginPath();
         ctx.moveTo(x1, y1);
         ctx.lineTo(x2, y2);
         ctx.stroke();
      }

      if (previewLine) {
         const x1 = previewLine.x1 * canvas.width;
         const y1 = previewLine.y1 * canvas.height;
         const x2 = previewLine.x2 * canvas.width;
         const y2 = previewLine.y2 * canvas.height;
         ctx.save();
         ctx.setLineDash([6, 4]);
         ctx.beginPath();
         ctx.moveTo(x1, y1);
         ctx.lineTo(x2, y2);
         ctx.stroke();
         ctx.restore();
      }
   }, [lines, previewLine]);

   return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
}
