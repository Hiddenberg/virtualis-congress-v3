"use client";

import { useEffect, useMemo, useRef } from "react";

interface Props {
   containerRef: React.RefObject<HTMLDivElement | null>;
   drawingEvents?: PresentationDrawingEvent[];
   currentSlideIndex: number;
}

export default function PresentationDrawingPlaybackOverlay({ containerRef, drawingEvents, currentSlideIndex }: Props) {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const contextRef = useRef<CanvasRenderingContext2D | null>(null);

   const eventsBySlide = useMemo(() => {
      const bySlide = new Map<number, PresentationDrawingEvent[]>();
      const list = drawingEvents || [];
      for (const ev of list) {
         const arr = bySlide.get(ev.slideIndex) || [];
         arr.push(ev);
         bySlide.set(ev.slideIndex, arr);
      }
      for (const [k, arr] of bySlide) {
         arr.sort((a, b) => a.timestamp - b.timestamp);
         bySlide.set(k, arr);
      }
      return bySlide;
   }, [drawingEvents]);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
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

   useEffect(() => {
      const container = containerRef.current;
      const playerEl = container?.querySelector("mux-player") as HTMLMediaElement | undefined;
      if (!playerEl) return;

      const drawAtTime = (tMs: number) => {
         const canvas = canvasRef.current;
         const ctx = contextRef.current;
         if (!canvas || !ctx) return;
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         const events = eventsBySlide.get(currentSlideIndex) || [];
         if (!events.length) return;

         const activeLines: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
         }[] = [];
         for (const ev of events) {
            if (ev.timestamp > tMs) break;
            if (ev.type === "clear") {
               activeLines.length = 0;
            } else if (ev.type === "add" && ev.line) {
               activeLines.push(ev.line);
            }
         }

         ctx.strokeStyle = "#ef4444"; // red-500

         ctx.lineWidth = 3;
         for (const line of activeLines) {
            const x1 = line.x1 * canvas.width;
            const y1 = line.y1 * canvas.height;
            const x2 = line.x2 * canvas.width;
            const y2 = line.y2 * canvas.height;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
         }
      };

      const handleUpdate = () => {
         const currentTimeMs = (playerEl.currentTime || 0) * 1000;
         drawAtTime(currentTimeMs);
      };

      handleUpdate();
      playerEl.addEventListener("timeupdate", handleUpdate);
      playerEl.addEventListener("seeked", handleUpdate);
      playerEl.addEventListener("loadedmetadata", handleUpdate);

      return () => {
         playerEl.removeEventListener("timeupdate", handleUpdate);
         playerEl.removeEventListener("seeked", handleUpdate);
         playerEl.removeEventListener("loadedmetadata", handleUpdate);
      };
   }, [containerRef, eventsBySlide, currentSlideIndex]);

   // Re-draw when slide changes even if time event hasn't fired yet
   useEffect(() => {
      const container = containerRef.current;
      const playerEl = container?.querySelector("mux-player") as HTMLMediaElement | undefined;
      if (!playerEl) return;
      const currentTimeMs = (playerEl.currentTime || 0) * 1000;
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const events = eventsBySlide.get(currentSlideIndex) || [];
      const activeLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
      for (const ev of events) {
         if (ev.timestamp > currentTimeMs) break;
         if (ev.type === "clear") {
            activeLines.length = 0;
         } else if (ev.type === "add" && ev.line) {
            activeLines.push(ev.line);
         }
      }

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      for (const line of activeLines) {
         const x1 = line.x1 * canvas.width;
         const y1 = line.y1 * canvas.height;
         const x2 = line.x2 * canvas.width;
         const y2 = line.y2 * canvas.height;
         ctx.beginPath();
         ctx.moveTo(x1, y1);
         ctx.lineTo(x2, y2);
         ctx.stroke();
      }
   }, [currentSlideIndex, eventsBySlide, containerRef]);

   return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" />;
}
